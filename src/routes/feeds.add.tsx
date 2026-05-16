import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/feeds/add')({
  component: AddFeed,
})

type Category = 'engineering' | 'news' | 'design' | 'science'

interface AddFeedValues {
  url: string
  title: string
  category: Category
}

function validateUrl({ value }: { value: string }) {
  if (!value) return 'Feed URL is required'
  try {
    new URL(value)
  } catch {
    return 'Must be a valid URL'
  }
  return undefined
}

function AddFeed() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState<AddFeedValues | null>(null)

  const form = useForm({
    defaultValues: {
      url: '',
      title: '',
      category: 'engineering' as Category,
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 300))
      setSubmitted(value)
    },
  })

  if (submitted) {
    return (
      <section className="border-border bg-card mt-8 rounded-2xl border p-6 shadow-sm">
        <p className="text-muted-foreground mb-2 text-xs font-bold uppercase tracking-widest">
          Subscribed
        </p>
        <h2 className="text-foreground mb-2 text-xl font-semibold">
          {submitted.title || submitted.url}
        </h2>
        <p className="text-muted-foreground m-0 text-sm">
          Category: <span className="capitalize">{submitted.category}</span>
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setSubmitted(null)
              form.reset()
            }}
            className="border-border bg-card text-foreground hover:bg-accent rounded-full border px-4 py-2 text-sm font-semibold transition"
          >
            Add another
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: '/feeds' })}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 py-2 text-sm font-semibold transition"
          >
            Back to feeds
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="border-border bg-card mt-8 rounded-2xl border p-6 shadow-sm">
      <p className="text-muted-foreground mb-2 text-xs font-bold uppercase tracking-widest">
        Subscribe
      </p>
      <h2 className="text-foreground mb-1 text-xl font-semibold">Add a feed</h2>
      <p className="text-muted-foreground mb-6 text-sm">
        Paste an RSS or Atom URL. We'll fetch it on the next sync.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.Field
          name="url"
          validators={{
            onChange: validateUrl,
            onBlur: validateUrl,
          }}
        >
          {(field) => {
            const errorMessage = field.state.meta.errors
              .map((e) =>
                typeof e === 'string'
                  ? e
                  : ((e as { message?: string })?.message ?? ''),
              )
              .filter(Boolean)
              .join(', ')
            const errorId = 'url-error'
            return (
              <div>
                <label htmlFor={field.name} className="block">
                  <span className="text-foreground mb-1 block text-sm font-semibold">
                    Feed URL
                  </span>
                </label>
                <input
                  id={field.name}
                  type="text"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://example.com/feed.xml"
                  aria-invalid={!field.state.meta.isValid || undefined}
                  aria-describedby={
                    !field.state.meta.isValid ? errorId : undefined
                  }
                  className="border-input text-foreground focus:border-primary w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
                />
                {!field.state.meta.isValid && errorMessage && (
                  <p
                    id={errorId}
                    role="alert"
                    className="text-destructive mt-1 text-xs"
                  >
                    {errorMessage}
                  </p>
                )}
              </div>
            )
          }}
        </form.Field>

        <form.Field name="title">
          {(field) => (
            <label className="block">
              <span className="text-foreground mb-1 block text-sm font-semibold">
                Display title{' '}
                <span className="text-muted-foreground">(optional)</span>
              </span>
              <input
                type="text"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Auto-detected if blank"
                className="border-input text-foreground focus:border-primary w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
              />
            </label>
          )}
        </form.Field>

        <form.Field name="category">
          {(field) => (
            <label className="block">
              <span className="text-foreground mb-1 block text-sm font-semibold">
                Category
              </span>
              <select
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value as Category)}
                className="border-input text-foreground focus:border-primary w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
              >
                <option value="engineering">Engineering</option>
                <option value="news">News</option>
                <option value="design">Design</option>
                <option value="science">Science</option>
              </select>
            </label>
          )}
        </form.Field>

        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={!canSubmit}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50"
              >
                {isSubmitting ? 'Subscribing…' : 'Subscribe'}
              </button>
              <Link
                to="/feeds"
                className="border-border bg-card text-foreground hover:bg-accent rounded-full border px-5 py-2.5 text-sm font-semibold no-underline transition"
              >
                Cancel
              </Link>
            </div>
          )}
        </form.Subscribe>
      </form>
    </section>
  )
}
