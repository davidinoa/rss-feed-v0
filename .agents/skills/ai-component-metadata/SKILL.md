---
name: ai-component-metadata
version: 2.0.0
description: Scaffold or author a single component's `.meta.ts` file matching the canonical `ComponentMeta` schema defined by `agentic-design-systems`. Triggers include "generate metadata for this component", "scaffold a .meta.ts", "add aiHints to <Component>", "fill in variant axes / antiPatterns / relationships for <Component>", or any per-component metadata authoring task within an agent-readable design system. Don't use this skill to design the whole system, audit a library, or build the validator — use `agentic-design-systems` for those.
---

# AI Component Metadata (Producer)

This skill produces what [`agentic-design-systems`](../agentic-design-systems/SKILL.md) consumes: a per-component `.meta.ts` file conforming to the canonical `ComponentMeta` contract.

If you're starting fresh or auditing the whole system, switch to `agentic-design-systems`. Use this skill when the scope is **one component** — scaffolding it, filling its anti-patterns, declaring its variant axes, or wiring up its relationships.

---

## Producer / consumer contract

```
ai-component-metadata    →    Button.meta.ts    →    agentic-design-systems
(this skill)                  (the artifact)         (index, validator, agent runtime)
```

Both sides agree on a single schema: `ComponentMeta` in `meta.types.ts`. This skill is responsible for filling every applicable field; the consumer enforces shape via the validator in [`agentic-design-systems` → Step 9](../agentic-design-systems/SKILL.md#step-9--metadata-validator).

---

## Quick start

### One-time: install the canonical contract

Copy [`assets/meta.types.ts`](assets/meta.types.ts) to your design system root (e.g. `packages/ui-next/meta.types.ts`). Every component's `.meta.ts` imports `ComponentMeta` from this file.

### Scaffold a new component's metadata

```bash
python scripts/generate_metadata.py path/to/Button.tsx
# emits path/to/Button.meta.ts
```

The scaffolder fills what's mechanically parseable:

- `component.{name, category, type, path}` — heuristic
- `props: Record<string, PropDef>` — parsed from the TS prop interface
- `variants.axes` — parsed from cva() configs when present

Everything that requires judgment ships as `// TODO`:

- `relationships.{role, keyboardSupport, screenReader, mustBeChildOf, ...}`
- `tokens.*` — component-scoped names + state encoding
- `aiHints.{selectionCriteria, usage.{antiPatterns, commonPatterns}}`

### Or author by hand

Copy [`assets/metadata-template.ts`](assets/metadata-template.ts) — a fully-filled `Button.meta.ts` you can adapt. Recommended for the first ~10 components, before patterns are obvious enough to automate.

---

## Authoring guide — the four pillars

`agentic-design-systems` defines the [four pillars](../agentic-design-systems/SKILL.md#the-four-pillars): props, variants, relationships, tokens — plus `aiHints`. When authoring a `.meta.ts`, fill them in this order:

1. **Anti-patterns first.** Write `aiHints.usage.antiPatterns` as `{scenario, reason, alternative}` triples before touching anything else. The triple format forces precision — you can't write "don't overuse primary buttons"; you have to write *which scenario*, *why it's wrong*, *what to use instead*. The anti-patterns often reveal missing variants or relationships.
2. **Variants as a matrix.** Declare `axes` (e.g. `appearance × size`), then `purpose` (one line per `axis.value` cell), then `invalidCombinations` for cells that shouldn't ship.
3. **Relationships as machine-checkable rules.** `requires`, `mustBeChildOf`, `mustBeParentOf`, `triggers`, `blocksWhen`, `exposesState`. Accessibility (`role`, `keyboardSupport`, `screenReader`) folds in here — it's relational, not a separate pillar.
4. **Component-scoped tokens.** Every key is kebab-case of the component name (`button-primary-bg`, `button-primary-bg-hover`). States live in token names, not a separate `states` block. The component's CSS never references raw global tokens.

`aiHints.selectionCriteria` is the bridge between prose and the variant matrix: map a situation (`"destructive action"`) to a coordinate (`"appearance: 'danger'"`).

---

## What the scaffolder won't do

The Python scaffolder is honest about its limits. It will not fabricate:

- Anti-patterns — require domain knowledge of how the component gets misused
- `aiHints.selectionCriteria` — requires knowing which prose situations map to which variants
- `relationships.{mustBeChildOf, blocksWhen, requires}` — require understanding how the component fits structurally
- Token bindings — require knowing the project's token system
- `role` / `keyboardSupport` / `screenReader` — require ARIA and interaction-model judgment

These ship as `// TODO`. The validator from `agentic-design-systems` Step 9 will fail the build if they remain empty for `priority: "high"` components — that's intentional.

---

## References

- **Nested composition:** parent/child constraints, slots, context propagation — [NESTED.md](references/NESTED.md)
- **Integration patterns:** Figma MCP, agent runtime, code-gen, CI, Storybook — [INTEGRATION.md](references/INTEGRATION.md)
- **Validator + testing:** how to implement `agentic-design-systems` Step 9 in CI — [TESTING.md](references/TESTING.md)

---

## Success metric

You've authored a `.meta.ts` well when an agent, given a prose request like *"build a destructive confirmation modal"*, can:

1. Look up `Button` in `metadata/index.json` via keywords
2. Pick `appearance: "danger"` from `aiHints.selectionCriteria["destructive action"]`
3. See `relationships.mustBeChildOf: ["ModalFooter"]` and place the Button correctly
4. Avoid two `appearance: "primary"` Buttons as siblings (the `antiPatterns` triple forbids it)
5. Reference component-scoped tokens — never invent colors or spacing

If the agent can't get there from your metadata, it's incomplete. Iterate.
