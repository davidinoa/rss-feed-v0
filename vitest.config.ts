import { defineConfig } from 'vitest/config'
import viteReact from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import type { UserConfig } from 'vite'
const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))
type BrowserProvider = NonNullable<
  NonNullable<NonNullable<UserConfig['test']>['browser']>['provider']
>

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [viteReact()],
  resolve: {
    alias: {
      '#': new URL('./src/', import.meta.url).pathname,
      '@': new URL('./src/', import.meta.url).pathname,
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
          exclude: [
            'node_modules',
            'e2e',
            '.tanstack',
            '.wrangler',
            '.output',
            'dist',
          ],
          css: false,
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}) as unknown as BrowserProvider,
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
})
