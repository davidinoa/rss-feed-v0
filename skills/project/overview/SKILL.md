---
name: project/overview
description: Conventions for adding routes, wiring data, and extending the rss-feed-v0 RSS reader. Use when modifying anything under src/.
license: MIT
---

# rss-feed-v0 conventions

A TanStack Start RSS reader scaffold. Users subscribe to feeds, organize them
into categories, and read articles in a unified timeline.

## Stack

- **TanStack Start** — SSR + server functions
- **TanStack Router** — type-safe file-based routes under `src/routes/`
- **TanStack Query** — fetching/caching, SSR hydration via
  `setupRouterSsrQueryIntegration` (configured in `src/router.tsx`)
- **TanStack Form** — subscription forms
- **Clerk (`@clerk/clerk-react`)** — authentication, provider in
  `src/integrations/clerk/provider.tsx`
- **Tailwind CSS v4**
- **Cloudflare Workers** — deployment via `wrangler.jsonc`

## Conventions

### Routes

- File-based under `src/routes/`. Use `createFileRoute('/<path>')({ ... })`.
- The QueryClient is in the route context, typed by `RouterContext` in
  `src/routes/__root.tsx`.

### Data loading

Standard pattern: queryOptions + ensureQueryData + useSuspenseQuery.

```ts
const feedsQueryOptions = queryOptions({
  queryKey: ['feeds'],
  queryFn: listFeeds,
})

export const Route = createFileRoute('/feeds')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(feedsQueryOptions),
  component: Feeds,
})

function Feeds() {
  const { data } = useSuspenseQuery(feedsQueryOptions)
}
```

This gives SSR hydration with no client refetch flash.

### Forms

Use `useForm` from `@tanstack/react-form`. Validators go on the field via
`validators.onChange`. See `src/routes/feeds.add.tsx`.

### Auth

- The Clerk provider wraps the tree in `src/routes/__root.tsx`.
- For client UI gating, use `<Show when="signed-in">` / `<Show when="signed-out">`
  from `@clerk/react`.
- For protected routes, wrap with `<Show when="signed-in">` and a
  `<RedirectToSignIn />` inside `<Show when="signed-out">`.
- `VITE_CLERK_PUBLISHABLE_KEY` is **required in every environment** — the
  provider throws at boot when it's missing. There is no fallback / no-op
  mode. Same rule applies to `VITE_CONVEX_URL` for the Convex provider.

### Cloudflare

- `wrangler.jsonc` is the source of truth for bindings.
- Run `pnpm cf-typegen` after adding bindings to regenerate
  `worker-configuration.d.ts`.
- The Cloudflare Vite plugin handles local Workers semantics — no separate
  emulator.

## Avoid

- `<a href>` for in-app navigation — use `<Link to="/path">`.
- Fetching data in components without `queryOptions` — you lose SSR dedupe
  and hydration.
- Hardcoded Clerk keys — read from `import.meta.env.VITE_CLERK_PUBLISHABLE_KEY`.
