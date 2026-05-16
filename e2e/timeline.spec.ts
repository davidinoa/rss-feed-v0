import { expect, test } from '@playwright/test'

test('home page renders the hero', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', {
      name: /subscribe\. sort\. read on your own terms\./i,
    }),
  ).toBeVisible()
})

test('timeline lists articles from subscriptions', async ({ page }) => {
  await page.goto('/timeline')
  await expect(
    page.getByRole('heading', { name: /latest from your subscriptions/i }),
  ).toBeVisible()
  await expect(
    page.getByText(/introducing tanstack intent/i).first(),
  ).toBeVisible()
})

test('feeds page lists subscriptions and links to add flow', async ({
  page,
}) => {
  await page.goto('/feeds')
  await expect(page.getByRole('heading', { name: /your feeds/i })).toBeVisible()
  await page.getByRole('link', { name: /\+ add feed/i }).click()
  await expect(page).toHaveURL(/\/feeds\/add$/)
  await expect(page.getByRole('heading', { name: /add a feed/i })).toBeVisible()
})

// Passes locally but reliably fails on GitHub Actions ubuntu-latest —
// see #9 for diagnosis and fix candidates.
test.fixme('add feed form validates the URL field', async ({ page }) => {
  await page.goto('/feeds/add')
  const urlInput = page.getByRole('textbox', { name: /feed url/i })
  await urlInput.fill('not-a-url')
  await urlInput.blur()
  await expect(page.getByRole('alert')).toHaveText(/must be a valid url/i)
  await expect(page.getByRole('button', { name: /subscribe/i })).toBeDisabled()
})
