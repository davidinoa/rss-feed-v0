# Design system

Quick-reference for anyone (including agents) starting a UI change in this repo. Read this once before your first design-system PR; refer back when adding a component.

The why behind these choices lives in [ADR-0002](./adr/0002-design-system-foundation.md) (foundation) and [ADR-0003](./adr/0003-tiered-color-tokens.md) (tiered color tokens).

## Tokens

Colors use a **two-tier architecture** — private primitives (`--neutral-100`, `--blue-600`) named by appearance, and public semantics (`--primary`, `--background`) named by role. Use the Tailwind utility for the semantic (`bg-primary`, `text-muted-foreground`) in JSX — never inline a hex, and never reach for a primitive directly.

Tailwind v4's default color palette is disabled (`@theme { --color-*: initial; }`), so `bg-blue-500`, `text-gray-700`, and similar are NOT valid utilities. Only `transparent`, `currentColor`, and `inherit` are preserved as functional escape hatches.

**Browse the full catalog in Storybook**: `Design System / Tokens` (`pnpm storybook`). The Overview page explains the architecture and lists the brand-kit cross-reference; per-tier pages render every primitive, semantic, and radius value with light/dark previews resolved at runtime from the live CSS.

States (hover, active, focus) are expressed via Tailwind's opacity modifier (`hover:bg-primary/90`) inherited from shadcn — not explicit state tokens. See ADR-0003 for the rationale.

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
