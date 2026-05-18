# Nested Component Metadata

How to express parent/child constraints, slot relationships, and context propagation in the four-pillars schema.

In `ComponentMeta`, all structural relationships live under `relationships`. There's no separate `composition` pillar — slots and nested components are expressed via `mustBeChildOf` / `mustBeParentOf` / `commonPartners` / `requires`.

---

## Required vs. optional nesting

**Required (structural — validator enforces):**

```ts
// ConfirmDialog.meta.ts
relationships: {
  mustBeParentOf: ["DialogTitle", "DialogBody", "DialogFooter"],
  // ...
}

// ConfirmButton.meta.ts (a Button restricted to dialog footers)
relationships: {
  mustBeChildOf: ["DialogFooter"],
  // ...
}
```

**Optional (semantic — agent hint only):**

```ts
// Button.meta.ts
relationships: {
  commonPartners: ["Icon", "Spinner"],   // frequently used together
  optionalSibling: ["Button"],            // button-pair pattern
  // ...
}
```

The validator treats `mustBeChildOf` as a hard constraint: an agent that places `ConfirmButton` outside a `DialogFooter` is generating broken code. `commonPartners` is purely informational.

---

## Slots: parent + child in two files

The old `composition.slots` field is gone. Express slot relationships from both sides — the parent lists only **required** children in `mustBeParentOf`; optional children are expressed only from the child's side.

```ts
// Card.meta.ts
relationships: {
  mustBeParentOf: ["CardHeader", "CardBody"],   // required children
  // CardFooter is optional — not listed here. It's expressed from the
  // child side below via mustBeChildOf, which is enough for the agent
  // to know CardFooter is only valid inside Card.
}

// CardHeader.meta.ts (required child)
relationships: {
  mustBeChildOf: ["Card"],
  // CardHeader doesn't ship outside Card
}

// CardFooter.meta.ts (optional child — Card doesn't require it,
// but CardFooter only makes sense inside Card)
relationships: {
  mustBeChildOf: ["Card"],
}
```

The validator cross-checks `mustBeParentOf` against the child's `mustBeChildOf`. Note: `optionalSibling` is for siblings (e.g. a Button next to another Button), not for optional children — don't reach for it here.

---

## Context propagation: `requires` and `exposesState`

When a component depends on a provider being mounted above:

```ts
// MenuItem.meta.ts
relationships: {
  requires: ["MenuProvider"],   // throws or misbehaves without it
  mustBeChildOf: ["Menu"],
  // ...
}
```

When a parent exposes state that descendants can read:

```ts
// Form.meta.ts
relationships: {
  exposesState: ["formValues", "isSubmitting", "errors"],
  // ...
}

// FormField.meta.ts — consumes Form's state
relationships: {
  mustBeChildOf: ["Form"],
  // Reads `errors[name]` from Form.exposesState — don't pass a separate `error` prop
}
```

An agent reading both files can infer the context contract without inspecting source.

---

## Compound components

For a parent that ships with attached subcomponents (e.g. `Card.Header`, `Card.Body`):

```ts
// Card.meta.ts
component: { name: "Card", ... },
relationships: {
  mustBeParentOf: ["Card.Header", "Card.Body"],
  // ...
}

// Card.Header.meta.ts — separate file
component: { name: "Card.Header", category: "atoms", ... },
relationships: {
  mustBeChildOf: ["Card"],
  // ...
}
```

Each subcomponent gets its own `.meta.ts`. The dotted `name` keeps the index resolution clean.

---

## Common mistakes

| Mistake | Fix |
|---|---|
| Documenting child components only in `aiHints.usage.commonPatterns` | Add to `mustBeParentOf` so the validator catches misplacement |
| Listing every Button-adjacent component in `commonPartners` | Reserve it for pairs an agent should *actually* consider together |
| Using `requires` for optional providers (e.g. `ThemeProvider`) | Only use `requires` when the component is broken without the provider |
| Mismatched `mustBeChildOf` and parent's `mustBeParentOf` | They should mirror — the validator checks both sides |
