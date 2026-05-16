import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Settings } from 'lucide-react'
import { Button } from './button'

const meta = {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Button',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: [
        'default',
        'xs',
        'sm',
        'lg',
        'icon',
        'icon-xs',
        'icon-sm',
        'icon-lg',
      ],
    },
    asChild: { control: false },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { variant: 'default' },
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const Ghost: Story = {
  args: { variant: 'ghost' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete feed' },
}

export const Link: Story = {
  args: { variant: 'link', children: 'Read more' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const IconSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="icon-xs" aria-label="Open settings (icon-xs)">
        <Settings />
      </Button>
      <Button size="icon-sm" aria-label="Open settings (icon-sm)">
        <Settings />
      </Button>
      <Button size="icon" aria-label="Open settings (icon)">
        <Settings />
      </Button>
      <Button size="icon-lg" aria-label="Open settings (icon-lg)">
        <Settings />
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}
