import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Show } from '@clerk/react'
import { useForm } from '@tanstack/react-form'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAction } from 'convex/react'
import { toast } from 'sonner'
import { z } from 'zod'

import { api } from '../../convex/_generated/api'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { SignedOutNotice } from '../components/states/signed-out-notice'
import { SignInAction } from '../integrations/clerk/sign-in-action'

export const Route = createFileRoute('/subscriptions/add')({
  component: AddSubscription,
})

const urlSchema = z
  .string()
  .min(1, 'Paste an RSS or Atom URL.')
  .url('That doesn’t look like a URL.')

function AddSubscription() {
  return (
    <section className="border-border bg-card mt-8 rounded-2xl border p-6 shadow-sm">
      <p className="text-muted-foreground mb-2 text-xs font-bold uppercase tracking-widest">
        Subscribe
      </p>
      <h2 className="text-foreground mb-1 text-xl font-semibold">
        Add a subscription
      </h2>
      <p className="text-muted-foreground mb-6 text-sm">
        Paste an RSS or Atom URL. We'll fetch it once now to validate, then
        again later on the polling schedule.
      </p>

      <Show when="signed-in">
        <AddSubscriptionForm />
      </Show>
      <Show when="signed-out">
        <SignedOutNotice action={<SignInAction />}>
          Sign in to add subscriptions to your library.
        </SignedOutNotice>
      </Show>
    </section>
  )
}

function AddSubscriptionForm() {
  const navigate = useNavigate()
  const addByUrl = useAction(api.sources.addByUrl)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { url: '' },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      try {
        await addByUrl({ url: value.url })
        toast.success('Subscribed')
        // Sonner mounts the toast via setTimeout(0) + flushSync, then sets
        // `data-mounted=true` in a follow-up useEffect. If we navigate
        // synchronously the route transition wins the race and the toast
        // never enters its visible state. Yield one animation frame so the
        // mount effect commits before the route changes.
        await new Promise((resolve) =>
          requestAnimationFrame(() => resolve(null)),
        )
        navigate({ to: '/subscriptions' })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Could not subscribe.'
        setSubmitError(message)
        toast.error(message)
      }
    },
  })

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    form.handleSubmit()
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <form.Field
        name="url"
        validators={{ onChange: urlSchema, onBlur: urlSchema }}
      >
        {(field) => {
          function handleUrlChange(event: ChangeEvent<HTMLInputElement>) {
            field.handleChange(event.target.value)
          }
          const errorId = 'url-error'
          const firstError = field.state.meta.errors[0]
          const errorMessage =
            typeof firstError === 'string'
              ? firstError
              : (firstError as { message?: string } | undefined)?.message
          const hasError = !field.state.meta.isValid && Boolean(errorMessage)
          return (
            <div className="space-y-1">
              <Label htmlFor={field.name}>URL</Label>
              <Input
                id={field.name}
                name={field.name}
                type="url"
                inputMode="url"
                autoComplete="off"
                placeholder="https://example.com/feed.xml"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={handleUrlChange}
                aria-invalid={hasError || undefined}
                aria-describedby={hasError ? errorId : undefined}
              />
              {hasError && (
                <p
                  id={errorId}
                  role="alert"
                  className="text-destructive text-xs"
                >
                  {errorMessage}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>

      {submitError && (
        <p role="alert" className="text-destructive text-xs">
          {submitError}
        </p>
      )}

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50"
            >
              {isSubmitting ? 'Subscribing…' : 'Subscribe'}
            </button>
            <Link
              to="/subscriptions"
              className="border-border bg-card text-foreground hover:bg-accent rounded-full border px-5 py-2.5 text-sm font-semibold no-underline transition"
            >
              Cancel
            </Link>
          </div>
        )}
      </form.Subscribe>
    </form>
  )
}
