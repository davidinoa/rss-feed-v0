import { describe, expect, test } from 'vitest'
import { parseFeed, validateAndParseFeed } from './feedValidator'

const RSS_2_0 = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Example Engineering</title>
    <link>https://example.com</link>
    <description>The blog</description>
    <item>
      <title>Newer post</title>
      <pubDate>Sat, 09 May 2026 12:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Older post</title>
      <pubDate>Wed, 06 May 2026 09:30:00 GMT</pubDate>
    </item>
  </channel>
</rss>`

const ATOM_1_0 = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Example Changelog</title>
  <link href="https://example.com"/>
  <updated>2026-05-09T15:00:00Z</updated>
  <entry>
    <title>Newest entry</title>
    <updated>2026-05-09T15:00:00Z</updated>
  </entry>
  <entry>
    <title>Older entry</title>
    <updated>2026-05-01T10:00:00Z</updated>
  </entry>
</feed>`

const ATOM_PUBLISHED_FALLBACK = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Published-only feed</title>
  <entry>
    <title>One</title>
    <published>2026-04-01T00:00:00Z</published>
  </entry>
</feed>`

const RSS_NO_ITEMS = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Brand new blog</title>
  </channel>
</rss>`

const RSS_EMPTY_TITLE = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title></title>
    <item><title>x</title></item>
  </channel>
</rss>`

const NOT_A_FEED_XML = `<?xml version="1.0"?>
<root>
  <hello>world</hello>
</root>`

const MALFORMED_XML = `<?xml version="1.0"?>
<rss version="2.0"><channel><title>Broken`

describe('parseFeed — RSS 2.0', () => {
  test('extracts title and the newest pubDate', () => {
    const result = parseFeed(RSS_2_0)
    expect(result).toEqual({
      title: 'Example Engineering',
      lastPublishedAt: Date.parse('Sat, 09 May 2026 12:00:00 GMT'),
    })
  })

  test('returns lastPublishedAt = null when there are no items', () => {
    expect(parseFeed(RSS_NO_ITEMS)).toEqual({
      title: 'Brand new blog',
      lastPublishedAt: null,
    })
  })

  test('returns null on empty title', () => {
    expect(parseFeed(RSS_EMPTY_TITLE)).toBeNull()
  })
})

describe('parseFeed — Atom 1.0', () => {
  test('extracts title and the newest updated', () => {
    const result = parseFeed(ATOM_1_0)
    expect(result).toEqual({
      title: 'Example Changelog',
      lastPublishedAt: Date.parse('2026-05-09T15:00:00Z'),
    })
  })

  test('falls back to <published> when <updated> is absent on entry', () => {
    expect(parseFeed(ATOM_PUBLISHED_FALLBACK)).toEqual({
      title: 'Published-only feed',
      lastPublishedAt: Date.parse('2026-04-01T00:00:00Z'),
    })
  })
})

describe('parseFeed — rejects', () => {
  test('returns null on XML that is neither RSS nor Atom', () => {
    expect(parseFeed(NOT_A_FEED_XML)).toBeNull()
  })

  test('returns null on malformed XML', () => {
    expect(parseFeed(MALFORMED_XML)).toBeNull()
  })

  test('returns null on the empty string', () => {
    expect(parseFeed('')).toBeNull()
  })
})

describe('validateAndParseFeed — orchestration', () => {
  test('returns ok with parsed feed on a healthy response', async () => {
    const result = await validateAndParseFeed('https://example.com/feed.xml', {
      fetch: mockResponse(RSS_2_0),
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.feed.title).toBe('Example Engineering')
      expect(result.finalUrl).toBe('https://example.com/feed.xml')
    }
  })

  test('returns ok with finalUrl reflecting a redirect', async () => {
    const result = await validateAndParseFeed('https://example.com/feed', {
      fetch: mockResponse(ATOM_1_0, {
        finalUrl: 'https://example.com/feed.xml',
      }),
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.finalUrl).toBe('https://example.com/feed.xml')
    }
  })

  test('returns error when HTTP status is not ok', async () => {
    const result = await validateAndParseFeed('https://example.com/feed.xml', {
      fetch: mockResponse('not found', {
        status: 404,
        statusText: 'Not Found',
      }),
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('404')
    }
  })

  test('returns error when fetch throws', async () => {
    const result = await validateAndParseFeed('https://example.com/feed.xml', {
      fetch: () => Promise.reject(new Error('network down')),
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('network down')
    }
  })

  test('returns error when body is not a recognized feed', async () => {
    const result = await validateAndParseFeed('https://example.com/feed.xml', {
      fetch: mockResponse(NOT_A_FEED_XML),
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('not a valid feed')
    }
  })

  test('returns error when response exceeds the 5MB cap', async () => {
    const huge = 'a'.repeat(5 * 1024 * 1024 + 1)
    const result = await validateAndParseFeed('https://example.com/feed.xml', {
      fetch: mockResponse(huge),
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('size cap')
    }
  })

  test('follows up to MAX_REDIRECTS (3) hops', async () => {
    const chain = redirectChain([
      'https://example.com/feed',
      'https://example.com/v2/feed',
      'https://example.com/v3/feed',
      'https://final.example/feed.xml',
    ])
    const result = await validateAndParseFeed('https://example.com/feed', {
      fetch: chain.fetch,
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.finalUrl).toBe('https://final.example/feed.xml')
    }
    expect(chain.calls).toEqual([
      'https://example.com/feed',
      'https://example.com/v2/feed',
      'https://example.com/v3/feed',
      'https://final.example/feed.xml',
    ])
  })

  test('rejects when a 4th redirect is requested', async () => {
    const chain = redirectChain([
      'https://example.com/a',
      'https://example.com/b',
      'https://example.com/c',
      'https://example.com/d',
      'https://example.com/e',
    ])
    const result = await validateAndParseFeed('https://example.com/a', {
      fetch: chain.fetch,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('too many redirects')
    }
  })
})

function mockResponse(
  body: string,
  options: {
    status?: number
    statusText?: string
    finalUrl?: string
  } = {},
) {
  const status = options.status ?? 200
  return async (input: RequestInfo | URL): Promise<Response> => {
    const url =
      options.finalUrl ??
      (typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url)
    const response = new Response(body, {
      status,
      statusText: options.statusText,
    })
    Object.defineProperty(response, 'url', { value: url })
    return response
  }
}

function redirectChain(urls: Array<string>) {
  const calls: Array<string> = []
  const fetch = async (input: RequestInfo | URL): Promise<Response> => {
    const requestedUrl =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url
    calls.push(requestedUrl)
    const index = urls.indexOf(requestedUrl)
    if (index === -1) {
      throw new Error(`Unexpected fetch to ${requestedUrl}`)
    }
    const isFinal = index === urls.length - 1
    if (isFinal) {
      const response = new Response(RSS_2_0, { status: 200 })
      Object.defineProperty(response, 'url', { value: requestedUrl })
      return response
    }
    return new Response(null, {
      status: 301,
      headers: { Location: urls[index + 1] },
    })
  }
  return { fetch, calls }
}
