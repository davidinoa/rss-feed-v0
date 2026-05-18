import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { DepthScale } from './token-catalog'
import { DEPTH_TOKENS } from './tokens'

const meta = {
  title: 'Design System/Tokens/Depth',
  component: DepthScale,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Three-level depth scale per DESIGN.md §5. The room is well-lit; objects do not cast dramatic shadows. Level 0 (flat) is the default for the canvas, sidebar, and most surfaces. Level 1 (hairline) is a 1px outset border via --border for cards, dividers, and container edges — preferred over drop shadows and does not shift layout the way a real border would. Level 2 (floating) is reserved for popovers, dialogs, the command palette, and the mobile drawer. Tailwind utilities: `shadow-flat`, `shadow-hairline`, `shadow-floating`.',
      },
    },
  },
} satisfies Meta<typeof DepthScale>

export default meta
type Story = StoryObj<typeof meta>

export const All: Story = {
  args: { tokens: DEPTH_TOKENS },
}
