import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/timeline')({ component: Timeline })

// Placeholder until the Article ingestion + read-state model lands in the
// Timeline feature. The Articles table was structurally wrong post-split
// (see ADR-0005) and was dropped as part of slice #55. The Timeline feature
// will rebuild it with shared Articles + per-Subscription read state.
function Timeline() {
  return (
    <main className="page-wrap px-4 py-10">
      <header className="mb-6">
        <p className="text-muted-foreground mb-2 text-xs font-bold uppercase tracking-widest">
          Unified timeline
        </p>
        <h1 className="text-foreground text-3xl font-bold sm:text-4xl">
          Coming up next
        </h1>
      </header>
      <section className="border-border bg-card max-w-2xl rounded-2xl border p-6 shadow-sm">
        <p className="text-muted-foreground text-sm">
          The unified timeline arrives once Article ingestion is wired up. In
          the meantime, your subscriptions are already collecting.
        </p>
        <Link
          to="/subscriptions"
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold no-underline transition"
        >
          Manage subscriptions
        </Link>
      </section>
    </main>
  )
}
