import type { ReactNode } from 'react'

/**
 * Presentational shell for "you need to sign in" prompts. The caller passes:
 *   - children: the contextual description ("Sign in to see your subscriptions.")
 *   - action: the call-to-action node, typically a Clerk `<SignInButton>`
 *     wrapping a styled `<button>`.
 *
 * Keeping this presentational keeps it Clerk-free, so the story-as-test
 * exercise — which renders without a `ClerkProvider` ancestor — can axe-check
 * the layout. Per docs/design-system.md § Stories (presentation/container
 * split), Clerk wiring stays in the route.
 */
export function SignedOutNotice({
  children,
  action,
}: {
  children: ReactNode
  action: ReactNode
}) {
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">{children}</p>
      {action}
    </div>
  )
}
