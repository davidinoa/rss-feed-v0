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
          <p className="island-kicker mb-2">Subscriptions</p>
          <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
            Your feeds
          </h1>
        </div>
        <Link
          to="/feeds/add"
          className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
        >
          + Add feed
        </Link>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {feeds.map((feed) => (
          <li
            key={feed.id}
            className="island-shell flex items-start justify-between gap-3 rounded-2xl p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="island-kicker mb-1 capitalize">{feed.category}</p>
              <h2 className="m-0 truncate text-base font-semibold text-[var(--sea-ink)]">
                {feed.title}
              </h2>
              <a
                href={feed.siteUrl}
                target="_blank"
                rel="noreferrer"
                className="block truncate text-xs text-[var(--sea-ink-soft)] no-underline hover:underline"
              >
                {feed.siteUrl}
              </a>
            </div>
            <span className="shrink-0 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--sea-ink)]">
              {feed.unread} new
            </span>
          </li>
        ))}
      </ul>

      <Outlet />
    </main>
  )
}
