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
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      return stored
    }
  } catch {
    // Restricted contexts (private mode, sandboxed iframe) can throw SecurityError.
  }
  return 'auto'
}

export function getResolvedTheme(): ResolvedTheme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function subscribeToResolvedTheme(
  listener: (theme: ResolvedTheme) => void,
): () => void {
  if (typeof document === 'undefined') return () => {}
  const observer = new MutationObserver(() => listener(getResolvedTheme()))
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  return () => observer.disconnect()
}

export function applyTheme(mode: ThemeMode): void {
  if (typeof window === 'undefined') return

  let prefersDark = false
  try {
    prefersDark =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false
  } catch {
    // Same restricted-context concern as getStoredMode.
  }

  const resolved = resolveTheme(mode, prefersDark)
  const root = document.documentElement

  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved

  try {
    window.localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // Persistence is best-effort.
  }
}
