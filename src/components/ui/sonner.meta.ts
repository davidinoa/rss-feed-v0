import type { ComponentMeta } from '#/components/meta.types'

export const meta: ComponentMeta = {
  component: {
    name: 'Toaster',
    category: 'feedback',
    type: 'structural',
    description:
      'App-level toast outlet powered by Sonner. Mount once near the root; trigger toasts from anywhere with the `toast` function from "sonner". Tracks the resolved theme via the project theme system.',
    path: 'src/components/ui/sonner.tsx',
    figma: { nodeId: null },
  },

  props: {
    position: {
      type: '"top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"',
      required: false,
      default: "'bottom-right'",
      description: 'Where the stack of toasts is anchored.',
    },
    richColors: {
      type: 'boolean',
      required: false,
      default: 'false',
      description:
        'Tint the toast surface by variant (success/info/warning/error). Off by default to match the Quiet Reading Room aesthetic.',
    },
  },

  variants: { axes: {}, purpose: {} },

  relationships: {
    requires: [],
    mustBeChildOf: ['__root.tsx (app root)'],
    mustBeParentOf: [],
    optionalSibling: [],
    commonPartners: [],
    triggers: [],
    blocksWhen: [],
    exposesState: [],
    role: 'status / alert (per-toast)',
    keyboardSupport:
      'Sonner provides Tab focus into the toast region; dismiss with Esc when focused.',
    screenReader:
      "Each toast announces via aria-live='polite' (success/info) or 'assertive' (error).",
  },

  tokens: {
    color: {
      '--normal-bg': 'Toast surface (var(--popover)).',
      '--normal-text': 'Toast label (var(--popover-foreground)).',
      '--normal-border': 'Toast hairline (var(--border)).',
    },
    border: {
      '--border-radius': '8px — matches Card and Button.',
    },
  },

  aiHints: {
    priority: 'medium',
    keywords: ['toast', 'notification', 'snackbar', 'feedback', 'sonner'],
    selectionCriteria: {
      'transient success or error feedback after a mutation':
        'Call toast.success() / toast.error() — no extra component needed',
      'persistent feedback that must be acknowledged': 'Use a Dialog instead',
    },
    usage: {
      useCases: [
        'Subscribed / Updated / Removed confirmations',
        'Background error reporting that does not block the page',
      ],
      commonPatterns: [
        {
          name: 'mount once near root',
          composition: '<>{children}<Toaster /></>',
        },
        {
          name: 'success toast from a mutation',
          composition: "toast.success('Subscribed')",
        },
      ],
      antiPatterns: [],
    },
  },
}
