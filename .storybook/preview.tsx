import type { Preview } from '@storybook/tanstack-react'
import { withThemeByClassName } from '@storybook/addon-themes'
// oxlint-disable-next-line no-unassigned-import
import '../src/styles.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'error',
    },
    layout: 'centered',
    backgrounds: { disable: true },
  },
  tags: ['autodocs'],
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      parentSelector: 'html',
    }),
  ],
}

export default preview
