import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '#/lib/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-title-s whitespace-nowrap transition-colors duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary CTA: Burnt Amber bg, Warm Parchment text. Used sparingly —
        // a screen rarely has more than one. Hover fades to lighter primary.
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        // Secondary: Soft Vellum bg, Pebble text. For less critical actions.
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        // Ghost: transparent → Amber Hush on hover. Default for toolbar
        // actions and inline controls.
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        // Destructive: Brick Alert bg, Warm Parchment text. Reserved for
        // confirmed delete/unsubscribe actions (never one-click).
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive',
        // Outline: 1px hairline border, transparent bg. Hover fills with
        // Amber Hush. Used for tertiary actions that need more presence
        // than ghost but less than secondary.
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        // Link: transparent, Burnt Amber text with underline-on-hover.
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        // DESIGN.md §4: xs (compact), default (standard), lg (marketing-page
        // primaries), icon (36px square). Touch targets enforced via padding
        // on mobile per DESIGN.md §5 (44×44 minimum).
        default: 'h-10 px-[1.125rem] has-[>svg]:px-3.5',
        xs: "h-8 gap-1 px-3 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-12 px-7 has-[>svg]:px-5',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
