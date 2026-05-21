import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/convex')({
  component: ConvexDemo,
})

function ConvexDemo() {
  return (
    <main className="page-wrap px-4 py-10">
      <section className="border-border bg-card max-w-2xl space-y-4 rounded-2xl border p-6 shadow-sm sm:p-8">
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
          Convex demo
        </p>
        <h1 className="text-foreground text-2xl font-semibold">
          Backend connected
        </h1>
        <p className="text-muted-foreground text-sm">
          <code>VITE_CONVEX_URL</code> is required at boot (the provider throws
          otherwise), so reaching this route means the deployment is reachable.
          Recommended pattern for live queries with TanStack Query:
        </p>
        <pre className="border-border bg-secondary overflow-x-auto rounded-lg border p-3 text-xs">
          {`import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'

function Subscriptions() {
  const { data } = useSuspenseQuery(convexQuery(api.subscriptions.list, {}))
  return <ul>{data.map(s => <li key={s._id}>{s.source?.title}</li>)}</ul>
}`}
        </pre>
        <p className="text-muted-foreground text-xs">
          Live updates flow through Convex's subscription channel — no manual
          invalidation needed.
        </p>
      </section>
    </main>
  )
}
