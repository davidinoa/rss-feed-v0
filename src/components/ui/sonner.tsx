import { useSyncExternalStore } from 'react'
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

import { getResolvedTheme, subscribeToResolvedTheme } from '#/lib/theme'

const SERVER_FALLBACK_THEME = () => 'light' as const

const TOASTER_ICONS = {
  success: <CircleCheckIcon className="size-4" />,
  info: <InfoIcon className="size-4" />,
  warning: <TriangleAlertIcon className="size-4" />,
  error: <OctagonXIcon className="size-4" />,
  loading: <Loader2Icon className="size-4 animate-spin" />,
}

const TOASTER_STYLE = {
  '--normal-bg': 'var(--popover)',
  '--normal-text': 'var(--popover-foreground)',
  '--normal-border': 'var(--border)',
  '--border-radius': 'var(--radius)',
} as React.CSSProperties

function Toaster(props: ToasterProps) {
  const theme = useSyncExternalStore(
    subscribeToResolvedTheme,
    getResolvedTheme,
    SERVER_FALLBACK_THEME,
  )

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={TOASTER_ICONS}
      style={TOASTER_STYLE}
      {...props}
    />
  )
}

export { Toaster }
