import { createFileRoute } from '@tanstack/react-router'
import { isConvexConfigured } from '../../integrations/convex/provider'

export const Route = createFileRoute('/demo/convex')({
  component: ConvexDemo,
})

function ConvexDemo() {
  if (!isConvexConfigured) {
    return (
      <main className="page-wrap px-4 py-10">
        <section className="island-shell max-w-2xl rounded-2xl p-6 sm:p-8 space-y-4">
          <p className="island-kicker">Convex demo</p>
          <h1 className="text-2xl font-semibold text-[var(--sea-ink)]">
            Backend not configured yet
          </h1>
          <p className="text-sm text-[var(--sea-ink-soft)]">
            The Convex schema and functions are scaffolded in{' '}
            <code>convex/</code>, but the project hasn't been provisioned. Run
            the dev command to log in, create a deployment, and generate the
            typed <code>convex/_generated/</code> client.
          </p>
          <pre className="rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] p-3 text-xs">
            {`pnpm convex:dev`}
          </pre>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
            <li>
              It prompts you to sign in and create or pick a project. A{' '}
              <code>VITE_CONVEX_URL</code> entry gets appended to{' '}
              <code>.env.local</code> automatically.
            </li>
            <li>
              The first run also creates <code>convex/_generated/</code> with
              types for <code>api.feeds.list</code>, <code>api.feeds.add</code>,
              and <code>api.articles.timeline</code>.
            </li>
            <li>
              To wire Clerk, follow the{' '}
              <a
                href="https://docs.convex.dev/auth/clerk"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Convex + Clerk guide
              </a>{' '}
              to add a JWT template and set <code>CLERK_JWT_ISSUER_DOMAIN</code>{' '}
              on Convex.
            </li>
          </ol>
          <p className="text-xs text-[var(--sea-ink-soft)]">
            After that, restart <code>pnpm dev</code> and reload this route to
            see live queries.
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="page-wrap px-4 py-10">
      <section className="island-shell max-w-2xl rounded-2xl p-6 sm:p-8 space-y-4">
        <p className="island-kicker">Convex demo</p>
        <h1 className="text-2xl font-semibold text-[var(--sea-ink)]">
          Backend connected
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          <code>VITE_CONVEX_URL</code> is set. Replace this placeholder with
          your first real query. Recommended pattern with TanStack Query:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] p-3 text-xs">
          {`import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'

function Feeds() {
  const { data } = useSuspenseQuery(convexQuery(api.feeds.list, {}))
  return <ul>{data.map(f => <li key={f._id}>{f.title}</li>)}</ul>
}`}
        </pre>
        <p className="text-xs text-[var(--sea-ink-soft)]">
          Live updates flow through Convex's subscription channel — no manual
          invalidation needed.
        </p>
      </section>
    </main>
  )
}
