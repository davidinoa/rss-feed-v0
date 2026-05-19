# Design system — engineering reference

Conventions for writing component code in this repo: file naming, shadcn installation, Storybook stories, dark-mode rules, accessibility enforcement. Read this once before your first UI PR; refer back when adding a component.

**For visual decisions** — palette values, typography scale, component design intent — see [`DESIGN.md`](../DESIGN.md) at the repo root. This document deliberately doesn't duplicate token values; the [Storybook tokens catalog](#tokens--how-to-use-them) renders every live value via `getComputedStyle()` and stays authoritative.

The why behind the foundational architecture decisions lives in [ADR-0002](./adr/0002-design-system-foundation.md) (shadcn vocabulary), [ADR-0003](./adr/0003-tiered-color-tokens.md) (tiered tokens), and [ADR-0004](./adr/0004-adopt-quiet-reading-room.md) (Quiet Reading Room visual direction).

## Tokens — how to use them

Colors use a **two-tier architecture** per ADR-0003: private primitives named by appearance, public semantics named by role. **Always use the semantic Tailwind utility** (`bg-primary`, `text-muted-foreground`, `bg-card`, etc.) in JSX. Never inline a hex, and never reach for a primitive directly.

Tailwind v4's default color palette is disabled (`@theme { --color-*: initial; }`), so `bg-blue-500`, `text-gray-700`, and similar are NOT valid utilities. Only the functional non-palette values (`text-transparent` / `bg-transparent`, `text-current` / `bg-current`, `text-inherit` / `bg-inherit`) are preserved as escape hatches.

**Browse the full catalog in Storybook**: `Design System / Tokens` (`pnpm storybook`). The Overview page explains the architecture; per-tier pages render every primitive, semantic, and radius value with light/dark previews resolved at runtime from the live CSS. The Storybook catalog is the authoritative live view; DESIGN.md is the authoritative spec.

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

**Every UI primitive ships as a trio**, enforced in CI by `pnpm check:ui`:

1. `src/components/ui/<name>.tsx` — the component (the shadcn install gives you this).
2. `src/components/ui/<name>.meta.ts` — machine-readable metadata. See [§ Component metadata for AI agents](#component-metadata-for-ai-agents) for the workflow.
3. `src/components/ui/<name>.stories.tsx` — Storybook story. At minimum, one default story; ideally one story per visual state. Story-as-test runs axe-core a11y on every render, so missing this file silently drops a11y coverage for the component.

If any of the three are missing, `pnpm check:ui` (run as part of the `Lint, format, test, intent:stale` CI job) fails the build with a punch list.

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

## Component metadata for AI agents

Every new component (and every new variant on an existing one) ships with a co-located `<name>.meta.ts` describing it in a machine-readable shape. AI agents read these files to pick the right component for a prose request — variant, relationships, anti-patterns — without inventing patterns.

Two skills wire this up:

- [`agentic-design-systems`](../.agents/skills/agentic-design-systems/SKILL.md) — the canonical `ComponentMeta` schema, build workflow, and validator spec.
- [`ai-component-metadata`](../.agents/skills/ai-component-metadata/SKILL.md) — the per-component producer; ships a Python scaffolder and a worked Button template.

### Workflow when adding a component

1. Build the component as usual (shadcn install, or new file per the conventions above).
2. Scaffold the metadata:
   ```sh
   python .agents/skills/ai-component-metadata/scripts/generate_metadata.py src/components/ui/<name>.tsx
   ```
   Emits `<name>.meta.ts` with `component` / `props` / `variants.axes` filled and `// TODO` placeholders for the rest. Or copy [`metadata-template.ts`](../.agents/skills/ai-component-metadata/assets/metadata-template.ts) and adapt by hand. Run `pnpm format` afterwards — the scaffolder emits double quotes; oxfmt normalizes to single (same gotcha as a fresh shadcn install).
3. Hand-fill `aiHints.usage.antiPatterns` first — the `{scenario, reason, alternative}` triples often reveal missing variants or relationships before they bite.
4. Wire `meta.tokens` to this repo's tiered semantic tokens (`bg-primary`, `text-muted-foreground`, etc.) — the **semantic-palette** variant in [Token architecture variants](../.agents/skills/agentic-design-systems/SKILL.md#token-architecture-variants). State is carried by Tailwind opacity modifiers per [ADR-0003](adr/0003-tiered-color-tokens.md); don't invent `--<name>-state-*` tokens.

### One-time setup

If this is the first component getting metadata, copy the canonical contract once:

```sh
cp .agents/skills/ai-component-metadata/assets/meta.types.ts src/components/meta.types.ts
```

Every `<name>.meta.ts` imports `ComponentMeta` from this file.

### Retrofitting existing components

Don't open standalone "add metadata to X" PRs. Retrofit as you touch each component for other reasons. Mark less-trafficked primitives as `priority: "medium"` or `"low"` — the validator only requires `antiPatterns` for `priority: "high"`.
