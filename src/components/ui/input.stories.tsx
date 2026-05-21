import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Input } from './input'
import { Label } from './label'

const meta = {
  title: 'UI/Input',
  component: Input,
  args: {
    placeholder: 'https://example.com/feed.xml',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'url', 'email', 'password', 'search', 'number'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'https://blog.cloudflare.com/rss' },
}

export const UrlField: Story = {
  args: { type: 'url', placeholder: 'https://example.com/feed.xml' },
}

export const WithError: Story = {
  args: {
    type: 'url',
    defaultValue: 'not-a-url',
    'aria-invalid': true,
    'aria-describedby': 'url-error',
  },
  render: (args) => (
    <div className="space-y-1">
      <Label htmlFor="url-with-error">URL</Label>
      <Input id="url-with-error" {...args} />
      <p id="url-error" role="alert" className="text-destructive text-xs">
        That doesn't look like a URL.
      </p>
    </div>
  ),
}

export const PairedWithLabel: Story = {
  render: () => (
    <div className="space-y-1">
      <Label htmlFor="paired">Feed URL</Label>
      <Input
        id="paired"
        type="url"
        placeholder="https://example.com/feed.xml"
      />
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <div className="space-y-1">
        <Label htmlFor="ex-default">Default</Label>
        <Input id="ex-default" placeholder="Empty placeholder" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="ex-filled">Filled</Label>
        <Input id="ex-filled" defaultValue="https://blog.cloudflare.com/rss" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="ex-disabled">Disabled</Label>
        <Input
          id="ex-disabled"
          disabled
          defaultValue="https://blog.cloudflare.com/rss"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="ex-invalid">Invalid</Label>
        <Input
          id="ex-invalid"
          defaultValue="not-a-url"
          aria-invalid
          aria-describedby="ex-invalid-error"
        />
        <p
          id="ex-invalid-error"
          role="alert"
          className="text-destructive text-xs"
        >
          That doesn't look like a URL.
        </p>
      </div>
    </div>
  ),
}
