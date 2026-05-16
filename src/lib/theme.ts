export type ThemeMode = 'light' | 'dark' | 'auto'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

export function resolveTheme(
  mode: ThemeMode,
  prefersDark: boolean,
): ResolvedTheme {
  if (mode === 'auto') return prefersDark ? 'dark' : 'light'
  return mode
}

export function nextMode(current: ThemeMode): ThemeMode {
  if (current === 'light') return 'dark'
  if (current === 'dark') return 'auto'
  return 'light'
}

export function getStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'auto'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }
  return 'auto'
}

export function applyTheme(mode: ThemeMode): void {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = resolveTheme(mode, prefersDark)
  const root = document.documentElement

  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved

  window.localStorage.setItem(STORAGE_KEY, mode)
}
