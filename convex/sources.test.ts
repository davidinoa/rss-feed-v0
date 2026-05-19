/// <reference types="vite/client" />
import { convexTest } from 'convex-test'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { api } from './_generated/api'
import schema from './schema'

const modules = import.meta.glob('./**/*.{ts,js}')

const RSS_HAPPY = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Example Engineering</title>
    <item>
      <title>Hi</title>
      <pubDate>Sat, 01 May 2026 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`

function stubFetch(
  body: string,
  options: { status?: number; finalUrl?: string } = {},
) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const inputUrl =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url
    const response = new Response(body, { status: options.status ?? 200 })
    Object.defineProperty(response, 'url', {
      value: options.finalUrl ?? inputUrl,
    })
    return response
  })
}

beforeEach(() => {
  vi.stubGlobal('fetch', stubFetch(RSS_HAPPY))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('sources.addByUrl', () => {
  test('creates a Source and a Subscription on first add', async () => {
    const t = convexTest(schema, modules)
    const asAlice = t.withIdentity({ tokenIdentifier: 'alice' })

    const subscriptionId = await asAlice.action(api.sources.addByUrl, {
      url: 'https://example.com/feed.xml',
    })
    expect(subscriptionId).toBeDefined()

    const sources = await t.run(async (ctx) =>
      ctx.db.query('sources').collect(),
    )
    expect(sources).toHaveLength(1)
    expect(sources[0]).toMatchObject({
      url: 'https://example.com/feed.xml',
      title: 'Example Engineering',
      subscriberCount: 1,
      lastFetchStatus: 'ok',
    })
    expect(sources[0].lastFetchedAt).toBeTypeOf('number')
    expect(sources[0].lastPublishedAt).toBe(
      Date.parse('Sat, 01 May 2026 00:00:00 GMT'),
    )

    const subs = await t.run(async (ctx) =>
      ctx.db.query('subscriptions').collect(),
    )
    expect(subs).toHaveLength(1)
    expect(subs[0]).toMatchObject({
      userId: 'alice',
      sourceId: sources[0]._id,
    })
  })

  test('two users subscribing to the same URL share one Source', async () => {
    const t = convexTest(schema, modules)
    const asAlice = t.withIdentity({ tokenIdentifier: 'alice' })
    const asBob = t.withIdentity({ tokenIdentifier: 'bob' })

    await asAlice.action(api.sources.addByUrl, {
      url: 'https://example.com/feed.xml',
    })
    await asBob.action(api.sources.addByUrl, {
      url: 'https://example.com/feed.xml',
    })

    const sources = await t.run(async (ctx) =>
      ctx.db.query('sources').collect(),
    )
    expect(sources).toHaveLength(1)
    expect(sources[0].subscriberCount).toBe(2)

    const subs = await t.run(async (ctx) =>
      ctx.db.query('subscriptions').collect(),
    )
    expect(subs).toHaveLength(2)
    expect(subs.map((s) => s.userId).sort()).toEqual(['alice', 'bob'])
  })

  test('second user skips the fetch when the Source is already known', async () => {
    const t = convexTest(schema, modules)
    const fetchSpy = stubFetch(RSS_HAPPY)
    vi.stubGlobal('fetch', fetchSpy)

    const asAlice = t.withIdentity({ tokenIdentifier: 'alice' })
    const asBob = t.withIdentity({ tokenIdentifier: 'bob' })

    await asAlice.action(api.sources.addByUrl, {
      url: 'https://example.com/feed.xml',
    })
    await asBob.action(api.sources.addByUrl, {
      url: 'https://example.com/feed.xml',
    })

    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  test('rejects a duplicate Subscription from the same user', async () => {
    const t = convexTest(schema, modules)
    const asAlice = t.withIdentity({ tokenIdentifier: 'alice' })

    await asAlice.action(api.sources.addByUrl, {
      url: 'https://example.com/feed.xml',
    })
    await expect(
      asAlice.action(api.sources.addByUrl, {
        url: 'https://example.com/feed.xml',
      }),
    ).rejects.toThrow(/already subscribed/i)
  })

  test('canonicalises the input URL before dedup', async () => {
    const t = convexTest(schema, modules)
    const asAlice = t.withIdentity({ tokenIdentifier: 'alice' })
    const asBob = t.withIdentity({ tokenIdentifier: 'bob' })

    await asAlice.action(api.sources.addByUrl, {
      url: 'https://EXAMPLE.com:443/feed.xml#latest',
    })
    await asBob.action(api.sources.addByUrl, {
      url: 'https://example.com/feed.xml',
    })

    const sources = await t.run(async (ctx) =>
      ctx.db.query('sources').collect(),
    )
    expect(sources).toHaveLength(1)
    expect(sources[0].url).toBe('https://example.com/feed.xml')
    expect(sources[0].subscriberCount).toBe(2)
  })

  test('rejects an unauthenticated call', async () => {
    const t = convexTest(schema, modules)
    await expect(
      t.action(api.sources.addByUrl, { url: 'https://example.com/feed.xml' }),
    ).rejects.toThrow(/sign in/i)
  })

  test('rejects an invalid URL', async () => {
    const t = convexTest(schema, modules)
    const asAlice = t.withIdentity({ tokenIdentifier: 'alice' })
    await expect(
      asAlice.action(api.sources.addByUrl, { url: 'not a url' }),
    ).rejects.toThrow(/not a valid url/i)
  })

  test('surfaces a generic error when the body is not a feed', async () => {
    vi.stubGlobal('fetch', stubFetch('<html><body>not a feed</body></html>'))
    const t = convexTest(schema, modules)
    const asAlice = t.withIdentity({ tokenIdentifier: 'alice' })
    await expect(
      asAlice.action(api.sources.addByUrl, {
        url: 'https://example.com/page.html',
      }),
    ).rejects.toThrow(/could not subscribe/i)

    const sources = await t.run(async (ctx) =>
      ctx.db.query('sources').collect(),
    )
    expect(sources).toHaveLength(0)
  })
})
