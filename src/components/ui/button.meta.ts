import type { ComponentMeta } from '#/components/meta.types'

export const meta: ComponentMeta = {
  component: {
    name: 'Button',
    category: 'atoms',
    type: 'interactive',
    description:
      'Action trigger; carries variant-driven emphasis from primary CTA down to inline link.',
    path: 'src/components/ui/button.tsx',
    figma: { nodeId: null },
  },

  props: {
    variant: {
      type: '"default" | "secondary" | "ghost" | "destructive" | "outline" | "link"',
      required: false,
      default: "'default'",
      description:
        'Visual variant — drives bg/fg/border colors and hover behavior.',
    },
    size: {
      type: '"default" | "xs" | "lg" | "icon"',
      required: false,
      default: "'default'",
      description:
        "Visual size — height + padding. Use 'icon' for icon-only buttons (36px square).",
    },
    asChild: {
      type: 'boolean',
      required: false,
      default: 'false',
      description:
        'When true, renders children as the root via Radix Slot (e.g. wrap a Link with button styling).',
    },
    disabled: {
      type: 'boolean',
      required: false,
      default: 'false',
      description:
        'Inherited from HTMLButtonElement. Suppresses click; reduces opacity to 50%.',
    },
    onClick: {
      type: '(e: MouseEvent<HTMLButtonElement>) => void',
      required: false,
      description: 'Inherited click handler. Suppressed when disabled.',
    },
    children: {
      type: 'ReactNode',
      required: false,
      description:
        "Visible label, icon, or both. For size='icon', children must be a single icon component.",
    },
    type: {
      type: '"button" | "submit" | "reset"',
      required: false,
      default: "'button'",
      description: "Native button type. Pass 'submit' for form submit buttons.",
    },
    className: {
      type: 'string',
      required: false,
      description:
        'Additional Tailwind classes merged via cn(). Prefer variant/size over ad-hoc classes.',
    },
  },

  variants: {
    axes: {
      variant: [
        'default',
        'secondary',
        'ghost',
        'destructive',
        'outline',
        'link',
      ] as const,
      size: ['default', 'xs', 'lg', 'icon'] as const,
    },
    purpose: {
      'variant.default':
        'Primary CTA — Burnt Amber bg. Per DESIGN.md §4, used sparingly: rarely more than one per screen.',
      'variant.secondary':
        'Non-critical actions paired with a primary (Cancel, Edit, dismiss).',
      'variant.ghost':
        'Low-emphasis — toolbar icons, inline controls, contexts where chrome would distract.',
      'variant.destructive':
        'Confirmed destructive actions (Delete, Unsubscribe). Always sits behind a confirmation modal.',
      'variant.outline':
        'Medium-emphasis on busy surfaces. Transparent bg blends with the container (sits over bg-card without parchment-on-vellum).',
      'variant.link':
        'Inline text-like action with underline-on-hover (Read more, See details).',
      'size.default': 'Standard 40px — most actions.',
      'size.xs': 'Compact 32px — toolbars, dense layouts.',
      'size.lg': '48px — marketing-page primaries, hero CTAs.',
      'size.icon':
        '36px square — icon-only buttons (theme toggle, mark-as-read, share). Requires aria-label.',
    },
    invalidCombinations: [
      {
        axes: { variant: 'link', size: 'icon' },
        reason:
          'Link variant has no padding or background; rendering as an icon-only square removes both the label and the visual affordance.',
      },
      {
        axes: { variant: 'link', size: 'lg' },
        reason:
          'Link variant is sized by text; the lg height adds vertical space with nothing to fill, breaking visual rhythm.',
      },
    ],
  },

  relationships: {
    requires: [],
    mustBeChildOf: [],
    mustBeParentOf: [],
    optionalSibling: [],
    commonPartners: ['Icon'],
    triggers: ['click'],
    blocksWhen: [
      {
        when: 'disabled',
        effect:
          'Suppresses onClick via native button[disabled]; reduces opacity to 50%; sets pointer-events: none.',
      },
      {
        when: "size === 'icon' && !aria-label && !aria-labelledby",
        effect:
          "Screen-reader inaccessible — axe-core fails the story (per `a11y.test: 'error'` in .storybook/preview.tsx).",
      },
    ],
    exposesState: [],
    role: 'button',
    keyboardSupport:
      'Space and Enter activate. Tab moves focus. Native <button> semantics — no custom key handling.',
    screenReader:
      'Announces label (children text, or aria-label for icon-only). Disabled state announced via native button[disabled].',
  },

  tokens: {
    // Semantic-palette pattern per docs/design-system.md "Component metadata for AI agents"
    // and ADR-0003. Keys are the semantic Tailwind utilities the component consumes;
    // values describe purpose. Resolution lives in styles.css (:root + .dark blocks).
    color: {
      'bg-primary': 'Primary CTA background (Burnt Amber).',
      'text-primary-foreground': 'Primary CTA label (Warm Parchment).',
      'bg-secondary': 'Secondary background (Soft Vellum).',
      'text-secondary-foreground': 'Secondary label (Pebble).',
      'bg-accent': 'Ghost/outline hover background (Amber Hush).',
      'text-accent-foreground': 'Outline hover label.',
      'bg-destructive': 'Destructive background (Brick Alert).',
      'text-destructive-foreground': 'Destructive label (Warm Parchment).',
      'text-primary': 'Link variant text color (Burnt Amber).',
      'border-input': 'Outline variant hairline border.',
      'ring-ring': 'Focus ring color (2px Burnt Amber).',
      'ring-offset-background':
        'Focus ring offset against the page background.',
      'ring-destructive': 'Destructive variant focus ring.',
      'border-destructive': 'aria-invalid border state.',
    },
    typography: {
      'text-title-s': 'Button label — 1rem, weight 500, line-height 1.5.',
    },
    border: {
      'rounded-md': '8px radius — approachable but not playful.',
    },
    motion: {
      'transition-colors duration-200 ease-out':
        'Background color transitions on hover (no scale, no lift, per DESIGN.md §4).',
    },
  },

  aiHints: {
    priority: 'high',
    keywords: [
      'click',
      'tap',
      'submit',
      'confirm',
      'cancel',
      'delete',
      'cta',
      'action',
      'button',
      'trigger',
    ],
    selectionCriteria: {
      'primary CTA / main action': "variant: 'default'",
      'secondary action paired with primary (cancel, dismiss)':
        "variant: 'secondary'",
      'destructive action (delete, unsubscribe)': "variant: 'destructive'",
      'low-emphasis toolbar or inline control': "variant: 'ghost'",
      'medium-emphasis on a busy card surface': "variant: 'outline'",
      'inline link-styled action (read more, see details)': "variant: 'link'",
      'icon-only action (theme toggle, mark-as-read)':
        "variant: 'ghost', size: 'icon'",
      'compact toolbar action': "size: 'xs'",
      'marketing-page hero CTA': "size: 'lg'",
    },
    usage: {
      useCases: [
        'Form submission',
        'Primary CTAs (Add Feed, Save Settings, Mark All Read)',
        'Destructive confirmations (behind a modal)',
        'Toolbar icon controls (theme toggle, mark-as-read, share)',
        'Inline cancel/dismiss actions',
        'Link-styled inline actions (Read more, See details)',
      ],
      commonPatterns: [
        {
          name: 'submit-cancel pair',
          composition:
            '<div className="flex gap-2"><Button>Save</Button><Button variant="secondary">Cancel</Button></div>',
        },
        {
          name: 'destructive confirmation in a dialog footer',
          composition:
            '<DialogFooter><Button variant="secondary">Cancel</Button><Button variant="destructive">Delete feed</Button></DialogFooter>',
        },
        {
          name: 'icon-only toolbar action',
          composition:
            '<Button variant="ghost" size="icon" aria-label="Mark as read"><Check /></Button>',
        },
      ],
      antiPatterns: [
        {
          scenario:
            "Two variant='default' Buttons as siblings competing for attention.",
          reason:
            'Per DESIGN.md §4, a screen rarely has more than one primary CTA. Competing primaries leave the user unsure which action is canonical.',
          alternative:
            "Keep one as 'default'; demote the other to 'secondary' or 'ghost'.",
        },
        {
          scenario:
            "variant='destructive' Button performing the destructive action immediately on click.",
          reason:
            'Per DESIGN.md §4, destructive actions are reserved for confirmed flows — never one-click.',
          alternative:
            "Wrap the destructive Button in a confirmation Dialog (or AlertDialog). The outer Button opens the modal; the modal's confirm Button performs the action.",
        },
        {
          scenario: "size='icon' Button without aria-label or aria-labelledby.",
          reason:
            "Icon-only buttons have no visible label; screen readers fall back to nothing. axe-core (run on every story per `a11y.test: 'error'`) fails the build.",
          alternative:
            'Always pass aria-label. Optionally pass title for a hover tooltip.',
        },
        {
          scenario:
            'Using a Button for navigation between pages or external links.',
          reason:
            'Buttons trigger actions; navigation belongs to anchors/Links. Using a button breaks SEO, browser history, and middle-click/cmd-click semantics.',
          alternative:
            "Use the TanStack Router Link (or an anchor). If you need button styling, render the Link via the Button's asChild prop, or apply variant='link'.",
        },
      ],
    },
  },
}
