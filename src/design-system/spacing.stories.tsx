import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { SpacingScale } from './token-catalog'
import { SPACING_TOKENS } from './tokens'

const meta = {
  title: 'Design System/Tokens/Spacing',
  component: SpacingScale,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Named spacing scale per DESIGN.md §5. Eight semantic tiers from 2xs (4px, adjacent inline items) through 3xl (80px, reading-view top/bottom padding) for design reference. For actual styling, each tier maps to a Tailwind numeric utility (e.g. md → p-4, lg → p-6, xl → p-8) — see the utility column on each row. The tokens themselves are exposed as CSS variables (--space-md, --space-lg, etc.) on :root for inline-style use and runtime introspection; they are intentionally NOT in Tailwind's --spacing-* namespace because the named keys (md, lg, xl, 2xl, 3xl) would shadow Tailwind's container scale and collapse max-w-md / max-w-3xl etc.",
      },
    },
  },
} satisfies Meta<typeof SpacingScale>

export default meta
type Story = StoryObj<typeof meta>

export const All: Story = {
  args: { tokens: SPACING_TOKENS },
}
