import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { ColorSwatchGrid } from './token-catalog'
import { PRIMITIVE_COLOR_TOKENS } from './tokens'

const meta = {
  title: 'Design System/Tokens/Colors/Primitives',
  component: ColorSwatchGrid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Raw color palette — private to the token system. NOT exposed as Tailwind utilities. Semantic tokens reference these via var(...). Off-scale step numbers (--neutral-150, -850, -925) are intentional; see ADR-0003.',
      },
    },
  },
} satisfies Meta<typeof ColorSwatchGrid>

export default meta
type Story = StoryObj<typeof meta>

export const All: Story = {
  args: { tokens: PRIMITIVE_COLOR_TOKENS },
}
