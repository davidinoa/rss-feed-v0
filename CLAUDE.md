# rss-feed-v0

Solo project. See `package.json` for stack details (Vite + Convex + Cloudflare Workers).

## Agent skills

### Issue tracker

Issues are tracked as GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical defaults (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context (one `CONTEXT.md` + `docs/adr/` at the repo root). See `docs/agents/domain.md`.

## Commit conventions

All commits in this repo **must** follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Enforced by a `commit-msg` hook (`commitlint` + `simple-git-hooks`) — non-conforming messages are rejected.

Format: `type(scope?): description`

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

- Description is required, lowercase, no trailing period.
- Breaking changes: append `!` after the type/scope and add a `BREAKING CHANGE:` footer.
- Wrap the body at ~72 chars; explain the *why*, not the *what*.

Examples: `feat(feeds): add OPML import`, `fix(timeline): handle empty entry list`, `chore: bump pnpm to 9.16`.
