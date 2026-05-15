import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return await ctx.db.query('feeds').collect()
    }
    return await ctx.db
      .query('feeds')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect()
  },
})

export const add = mutation({
  args: {
    title: v.string(),
    url: v.string(),
    siteUrl: v.optional(v.string()),
    category: v.union(
      v.literal('engineering'),
      v.literal('news'),
      v.literal('design'),
      v.literal('science'),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Sign in to add a feed.')
    }
    return await ctx.db.insert('feeds', {
      ...args,
      unreadCount: 0,
      userId: identity.subject,
    })
  },
})

export const remove = mutation({
  args: { id: v.id('feeds') },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Sign in to remove a feed.')
    const feed = await ctx.db.get(id)
    if (!feed || feed.userId !== identity.subject) {
      throw new Error('Feed not found.')
    }
    await ctx.db.delete(id)
  },
})
