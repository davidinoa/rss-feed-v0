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
        <p className="text-muted-foreground mb-2 text-xs font-bold uppercase tracking-widest">
          Unified timeline
        </p>
        <h1 className="text-foreground text-3xl font-bold sm:text-4xl">
          Latest from your subscriptions
        </h1>
      </header>

      <ol className="space-y-3">
        {articles.map((a) => (
          <li
            key={a.id}
            className="border-border bg-card rounded-2xl border p-5 shadow-sm transition"
          >
            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
              <span className="text-foreground font-semibold">
                {a.feedTitle}
              </span>
              <time
                dateTime={a.publishedAt}
                className="text-muted-foreground"
              >
                {relativeTime(a.publishedAt)}
              </time>
            </div>
            <a
              href={a.url}
              target="_blank"
              rel="noreferrer"
              className="text-foreground block text-base font-semibold no-underline hover:underline"
            >
              {a.title}
            </a>
            <p className="text-muted-foreground m-0 mt-1.5 text-sm">
              {a.excerpt}
            </p>
          </li>
        ))}
      </ol>
    </main>
  )
}
