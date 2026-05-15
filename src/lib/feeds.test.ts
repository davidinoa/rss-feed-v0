import { describe, expect, it } from 'vitest'
import { listFeeds, listTimeline } from './feeds'

describe('listFeeds', () => {
  it('returns the mock feeds', async () => {
    const feeds = await listFeeds()
    expect(feeds.length).toBeGreaterThan(0)
    expect(feeds[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      url: expect.stringMatching(/^https?:\/\//),
      category: expect.stringMatching(/^(engineering|news|design|science)$/),
    })
  })

  it('every feed has a non-negative unread count', async () => {
    const feeds = await listFeeds()
    for (const feed of feeds) {
      expect(feed.unread).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('listTimeline', () => {
  it('returns articles sorted newest first', async () => {
    const articles = await listTimeline()
    expect(articles.length).toBeGreaterThan(0)
    for (let i = 1; i < articles.length; i++) {
      expect(articles[i - 1].publishedAt >= articles[i].publishedAt).toBe(true)
    }
  })

  it('joins each article with its feed title', async () => {
    const articles = await listTimeline()
    for (const article of articles) {
      expect(article.feedTitle).toBeTruthy()
      expect(article.feedTitle).not.toBe('Unknown feed')
    }
  })
})
