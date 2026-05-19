import { v } from 'convex/values'
import { action, internalMutation, internalQuery } from './_generated/server'
import { internal } from './_generated/api'
import type { Doc, Id } from './_generated/dataModel'
import { canonicaliseUrl, InvalidUrlError } from './lib/canonicalUrl'
import { validateAndParseFeed } from './lib/feedValidator'

// Public action — the entry point of the add-Subscription flow.
//
// Pipeline: canonicalise → look up existing Source → if known, short-circuit
// the fetch; if not, fetch + parse → write Source (if missing) and the new
// Subscription in one transaction.
//
// Slice #55 returns a generic Error string on failure; slice #57 swaps this
// for a typed error enum.
export const addByUrl = action({
  args: { url: v.string() },
  handler: async (ctx, args): Promise<Id<'subscriptions'>> => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Sign in to add a subscription.')
    }

    let canonical: string
    try {
      canonical = canonicaliseUrl(args.url)
    } catch (err) {
      if (err instanceof InvalidUrlError) {
        throw new Error('Not a valid URL', { cause: err })
      }
      throw err
    }

    // Short-circuit: skip the fetch when a Source already exists for this URL.
    // This is the payoff of the Source/Subscription split — the 1,001st
    // subscriber to TanStack Blog costs zero new fetches.
    const known: Doc<'sources'> | null = await ctx.runQuery(
      internal.sources._getByUrl,
      { url: canonical },
    )
    if (known) {
      return await ctx.runMutation(internal.sources._upsertAndSubscribe, {
        userId: identity.tokenIdentifier,
        url: canonical,
      })
    }

    const result = await validateAndParseFeed(canonical)
    if (!result.ok) {
      throw new Error(`Could not subscribe: ${result.error}`)
    }

    let finalCanonical: string
    try {
      finalCanonical = canonicaliseUrl(result.finalUrl)
    } catch {
      finalCanonical = canonical
    }

    return await ctx.runMutation(internal.sources._upsertAndSubscribe, {
      userId: identity.tokenIdentifier,
      url: finalCanonical,
      initialMetadata: {
        title: result.feed.title,
        lastFetchedAt: Date.now(),
        lastPublishedAt: result.feed.lastPublishedAt ?? undefined,
      },
    })
  },
})

// Lookup helper used by the action to decide whether to fetch.
export const _getByUrl = internalQuery({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('sources')
      .withIndex('by_url', (q) => q.eq('url', args.url))
      .unique()
  },
})

// Single mutation that handles both code paths inside one transaction:
//   - Source exists  → reuse it, just insert the Subscription.
//   - Source missing → insert with initialMetadata, then insert Subscription.
//
// Re-queries the Source inside the transaction so a race between the action's
// short-circuit query and this mutation can't create a duplicate Source row.
export const _upsertAndSubscribe = internalMutation({
  args: {
    userId: v.string(),
    url: v.string(),
    initialMetadata: v.optional(
      v.object({
        title: v.string(),
        lastFetchedAt: v.number(),
        lastPublishedAt: v.optional(v.number()),
      }),
    ),
  },
  handler: async (ctx, args): Promise<Id<'subscriptions'>> => {
    let source = await ctx.db
      .query('sources')
      .withIndex('by_url', (q) => q.eq('url', args.url))
      .unique()

    if (!source) {
      if (!args.initialMetadata) {
        throw new Error('Source missing and no metadata provided')
      }
      const id = await ctx.db.insert('sources', {
        url: args.url,
        title: args.initialMetadata.title,
        lastFetchedAt: args.initialMetadata.lastFetchedAt,
        lastFetchStatus: 'ok',
        lastPublishedAt: args.initialMetadata.lastPublishedAt,
        subscriberCount: 0,
      })
      const inserted = await ctx.db.get(id)
      if (!inserted) {
        throw new Error('Failed to read Source after insert')
      }
      source = inserted
    }

    const existingSub = await ctx.db
      .query('subscriptions')
      .withIndex('by_user_and_source', (q) =>
        q.eq('userId', args.userId).eq('sourceId', source._id),
      )
      .unique()
    if (existingSub) {
      throw new Error('Already subscribed')
    }

    const subscriptionId = await ctx.db.insert('subscriptions', {
      userId: args.userId,
      sourceId: source._id,
      addedAt: Date.now(),
    })

    await ctx.db.patch(source._id, {
      subscriberCount: source.subscriberCount + 1,
    })

    return subscriptionId
  },
})
