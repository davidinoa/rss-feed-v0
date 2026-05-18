import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="border-border bg-card rounded-2xl border p-6 shadow-sm sm:p-8">
        <p className="text-muted-foreground mb-2 text-xs font-bold uppercase tracking-widest">
          About
        </p>
        <h1 className="text-foreground mb-3 text-4xl font-bold sm:text-5xl">
          A reader you can shape to your habits.
        </h1>
        <p className="text-muted-foreground text-body-m mb-4 max-w-3xl">
          rss-feed-v0 is a starter for building a personal RSS reader. The
          subscriptions, categories, and timeline you see are stand-ins for your
          own data model — swap the mock <code>src/lib/feeds.ts</code> out for a
          real feed fetcher, persist subscriptions to your preferred store, and
          ship to Cloudflare Workers when you're ready.
        </p>
        <ul className="text-muted-foreground m-0 list-disc space-y-2 pl-5 text-sm">
          <li>TanStack Start handles SSR and server functions.</li>
          <li>TanStack Router gives you type-safe routes and loaders.</li>
          <li>TanStack Query manages fetching, caching, and hydration.</li>
          <li>TanStack Form covers validation for subscription flows.</li>
          <li>Clerk drops in authentication when you need accounts.</li>
          <li>
            TanStack Intent lets packages you depend on ship agent skills your
            IDE picks up automatically.
          </li>
        </ul>
      </section>
    </main>
  )
}
