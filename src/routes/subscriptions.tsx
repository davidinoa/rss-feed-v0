import { Show } from '@clerk/react'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { SignedOutNotice } from '../components/states/signed-out-notice'
import { SignInAction } from '../integrations/clerk/sign-in-action'

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

      <Show when="signed-in">
        <SubscriptionsList />
      </Show>
      <Show when="signed-out">
        <SignedOutNotice action={<SignInAction />}>
          Sign in to see your subscriptions.
        </SignedOutNotice>
      </Show>

      <Outlet />
    </main>
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
