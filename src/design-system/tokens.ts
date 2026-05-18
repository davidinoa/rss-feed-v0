export type PrimitiveColorToken = {
  name: string
  category: 'neutral-light' | 'neutral-dark' | 'amber' | 'functional'
}

export type SemanticColorToken = {
  name: string
  primitiveLight: string
  primitiveDark: string
  utilities: readonly string[]
  usage: string
}

export type RadiusToken = {
  name: string
  utility: string
}

export type SpacingToken = {
  name: string
  sizeLabel: string
  utilityHint: string
  description: string
}

export type DepthToken = {
  name: string
  utility: string
  description: string
}

export type TypographyToken = {
  name: string
  utility: string
  family: 'serif' | 'sans' | 'mono'
  sizeLabel: string
  fontWeight: number
  lineHeight: number
  letterSpacing: string
  description: string
  sample: string
}

export const PRIMITIVE_COLOR_TOKENS = [
  // Warm light neutrals — parchment scale, used by light-mode semantics.
  { name: 'warm-parchment', category: 'neutral-light' },
  { name: 'soft-vellum', category: 'neutral-light' },
  { name: 'antique-linen', category: 'neutral-light' },
  { name: 'aged-paper', category: 'neutral-light' },
  { name: 'muted-stone', category: 'neutral-light' },
  { name: 'pebble', category: 'neutral-light' },
  { name: 'ink-espresso', category: 'neutral-light' },

  // Deep warm dark neutrals — midnight scale, used by dark-mode semantics.
  { name: 'midnight-slate', category: 'neutral-dark' },
  { name: 'charcoal-mist', category: 'neutral-dark' },
  { name: 'smoke-veil', category: 'neutral-dark' },
  { name: 'dusk-mauve', category: 'neutral-dark' },
  { name: 'ash-stone', category: 'neutral-dark' },
  { name: 'bone', category: 'neutral-dark' },
  { name: 'cream-mist', category: 'neutral-dark' },

  // Amber accent — the single signal hue.
  { name: 'burnt-amber', category: 'amber' },
  { name: 'amber-glow', category: 'amber' },
  { name: 'amber-hush', category: 'amber' },
  { name: 'amber-deep', category: 'amber' },

  // Functional feedback — system signals.
  { name: 'sage-read', category: 'functional' },
  { name: 'brick-alert', category: 'functional' },
  { name: 'honey-caution', category: 'functional' },
] as const satisfies readonly PrimitiveColorToken[]

export const SEMANTIC_COLOR_TOKENS = [
  {
    name: 'background',
    primitiveLight: 'warm-parchment',
    primitiveDark: 'midnight-slate',
    utilities: ['bg-background'],
    usage: 'Page-level surface. The default body background.',
  },
  {
    name: 'foreground',
    primitiveLight: 'ink-espresso',
    primitiveDark: 'cream-mist',
    utilities: ['text-foreground'],
    usage: 'Default body text color, paired with bg-background.',
  },
  {
    name: 'card',
    primitiveLight: 'soft-vellum',
    primitiveDark: 'charcoal-mist',
    utilities: ['bg-card'],
    usage: 'Surface for grouped content (cards, panels).',
  },
  {
    name: 'card-foreground',
    primitiveLight: 'ink-espresso',
    primitiveDark: 'cream-mist',
    utilities: ['text-card-foreground'],
    usage: 'Text on bg-card.',
  },
  {
    name: 'popover',
    primitiveLight: 'soft-vellum',
    primitiveDark: 'charcoal-mist',
    utilities: ['bg-popover'],
    usage: 'Surface for floating content (popovers, menus, tooltips).',
  },
  {
    name: 'popover-foreground',
    primitiveLight: 'ink-espresso',
    primitiveDark: 'cream-mist',
    utilities: ['text-popover-foreground'],
    usage: 'Text on bg-popover.',
  },
  {
    name: 'primary',
    primitiveLight: 'burnt-amber',
    primitiveDark: 'amber-glow',
    utilities: ['bg-primary', 'text-primary'],
    usage:
      'Primary actions, CTAs, brand emphasis. Dark mode remaps to amber-glow (not burnt-amber) to maintain WCAG AA; see ADR-0004.',
  },
  {
    name: 'primary-foreground',
    primitiveLight: 'warm-parchment',
    primitiveDark: 'midnight-slate',
    utilities: ['text-primary-foreground'],
    usage: 'Text on bg-primary.',
  },
  {
    name: 'secondary',
    primitiveLight: 'soft-vellum',
    primitiveDark: 'charcoal-mist',
    utilities: ['bg-secondary'],
    usage:
      'Secondary surfaces (subdued backgrounds, secondary button background).',
  },
  {
    name: 'secondary-foreground',
    primitiveLight: 'pebble',
    primitiveDark: 'bone',
    utilities: ['text-secondary-foreground'],
    usage: 'Text on bg-secondary.',
  },
  {
    name: 'muted',
    primitiveLight: 'antique-linen',
    primitiveDark: 'smoke-veil',
    utilities: ['bg-muted'],
    usage: 'Muted surfaces (disabled fields, low-emphasis panels).',
  },
  {
    name: 'muted-foreground',
    primitiveLight: 'muted-stone',
    primitiveDark: 'ash-stone',
    utilities: ['text-muted-foreground'],
    usage: 'Low-emphasis text (captions, helper text, metadata).',
  },
  {
    name: 'accent',
    primitiveLight: 'amber-hush',
    primitiveDark: 'dusk-mauve',
    utilities: ['bg-accent', 'hover:bg-accent'],
    usage:
      'Soft highlight surface for hovered or selected rows. Currently identical to accent-subtle; semantically distinct so they can diverge later.',
  },
  {
    name: 'accent-foreground',
    primitiveLight: 'amber-deep',
    primitiveDark: 'cream-mist',
    utilities: ['text-accent-foreground'],
    usage: 'Text on bg-accent.',
  },
  {
    name: 'destructive',
    primitiveLight: 'brick-alert',
    primitiveDark: 'brick-alert',
    utilities: ['bg-destructive', 'text-destructive'],
    usage: 'Destructive actions (delete, remove), error indicators.',
  },
  {
    name: 'destructive-foreground',
    primitiveLight: 'warm-parchment',
    primitiveDark: 'warm-parchment',
    utilities: ['text-destructive-foreground'],
    usage:
      'Text on bg-destructive. Stays warm-parchment in dark mode (not cream-mist) for consistent WCAG AA across feedback surfaces.',
  },
  {
    name: 'border',
    primitiveLight: 'antique-linen',
    primitiveDark: 'smoke-veil',
    utilities: ['border-border', 'border'],
    usage: 'Default border for surfaces and dividers (hairline weight).',
  },
  {
    name: 'input',
    primitiveLight: 'antique-linen',
    primitiveDark: 'smoke-veil',
    utilities: ['border-input'],
    usage: 'Border for form inputs and interactive fields.',
  },
  {
    name: 'ring',
    primitiveLight: 'burnt-amber',
    primitiveDark: 'amber-glow',
    utilities: ['focus-visible:ring-ring'],
    usage:
      'Focus-visible ring for keyboard navigation. Intentionally identical to --primary so the eye trains on one color for "wants your attention".',
  },
  {
    name: 'success',
    primitiveLight: 'sage-read',
    primitiveDark: 'sage-read',
    utilities: ['bg-success', 'text-success'],
    usage: 'Feed-health indicator, "fetched OK" confirmations.',
  },
  {
    name: 'success-foreground',
    primitiveLight: 'warm-parchment',
    primitiveDark: 'warm-parchment',
    utilities: ['text-success-foreground'],
    usage:
      'Text on bg-success. Stays warm-parchment in dark mode for consistent WCAG AA across feedback surfaces.',
  },
  {
    name: 'warning',
    primitiveLight: 'honey-caution',
    primitiveDark: 'honey-caution',
    utilities: ['bg-warning', 'text-warning'],
    usage: 'Stale feed, retry suggested, soft validation issues.',
  },
  {
    name: 'warning-foreground',
    primitiveLight: 'warm-parchment',
    primitiveDark: 'warm-parchment',
    utilities: ['text-warning-foreground'],
    usage:
      'Text on bg-warning. Stays warm-parchment in dark mode for consistent WCAG AA across feedback surfaces.',
  },
  {
    name: 'unread-indicator',
    primitiveLight: 'burnt-amber',
    primitiveDark: 'amber-glow',
    utilities: ['bg-unread-indicator'],
    usage:
      'Dot on unread feed items. Intentionally identical to --primary so the eye trains on one color for "wants your attention".',
  },
  {
    name: 'accent-subtle',
    primitiveLight: 'amber-hush',
    primitiveDark: 'dusk-mauve',
    utilities: ['bg-accent-subtle'],
    usage:
      'Cell-level highlight — applied to inline elements within a row rather than the row itself. Currently identical to --accent; semantically distinct so they can diverge later.',
  },
] as const satisfies readonly SemanticColorToken[]

export const RADIUS_TOKENS = [
  { name: 'radius-sm', utility: 'rounded-sm' },
  { name: 'radius-md', utility: 'rounded-md' },
  { name: 'radius-lg', utility: 'rounded-lg' },
  { name: 'radius-xl', utility: 'rounded-xl' },
] as const satisfies readonly RadiusToken[]

export const SPACING_TOKENS = [
  {
    name: 'space-2xs',
    sizeLabel: '0.25rem · 4px',
    utilityHint: 'p-1 / gap-1 / m-1',
    description: 'Adjacent inline items.',
  },
  {
    name: 'space-xs',
    sizeLabel: '0.5rem · 8px',
    utilityHint: 'p-2 / gap-2 / m-2',
    description: 'Closely related elements.',
  },
  {
    name: 'space-sm',
    sizeLabel: '0.75rem · 12px',
    utilityHint: 'p-3 / gap-3 / m-3',
    description: 'Within a tight cluster.',
  },
  {
    name: 'space-md',
    sizeLabel: '1rem · 16px',
    utilityHint: 'p-4 / gap-4 / m-4',
    description: 'Default component padding.',
  },
  {
    name: 'space-lg',
    sizeLabel: '1.5rem · 24px',
    utilityHint: 'p-6 / gap-6 / m-6',
    description: 'Between distinct elements.',
  },
  {
    name: 'space-xl',
    sizeLabel: '2rem · 32px',
    utilityHint: 'p-8 / gap-8 / m-8',
    description: 'Between subsections.',
  },
  {
    name: 'space-2xl',
    sizeLabel: '3rem · 48px',
    utilityHint: 'p-12 / gap-12 / m-12',
    description: 'Between major page sections.',
  },
  {
    name: 'space-3xl',
    sizeLabel: '5rem · 80px',
    utilityHint: 'p-20 / gap-20 / m-20',
    description: 'Reading-view top/bottom padding.',
  },
] as const satisfies readonly SpacingToken[]

export const DEPTH_TOKENS = [
  {
    name: 'shadow-flat',
    utility: 'shadow-flat',
    description:
      'Level 0 — flat. The default for the canvas, sidebar, and most surfaces. Resolves to box-shadow: none.',
  },
  {
    name: 'shadow-hairline',
    utility: 'shadow-hairline',
    description:
      'Level 1 — 1px outset hairline using --border. For cards, dividers, container edges. Preferred over drop shadows; does not shift layout the way a 1px border would.',
  },
  {
    name: 'shadow-floating',
    utility: 'shadow-floating',
    description:
      'Level 2 — soft drop shadow for popovers, dialogs, command palette, and the mobile drawer. Used sparingly. In dark mode, pair with a 1px hairline border so the edge stays defined.',
  },
] as const satisfies readonly DepthToken[]

export const TYPOGRAPHY_TOKENS = [
  // Display tier — Source Serif 4. Used for headings 24px+, reading-view titles.
  {
    name: 'display-xl',
    utility: 'text-display-xl',
    family: 'serif',
    sizeLabel: '3.5rem · 56px',
    fontWeight: 400,
    lineHeight: 1.05,
    letterSpacing: '-0.02em',
    description: 'Hero headlines, reading-view article titles.',
    sample: 'The quiet reading room',
  },
  {
    name: 'display-l',
    utility: 'text-display-l',
    family: 'serif',
    sizeLabel: '2.5rem · 40px',
    fontWeight: 400,
    lineHeight: 1.1,
    letterSpacing: '-0.015em',
    description: 'Page-level H1, primary section headers.',
    sample: 'A library, not a dashboard',
  },
  {
    name: 'display-m',
    utility: 'text-display-m',
    family: 'serif',
    sizeLabel: '1.875rem · 30px',
    fontWeight: 500,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    description: 'Article titles in feed cards.',
    sample: 'Editorial calm at every scroll',
  },
  {
    name: 'display-s',
    utility: 'text-display-s',
    family: 'serif',
    sizeLabel: '1.5rem · 24px',
    fontWeight: 500,
    lineHeight: 1.25,
    letterSpacing: '0',
    description: 'Feed names in the subscription list, dialog titles.',
    sample: 'Subscribed feeds',
  },

  // UI tier — Inter. Used for any heading below 24px and all body copy.
  {
    name: 'title-l',
    utility: 'text-title-l',
    family: 'sans',
    sizeLabel: '1.25rem · 20px',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0',
    description: 'Card titles, sidebar group headers.',
    sample: 'Recent reading activity',
  },
  {
    name: 'title-m',
    utility: 'text-title-m',
    family: 'sans',
    sizeLabel: '1.125rem · 18px',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0',
    description: 'Settings section headers.',
    sample: 'Reading preferences',
  },
  {
    name: 'title-s',
    utility: 'text-title-s',
    family: 'sans',
    sizeLabel: '1rem · 16px',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0',
    description: 'Small headers, primary button labels.',
    sample: 'Add Feed',
  },
  {
    name: 'body-l',
    utility: 'text-body-l',
    family: 'sans',
    sizeLabel: '1.0625rem · 17px',
    fontWeight: 400,
    lineHeight: 1.7,
    letterSpacing: '0',
    description:
      'Reading-view body. Line-height 1.7 is non-negotiable; do not change per-route.',
    sample:
      'Reading on a feed reader is different from skimming on a dashboard. The line-height does the work.',
  },
  {
    name: 'body-m',
    utility: 'text-body-m',
    family: 'sans',
    sizeLabel: '1rem · 16px',
    fontWeight: 400,
    lineHeight: 1.55,
    letterSpacing: '0',
    description: 'Default UI body text, feed item excerpts.',
    sample:
      'Default body text reads comfortably at sixteen pixels with a relaxed line-height.',
  },
  {
    name: 'body-s',
    utility: 'text-body-s',
    family: 'sans',
    sizeLabel: '0.875rem · 14px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0',
    description: 'Secondary copy, item metadata.',
    sample: 'Secondary copy stays legible without competing.',
  },
  {
    name: 'caption',
    utility: 'text-caption',
    family: 'sans',
    sizeLabel: '0.8125rem · 13px',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0',
    description: 'Timestamps, source attributions, reading time.',
    sample: '3h ago · 5 min read',
  },
  {
    name: 'caption-uppercase',
    utility: 'text-caption-uppercase',
    family: 'sans',
    sizeLabel: '0.75rem · 12px',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0.08em',
    description:
      'Section labels (UNREAD, CATEGORY, source names above titles).',
    sample: 'Unread · Newsletter',
  },

  // Mono tier — JetBrains Mono. Used inside reading-view code excerpts.
  {
    name: 'code',
    utility: 'text-code',
    family: 'mono',
    sizeLabel: '0.875rem · 14px',
    fontWeight: 400,
    lineHeight: 1.65,
    letterSpacing: '0',
    description: 'Inline and block code in reading view.',
    sample: 'const reader = createReader({ width: "64ch" })',
  },
] as const satisfies readonly TypographyToken[]
