import type { Meta, StoryObj } from '@storybook/tanstack-react'
import type { ThemeMode } from '#/lib/theme'
import ThemeToggle from './theme-toggle'

function seedTheme(mode: ThemeMode) {
  const root = document.documentElement
  const previous = window.localStorage.getItem('theme')
  window.localStorage.setItem('theme', mode)
  return () => {
    if (previous === null) window.localStorage.removeItem('theme')
    else window.localStorage.setItem('theme', previous)
    root.classList.remove('light', 'dark')
  }
}

const meta = {
  title: 'Layout/ThemeToggle',
  component: ThemeToggle,
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Auto: Story = {
  beforeEach: () => seedTheme('auto'),
}

export const Light: Story = {
  beforeEach: () => seedTheme('light'),
}

export const Dark: Story = {
  beforeEach: () => seedTheme('dark'),
}
