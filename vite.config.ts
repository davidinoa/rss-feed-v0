import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

// Storybook builds with its own Vite config (.storybook/main.ts) and must NOT
// include the Cloudflare or TanStack Start plugins — they require a server
// runtime that breaks Storybook's preview iframe.
const isStorybook = process.env.STORYBOOK === 'true'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    !isStorybook && cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    !isStorybook && tanstackStart(),
    viteReact(),
  ].filter(Boolean),
})

export default config
