export type PrimitiveColorToken = {
  name: string
  category: 'neutral' | 'blue' | 'red' | 'green' | 'yellow'
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
  { name: 'neutral-0', category: 'neutral' },
  { name: 'neutral-50', category: 'neutral' },
  { name: 'neutral-100', category: 'neutral' },
  { name: 'neutral-150', category: 'neutral' },
  { name: 'neutral-200', category: 'neutral' },
  { name: 'neutral-500', category: 'neutral' },
  { name: 'neutral-600', category: 'neutral' },
  { name: 'neutral-800', category: 'neutral' },
  { name: 'neutral-850', category: 'neutral' },
  { name: 'neutral-900', category: 'neutral' },
  { name: 'neutral-925', category: 'neutral' },
  { name: 'neutral-1000', category: 'neutral' },
  { name: 'blue-50', category: 'blue' },
  { name: 'blue-400', category: 'blue' },
  { name: 'blue-600', category: 'blue' },
  { name: 'blue-950', category: 'blue' },
  { name: 'red-500', category: 'red' },
  { name: 'red-600', category: 'red' },
  { name: 'green-500', category: 'green' },
  { name: 'green-600', category: 'green' },
  { name: 'yellow-500', category: 'yellow' },
  { name: 'yellow-600', category: 'yellow' },
] as const satisfies readonly PrimitiveColorToken[]

export const SEMANTIC_COLOR_TOKENS = [
  {
    name: 'background',
    primitiveLight: 'neutral-0',
    primitiveDark: 'neutral-1000',
    utilities: ['bg-background'],
    usage: 'Page-level surface. The default body background.',
  },
  {
    name: 'foreground',
    primitiveLight: 'neutral-900',
    primitiveDark: 'neutral-150',
    utilities: ['text-foreground'],
    usage: 'Default body text color, paired with bg-background.',
  },
  {
    name: 'card',
    primitiveLight: 'neutral-0',
    primitiveDark: 'neutral-925',
    utilities: ['bg-card'],
    usage: 'Surface for grouped content (cards, panels).',
  },
  {
    name: 'card-foreground',
    primitiveLight: 'neutral-900',
    primitiveDark: 'neutral-150',
    utilities: ['text-card-foreground'],
    usage: 'Text on bg-card.',
  },
  {
    name: 'popover',
    primitiveLight: 'neutral-0',
    primitiveDark: 'neutral-925',
    utilities: ['bg-popover'],
    usage: 'Surface for floating content (popovers, menus, tooltips).',
  },
  {
    name: 'popover-foreground',
    primitiveLight: 'neutral-900',
    primitiveDark: 'neutral-150',
    utilities: ['text-popover-foreground'],
    usage: 'Text on bg-popover.',
  },
  {
    name: 'primary',
    primitiveLight: 'blue-600',
    primitiveDark: 'blue-400',
    utilities: ['bg-primary', 'text-primary'],
    usage: 'Primary actions, CTAs, brand emphasis.',
  },
  {
    name: 'primary-foreground',
    primitiveLight: 'neutral-0',
    primitiveDark: 'neutral-1000',
    utilities: ['text-primary-foreground'],
    usage: 'Text on bg-primary.',
  },
  {
    name: 'secondary',
    primitiveLight: 'neutral-50',
    primitiveDark: 'neutral-925',
    utilities: ['bg-secondary'],
    usage:
      'Secondary surfaces (subdued backgrounds, secondary button background).',
  },
  {
    name: 'secondary-foreground',
    primitiveLight: 'neutral-900',
    primitiveDark: 'neutral-150',
    utilities: ['text-secondary-foreground'],
    usage: 'Text on bg-secondary.',
  },
  {
    name: 'muted',
    primitiveLight: 'neutral-100',
    primitiveDark: 'neutral-850',
    utilities: ['bg-muted'],
    usage: 'Muted surfaces (disabled fields, low-emphasis panels).',
  },
  {
    name: 'muted-foreground',
    primitiveLight: 'neutral-500',
    primitiveDark: 'neutral-600',
    utilities: ['text-muted-foreground'],
    usage: 'Low-emphasis text (captions, helper text, metadata).',
  },
  {
    name: 'accent',
    primitiveLight: 'neutral-100',
    primitiveDark: 'neutral-850',
    utilities: ['bg-accent', 'hover:bg-accent'],
    usage:
      'Hover surface for interactive rows. Distinct from accent-subtle (selected state).',
  },
  {
    name: 'accent-foreground',
    primitiveLight: 'neutral-900',
    primitiveDark: 'neutral-150',
    utilities: ['text-accent-foreground'],
    usage: 'Text on bg-accent.',
  },
  {
    name: 'destructive',
    primitiveLight: 'red-600',
    primitiveDark: 'red-500',
    utilities: ['bg-destructive', 'text-destructive'],
    usage: 'Destructive actions (delete, remove), error indicators.',
  },
  {
    name: 'destructive-foreground',
    primitiveLight: 'neutral-0',
    primitiveDark: 'neutral-1000',
    utilities: ['text-destructive-foreground'],
    usage: 'Text on bg-destructive.',
  },
  {
    name: 'border',
    primitiveLight: 'neutral-200',
    primitiveDark: 'neutral-800',
    utilities: ['border-border', 'border'],
    usage: 'Default border for surfaces and dividers.',
  },
  {
    name: 'input',
    primitiveLight: 'neutral-200',
    primitiveDark: 'neutral-800',
    utilities: ['border-input'],
    usage: 'Border for form inputs and interactive fields.',
  },
  {
    name: 'ring',
    primitiveLight: 'blue-600',
    primitiveDark: 'blue-400',
    utilities: ['focus-visible:ring-ring'],
    usage: 'Focus-visible ring for keyboard navigation.',
  },
  {
    name: 'success',
    primitiveLight: 'green-600',
    primitiveDark: 'green-500',
    utilities: ['bg-success', 'text-success'],
    usage: 'Feed-health indicator, "fetched OK" confirmations.',
  },
  {
    name: 'success-foreground',
    primitiveLight: 'neutral-0',
    primitiveDark: 'neutral-1000',
    utilities: ['text-success-foreground'],
    usage: 'Text on bg-success.',
  },
  {
    name: 'warning',
    primitiveLight: 'yellow-600',
    primitiveDark: 'yellow-500',
    utilities: ['bg-warning', 'text-warning'],
    usage: 'Stale feed, retry suggested, soft validation issues.',
  },
  {
    name: 'warning-foreground',
    primitiveLight: 'neutral-0',
    primitiveDark: 'neutral-1000',
    utilities: ['text-warning-foreground'],
    usage: 'Text on bg-warning.',
  },
  {
    name: 'unread-indicator',
    primitiveLight: 'blue-600',
    primitiveDark: 'blue-400',
    utilities: ['bg-unread-indicator'],
    usage:
      'Dot on unread feed items. Distinct from primary so unread color can shift independently.',
  },
  {
    name: 'accent-subtle',
    primitiveLight: 'blue-50',
    primitiveDark: 'blue-950',
    utilities: ['bg-accent-subtle'],
    usage:
      'Selected/active row background (sidebar, feed list). Distinct from accent (which is hover).',
  },
] as const satisfies readonly SemanticColorToken[]

export const RADIUS_TOKENS = [
  { name: 'radius-sm', utility: 'rounded-sm' },
  { name: 'radius-md', utility: 'rounded-md' },
  { name: 'radius-lg', utility: 'rounded-lg' },
  { name: 'radius-xl', utility: 'rounded-xl' },
] as const satisfies readonly RadiusToken[]
