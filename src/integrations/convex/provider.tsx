import { useAuth } from '@clerk/react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL

if (!CONVEX_URL) {
  throw new Error(
    'VITE_CONVEX_URL is required. Vite inlines VITE_* vars at build time, ' +
      'so this must be set as a BUILD-TIME variable.\n\n' +
      '  Locally: run `pnpm convex:dev` once to provision a dev deployment ' +
      '(it adds the URL to .env.local automatically).\n' +
      '  Cloudflare Workers: dashboard → Workers & Pages → <worker> → ' +
      'Settings → Build → Variables and Secrets.\n' +
      '  CI: configure as a GitHub Actions repository variable.\n\n' +
      'See README § Backend (Convex) and docs/deploy.md.',
  )
}

const convex = new ConvexReactClient(CONVEX_URL)

export default function AppConvexProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}
