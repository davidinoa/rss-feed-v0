import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { TypographyScale } from './token-catalog'
import { TYPOGRAPHY_TOKENS } from './tokens'

const meta = {
  title: 'Design System/Tokens/Typography',
  component: TypographyScale,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Named typography scale per DESIGN.md §3. Each utility (text-display-xl, text-title-s, text-body-l, etc.) bundles font-family + size + weight + line-height + letter-spacing as one indivisible decision. Display tier uses Source Serif 4; UI/body tier uses Inter; code tier uses JetBrains Mono. Never assemble equivalents from raw text-* / font-* utilities — reach for the named utility instead.',
      },
    },
  },
} satisfies Meta<typeof TypographyScale>

export default meta
type Story = StoryObj<typeof meta>

export const All: Story = {
  args: { tokens: TYPOGRAPHY_TOKENS },
}
