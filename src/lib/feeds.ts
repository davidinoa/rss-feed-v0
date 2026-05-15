export type FeedCategory = 'engineering' | 'news' | 'design' | 'science'

export interface Feed {
  id: string
  title: string
  url: string
  siteUrl: string
  category: FeedCategory
  unread: number
}

export interface Article {
  id: string
  feedId: string
  title: string
  excerpt: string
  url: string
  publishedAt: string
}

const FEEDS: Array<Feed> = [
  {
    id: 'tanstack-blog',
    title: 'TanStack Blog',
    url: 'https://tanstack.com/blog/rss.xml',
    siteUrl: 'https://tanstack.com/blog',
    category: 'engineering',
    unread: 3,
  },
  {
    id: 'cloudflare-blog',
    title: 'The Cloudflare Blog',
    url: 'https://blog.cloudflare.com/rss',
    siteUrl: 'https://blog.cloudflare.com',
    category: 'engineering',
    unread: 7,
  },
  {
    id: 'clerk-changelog',
    title: 'Clerk Changelog',
    url: 'https://clerk.com/changelog/rss',
    siteUrl: 'https://clerk.com/changelog',
    category: 'engineering',
    unread: 1,
  },
  {
    id: 'nyt-world',
    title: 'NYT World',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    siteUrl: 'https://www.nytimes.com/section/world',
    category: 'news',
    unread: 12,
  },
  {
    id: 'a-list-apart',
    title: 'A List Apart',
    url: 'https://alistapart.com/main/feed/',
    siteUrl: 'https://alistapart.com',
    category: 'design',
    unread: 2,
  },
]

const ARTICLES: Array<Article> = [
  {
    id: 'a1',
    feedId: 'tanstack-blog',
    title:
      'Introducing TanStack Intent: Ship Agent Skills with your npm Packages',
    excerpt:
      'Skills travel with your library via npm update — not the model training cutoff.',
    url: 'https://tanstack.com/blog/from-docs-to-agents',
    publishedAt: '2026-05-12T15:00:00Z',
  },
  {
    id: 'a2',
    feedId: 'cloudflare-blog',
    title: 'Workers now supports nodejs_compat by default for new projects',
    excerpt:
      'A small but meaningful default that unlocks more of the npm ecosystem.',
    url: 'https://blog.cloudflare.com/workers-nodejs-compat-default',
    publishedAt: '2026-05-11T09:30:00Z',
  },
  {
    id: 'a3',
    feedId: 'clerk-changelog',
    title: 'TanStack React Start SDK is now GA',
    excerpt: 'createClerkHandler, clerkMiddleware, and server auth() helpers.',
    url: 'https://clerk.com/changelog/2026-05',
    publishedAt: '2026-05-09T12:00:00Z',
  },
  {
    id: 'a4',
    feedId: 'a-list-apart',
    title: 'Designing for Reading Mode',
    excerpt:
      'Typography, line length, and rhythm choices that make long articles feel effortless.',
    url: 'https://alistapart.com/article/designing-for-reading-mode',
    publishedAt: '2026-05-08T16:00:00Z',
  },
  {
    id: 'a5',
    feedId: 'nyt-world',
    title: 'Global supply chain resilience reports for Q2',
    excerpt:
      'Analysts weigh in on what shifted, what held up, and what to watch next.',
    url: 'https://www.nytimes.com/2026/05/07/world/supply-chain',
    publishedAt: '2026-05-07T22:15:00Z',
  },
]

export async function listFeeds(): Promise<Array<Feed>> {
  await new Promise((r) => setTimeout(r, 150))
  return FEEDS
}

export async function listTimeline(): Promise<
  Array<Article & { feedTitle: string }>
> {
  await new Promise((r) => setTimeout(r, 200))
  const byId = new Map(FEEDS.map((f) => [f.id, f]))
  return [...ARTICLES]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((a) => ({
      ...a,
      feedTitle: byId.get(a.feedId)?.title ?? 'Unknown feed',
    }))
}
