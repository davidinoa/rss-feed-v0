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

// Passes locally but reliably fails on GitHub Actions ubuntu-latest —
// see #9 for diagnosis and fix candidates.
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
