# Deployment

This repo deploys to Cloudflare Workers via the Cloudflare Workers Build pipeline (GitHub integration → runs `pnpm build && wrangler deploy`).

Public URL: https://rss-feed-v0.davidinoa.workers.dev

## Environment variables

The app reads two `VITE_*` env vars:

| Variable | Where to get it | Used by |
| --- | --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | [Clerk dashboard](https://dashboard.clerk.com) → API keys (`pk_test_…` or `pk_live_…`) | `src/integrations/clerk/provider.tsx` |
| `VITE_CONVEX_URL` | Convex deployment URL (`https://<name>.convex.cloud`); run `pnpm convex:dev` once to provision | `src/integrations/convex/provider.tsx` |

### ⚠️ Build-time, not runtime

`VITE_*` vars are **inlined by Vite at build time** — they get replaced with literal strings inside `dist/server/index.js` during `vite build`. Whatever value is set in the environment when the build runs is permanently baked into the deployed bundle.

This means **`wrangler secret put` will not work for these vars**. Runtime secrets are only readable via `env.MY_SECRET` inside the Worker, not via `import.meta.env.VITE_*` in the bundle.

(The error message in `src/integrations/clerk/provider.tsx` currently suggests `wrangler secret put` — that's misleading and tracked as a follow-up fix.)

### Setting them in Cloudflare

For Workers Build deploys (GitHub-connected):

1. Cloudflare dashboard → **Workers & Pages → `rss-feed-v0` → Settings**
2. Find the **Build** section (the one that shows the GitHub repo connection — *not* the Worker's runtime "Variables and Secrets" near the top)
3. Under the Build config's **Variables and Secrets**, add both vars
4. Click **Save** then trigger a redeploy (push any commit, or use **Retry deployment** on the failed build)

### Setting them locally

Copy `.env.example` to `.env.local` and fill in real values. `.env.local` is gitignored.

```sh
cp .env.example .env.local
# edit .env.local with real values
pnpm dev
```

## Convex deploy is currently separate

The Cloudflare build runs `pnpm build && wrangler deploy` — it does **not** deploy Convex. The Convex backend (`convex/` directory) must be deployed separately:

```sh
# one-time: provision a prod deployment + get a deploy key
pnpm convex:deploy

# then for ongoing deploys, store CONVEX_DEPLOY_KEY in Cloudflare Build secrets
# and prepend `pnpm convex:deploy &&` to the build command
```

See follow-up task: "Wire Convex deploy into Cloudflare Build" for the full plan.

## Symptoms when env vars are missing

- **All SSR routes return HTTP 500** with `{"status":500,"unhandled":true,"message":"HTTPError"}`
- Static assets (`/favicon.ico`, `/assets/*.js`) still return 200 — they're served before the SSR Worker runs
- Root cause: `src/integrations/clerk/provider.tsx` explicitly throws in production when `VITE_CLERK_PUBLISHABLE_KEY` is empty (lines 25-28)

If you hit this, the fix is always the same: confirm both build-time vars are set in the Workers Build configuration, then redeploy.

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
