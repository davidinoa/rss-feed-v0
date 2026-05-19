import { Show, SignInButton } from '@clerk/react'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { isClerkConfigured } from '../integrations/clerk/provider'
import { isConvexConfigured } from '../integrations/convex/provider'

export const Route = createFileRoute('/subscriptions')({
  component: SubscriptionsLayout,
})

function SubscriptionsLayout() {
  return (
    <main className="page-wrap px-4 py-10">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-muted-foreground mb-2 text-xs font-bold uppercase tracking-widest">
            Library
          </p>
          <h1 className="text-foreground text-3xl font-bold sm:text-4xl">
            Your subscriptions
          </h1>
        </div>
        <Link
          to="/subscriptions/add"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2.5 text-sm font-semibold no-underline transition"
        >
          + Add subscription
        </Link>
      </header>

      {!isConvexConfigured ? <ConvexMissingNotice /> : <ListShell />}

      <Outlet />
    </main>
  )
}

function ListShell() {
  if (!isClerkConfigured) {
    // No auth at all — query returns [] and the empty-state copy carries
    // the page. Same behaviour the scaffold had with mock data.
    return <SubscriptionsList />
  }
  return (
    <>
      <Show when="signed-in">
        <SubscriptionsList />
      </Show>
      <Show when="signed-out">
        <SignedOutNotice />
      </Show>
    </>
  )
}

function SignedOutNotice() {
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        Sign in to see your subscriptions.
      </p>
      <SignInButton mode="modal">
        <button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2.5 text-sm font-semibold transition"
        >
          Sign in
        </button>
      </SignInButton>
    </div>
  )
}

function SubscriptionsList() {
  const subscriptions = useQuery(api.subscriptions.list)

  if (subscriptions === undefined) {
    return <p className="text-muted-foreground text-sm">Loading…</p>
  }

  if (subscriptions.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        You haven't subscribed to anything yet.{' '}
        <Link to="/subscriptions/add" className="underline">
          Add your first.
        </Link>
      </p>
    )
  }

  return (
    <ul className="space-y-1">
      {subscriptions.map((subscription) => {
        const displayTitle =
          subscription.customTitle ??
          subscription.source?.title ??
          '(Source unavailable)'
        return (
          <li key={subscription._id} className="text-foreground py-1">
            {displayTitle}
          </li>
        )
      })}
    </ul>
  )
}

function ConvexMissingNotice() {
  return (
    <p className="text-muted-foreground text-sm">
      Backend not configured. Run <code>pnpm convex:dev</code> to provision a
      deployment, then refresh.
    </p>
  )
}
