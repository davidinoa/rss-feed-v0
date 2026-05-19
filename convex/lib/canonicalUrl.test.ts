import { describe, expect, test } from 'vitest'
import { canonicaliseUrl, InvalidUrlError } from './canonicalUrl'

describe('canonicaliseUrl — applied normalisations', () => {
  test.each([
    // Lowercase host
    ['https://Example.COM/feed.xml', 'https://example.com/feed.xml'],
    ['https://EXAMPLE.com/feed.xml', 'https://example.com/feed.xml'],
    // Strip default port
    ['https://example.com:443/feed.xml', 'https://example.com/feed.xml'],
    ['http://example.com:80/feed.xml', 'http://example.com/feed.xml'],
    // Drop fragment
    ['https://example.com/feed.xml#latest', 'https://example.com/feed.xml'],
    [
      'https://example.com/feed.xml?q=1#section',
      'https://example.com/feed.xml?q=1',
    ],
    // Identity for already-canonical input
    ['https://example.com/feed.xml', 'https://example.com/feed.xml'],
  ])('canonicaliseUrl(%s) === %s', (input, expected) => {
    expect(canonicaliseUrl(input)).toBe(expected)
  })
})

describe('canonicaliseUrl — deliberately NOT normalised', () => {
  test.each<[string, string]>([
    // Trailing slash kept — different routes can serve different content
    ['https://example.com/feed', 'https://example.com/feed'],
    ['https://example.com/feed/', 'https://example.com/feed/'],
    // www. kept — publisher's choice
    ['https://www.example.com/feed.xml', 'https://www.example.com/feed.xml'],
    // http stays http — server-side redirects handle the upgrade
    ['http://example.com/feed.xml', 'http://example.com/feed.xml'],
    // Query params kept verbatim
    [
      'https://example.com/feed.xml?category=ai&page=2',
      'https://example.com/feed.xml?category=ai&page=2',
    ],
    // Non-default port kept (only :80 on http and :443 on https are stripped)
    ['https://example.com:8443/feed.xml', 'https://example.com:8443/feed.xml'],
  ])('canonicaliseUrl preserves %s', (input, expected) => {
    expect(canonicaliseUrl(input)).toBe(expected)
  })

  test('two URLs that differ only by trailing slash remain distinct', () => {
    expect(canonicaliseUrl('https://example.com/feed')).not.toBe(
      canonicaliseUrl('https://example.com/feed/'),
    )
  })

  test('http and https variants of the same host stay distinct', () => {
    expect(canonicaliseUrl('http://example.com/feed')).not.toBe(
      canonicaliseUrl('https://example.com/feed'),
    )
  })
})

describe('canonicaliseUrl — rejects invalid input', () => {
  test.each([
    '',
    'not a url',
    'example.com/feed', // missing protocol
    'ftp://example.com/feed.xml', // unsupported protocol
    'mailto:rss@example.com', // unsupported protocol
    'file:///etc/passwd', // unsupported protocol
  ])('throws InvalidUrlError on %s', (input) => {
    expect(() => canonicaliseUrl(input)).toThrow(InvalidUrlError)
  })
})
