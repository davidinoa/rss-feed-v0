import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? ''

export const isClerkConfigured = PUBLISHABLE_KEY.length > 0

let warned = false

export default function AppClerkProvider({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isClerkConfigured) {
    if (import.meta.env.DEV) {
      if (!warned) {
        warned = true
        console.warn(
          '[Clerk] VITE_CLERK_PUBLISHABLE_KEY is missing — authentication is disabled. ' +
            'Add it to .env.local to enable sign-in. See README "Authentication (Clerk)".',
        )
      }
      return <>{children}</>
    }
    throw new Error(
      'VITE_CLERK_PUBLISHABLE_KEY is required in production. ' +
        'Vite inlines VITE_* vars at build time, so this must be set as a ' +
        'BUILD-TIME variable, not a runtime secret. In Cloudflare Workers ' +
        'Build: dashboard → Workers & Pages → <worker> → Settings → Build → ' +
        'Variables and Secrets. See docs/deploy.md.',
    )
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      {children}
    </ClerkProvider>
  )
}
