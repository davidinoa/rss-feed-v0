# Validator + Testing

The metadata is only as good as the validator that enforces it. This doc shows how to implement `agentic-design-systems` [Step 9](../../agentic-design-systems/SKILL.md#step-9--metadata-validator) in CI, plus what to test beyond shape.

---

## The validator

`scripts/validate-metadata.ts` walks every `*.meta.ts`, dynamically imports each, and asserts the rules below. Run it in CI; failing metadata fails the build.

```ts
import fg from "fast-glob";
import type { ComponentMeta } from "../meta.types";

const files = await fg("packages/ui-next/src/**/*.meta.ts");
const errors: string[] = [];

for (const file of files) {
  const mod = await import(`${process.cwd()}/${file}`);
  const meta: ComponentMeta = mod.meta;

  // 1. Every variant axis cell appears in aiHints.selectionCriteria or variants.purpose
  for (const [axis, values] of Object.entries(meta.variants.axes)) {
    for (const v of values) {
      const key = `${axis}.${v}` as const;
      const inPurpose = key in meta.variants.purpose;
      const inSelection = Object.values(meta.aiHints.selectionCriteria).some((s) =>
        s.includes(`${axis}: '${v}'`),
      );
      if (!inPurpose && !inSelection) {
        errors.push(`${file}: axis cell ${key} has no purpose or selectionCriteria`);
      }
    }
  }

  // 2. Every tokens.* key matches the project's token convention.
  // Pick ONE of these checks based on your architecture — see
  // agentic-design-systems → "Token architecture variants".

  // 2A. Component-scoped: tokens start with kebab-case of component name.
  const prefix = meta.component.name.toLowerCase();
  for (const group of Object.values(meta.tokens)) {
    for (const key of Object.keys(group ?? {})) {
      if (!key.startsWith(`${prefix}-`)) {
        errors.push(`${file}: token "${key}" must start with "${prefix}-"`);
      }
    }
  }

  // 2B. Semantic palette (shadcn / Tailwind v4): tokens must come from an
  // allowlist of approved semantic utilities. Replace SEMANTIC_TOKENS with
  // the set your project exposes; comment out 2A above when using 2B.
  //
  // const SEMANTIC_TOKENS = new Set([
  //   "bg-primary", "bg-secondary", "bg-card", "bg-muted", "bg-destructive",
  //   "text-foreground", "text-muted-foreground", "text-primary-foreground",
  //   // ... extend to match your project
  // ]);
  // for (const group of Object.values(meta.tokens)) {
  //   for (const key of Object.keys(group ?? {})) {
  //     if (!SEMANTIC_TOKENS.has(key)) {
  //       errors.push(`${file}: token "${key}" not in semantic allowlist`);
  //     }
  //   }
  // }

  // 3. antiPatterns non-empty when priority === "high"
  if (meta.aiHints.priority === "high" && meta.aiHints.usage.antiPatterns.length === 0) {
    errors.push(`${file}: priority='high' requires at least one antiPattern`);
  }

  // 4. relationships.{role, keyboardSupport, screenReader} non-empty (a11y is relational)
  for (const k of ["role", "keyboardSupport", "screenReader"] as const) {
    const value = meta.relationships[k];
    if (!value || value === "TODO") {
      errors.push(`${file}: relationships.${k} must be filled`);
    }
  }

  // 5. invalidCombinations references only declared axis values
  for (const ic of meta.variants.invalidCombinations ?? []) {
    for (const [axis, value] of Object.entries(ic.axes)) {
      if (!meta.variants.axes[axis]?.includes(value)) {
        errors.push(`${file}: invalidCombinations references undeclared ${axis}.${value}`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
```

The rule set is owned by `agentic-design-systems`; this skill produces metadata that satisfies it.

---

## Are `commonPatterns` runnable?

`aiHints.usage.commonPatterns[].composition` is a string. To detect drift (e.g. you rename a prop on the component but forget the metadata), snapshot each pattern:

```ts
import { render } from "@testing-library/react";
import { meta as buttonMeta } from "./Button.meta";

describe(`${buttonMeta.component.name} commonPatterns`, () => {
  for (const pattern of buttonMeta.aiHints.usage.commonPatterns) {
    it(`renders pattern: ${pattern.name}`, () => {
      // Render the same JSX described by `pattern.composition`
      // and assert it mounts without throwing.
    });
  }
});
```

---

## Anti-pattern detection

Anti-patterns are documentation, but they can also be actionable. Two strategies, often combined:

**A — assert at code review.** A CI step greps generated code for the forbidden shape (e.g. sibling `appearance="primary"` Buttons) and fails the build. Mechanical and precise.

**B — feed them to the agent.** The agent reads `aiHints.usage.antiPatterns` and self-checks before emitting code. Relies on agent compliance; pair with A for safety.

---

## A11y testing

`relationships.{role, keyboardSupport, screenReader}` should match runtime behavior. Cross-check with `@testing-library`:

```ts
it("renders with the role declared in metadata", () => {
  const { getByRole } = render(<Button>Click</Button>);
  expect(getByRole(buttonMeta.relationships.role)).toBeInTheDocument();
});
```

Verify keyboard claims with `user-event`, and screen-reader claims with `aria-*` snapshots.

---

## What you don't need to test

- **States as separate cases.** States are encoded in tokens (`--button-primary-bg-hover`), not in metadata. Visual-regression coverage of token swaps suffices.
- **Responsive behavior.** Not in `ComponentMeta` — handled by CSS/tokens.
- **WCAG level.** Not a metadata field. Run `axe-core` against rendered output instead.
