import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Input } from './input'
import { Label } from './label'

const meta = {
  title: 'UI/Label',
  component: Label,
  args: {
    children: 'Feed URL',
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const PairedWithInput: Story = {
  render: () => (
    <div className="space-y-1">
      <Label htmlFor="story-feed-url">Feed URL</Label>
      <Input
        id="story-feed-url"
        type="url"
        placeholder="https://example.com/feed.xml"
      />
    </div>
  ),
}

// Demonstrates the "peer-disabled" greying — the Label sits as a sibling
// AFTER the Input, with the input marked `peer`, so the label can pick up
// the input's disabled state.
export const DimsWithDisabledPeer: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <Input id="peered" className="peer" disabled defaultValue="example" />
      <Label htmlFor="peered">Greyed because the input above is disabled</Label>
    </div>
  ),
}
