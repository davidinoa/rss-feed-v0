import { createFileRoute } from '@tanstack/react-router'
import { SignIn, Show, useUser } from '@clerk/react'
import { isClerkConfigured } from '../../integrations/clerk/provider'

export const Route = createFileRoute('/demo/clerk')({
  component: ClerkDemo,
})

function ClerkDemo() {
  if (!isClerkConfigured) {
    return (
      <div className="flex justify-center px-4 py-10">
        <div className="border-border bg-card w-full max-w-md space-y-3 rounded-2xl border p-6 shadow-sm">
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
            Clerk demo
          </p>
          <h1 className="text-foreground text-lg font-semibold">
            Authentication is not configured yet
          </h1>
          <p className="text-muted-foreground text-sm">
            Add your Clerk publishable key to <code>.env.local</code> and
            restart the dev server:
          </p>
          <pre className="border-border bg-secondary rounded-lg border p-3 text-xs">
            {`VITE_CLERK_PUBLISHABLE_KEY=pk_test_...`}
          </pre>
          <p className="text-muted-foreground text-xs">
            Get a key from{' '}
            <a
              href="https://dashboard.clerk.com"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              dashboard.clerk.com
            </a>
            .
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6 p-6">
        <Show when="signed-out">
          <div className="space-y-1.5">
            <h1 className="text-lg font-semibold leading-none tracking-tight">
              Sign in to continue
            </h1>
            <p className="text-muted-foreground text-sm">
              Clerk renders the sign-in UI, manages sessions, and handles social
              providers for you.
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <SignIn routing="hash" />
          </div>
          <p className="text-muted-foreground text-center text-xs">
            Built with{' '}
            <a
              href="https://clerk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground font-medium"
            >
              CLERK
            </a>
            .
          </p>
        </Show>

        <Show when="signed-in">
          <SignedInGreeting />
        </Show>
      </div>
    </div>
  )
}

function SignedInGreeting() {
  const { user } = useUser()
  if (!user) return null

  const email = user.primaryEmailAddress?.emailAddress
  const initial = (user.firstName || email || 'U').charAt(0).toUpperCase()

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-lg font-semibold leading-none tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-sm">
          You're signed in as {email}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {user.imageUrl ? (
          <img src={user.imageUrl} alt="" className="h-10 w-10 rounded-full" />
        ) : (
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
            <span className="text-muted-foreground text-sm font-medium">
              {initial}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-muted-foreground truncate text-xs">{email}</p>
        </div>
      </div>

      <p className="text-muted-foreground text-center text-xs">
        Manage your account from the avatar in the header. Built with{' '}
        <a
          href="https://clerk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground font-medium"
        >
          CLERK
        </a>
        .
      </p>
    </div>
  )
}
