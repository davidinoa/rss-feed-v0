import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

const FEATURES: Array<[string, string]> = [
  [
    'Unified timeline',
    'Articles from every subscription, sorted newest first.',
  ],
  [
    'Category folders',
    'Group feeds by engineering, news, design, or anything you like.',
  ],
  ['Type-safe routing', 'TanStack Router keeps every link and loader in sync.'],
  [
    'Edge-hosted',
    'Cloudflare Workers handles SSR and feed sync, close to your readers.',
  ],
]

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">
          An RSS reader, built on TanStack Start
        </p>
        <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
          Subscribe. Sort. Read on your own terms.
        </h1>
        <p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
          Add blogs and news sources, drop them into categories, and skim a
          single timeline. This starter wires up TanStack Start, Router, Query,
          Form, Clerk, and Cloudflare so you can focus on the reader itself.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/timeline"
            className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
          >
            Open timeline
          </Link>
          <Link
            to="/feeds/add"
            className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
          >
            Subscribe to a feed
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(([title, desc], index) => (
          <article
            key={title}
            className="island-shell feature-card rise-in rounded-2xl p-5"
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <h2 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
              {title}
            </h2>
            <p className="m-0 text-sm text-[var(--sea-ink-soft)]">{desc}</p>
          </article>
        ))}
      </section>

      <section className="island-shell mt-8 rounded-2xl p-6">
        <p className="island-kicker mb-2">What's wired</p>
        <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
          <li>
            <code>/timeline</code> — TanStack Query loads articles via the route
            loader and hydrates on the client.
          </li>
          <li>
            <code>/feeds</code> — Suspense query lists subscriptions.
          </li>
          <li>
            <code>/feeds/add</code> — TanStack Form handles validation and
            submission.
          </li>
          <li>
            <code>/demo/clerk</code> — Clerk's prebuilt sign-in flow.
          </li>
        </ul>
      </section>
    </main>
  )
}
