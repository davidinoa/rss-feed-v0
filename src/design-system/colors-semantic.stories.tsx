import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { SemanticTokenTable } from './token-catalog'
import { SEMANTIC_COLOR_TOKENS } from './tokens'

const meta = {
  title: 'Design System/Tokens/Colors/Semantic',
  component: SemanticTokenTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Semantic color tokens — exposed as Tailwind utilities (bg-primary, text-foreground, etc.). Each row shows the primitive referenced in light and dark mode, the matching Tailwind utility, and usage guidance.',
      },
    },
  },
} satisfies Meta<typeof SemanticTokenTable>

export default meta
type Story = StoryObj<typeof meta>

export const All: Story = {
  args: { tokens: SEMANTIC_COLOR_TOKENS },
}
