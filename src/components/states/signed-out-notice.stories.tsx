import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { SignedOutNotice } from './signed-out-notice'

const MockSignInAction = () => (
  <button
    type="button"
    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2.5 text-sm font-semibold transition"
  >
    Sign in
  </button>
)

const meta = {
  title: 'States/SignedOutNotice',
  component: SignedOutNotice,
  args: {
    children: 'Sign in to see your subscriptions.',
    action: <MockSignInAction />,
  },
} satisfies Meta<typeof SignedOutNotice>

export default meta
type Story = StoryObj<typeof meta>

export const ListContext: Story = {
  args: { children: 'Sign in to see your subscriptions.' },
}

export const AddContext: Story = {
  args: { children: 'Sign in to add subscriptions to your library.' },
}
