import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { ConvexMissingNotice } from './convex-missing-notice'

const meta = {
  title: 'States/ConvexMissingNotice',
  component: ConvexMissingNotice,
} satisfies Meta<typeof ConvexMissingNotice>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
