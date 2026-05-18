import type { ComponentMeta } from "../../meta.types";
// ^ Adjust path to wherever you placed `meta.types.ts` in your project.
//   See agentic-design-systems → "The schema (canonical contract)".

/**
 * Worked example: Button.meta.ts.
 *
 * Replace every Button-specific value with your component's.
 * Empty arrays are fine; missing keys are not (the validator will catch them).
 *
 * Producer/consumer contract:
 *   ai-component-metadata  →  Button.meta.ts  →  agentic-design-systems
 *   (this skill)              (the artifact)     (index, validator, agent runtime)
 */
export const meta: ComponentMeta = {
  component: {
    name: "Button",
    category: "atoms",
    type: "interactive",
    description: "Primary tap target for actions; carries variant-driven emphasis.",
    path: "src/components/Button/Button.tsx",
    figma: { nodeId: null },
  },

  props: {
    children: {
      type: "ReactNode",
      required: false,
      description: "Visible label or content.",
    },
    onClick: {
      type: "(e: MouseEvent) => void",
      required: false,
      description: "Fired on activation (click, Space, Enter).",
    },
    disabled: {
      type: "boolean",
      required: false,
      default: "false",
      description: "Blocks interaction; suppresses onClick.",
    },
    loading: {
      type: "boolean",
      required: false,
      default: "false",
      description: "Shows a spinner; behaves as disabled.",
    },
  },

  variants: {
    axes: {
      appearance: ["primary", "secondary", "ghost", "outline", "danger"] as const,
      size: ["sm", "md", "lg"] as const,
    },
    purpose: {
      "appearance.primary": "Highest-emphasis action on a screen.",
      "appearance.secondary": "Supporting action paired with a primary.",
      "appearance.ghost": "Low-emphasis action; chrome would distract.",
      "appearance.outline": "Medium-emphasis action on a busy surface.",
      "appearance.danger": "Destructive action (delete, leave, revoke).",
      "size.sm": "Dense layouts — tables, toolbars.",
      "size.md": "Default sizing for most surfaces.",
      "size.lg": "Hero CTAs, marketing surfaces.",
    },
    invalidCombinations: [
      {
        axes: { appearance: "ghost", size: "sm" },
        reason: "Tap target falls below 44px guideline.",
      },
    ],
  },

  relationships: {
    requires: [], // e.g. ["ThemeProvider"] if the component breaks without it
    mustBeChildOf: [], // e.g. ["ModalFooter"] for a variant restricted to dialogs
    mustBeParentOf: [],
    optionalSibling: [],
    commonPartners: ["Icon", "Spinner"],
    triggers: ["click"],
    blocksWhen: [
      { when: "disabled || loading", effect: "Suppress onClick; set aria-disabled='true'." },
    ],
    exposesState: [],
    role: "button",
    keyboardSupport: "Space and Enter activate. Tab moves focus.",
    screenReader: "Announces label and disabled/loading state.",
  },

  tokens: {
    color: {
      "button-primary-bg": "var(--color-brand-600)",
      "button-primary-bg-hover": "var(--color-brand-700)",
      "button-primary-bg-disabled": "var(--color-neutral-300)",
      "button-primary-fg": "var(--color-neutral-0)",
    },
    spacing: {
      "button-padding-x": "var(--space-3)",
      "button-padding-y": "var(--space-2)",
    },
    typography: {
      "button-font": "var(--font-sans)",
      "button-weight": "var(--weight-medium)",
    },
    border: {
      "button-radius": "var(--radius-md)",
    },
    motion: {
      "button-transition": "background-color 120ms ease-out",
    },
  },

  aiHints: {
    priority: "high",
    keywords: ["click", "tap", "submit", "confirm", "cta", "action"],
    selectionCriteria: {
      "destructive action": "appearance: 'danger'",
      "primary CTA": "appearance: 'primary'",
      "secondary action on a card": "appearance: 'outline'",
      "tertiary or toolbar action": "appearance: 'ghost'",
    },
    usage: {
      useCases: ["form submission", "primary CTAs", "destructive confirmations"],
      commonPatterns: [
        {
          name: "submit-cancel pair",
          composition:
            '<Stack direction="row" gap="2"><Button appearance="primary">Submit</Button><Button appearance="ghost">Cancel</Button></Stack>',
        },
      ],
      antiPatterns: [
        {
          scenario: "Two appearance='primary' Buttons as siblings.",
          reason:
            "Competing primary CTAs leave the user unsure which action is canonical.",
          alternative:
            "Keep one as 'primary'; demote the other to 'outline' or 'ghost'.",
        },
        {
          scenario: "Using a Button for navigation between pages.",
          reason:
            "Buttons trigger actions; navigation should be a Link for SEO, history, and middle-click semantics.",
          alternative: "Use Link with appearance='button' if you need button styling.",
        },
      ],
    },
  },
};
