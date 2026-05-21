import type { ComponentMeta } from '#/components/meta.types'

export const meta: ComponentMeta = {
  component: {
    name: 'Label',
    category: 'atoms',
    type: 'structural',
    description:
      'Form field label built on Radix Label. Associates with an Input via htmlFor; greys out when its peer input is disabled.',
    path: 'src/components/ui/label.tsx',
    figma: { nodeId: null },
  },

  props: {
    htmlFor: {
      type: 'string',
      required: false,
      description:
        'ID of the associated control. Setting this is what makes the label clickable and screen-reader-linked.',
    },
    children: {
      type: 'ReactNode',
      required: true,
      description:
        'The visible label text. Short and concrete ("Feed URL", not "Enter the URL of the feed here").',
    },
    className: {
      type: 'string',
      required: false,
      description: 'Additional Tailwind classes merged via cn().',
    },
  },

  variants: { axes: {}, purpose: {} },

  relationships: {
    requires: [],
    mustBeChildOf: [],
    mustBeParentOf: [],
    optionalSibling: ['Input'],
    commonPartners: ['Input'],
    triggers: ['click'],
    blocksWhen: [],
    exposesState: [],
    role: 'label',
    keyboardSupport:
      'Clicking the label moves focus to the associated control (native behaviour).',
    screenReader: 'Read as the accessible name of the associated control.',
  },

  tokens: {
    typography: {
      'text-sm font-medium leading-none': 'Compact, weight 500.',
    },
    color: {
      'peer-disabled:opacity-50': 'Dims when the associated input is disabled.',
    },
  },

  aiHints: {
    priority: 'low',
    keywords: ['label', 'form', 'field'],
    selectionCriteria: {
      'label for a form field': 'Label with htmlFor pointing at the field id',
    },
    usage: {
      useCases: ['Pair with Input in every form field'],
      commonPatterns: [],
      antiPatterns: [],
    },
  },
}
