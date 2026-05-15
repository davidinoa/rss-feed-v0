import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  feeds: defineTable({
    title: v.string(),
    url: v.string(),
    siteUrl: v.optional(v.string()),
    category: v.union(
      v.literal('engineering'),
      v.literal('news'),
      v.literal('design'),
      v.literal('science'),
    ),
    unreadCount: v.number(),
    userId: v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_category', ['category']),

  articles: defineTable({
    feedId: v.id('feeds'),
    title: v.string(),
    excerpt: v.string(),
    url: v.string(),
    publishedAt: v.number(),
    readAt: v.optional(v.number()),
  })
    .index('by_feed', ['feedId'])
    .index('by_published', ['publishedAt']),
})
