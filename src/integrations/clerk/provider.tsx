import { ClerkProvider } from '@clerk/react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export default function AppClerkProvider({
  children,
}: {
  children: React.ReactNode
}) {
  if (!PUBLISHABLE_KEY) {
    throw new Error(
      'VITE_CLERK_PUBLISHABLE_KEY is required. Vite inlines VITE_* vars at ' +
        'build time, so this must be set as a BUILD-TIME variable.\n\n' +
        '  Locally: add it to .env.local (get a publishable key from ' +
        'https://dashboard.clerk.com → API keys).\n' +
        '  Cloudflare Workers: dashboard → Workers & Pages → <worker> → ' +
        'Settings → Build → Variables and Secrets.\n' +
        '  CI: configure as a GitHub Actions repository variable.\n\n' +
        'See README § Authentication (Clerk) and docs/deploy.md.',
    )
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      {children}
    </ClerkProvider>
  )
}
