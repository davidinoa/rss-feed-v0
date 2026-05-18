#!/usr/bin/env python3
"""
Component metadata scaffolder.

Produces a partial `.meta.ts` file conforming to the canonical `ComponentMeta`
contract defined by the `agentic-design-systems` skill. Auto-fills what is
mechanically parseable (component identity, props, best-effort variant axes);
leaves human-judgment fields (relationships, tokens, anti-patterns, selection
criteria) as `// TODO` placeholders.

Usage:
    python generate_metadata.py path/to/Button.tsx [--meta-types ../meta.types]

Output:
    path/to/Button.meta.ts
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

CATEGORY_HINTS: dict[str, tuple[str, ...]] = {
    "organisms": ("Header", "Footer", "Form", "Table", "Navbar", "Sidebar",
                  "Modal", "Dialog", "Layout", "Page"),
    "molecules": ("Card", "Chip", "FormField", "ListItem", "Toast", "MenuItem",
                  "Dropdown", "Tooltip", "Avatar"),
}


def guess_category(name: str) -> str:
    for category, hits in CATEGORY_HINTS.items():
        if any(h in name for h in hits):
            return category
    return "atoms"


def guess_type(content: str, name: str) -> str:
    if re.search(r"\b(onChange|onInput|onBlur)\b|\bvalue\s*:", content):
        return "input"
    if re.search(r"\b(onClick|onPress|onActivate)\b", content):
        return "interactive"
    if re.search(r"\b(href|to)\s*:|\bLink\b", content) and "nav" in name.lower():
        return "navigation"
    if re.search(r"\bchildren\s*:", content):
        return "container"
    return "display"


PROP_LINE = re.compile(
    r"^\s*(?P<name>\w+)(?P<opt>\?)?\s*:\s*(?P<type>[^;]+?)\s*;?\s*(?://\s*(?P<comment>.+))?$"
)


def parse_props(content: str) -> dict[str, dict]:
    """Extract props from `type FooProps = { ... }` or `interface FooProps { ... }`."""
    match = re.search(r"(?:type|interface)\s+\w*Props\s*=?\s*\{([^}]+)\}", content, re.DOTALL)
    if not match:
        return {}

    props: dict[str, dict] = {}
    for line in match.group(1).splitlines():
        line = line.strip()
        if not line or line.startswith("//"):
            continue
        pm = PROP_LINE.match(line)
        if not pm:
            continue
        props[pm.group("name")] = {
            "type": pm.group("type").strip().rstrip(","),
            "required": pm.group("opt") != "?",
            "description": (pm.group("comment") or "TODO: describe").strip(),
        }
    return props


def parse_variant_axes(content: str) -> dict[str, list[str]]:
    """Best-effort axis extraction from cva() configs."""
    axes: dict[str, list[str]] = {}
    cva = re.search(
        r"variants\s*:\s*\{(.+?)\}\s*,\s*(?:defaultVariants|compoundVariants|\}\s*\))",
        content,
        re.DOTALL,
    )
    if not cva:
        return axes
    for axis_match in re.finditer(r"(\w+)\s*:\s*\{([^}]+)\}", cva.group(1)):
        axis_name = axis_match.group(1)
        values = re.findall(r"(\w+)\s*:", axis_match.group(2))
        if values:
            axes[axis_name] = values
    return axes


def emit_meta(
    name: str,
    category: str,
    comp_type: str,
    rel_path: str,
    props: dict[str, dict],
    axes: dict[str, list[str]],
    meta_types_import: str,
) -> str:
    prefix = name.lower()

    if props:
        prop_lines = "\n".join(
            f'    {k}: {{ type: "{v["type"]}", required: {str(v["required"]).lower()}, '
            f'description: "{v["description"]}" }},'
            for k, v in props.items()
        )
    else:
        prop_lines = "    // TODO: populate props from the component's TS interface"

    if axes:
        axis_chunks: list[str] = []
        for axis, values in axes.items():
            quoted = ", ".join(f'"{v}"' for v in values)
            axis_chunks.append(f"      {axis}: [{quoted}] as const,")
        axis_lines = "\n".join(axis_chunks)

        purpose_chunks: list[str] = []
        for axis, values in axes.items():
            for v in values:
                purpose_chunks.append(f'      "{axis}.{v}": "TODO: when to use",')
        purpose_lines = "\n".join(purpose_chunks)
    else:
        axis_lines = "      // TODO: declare variant axes (e.g. appearance × size × density)"
        purpose_lines = "      // TODO: explain when to pick each axis value"

    return f'''import type {{ ComponentMeta }} from "{meta_types_import}";

export const meta: ComponentMeta = {{
  component: {{
    name: "{name}",
    category: "{category}",
    type: "{comp_type}",
    description: "TODO: one-line description.",
    path: "{rel_path}",
    figma: {{ nodeId: null }},
  }},

  props: {{
{prop_lines}
  }},

  variants: {{
    axes: {{
{axis_lines}
    }},
    purpose: {{
{purpose_lines}
    }},
    // invalidCombinations: [],
  }},

  relationships: {{
    requires: [],
    mustBeChildOf: [],
    mustBeParentOf: [],
    optionalSibling: [],
    commonPartners: [],
    triggers: [],            // TODO: emitted events, e.g. ["click"]
    blocksWhen: [],          // TODO: {{ when, effect }} for prop-state-blocked behavior
    exposesState: [],
    role: "TODO",            // ARIA role
    keyboardSupport: "TODO", // e.g. "Space/Enter activate; Tab moves focus."
    screenReader: "TODO",    // what is announced
  }},

  tokens: {{
    // Two valid patterns (pick whichever matches your project — see
    // agentic-design-systems → Token architecture variants):
    //   1. Component-scoped: keys start with "{prefix}-"; states in the name
    //      (e.g. "{prefix}-primary-bg-hover"). Default for greenfield.
    //   2. Semantic palette: keys are the semantic utilities the component
    //      consumes (e.g. "bg-primary"); state lives in interaction modifiers
    //      ("hover:bg-primary/90"). Default for shadcn / Tailwind v4.
    color: {{}},
    spacing: {{}},
    typography: {{}},
    border: {{}},
    motion: {{}},
  }},

  aiHints: {{
    priority: "medium",      // high | medium | low
    keywords: ["{prefix}"],
    selectionCriteria: {{
      // TODO: "situation": "axis: 'value'"
    }},
    usage: {{
      useCases: [],          // TODO
      commonPatterns: [],    // TODO: {{ name, composition }}
      antiPatterns: [],      // TODO: required for priority='high' — {{ scenario, reason, alternative }}
    }},
  }},
}};
'''


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("source", type=Path, help="Path to the component .tsx file")
    ap.add_argument(
        "--meta-types",
        default="../../meta.types",
        help="Import specifier for the canonical types file (default: ../../meta.types)",
    )
    args = ap.parse_args()

    src: Path = args.source
    if not src.is_file():
        print(f"Error: {src} not found", file=sys.stderr)
        sys.exit(1)

    content = src.read_text()

    name_match = re.search(
        r"export\s+(?:const|function|default\s+function)\s+(\w+)", content
    )
    if not name_match:
        print(f"Error: could not find an exported component in {src}", file=sys.stderr)
        sys.exit(1)

    name = name_match.group(1)
    category = guess_category(name)
    comp_type = guess_type(content, name)
    props = parse_props(content)
    axes = parse_variant_axes(content)

    try:
        rel_path = src.resolve().relative_to(Path.cwd()).as_posix()
    except ValueError:
        rel_path = src.as_posix()

    out_path = src.with_name(f"{src.stem}.meta.ts")
    out_path.write_text(
        emit_meta(name, category, comp_type, rel_path, props, axes, args.meta_types)
    )

    print(f"Scaffolded: {out_path}")
    print(f"  name={name}  category={category}  type={comp_type}")
    print(f"  props parsed: {len(props)}")
    print(f"  variant axes parsed: {len(axes)} ({', '.join(axes) if axes else '—'})")
    print()
    print("Next steps:")
    print("  1. Fill // TODO fields — especially relationships, tokens, antiPatterns.")
    print("  2. Run the validator (see agentic-design-systems Step 9).")


if __name__ == "__main__":
    main()
