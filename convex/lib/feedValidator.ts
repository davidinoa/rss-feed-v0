// Feed validator — fetches a URL, parses the body as RSS or Atom, returns the
// title and the newest entry's publish date.
//
// Slice #55 scope: happy-path only. No HTML discovery (slice #57), no typed
// error-code enum (slice #57), no description/icon/site-URL extraction
// (slice #56). Failures collapse into a single generic Error.

import { XMLParser } from 'fast-xml-parser'
import { z } from 'zod'

export type ParsedFeed = {
  title: string
  /** ms epoch from the newest item's pubDate / Atom updated/published. */
  lastPublishedAt: number | null
}

export type ValidateResult =
  | { ok: true; feed: ParsedFeed; finalUrl: string }
  | { ok: false; error: string }

const MAX_RESPONSE_BYTES = 5 * 1024 * 1024
const FETCH_TIMEOUT_MS = 8_000
const MAX_REDIRECTS = 3

type FetchLike = typeof fetch

export type ValidateOptions = {
  fetch?: FetchLike
  now?: () => number
}

export async function validateAndParseFeed(
  rawUrl: string,
  options: ValidateOptions = {},
): Promise<ValidateResult> {
  const fetchFn = options.fetch ?? globalThis.fetch
  let response: Response
  try {
    response = await fetchWithTimeout(rawUrl, fetchFn)
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'fetch failed',
    }
  }

  if (!response.ok) {
    return { ok: false, error: `HTTP ${response.status}` }
  }

  let body: string
  try {
    body = await readBodyCapped(response, MAX_RESPONSE_BYTES)
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'read failed',
    }
  }

  const parsed = parseFeed(body)
  if (!parsed) {
    return { ok: false, error: 'not a valid feed' }
  }

  return { ok: true, feed: parsed, finalUrl: response.url || rawUrl }
}

async function fetchWithTimeout(
  url: string,
  fetchFn: FetchLike,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    // `redirect: 'follow'` (the default) follows up to ~20 redirects in spec;
    // we don't have a portable way to cap at MAX_REDIRECTS without a custom
    // dispatcher, so we trust the runtime cap and rely on the timeout as the
    // backstop. The cap is documented in CONTEXT.md / PRD #54.
    const res = await fetchFn(url, {
      signal: controller.signal,
      redirect: 'follow',
    })
    void MAX_REDIRECTS // referenced in the docstring above
    return res
  } finally {
    clearTimeout(timer)
  }
}

async function readBodyCapped(
  response: Response,
  maxBytes: number,
): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) {
    // No streaming reader (some test mocks) — fall back to .text() but
    // verify the byte length afterwards.
    const text = await response.text()
    if (new TextEncoder().encode(text).byteLength > maxBytes) {
      throw new Error('response exceeds size cap')
    }
    return text
  }
  const chunks: Array<Uint8Array> = []
  let received = 0
  // Reads must be sequential to enforce the size cap: every chunk has to be
  // checked before the next is requested. Parallelising would defeat the
  // purpose.
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read()
    if (done) break
    received += value.byteLength
    if (received > maxBytes) {
      reader.cancel().catch(() => {})
      throw new Error('response exceeds size cap')
    }
    chunks.push(value)
  }
  const merged = new Uint8Array(received)
  let offset = 0
  for (const chunk of chunks) {
    merged.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(merged)
}

// ----- XML parsing -----------------------------------------------------------

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  // Atom feeds frequently have multiple <entry> elements; fast-xml-parser
  // collapses single occurrences to objects unless told to keep arrays.
  isArray: (name) => name === 'item' || name === 'entry',
  // Date strings should stay strings; let our parsers coerce.
  parseTagValue: false,
  trimValues: true,
})

// Zod shapes are intentionally loose. Real-world feeds break spec constantly;
// we only enforce what we actually use.
const rssShape = z.object({
  rss: z.object({
    channel: z.object({
      title: z.union([z.string(), z.object({ '#text': z.string() })]),
      item: z
        .array(
          z.object({
            pubDate: z.string().optional(),
          }),
        )
        .optional(),
    }),
  }),
})

const atomShape = z.object({
  feed: z.object({
    title: z.union([z.string(), z.object({ '#text': z.string() })]),
    entry: z
      .array(
        z.object({
          updated: z.string().optional(),
          published: z.string().optional(),
        }),
      )
      .optional(),
  }),
})

export function parseFeed(xml: string): ParsedFeed | null {
  let raw: unknown
  try {
    raw = xmlParser.parse(xml)
  } catch {
    return null
  }
  return parseRss(raw) ?? parseAtom(raw)
}

function parseRss(raw: unknown): ParsedFeed | null {
  const parsed = rssShape.safeParse(raw)
  if (!parsed.success) return null
  const channel = parsed.data.rss.channel
  const title = readTextish(channel.title)
  if (!title) return null
  const dates = (channel.item ?? [])
    .map((item) => parseDate(item.pubDate))
    .filter((d): d is number => d !== null)
  return {
    title,
    lastPublishedAt: dates.length === 0 ? null : Math.max(...dates),
  }
}

function parseAtom(raw: unknown): ParsedFeed | null {
  const parsed = atomShape.safeParse(raw)
  if (!parsed.success) return null
  const feed = parsed.data.feed
  const title = readTextish(feed.title)
  if (!title) return null
  const dates = (feed.entry ?? [])
    .map((entry) => parseDate(entry.updated ?? entry.published))
    .filter((d): d is number => d !== null)
  return {
    title,
    lastPublishedAt: dates.length === 0 ? null : Math.max(...dates),
  }
}

function readTextish(value: string | { '#text': string }): string {
  const raw = typeof value === 'string' ? value : value['#text']
  return raw.trim()
}

function parseDate(input: string | undefined): number | null {
  if (!input) return null
  const ts = Date.parse(input)
  return Number.isFinite(ts) ? ts : null
}
