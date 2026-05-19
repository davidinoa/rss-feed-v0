import type { ComponentMeta } from '#/components/meta.types'

export const meta: ComponentMeta = {
  component: {
    name: 'Input',
    category: 'atoms',
    type: 'interactive',
    description:
      'Single-line text input. Forwards native input props; styled to match the design system focus ring and aria-invalid feedback.',
    path: 'src/components/ui/input.tsx',
    figma: { nodeId: null },
  },

  props: {
    type: {
      type: 'HTMLInputElement["type"]',
      required: false,
      default: "'text'",
      description:
        'Native input type. Drives keyboard, validation, and platform UI (url, email, password, search, …).',
    },
    value: {
      type: 'string',
      required: false,
      description: 'Controlled value. Pair with onChange.',
    },
    onChange: {
      type: '(e: ChangeEvent<HTMLInputElement>) => void',
      required: false,
      description: 'Native change handler.',
    },
    placeholder: {
      type: 'string',
      required: false,
      description: 'Hint text shown when empty. Not a substitute for a Label.',
    },
    disabled: {
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Suppresses input; renders with reduced opacity.',
    },
    'aria-invalid': {
      type: 'boolean',
      required: false,
      description:
        'When true, swaps border + ring to the destructive token for error states.',
    },
    'aria-describedby': {
      type: 'string',
      required: false,
      description:
        'ID of an associated error or helper message. Always set when aria-invalid is true.',
    },
    className: {
      type: 'string',
      required: false,
      description: 'Additional Tailwind classes merged via cn().',
    },
  },

  variants: {
    axes: {},
    purpose: {},
  },

  relationships: {
    requires: [],
    mustBeChildOf: [],
    mustBeParentOf: [],
    optionalSibling: ['Label'],
    commonPartners: ['Label', 'Button'],
    triggers: ['change', 'blur', 'focus'],
    blocksWhen: [
      {
        when: 'disabled',
        effect: 'Suppresses input; reduces opacity to 50%.',
      },
    ],
    exposesState: ['value', 'focus', 'aria-invalid'],
    role: 'textbox',
    keyboardSupport: 'Native HTMLInputElement semantics.',
    screenReader:
      'Announces label (via associated Label or aria-label), value, and error message (via aria-describedby + aria-invalid).',
  },

  tokens: {
    color: {
      'border-input': 'Default hairline border.',
      'focus-visible:border-ring': 'Border swap on focus.',
      'focus-visible:ring-ring/50': 'Focus ring color.',
      'aria-invalid:border-destructive': 'Error-state border.',
      'aria-invalid:ring-destructive/20': 'Error-state focus ring.',
      'placeholder:text-muted-foreground': 'Placeholder text.',
      'selection:bg-primary selection:text-primary-foreground':
        'Text-selection colors.',
    },
    typography: {
      'text-base md:text-sm':
        'Base text — larger on mobile to avoid iOS zoom, compact on md+.',
    },
    border: {
      'rounded-md': '8px radius — consistent with Button.',
    },
  },

  aiHints: {
    priority: 'medium',
    keywords: ['input', 'text', 'field', 'form', 'url', 'email', 'search'],
    selectionCriteria: {
      'single-line text input': 'Input',
      'URL / email / password / search input':
        "Input with the matching type='…'",
      'multi-line input': 'Use Textarea instead (separate primitive).',
    },
    usage: {
      useCases: [
        'URL field in the Subscription add form',
        'Custom-title field in the Subscription edit form',
        'Search box in the Subscription list (future)',
      ],
      commonPatterns: [
        {
          name: 'labelled URL field with error',
          composition:
            '<><Label htmlFor="url">Feed URL</Label><Input id="url" type="url" aria-invalid={hasError} aria-describedby={hasError ? "url-error" : undefined} /></>',
        },
      ],
      antiPatterns: [],
    },
  },
}
