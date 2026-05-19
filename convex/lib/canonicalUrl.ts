// Canonical-URL policy for Source dedup. See ADR-0005 and PRD #54 for the
// rationale on what we normalise vs deliberately leave distinct.
//
// Applied:
//   - lowercase host (RFC 3986 §3.2.2 — hosts are case-insensitive)
//   - strip default port (:80 on http, :443 on https)
//   - drop URL fragment (fragments are client-only, never sent to server)
//
// NOT applied:
//   - trailing-slash stripping        (different routes may serve different content)
//   - 'www.' stripping                (publisher's host choice)
//   - http → https forcing            (let server-side redirects upgrade)
//   - query-param sorting/stripping   (some feeds use params semantically)
//
// The fetcher follows redirects (up to 3) and the action canonicalises the
// FINAL URL. We don't out-clever the publisher — we follow them.

export class InvalidUrlError extends Error {
  constructor(input: string) {
    super(`Not a valid URL: ${JSON.stringify(input)}`)
    this.name = 'InvalidUrlError'
  }
}

export function canonicaliseUrl(input: string): string {
  let url: URL
  try {
    url = new URL(input)
  } catch {
    throw new InvalidUrlError(input)
  }

  // Only accept http(s) — file://, mailto:, etc. aren't feeds.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new InvalidUrlError(input)
  }

  // host already drops default ports for http:80 / https:443 in modern URL
  // implementations. Setting hostname forces lowercase.
  url.hostname = url.hostname.toLowerCase()
  url.hash = ''

  return url.toString()
}
