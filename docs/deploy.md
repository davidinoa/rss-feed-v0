# Deployment

This repo deploys to Cloudflare Workers via the Cloudflare Workers Build pipeline (GitHub integration → runs `pnpm build && wrangler deploy`).

Public URL: https://rss-feed-v0.davidinoa.workers.dev

## Environment variables

The Cloudflare build needs these env vars:

| Variable | Where to get it | Used by |
| --- | --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | [Clerk dashboard](https://dashboard.clerk.com) → API keys (`pk_test_…` or `pk_live_…`) | `src/integrations/clerk/provider.tsx` |
| `VITE_CONVEX_URL` | Convex deployment URL (`https://<name>.convex.cloud`); run `pnpm convex:dev` once to provision | `src/integrations/convex/provider.tsx` |
| `CONVEX_DEPLOY_KEY` | Convex dashboard → Settings → Deploy Keys → "Generate Production Deploy Key" | `pnpm convex:deploy` in the build command (encrypted) |

### ⚠️ `VITE_*` is build-time, not runtime

`VITE_*` vars are **inlined by Vite at build time** — they get replaced with literal strings inside `dist/server/index.js` during `vite build`. Whatever value is set in the environment when the build runs is permanently baked into the deployed bundle. (`CONVEX_DEPLOY_KEY` is also consumed at build time, but by the Convex CLI — not inlined.)

This means **`wrangler secret put` will not work for these vars**. Runtime secrets are only readable via `env.MY_SECRET` inside the Worker, not via `import.meta.env.VITE_*` in the bundle.

(The error message in `src/integrations/clerk/provider.tsx` currently suggests `wrangler secret put` — that's misleading and tracked as a follow-up fix.)

### Setting them in Cloudflare

For Workers Build deploys (GitHub-connected):

1. Cloudflare dashboard → **Workers & Pages → `rss-feed-v0` → Settings**
2. Find the **Build** section (the one that shows the GitHub repo connection — *not* the Worker's runtime "Variables and Secrets" near the top)
3. Under the Build config's **Variables and Secrets**, add all three (mark `CONVEX_DEPLOY_KEY` as encrypted)
4. Click **Save** then trigger a redeploy (push any commit, or use **Retry deployment** on the failed build)

### Setting them locally

Copy `.env.example` to `.env.local` and fill in real values. `.env.local` is gitignored.

```sh
cp .env.example .env.local
# edit .env.local with real values
pnpm dev
```

## Convex deploy runs from the Cloudflare build

The Convex backend (`convex/`) is deployed as part of the same build that ships the Worker. The Cloudflare **Build command** is:

```sh
if [ "$WORKERS_CI_BRANCH" = "main" ]; then pnpm convex:deploy && pnpm build; else pnpm build; fi
```

`WORKERS_CI_BRANCH` is [injected by Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#environment-variables). The gate keeps preview-branch builds from pushing branch-specific Convex functions into the prod deployment — only `main` builds touch Convex. Backend deploys before frontend so the Worker never references a function that doesn't exist yet.

If `pnpm convex:deploy` fails on `main`, the build short-circuits and `wrangler deploy` doesn't run, leaving the previous Worker in place.

## Symptoms when env vars are missing

- **All SSR routes return HTTP 500** with `{"status":500,"unhandled":true,"message":"HTTPError"}`
- Static assets (`/favicon.ico`, `/assets/*.js`) still return 200 — they're served before the SSR Worker runs
- Root cause: `src/integrations/clerk/provider.tsx` explicitly throws in production when `VITE_CLERK_PUBLISHABLE_KEY` is empty (lines 25-28)

If you hit this, the fix is always the same: confirm all build-time vars are set in the Workers Build configuration, then redeploy.

## Build warnings to know about

The current deploy emits two warnings — both harmless defaults, but worth making explicit eventually:

```
⚠ workers_dev not in wrangler.jsonc → defaulted to enabled (publicly reachable *.workers.dev URL)
⚠ preview_urls not set → defaulted to enabled (preview URLs are also public)
```

Since the GitHub repo is private but the Worker URL is public-by-default, anyone who knows the URL can hit it. When you're ready to lock down, add to `wrangler.jsonc`:

```jsonc
"workers_dev": false,  // or true if you want to keep the workers.dev URL
"preview_urls": false  // or true
```

…and configure a custom domain.
