# Design system

Quick-reference for anyone (including agents) starting a UI change in this repo. Read this once before your first design-system PR; refer back when adding a component.

The why behind these choices lives in [ADR-0002](./adr/0002-design-system-foundation.md).

## Tokens

Canonical names follow shadcn's vocabulary. Values come from the Frontpage brand kit. Use the Tailwind utility name in JSX (`bg-primary`, `text-muted-foreground`, etc.) — never inline a hex.

| Token | Brand-kit name | Light | Dark | Tailwind utility |
|---|---|---|---|---|
| `--background` | `--color-bg-primary` | `#FFFFFF` | `#0D1117` | `bg-background` |
| `--foreground` | `--color-text-primary` | `#1A1D21` | `#E6EDF3` | `text-foreground` |
| `--card` | `--color-surface` | `#FFFFFF` | `#161B22` | `bg-card` |
| `--card-foreground` | `--color-text-primary` | `#1A1D21` | `#E6EDF3` | `text-card-foreground` |
| `--popover` | `--color-surface` | `#FFFFFF` | `#161B22` | `bg-popover` |
| `--popover-foreground` | `--color-text-primary` | `#1A1D21` | `#E6EDF3` | `text-popover-foreground` |
| `--primary` | `--color-accent` | `#2563EB` | `#58A6FF` | `bg-primary`, `text-primary` |
| `--primary-foreground` | text-on-accent | `#FFFFFF` | `#0D1117` | `text-primary-foreground` |
| `--secondary` | `--color-bg-secondary` | `#F8F9FA` | `#161B22` | `bg-secondary` |
| `--secondary-foreground` | `--color-text-primary` | `#1A1D21` | `#E6EDF3` | `text-secondary-foreground` |
| `--muted` | `--color-bg-tertiary` | `#F1F3F5` | `#21262D` | `bg-muted` |
| `--muted-foreground` | `--color-text-tertiary` | `#8B949E` | `#6E7681` | `text-muted-foreground` |
| `--accent` | `--color-bg-tertiary` (hover) | `#F1F3F5` | `#21262D` | `bg-accent`, `hover:bg-accent` |
| `--accent-foreground` | `--color-text-primary` | `#1A1D21` | `#E6EDF3` | `text-accent-foreground` |
| `--destructive` | `--color-error` | `#DC2626` | `#F85149` | `bg-destructive`, `text-destructive` |
| `--destructive-foreground` | text-on-destructive | `#FFFFFF` | `#0D1117` | `text-destructive-foreground` |
| `--border` | `--color-border` | `#E1E4E8` | `#30363D` | `border-border`, `border` |
| `--input` | `--color-border` | `#E1E4E8` | `#30363D` | `border-input` |
| `--ring` | `--color-accent` | `#2563EB` | `#58A6FF` | `focus-visible:ring-ring` |
| `--success` (custom) | `--color-success` | `#16A34A` | `#3FB950` | `bg-success`, `text-success` |
| `--success-foreground` (custom) | text-on-success | `#FFFFFF` | `#0D1117` | `text-success-foreground` |
| `--warning` (custom) | `--color-warning` | `#CA8A04` | `#D29922` | `bg-warning`, `text-warning` |
| `--warning-foreground` (custom) | text-on-warning | `#FFFFFF` | `#0D1117` | `text-warning-foreground` |
| `--unread-indicator` (custom) | `--color-unread-indicator` | `#2563EB` | `#58A6FF` | `bg-unread-indicator` |
| `--accent-subtle` (custom) | `--color-accent-subtle` | `#EFF6FF` | `#1A2332` | `bg-accent-subtle` |

`--radius` is `0.5rem` (shadcn default; matches brand-kit `--radius-md`). Tailwind exposes `rounded-sm`/`md`/`lg`/`xl` derived from it.

## Custom semantic tokens

Beyond shadcn's defaults, four custom tokens carry domain meaning:

- `--success` / `bg-success` — feed-health indicator, "fetched OK" confirmations.
- `--warning` / `bg-warning` — stale feed, retry suggested, soft validation issues.
- `--unread-indicator` / `bg-unread-indicator` — the dot on unread items. Distinct from `--primary` so unread-state colors can shift without affecting primary actions.
- `--accent-subtle` / `bg-accent-subtle` — selected/active row background in lists (sidebar, feed list). Distinct from `--accent` (which is the *hover* surface).

Use `text-success-foreground` / `text-warning-foreground` for text-on-color when applying `--success` / `--warning` as backgrounds.

## Adding a shadcn component

Install on demand — never pre-install primitives you aren't about to use.

```sh
npx shadcn@latest add <name>
```

The component lands at `src/components/ui/<name>.tsx`. Review the diff for:

- Imports — strip the redundant `.ts` extension (`#/lib/utils.ts` → `#/lib/utils`).
- Dependencies — shadcn may add `radix-ui` packages or others to `package.json`. Confirm they're in `dependencies` (not `devDependencies`) and that no duplicate `@radix-ui/react-*` scoped packages were added alongside the `radix-ui` metapackage.
- Tokens — the file should reference `bg-primary`, `text-foreground`, etc. Don't patch these; our `:root` + `.dark` blocks already provide the values.
- Formatting — run `pnpm format` immediately; shadcn ships double quotes, our config uses single.

## File & folder conventions

```text
src/
├── components/
│   ├── ui/         shadcn primitives (kebab-case, drop-in from registry)
│   ├── feed/       feed-domain compositions (feed-item, feed-health-badge, …)
│   ├── layout/     header, footer, theme-toggle, sidebar
│   └── states/     empty-state, error-state, loading-skeleton
└── lib/
    ├── theme.ts    only consumer of prefers-color-scheme (see Dark mode)
    └── utils.ts    cn() helper
```

- **Filenames** are kebab-case everywhere (`feed-item.tsx`, not `FeedItem.tsx`). Matches shadcn convention.
- **Component exports** stay PascalCase (`export function FeedItem()`).
- **Path alias** is `#/*` mapped to `src/*`. Use `#/components/ui/button`, not `../../components/...`.
- **Don't** create a top-level `src/features/` tree yet. Folders grow under `src/components/<area>/` until an area has its own data layer worth co-locating.

## Stories

Storybook is the single component-showcase surface. Stories live next to the component (`button.tsx` + `button.stories.tsx`).

**Presentation/container split** — Storybook runs with its own minimal Vite config that does not load the Cloudflare or TanStack Start plugins. Components in stories MUST receive their data via props. Do not import from `convex/`, do not call `@clerk/react` hooks, do not use TanStack Route loaders inside a storied component. If a component needs that data, split it: a presentational child (storied) plus a container parent (not storied) that wires the data.

**Variants per story** — one named export per visual state (`Default`, `Disabled`, `Loading`, `Error`, `LongTitle`, …). Composite stories (`Sizes`, `IconSizes`) are fine for catalog views.

**Tag for autodocs** — the default in `.storybook/preview.tsx` already includes `tags: ['autodocs']`, so every story file gets an auto-generated docs page. Use `argTypes` to drive the Controls panel (variant select, size select, etc.).

**Story-as-test** — every story is run as a Vitest test (smoke render + axe a11y assertion) via the Storybook Vitest addon. A story that throws on render, or that produces a serious/critical a11y violation, fails CI. The `a11y.test: 'error'` parameter in `preview.tsx` enforces this.

## Dark mode

Toggle is a `.dark` class on `<html>` — set by `THEME_INIT_SCRIPT` in `__root.tsx` before paint (no hydration flash) and re-applied by `src/lib/theme.ts` on mount and on every toggle click.

**Component rules:**

- Use Tailwind `dark:` variants on classes. Example: `bg-card dark:bg-card` is redundant — the token resolves under `.dark` already. Only add `dark:` when you need a class that doesn't go through a token (e.g. `dark:opacity-90`).
- `src/lib/theme.ts` is the **only** file in `src/` that reads `prefers-color-scheme`. Components never call `window.matchMedia` directly. If a component needs to know the resolved theme, lift that into a parent and pass as a prop, or extend `theme.ts`.

## Accessibility

Two enforcement layers:

1. **Storybook a11y addon** runs axe-core on every story render, both in the chrome (the a11y panel) and in CI (the Vitest addon, with `a11y.test: 'error'` failing serious/critical violations).
2. **Brand-kit checklist** — the canonical AA checklist lives in the Frontpage brand-kit's `accessibility.md` (external). Highlights to enforce manually:
    - Color is never the sole indicator (use icon + color, or weight + color, for status states).
    - All interactive elements have a visible `:focus-visible` outline (shadcn primitives already do this via `--ring`).
    - Form inputs have associated `<label>`s, error messages link via `aria-describedby`, and required fields use `aria-required`.
    - Dynamic content updates use `aria-live` regions (refresh complete, mark-all-read confirmations).
    - Touch targets are at least 44×44 px on mobile.

When in doubt, check whether axe catches it in a story — if not, add a story for the variant in question.
