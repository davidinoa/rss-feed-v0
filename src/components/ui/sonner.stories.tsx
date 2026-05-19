import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { toast } from 'sonner'
import { Button } from './button'
import { Toaster } from './sonner'

const meta = {
  title: 'UI/Toaster',
  component: Toaster,
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

// The Toaster mounts a single ARIA live region; toasts render inside it on
// demand. The empty state passes axe (an empty <section aria-live="polite"
// aria-atomic="false">) and matches the at-rest production render.
export const Mounted: Story = {
  render: () => (
    <div className="text-muted-foreground text-sm">
      <p>
        The Toaster is mounted below this paragraph. It's empty until a toast is
        fired.
      </p>
      <Toaster />
    </div>
  ),
}

// Interactive stories — click the buttons to fire a toast and observe the
// rendered Sonner output. Story-as-test only renders the static buttons +
// empty Toaster; the click path is exercised in real-app flows.
export const FireSuccess: Story = {
  render: () => (
    <div className="space-y-3">
      <Button onClick={() => toast.success('Subscribed')}>
        Fire success toast
      </Button>
      <Toaster />
    </div>
  ),
}

export const FireError: Story = {
  render: () => (
    <div className="space-y-3">
      <Button
        variant="destructive"
        onClick={() => toast.error('Could not subscribe.')}
      >
        Fire error toast
      </Button>
      <Toaster />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast.success('Subscribed')}>Success</Button>
        <Button variant="outline" onClick={() => toast.info('Heads up')}>
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning('That feed is stale')}
        >
          Warning
        </Button>
        <Button
          variant="destructive"
          onClick={() => toast.error('Could not subscribe.')}
        >
          Error
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.loading('Fetching feed…')}
        >
          Loading
        </Button>
      </div>
      <Toaster />
    </div>
  ),
}
