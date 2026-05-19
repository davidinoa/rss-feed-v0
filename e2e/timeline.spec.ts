import { expect, test } from '@playwright/test'

test('home page renders the hero', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', {
      name: /subscribe\. sort\. read on your own terms\./i,
    }),
  ).toBeVisible()
})

test('timeline shows the placeholder until Article ingestion lands', async ({
  page,
}) => {
  await page.goto('/timeline')
  await expect(
    page.getByRole('heading', { name: /coming up next/i }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: /manage subscriptions/i }),
  ).toBeVisible()
})

test('subscriptions page links to the add flow', async ({ page }) => {
  await page.goto('/subscriptions')
  const addSubscriptionLink = page.getByRole('link', {
    name: /\+ add subscription/i,
  })
  await expect(addSubscriptionLink).toBeVisible({ timeout: 15_000 })
  await addSubscriptionLink.click()
  await expect(page).toHaveURL(/\/subscriptions\/add$/)
  await expect(
    page.getByRole('heading', { name: /add a subscription/i }),
  ).toBeVisible()
})

test('subscriptions page shows a secondary state when there is nothing to read', async ({
  page,
}) => {
  // The exact copy depends on whether VITE_CONVEX_URL is wired up:
  //   - configured: empty-state ("You haven't subscribed to anything yet.")
  //   - unconfigured (e.g. CI without Convex): fallback notice
  //     ("Backend not configured. Run pnpm convex:dev…")
  // The shell renders one of the two — asserting either catches a regression
  // that removes both.
  await page.goto('/subscriptions')
  await expect(
    page.getByText(/(haven['’]t subscribed|backend not configured)/i),
  ).toBeVisible({ timeout: 15_000 })
})

test('header nav points at subscriptions, not feeds', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation')
  await expect(
    nav.getByRole('link', { name: /^subscriptions$/i }),
  ).toBeVisible()
  await expect(nav.getByRole('link', { name: /^feeds$/i })).toHaveCount(0)
})

test('Sonner toast region is mounted at the app root', async ({ page }) => {
  await page.goto('/')
  // Sonner mounts a single live region for toast announcements; absence here
  // means the Toaster was dropped from __root.tsx and success/error toasts
  // would silently no-op.
  await expect(
    page.getByRole('region', { name: /notifications/i }),
  ).toBeAttached()
})

// Passes locally but reliably fails on GitHub Actions ubuntu-latest —
// see #9 for diagnosis and fix candidates. Doubly blocked in CI right now
// because the form is replaced by the "Backend not configured" notice when
// VITE_CONVEX_URL is missing.
test.fixme('add subscription form validates the URL field', async ({
  page,
}) => {
  await page.goto('/subscriptions/add')
  const urlInput = page.getByRole('textbox', { name: /^url$/i })
  await urlInput.fill('not-a-url')
  await urlInput.blur()
  await expect(page.getByRole('alert')).toContainText(/doesn’t look/i)
  await expect(page.getByRole('button', { name: /subscribe/i })).toBeDisabled()
})
