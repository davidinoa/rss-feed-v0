# rss-feed-v0

A TanStack Start scaffold for an RSS feed reader. Users subscribe to blogs and
news sources, organize feeds into categories, and read articles in a unified
timeline.

## Stack

- **[TanStack Start](https://tanstack.com/start)** — SSR + server functions
- **[TanStack Router](https://tanstack.com/router)** — type-safe file routing
- **[TanStack Query](https://tanstack.com/query)** — fetching, caching, SSR
  hydration via `@tanstack/react-router-ssr-query`
- **[TanStack Form](https://tanstack.com/form)** — subscription form validation
- **[TanStack Intent](https://tanstack.com/intent)** — agent skills shipped
  with installed packages, auto-discovered by IDE agents
- **[TanStack CLI](https://www.npmjs.com/package/@tanstack/cli)** — project
  scaffolding tools (already used to bootstrap this app)
- **[Clerk](https://clerk.com)** — authentication
- **[Convex](https://convex.dev)** — database, queries, mutations, real-time
  subscriptions (schema + functions under `convex/`)
- **[Cloudflare Workers](https://workers.cloudflare.com)** — deployment
- **[CodeRabbit](https://coderabbit.ai)** — AI pull request review (configured
  via `.coderabbit.yaml`; requires the GitHub App)
- **Tailwind CSS v4**
- **pnpm** for package management

## Get started

```bash
pnpm install
cp .env.example .env.local   # then fill in VITE_CLERK_PUBLISHABLE_KEY
pnpm dev
```

The app boots at <http://localhost:3000>.

## Follow-ups

Manual / cloud-side steps the initial scaffolding can't do for you. Check
items off as you finish them; add new ones as integrations grow.

### Clerk

- [x] Create an app at [clerk.com](https://clerk.com) and set
      `VITE_CLERK_PUBLISHABLE_KEY` in `.env.local`
- [ ] Migrate `@clerk/clerk-react` (deprecated, warns on install) →
      `@clerk/react`
- [ ] When it leaves beta: switch to `@clerk/tanstack-react-start` for
      server-side `auth()` and `clerkMiddleware`
- [ ] Production: swap test keys for production keys, configure the
      production domain, and enable any social providers (Google, GitHub, …)

### Convex

- [x] Run `pnpm convex:dev` to provision a deployment (auto-writes
      `VITE_CONVEX_URL` to `.env.local`, generates `convex/_generated/`)
- [x] In Clerk dashboard: create a JWT template named `convex`, copy the
      issuer URL
- [x] In Convex dashboard: set `CLERK_JWT_ISSUER_DOMAIN` to that issuer URL,
      then restart `pnpm convex:dev`
- [ ] Migrate `/feeds`, `/timeline`, `/feeds/add` from mock
      `src/lib/feeds.ts` to `convexQuery(api.feeds.list, …)` /
      `useMutation(api.feeds.add)` (pattern in the Convex section below)
- [ ] Retire `src/lib/feeds.ts` once routes are migrated (or repurpose as
      seed data)
- [ ] Run `pnpm convex:deploy` from CI before each production release

### Cloudflare Workers

- [ ] Per machine: `pnpm dlx wrangler login`
- [x] Set `VITE_*` vars as **Cloudflare Build variables**
      (dashboard → Settings → Build → *Build variables and secrets*) —
      NOT `wrangler secret put`, which is runtime-only and won't reach
      `vite build`. See `docs/deploy.md` for the full gotcha.
- [ ] Configure custom domain under Workers → your worker → Triggers
- [ ] Disable public `*.workers.dev` URL once a custom domain is live:
      add `"workers_dev": false` and `"preview_urls": false` to
      `wrangler.jsonc`
- [ ] After binding changes (KV / D1 / R2 / Durable Objects / Queues):
      `pnpm cf-typegen`

### CodeRabbit

- [x] Push the repo to GitHub
- [ ] Install the [CodeRabbit GitHub App](https://github.com/apps/coderabbitai)
      on the repo or org
- [ ] Tune `.coderabbit.yaml` `path_instructions` as the codebase grows

### Playwright

- [ ] Per machine: `pnpm dlx playwright install chromium`
- [ ] Expand `e2e/` coverage beyond the smoke specs as routes settle

### Vitest

- [ ] Expand unit coverage as components and helpers stabilize (current
      coverage: `src/lib/feeds.test.ts`)

### TanStack

- [ ] Pin the `"latest"` versions in `package.json` to fixed semver before
      shipping (supply chain hygiene)
- [ ] (Optional) Add `pnpm intent:stale` as a CI check so library skills
      stay in sync with their source docs

### CI

- [ ] Add a GitHub Actions workflow running, in order:
      `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm format:check`,
      `pnpm test`, `pnpm test:e2e`, `pnpm intent:stale`,
      `pnpm convex:deploy` (on main)

## Project tour

| Path           | What it shows                                |
| -------------- | -------------------------------------------- |
| `/`            | Landing page                                 |
| `/timeline`    | TanStack Query + route loader (SSR-hydrated) |
| `/feeds`       | Suspense query listing subscriptions         |
| `/feeds/add`   | TanStack Form with validation                |
| `/demo/clerk`  | Clerk prebuilt sign-in + signed-in user info |
| `/demo/convex` | Convex backend setup wizard / live status    |
| `/about`       | High-level overview                          |

Mock data lives in `src/lib/feeds.ts`. Swap it for a real feed fetcher when you
move past the scaffold stage.

## Authentication (Clerk)

The CLI wired in `@clerk/clerk-react`. The provider wraps the app in
`src/integrations/clerk/provider.tsx` and the header swaps `SignInButton` ↔
`UserButton` based on auth state.

### Setup

1. Sign up at [clerk.com](https://clerk.com) and create an application.
2. Copy the **Publishable Key** from the Clerk dashboard.
3. Set it in `.env.local`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```
4. Visit `/demo/clerk` once `pnpm dev` is running.

### Protect a route

```tsx
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

function ProtectedPage() {
  return (
    <>
      <SignedIn>
        <YourPageContent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
```

For server-side auth (route loaders, server functions), you can upgrade to
[`@clerk/tanstack-react-start`](https://www.npmjs.com/package/@clerk/tanstack-react-start)
when it leaves beta — it ships `clerkMiddleware`, `createClerkHandler`, and
server-side `auth()` helpers.

## Backend (Convex)

[Convex](https://convex.dev) provides the database, queries, mutations, and
real-time subscriptions. The schema and functions live in `convex/`:

- `convex/schema.ts` — `feeds` and `articles` tables (with `by_user`,
  `by_category`, `by_published` indexes)
- `convex/feeds.ts` — `list`, `add`, `remove` (scoped to the signed-in user)
- `convex/articles.ts` — `timeline` (most recent 50 across subscribed feeds)
- `convex/auth.config.ts` — Clerk as the JWT provider

### First-time setup

```bash
pnpm convex:dev          # interactive: login, create or select a project
```

This appends `VITE_CONVEX_URL=https://...convex.cloud` to `.env.local` and
generates the typed client at `convex/_generated/`. Leave it running in a
second terminal while you develop — schema and function changes deploy on
save.

> **pnpm note:** scripts use `convex-bundled` (the compiled CLI) instead of
> `convex` because Convex's dev binary depends on `tsx` resolved against its
> own package directory, which pnpm's isolated install doesn't satisfy.
> `convex-bundled` is shipped in the same package and works the same way.

### Wire Clerk → Convex

1. In the **Clerk dashboard**, create a JWT template named `convex` (the
   default applicationID we use in `convex/auth.config.ts`).
2. Copy the issuer URL (e.g. `https://your-app.clerk.accounts.dev`).
3. In the **Convex dashboard** under your deployment's Settings →
   Environment Variables, set `CLERK_JWT_ISSUER_DOMAIN` to that issuer URL.
4. Restart `pnpm convex:dev` so it picks up the new env var.

Convex guide with screenshots: <https://docs.convex.dev/auth/clerk>.

### Use a Convex query in a route

After `pnpm convex:dev` has generated `convex/_generated/`:

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'

function Feeds() {
  const { data } = useSuspenseQuery(convexQuery(api.feeds.list, {}))
  return (
    <ul>
      {data.map((f) => (
        <li key={f._id}>{f.title}</li>
      ))}
    </ul>
  )
}
```

This piggybacks on the existing TanStack Query setup so SSR hydration still
works, and Convex's reactive channel keeps the data live without manual
invalidation.

### Deploy to production

```bash
pnpm convex:deploy
```

This deploys the latest `convex/` code to your production deployment. Run it
from CI or locally before/after `pnpm deploy` for Cloudflare.

## Deploy to Cloudflare Workers

This project uses the Cloudflare Vite plugin and `wrangler.jsonc`.

```bash
pnpm dlx wrangler login        # one-time auth
pnpm deploy                    # build + wrangler deploy
```

### Production env vars

Two categories with different homes:

- **Build-time** (`VITE_*`) — Vite inlines these into the bundle during
  `vite build`. Set them in the Cloudflare dashboard under
  *Settings → Build → Build variables and secrets*, **not** via
  `wrangler secret put`. The Worker runtime never sees them; the values
  are already baked into the deployed JS.
- **Runtime** (anything your Worker reads via `env.MY_VAR`) — use
  `pnpm dlx wrangler secret put MY_VAR` or the dashboard's
  *Settings → Variables and Secrets*.

See `docs/deploy.md` for the full flow and a debug-log story of what
happens when you put a `VITE_*` var in the runtime section by mistake.

After adding bindings (KV, D1, R2, Durable Objects, queues) in `wrangler.jsonc`,
regenerate the types:

```bash
pnpm cf-typegen
```

## Code review (CodeRabbit)

CodeRabbit is configured via `.coderabbit.yaml` but runs as an external GitHub
App, not as in-app code. To enable it on this repo:

1. Push the repo to GitHub.
2. Install the [CodeRabbit GitHub App](https://github.com/apps/coderabbitai) on
   the repo (or the whole org).
3. Open a pull request. CodeRabbit will pick up `.coderabbit.yaml` automatically
   and post a review.

Tweak `path_instructions` in `.coderabbit.yaml` as the codebase grows.

## Agent skills (TanStack Intent)

`@tanstack/intent` ships agent skills alongside npm packages so coding agents
(Claude Code, Cursor, Copilot, Codex, Goose, etc.) pick up procedural knowledge
that travels with `pnpm update` rather than the model's training cutoff.

```bash
pnpm intent:list       # show every skill discovered in node_modules
pnpm intent:validate   # validate skills/ in this repo
pnpm intent:stale      # CI check: skill source docs drifted?
```

- Project conventions for agents live in `skills/project/overview/SKILL.md`.
- Library skills are auto-discovered from `node_modules` — `pnpm intent:list`
  already finds 30+ skills shipped by installed TanStack packages.

## Routing & data

File-based routes live in `src/routes/`. The standard data pattern is
`queryOptions` + `ensureQueryData` in the route loader + `useSuspenseQuery` in
the component — see `src/routes/timeline.tsx`. This pattern gives you SSR
hydration with no client refetch flash.

For ad-hoc server-only work, use a server function:

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({ method: 'GET' }).handler(async () => {
  return new Date().toISOString()
})
```

## Tests

```bash
pnpm test          # vitest unit tests (jsdom + @testing-library/react)
pnpm test:watch    # vitest in watch mode
pnpm test:e2e      # playwright e2e (chromium, reuses dev server if running)
pnpm test:e2e:ui   # playwright UI mode
```

- Unit specs live next to the code they cover, e.g.
  `src/lib/feeds.test.ts`. Global setup is in `src/test/setup.ts`.
- E2E specs live in `e2e/`. Playwright's `webServer` config spawns `pnpm dev`
  on demand and reuses an existing dev server when one is already running.
- Run `pnpm dlx playwright install chromium` once per machine to download the
  browser binary.

## Lint & format (oxc)

```bash
pnpm lint           # oxlint
pnpm lint:fix       # oxlint --fix
pnpm format         # oxfmt (write changes)
pnpm format:check   # oxfmt --check (CI mode)
```

oxc is a Rust-based JS toolchain; both `oxlint` and `oxfmt` run in well
under a second on this project. Config lives in `.oxlintrc.json` and
`.oxfmtrc.json`.

## Tailwind

Tailwind v4 is configured through `@tailwindcss/vite`. Tokens and base styles
live in `src/styles.css`. The typography plugin is loaded via
`@plugin "@tailwindcss/typography"` in that file.
