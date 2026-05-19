import { query } from './_generated/server'

// Returns the caller's Subscriptions joined with the Source fields the
// list view needs. Slice #55 keeps the projection minimal — slices #56
// and #58 extend it (description, iconUrl, health derivation).
//
// Bounded at 500 rows per Convex guidance; pagination follows in a later
// slice if anyone genuinely hits the cap.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    const subscriptions = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', identity.tokenIdentifier))
      .order('desc')
      .take(500)

    return Promise.all(
      subscriptions.map(async (subscription) => {
        const source = await ctx.db.get(subscription.sourceId)
        return {
          _id: subscription._id,
          customTitle: subscription.customTitle,
          addedAt: subscription.addedAt,
          source: source
            ? {
                _id: source._id,
                url: source.url,
                title: source.title,
                lastFetchedAt: source.lastFetchedAt,
              }
            : null,
        }
      }),
    )
  },
})
