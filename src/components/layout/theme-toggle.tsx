import { useEffect, useState } from 'react'
import {
  applyTheme,
  getStoredMode,
  nextMode,
  type ThemeMode,
} from '../lib/theme'

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
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className="border-border bg-card text-foreground hover:bg-accent inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold shadow-sm transition"
    >
      {mode === 'auto' ? 'Auto' : mode === 'dark' ? 'Dark' : 'Light'}
    </button>
  )
}
