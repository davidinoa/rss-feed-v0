import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { listTimeline } from '../lib/feeds'

const timelineQueryOptions = queryOptions({
  queryKey: ['timeline'],
  queryFn: listTimeline,
})

export const Route = createFileRoute('/timeline')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(timelineQueryOptions),
  component: Timeline,
})

const RTF = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

function relativeTime(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  if (Math.abs(diffHours) < 24) return RTF.format(diffHours, 'hour')
  return RTF.format(Math.round(diffHours / 24), 'day')
}

function Timeline() {
  const { data: articles } = useSuspenseQuery(timelineQueryOptions)

  return (
    <main className="page-wrap px-4 py-10">
      <header className="mb-8">
        <p className="island-kicker mb-2">Unified timeline</p>
        <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
          Latest from your subscriptions
        </h1>
      </header>

      <ol className="space-y-3">
        {articles.map((a) => (
          <li
            key={a.id}
            className="island-shell rounded-2xl p-5 transition hover:-translate-y-0.5"
          >
            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-[var(--sea-ink)]">
                {a.feedTitle}
              </span>
              <time
                dateTime={a.publishedAt}
                className="text-[var(--sea-ink-soft)]"
              >
                {relativeTime(a.publishedAt)}
              </time>
            </div>
            <a
              href={a.url}
              target="_blank"
              rel="noreferrer"
              className="block text-base font-semibold text-[var(--sea-ink)] no-underline hover:underline"
            >
              {a.title}
            </a>
            <p className="m-0 mt-1.5 text-sm text-[var(--sea-ink-soft)]">
              {a.excerpt}
            </p>
          </li>
        ))}
      </ol>
    </main>
  )
}
