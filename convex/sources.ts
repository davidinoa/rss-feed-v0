import { v } from 'convex/values'
import { action, internalMutation, internalQuery } from './_generated/server'
import { internal } from './_generated/api'
import type { Doc, Id } from './_generated/dataModel'
import { canonicalizeUrl, InvalidUrlError } from './lib/canonicalUrl'
import {
  validateAndParseFeed,
  type ValidateErrorCode,
  validateErrorCodes,
} from './lib/feedValidator'

const subscribeErrorByCode: Record<ValidateErrorCode, string> = {
  [validateErrorCodes.fetchFailed]:
    'Could not reach this URL. Try again in a moment.',
  [validateErrorCodes.fetchTimedOut]:
    'The URL took too long to respond. Try again in a moment.',
  [validateErrorCodes.tooManyRedirects]:
    'This URL redirects too many times. Try the final feed URL directly.',
  [validateErrorCodes.httpError]:
    'The server rejected the request. Verify the URL and try again.',
  [validateErrorCodes.readFailed]:
    'We could not read this URL. Verify the URL and try again.',
  [validateErrorCodes.responseTooLarge]: 'This feed is too large to process.',
  [validateErrorCodes.invalidFeed]:
    'This URL does not appear to be a valid RSS or Atom feed.',
}

function toSubscribeErrorMessage(code: ValidateErrorCode): string {
  return subscribeErrorByCode[code]
}

function parseHttpStatus(message: string): number | null {
  const match = /^HTTP\s+(\d{3})$/.exec(message.trim())
  if (!match) return null
  return Number.parseInt(match[1], 10)
}

function toHttpSubscribeErrorMessage(message: string): string {
  const status = parseHttpStatus(message)
  if (status === 400) {
    return 'Invalid request. Verify the URL and try again.'
  }
  if (status === 401) {
    return 'Authentication required to access this feed.'
  }
  if (status === 403) {
    return 'Access denied for this feed URL.'
  }
  if (status === 404) {
    return 'Feed URL not found (404). Verify the URL and try again.'
  }
  if (status === 429) {
    return 'Too many requests. Try again in a moment.'
  }
  if (status !== null && status >= 400 && status <= 499) {
    return `The feed server returned ${status}. Verify the URL and try again.`
  }
  if (status !== null && status >= 500 && status <= 599) {
    return 'The feed server is having issues right now. Try again in a moment.'
  }
  return toSubscribeErrorMessage(validateErrorCodes.httpError)
}

// Public action — the entry point of the add-Subscription flow.
//
// Pipeline: canonicalize → look up existing Source → if known, short-circuit
// the fetch; if not, fetch + parse → write Source (if missing) and the new
// Subscription in one transaction.
//
// Validation failures include typed error codes from feedValidator.
export const addByUrl = action({
  args: { url: v.string() },
  handler: async (ctx, args): Promise<Id<'subscriptions'>> => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Sign in to add a subscription.')
    }

    let canonical: string
    try {
      canonical = canonicalizeUrl(args.url)
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
      const message =
        result.error.code === validateErrorCodes.httpError
          ? toHttpSubscribeErrorMessage(result.error.message)
          : toSubscribeErrorMessage(result.error.code)
      throw new Error(`Could not subscribe: ${message}`)
    }

    let finalCanonical: string
    try {
      finalCanonical = canonicalizeUrl(result.finalUrl)
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
