import { useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'
import {
  applyTheme,
  getStoredMode,
  nextMode,
  type ThemeMode,
} from '#/lib/theme'

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    const initial = getStoredMode()
    setMode(initial)
    applyTheme(initial)
  }, [])

  useEffect(() => {
    if (mode !== 'auto') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('auto')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [mode])

  function handleClick() {
    const next = nextMode(mode)
    setMode(next)
    applyTheme(next)
  }

  const label =
    mode === 'auto'
      ? 'Theme mode: auto (system). Click to switch to light mode.'
      : `Theme mode: ${mode}. Click to switch mode.`

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      {mode === 'auto' ? 'Auto' : mode === 'dark' ? 'Dark' : 'Light'}
    </Button>
  )
}
