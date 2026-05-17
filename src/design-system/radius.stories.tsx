import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { RadiusScale } from './token-catalog'
import { RADIUS_TOKENS } from './tokens'

const meta = {
  title: 'Design System/Tokens/Radius',
  component: RadiusScale,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Border-radius scale derived from --radius (0.5rem). Use the Tailwind utility (rounded-md, rounded-lg, etc.) in JSX — never set border-radius via inline styles.',
      },
    },
  },
} satisfies Meta<typeof RadiusScale>

export default meta
type Story = StoryObj<typeof meta>

export const All: Story = {
  args: { tokens: RADIUS_TOKENS },
}
