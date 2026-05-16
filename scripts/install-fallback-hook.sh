#!/bin/sh
# Idempotently install a commit-msg fallback into the main `.git/hooks/`
# directory. The Claude Code worktree harness writes a per-worktree
# `core.hooksPath` override pointing at `<main>/.git/hooks`, which beats
# husky's `.husky/_` config until `pnpm install` strips it. This fallback
# ensures the harness's override resolves to a working hook even before
# `pnpm install` runs in the new worktree.
set -e
HOOKS_DIR="$(git rev-parse --git-common-dir)/hooks"
mkdir -p "$HOOKS_DIR"
cat > "$HOOKS_DIR/commit-msg" <<'HOOK'
#!/bin/sh
npx --no -- commitlint --edit "$1"
HOOK
chmod +x "$HOOKS_DIR/commit-msg"
