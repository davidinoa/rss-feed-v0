import { useAuth } from '@clerk/clerk-react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { isClerkConfigured } from '../clerk/provider'

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL ?? ''

export const isConvexConfigured = CONVEX_URL.length > 0

const convex = isConvexConfigured ? new ConvexReactClient(CONVEX_URL) : null

let warned = false

export default function AppConvexProvider({
  children,
}: {
  children: React.ReactNode
}) {
  if (!convex) {
    if (import.meta.env.DEV && !warned) {
      warned = true
      console.warn(
        '[Convex] VITE_CONVEX_URL is missing — backend queries are disabled. ' +
          'Run `pnpm convex:dev` to provision a deployment.',
      )
    }
    return <>{children}</>
  }

  if (isClerkConfigured) {
    return (
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    )
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
