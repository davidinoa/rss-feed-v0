import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// See CONTEXT.md for the Source / Subscription / Category vocabulary and
// docs/adr/0005-source-subscription-split.md for the table-shape rationale.
// The Article table is intentionally absent in this slice (issue #55) and
// will be designed in the Timeline feature, which knows about per-Subscription
// read state.
export default defineSchema({
  // The remote RSS/Atom document. One row per canonical URL, shared across
  // every user who subscribes to it. Fetch state and publishing cadence live
  // here so the fetch worker (separate feature) polls each URL once.
  sources: defineTable({
    url: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    siteUrl: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
    lastFetchedAt: v.optional(v.number()),
    lastFetchStatus: v.optional(v.union(v.literal('ok'), v.literal('error'))),
    lastFetchError: v.optional(v.string()),
    lastPublishedAt: v.optional(v.number()),
    subscriberCount: v.number(),
  }).index('by_url', ['url']),

  // One user's follow of a Source. customTitle and categoryId are the
  // per-user overrides on top of the shared Source metadata.
  subscriptions: defineTable({
    userId: v.string(),
    sourceId: v.id('sources'),
    customTitle: v.optional(v.string()),
    categoryId: v.optional(v.id('categories')),
    addedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_source', ['userId', 'sourceId']),

  // Per-user bucket for organizing Subscriptions. slug dedupes "AI" / "ai".
  categories: defineTable({
    userId: v.string(),
    name: v.string(),
    slug: v.string(),
  }).index('by_user_and_slug', ['userId', 'slug']),
})
