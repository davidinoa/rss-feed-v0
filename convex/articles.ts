import { query } from './_generated/server'

export const timeline = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()

    const feedQuery = ctx.db.query('feeds')
    const feeds = identity
      ? await feedQuery
          .withIndex('by_user', (q) => q.eq('userId', identity.subject))
          .collect()
      : await feedQuery.collect()

    const feedIds = new Set(feeds.map((f) => f._id))
    const feedTitleById = new Map(feeds.map((f) => [f._id, f.title]))

    const recent = await ctx.db
      .query('articles')
      .withIndex('by_published')
      .order('desc')
      .take(50)

    return recent
      .filter((a) => feedIds.has(a.feedId))
      .map((a) => ({
        ...a,
        feedTitle: feedTitleById.get(a.feedId) ?? 'Unknown feed',
      }))
  },
})
