# rss-feed-v0

Solo project. See `package.json` for stack details (Vite + Convex + Cloudflare Workers).

## Agent skills

### Issue tracker

Issues are tracked as GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical defaults (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context (one `CONTEXT.md` + `docs/adr/` at the repo root). See `docs/agents/domain.md`.

### Design system

shadcn + Tailwind v4 + Storybook 10. Token reference, component conventions, and story rules in [`docs/design-system.md`](docs/design-system.md). Read once before your first UI PR.

## Deployment

Cloudflare Workers via Workers Build (GitHub integration). `VITE_*` env vars are **build-time inlined** — set them as build-time variables in the Cloudflare dashboard, not as `wrangler secret put` runtime secrets. See [`docs/deploy.md`](docs/deploy.md) for the full flow, gotchas, and warning explanations.

## Commit conventions

All commits in this repo **must** follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Enforced by a `commit-msg` hook (`commitlint` + `husky`) — non-conforming messages are rejected. The hook lives in `.husky/commit-msg` and is wired up via `core.hooksPath=.husky/_`, which works in git worktrees as well as the main checkout.

Format: `type(scope?): description`

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

- Description is required, lowercase, no trailing period.
- Breaking changes: append `!` after the type/scope and add a `BREAKING CHANGE:` footer.
- Wrap the body at ~72 chars; explain the *why*, not the *what*.

Examples: `feat(feeds): add OPML import`, `fix(timeline): handle empty entry list`, `chore: bump pnpm to 9.16`.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
