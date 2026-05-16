import { queryOptions } from '@tanstack/react-query'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { listFeeds } from '../lib/feeds'

const feedsQueryOptions = queryOptions({
  queryKey: ['feeds'],
  queryFn: listFeeds,
})

export const Route = createFileRoute('/feeds')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(feedsQueryOptions),
  component: FeedsLayout,
})

function FeedsLayout() {
  const { data: feeds } = useSuspenseQuery(feedsQueryOptions)

  return (
    <main className="page-wrap px-4 py-10">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-muted-foreground mb-2 text-xs font-bold uppercase tracking-widest">
            Subscriptions
          </p>
          <h1 className="text-foreground text-3xl font-bold sm:text-4xl">
            Your feeds
          </h1>
        </div>
        <Link
          to="/feeds/add"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2.5 text-sm font-semibold no-underline transition"
        >
          + Add feed
        </Link>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {feeds.map((feed) => (
          <li
            key={feed.id}
            className="border-border bg-card flex items-start justify-between gap-3 rounded-2xl border p-4 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground mb-1 text-xs font-bold uppercase tracking-widest capitalize">
                {feed.category}
              </p>
              <h2 className="text-foreground m-0 truncate text-base font-semibold">
                {feed.title}
              </h2>
              <a
                href={feed.siteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground block truncate text-xs no-underline hover:underline"
              >
                {feed.siteUrl}
              </a>
            </div>
            <span className="border-border bg-secondary text-foreground shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold">
              {feed.unread} new
            </span>
          </li>
        ))}
      </ul>

      <Outlet />
    </main>
  )
}
