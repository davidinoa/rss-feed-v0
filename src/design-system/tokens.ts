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
