import { SignInButton } from '@clerk/react'

/**
 * Reusable "Sign in" call-to-action: a styled button wrapped in Clerk's
 * `<SignInButton mode="modal">` so the modal opens in-place instead of
 * navigating away.
 *
 * Lives under `src/integrations/clerk/` (not `src/components/states/`)
 * because it depends on a ClerkProvider ancestor at render time — keeping
 * it here matches the rest of the Clerk-aware UI (`header-user.tsx`) and
 * keeps `src/components/states/signed-out-notice.tsx` presentation-only so
 * its story-as-test renders without needing a provider.
 *
 * Pass it as the `action` slot of <SignedOutNotice>:
 *
 *   <SignedOutNotice action={<SignInAction />}>
 *     Sign in to see your subscriptions.
 *   </SignedOutNotice>
 */
export function SignInAction() {
  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2.5 text-sm font-semibold transition"
      >
        Sign in
      </button>
    </SignInButton>
  )
}
