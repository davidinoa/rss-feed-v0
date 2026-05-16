import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  applyTheme,
  getStoredMode,
  nextMode,
  resolveTheme,
} from './theme'

describe('resolveTheme', () => {
  it("returns 'dark' when mode is auto and the system prefers dark", () => {
    expect(resolveTheme('auto', true)).toBe('dark')
  })

  it("returns 'light' when mode is auto and the system prefers light", () => {
    expect(resolveTheme('auto', false)).toBe('light')
  })

  it("returns 'light' when mode is light, even when system prefers dark", () => {
    expect(resolveTheme('light', true)).toBe('light')
  })

  it("returns 'dark' when mode is dark, even when system prefers light", () => {
    expect(resolveTheme('dark', false)).toBe('dark')
  })
})

describe('nextMode', () => {
  it("cycles light -> dark -> auto -> light", () => {
    expect(nextMode('light')).toBe('dark')
    expect(nextMode('dark')).toBe('auto')
    expect(nextMode('auto')).toBe('light')
  })
})

describe('getStoredMode', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it.each(['light', 'dark', 'auto'] as const)(
    "returns '%s' when stored",
    (mode) => {
      window.localStorage.setItem('theme', mode)
      expect(getStoredMode()).toBe(mode)
    },
  )

  it("returns 'auto' when localStorage is empty", () => {
    expect(getStoredMode()).toBe('auto')
  })

  it("returns 'auto' when the stored value is invalid", () => {
    window.localStorage.setItem('theme', 'sunset')
    expect(getStoredMode()).toBe('auto')
  })
})

describe('applyTheme', () => {
  function mockMatchMedia(prefersDark: boolean) {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn((query: string) => ({
        matches: query.includes('dark') ? prefersDark : false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  }

  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.removeAttribute('style')
  })

  it("adds the 'light' class and removes 'dark' when mode is light", () => {
    mockMatchMedia(true)
    document.documentElement.classList.add('dark')
    applyTheme('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it("adds the 'dark' class and removes 'light' when mode is dark", () => {
    mockMatchMedia(false)
    document.documentElement.classList.add('light')
    applyTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
  })

  it("applies the resolved theme from matchMedia when mode is auto", () => {
    mockMatchMedia(true)
    applyTheme('auto')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    mockMatchMedia(false)
    applyTheme('auto')
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })

  it('persists the mode to localStorage', () => {
    mockMatchMedia(false)
    applyTheme('dark')
    expect(window.localStorage.getItem('theme')).toBe('dark')
    applyTheme('auto')
    expect(window.localStorage.getItem('theme')).toBe('auto')
  })

  it('sets the colorScheme style on the root element', () => {
    mockMatchMedia(true)
    applyTheme('auto')
    expect(document.documentElement.style.colorScheme).toBe('dark')
    applyTheme('light')
    expect(document.documentElement.style.colorScheme).toBe('light')
  })
})
