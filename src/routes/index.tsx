import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

const FEATURES: Array<[string, string]> = [
  [
    'Unified timeline',
    'Articles from every subscription, sorted newest first.',
  ],
  [
    'Categories',
    'Bucket your subscriptions into the labels that make sense to you.',
  ],
  ['Type-safe routing', 'TanStack Router keeps every link and loader in sync.'],
  [
    'Edge-hosted',
    'Cloudflare Workers handles SSR and source polling, close to your readers.',
  ],
]

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="border-border bg-card relative overflow-hidden rounded-[2rem] border px-6 py-10 shadow-sm sm:px-10 sm:py-14">
        <p className="text-muted-foreground mb-3 text-xs font-bold uppercase tracking-widest">
          An RSS reader, built on TanStack Start
        </p>
        <h1 className="text-foreground mb-5 max-w-3xl text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
          Subscribe. Sort. Read on your own terms.
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl text-base sm:text-lg">
          Add blogs and news sources, drop them into categories, and skim a
          single timeline. This starter wires up TanStack Start, Router, Query,
          Form, Clerk, and Cloudflare so you can focus on the reader itself.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/timeline"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2.5 text-sm font-semibold no-underline transition"
          >
            Open timeline
          </Link>
          <Link
            to="/subscriptions/add"
            className="border-border bg-card text-foreground hover:bg-accent rounded-full border px-5 py-2.5 text-sm font-semibold no-underline transition"
          >
            Add a subscription
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(([title, desc]) => (
          <article
            key={title}
            className="border-border bg-card rounded-2xl border p-5 shadow-sm"
          >
            <h2 className="text-foreground mb-2 text-base font-semibold">
              {title}
            </h2>
            <p className="text-muted-foreground m-0 text-sm">{desc}</p>
          </article>
        ))}
      </section>

      <section className="border-border bg-card mt-8 rounded-2xl border p-6 shadow-sm">
        <p className="text-muted-foreground mb-2 text-xs font-bold uppercase tracking-widest">
          What's wired
        </p>
        <ul className="text-muted-foreground m-0 list-disc space-y-2 pl-5 text-sm">
          <li>
            <code>/timeline</code> — placeholder until Article ingestion lands.
          </li>
          <li>
            <code>/subscriptions</code> — Suspense query lists your follows of
            each Source, scoped to your auth identity.
          </li>
          <li>
            <code>/subscriptions/add</code> — TanStack Form + Zod validate the
            URL on the client, then a Convex action fetches and parses the feed
            before any row is written.
          </li>
          <li>
            <code>/demo/clerk</code> — Clerk's prebuilt sign-in flow.
          </li>
        </ul>
      </section>
    </main>
  )
}
