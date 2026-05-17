import { expect, test } from '@playwright/test'

async function getRootClassList(page: import('@playwright/test').Page) {
  return page.locator('html').evaluate((el) => [...el.classList])
}

test.describe('theme toggle', () => {
  test('initial paint resolves auto mode against light system preference', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const classList = await getRootClassList(page)
    expect(classList).toContain('light')
    expect(classList).not.toContain('dark')
  })

  test('initial paint resolves auto mode against dark system preference', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const classList = await getRootClassList(page)
    expect(classList).toContain('dark')
    expect(classList).not.toContain('light')
  })

  test('toggle cycles auto -> light -> dark -> auto', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/', { waitUntil: 'load' })

    const toggle = page.getByRole('button', { name: /theme mode/i })

    // The toggle's onClick only fires after React hydration. The localStorage
    // write inside applyTheme is the earliest observable hydration signal — the
    // SSR'd HTML doesn't have any 'theme' key set.
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('theme')))
      .toBe('auto')

    await expect(toggle).toHaveText('Auto')
    expect(await getRootClassList(page)).toContain('dark')

    await toggle.click()
    await expect(toggle).toHaveText('Light')
    expect(await getRootClassList(page)).toContain('light')
    expect(await getRootClassList(page)).not.toContain('dark')

    await toggle.click()
    await expect(toggle).toHaveText('Dark')
    expect(await getRootClassList(page)).toContain('dark')
    expect(await getRootClassList(page)).not.toContain('light')

    await toggle.click()
    await expect(toggle).toHaveText('Auto')
    expect(await getRootClassList(page)).toContain('dark')
  })

  test('dark mode persists across reload without a light-mode flash', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await page.evaluate(() => window.localStorage.setItem('theme', 'dark'))
    await page.reload({ waitUntil: 'domcontentloaded' })

    const classList = await getRootClassList(page)
    expect(classList).toContain('dark')
    expect(classList).not.toContain('light')
  })
})
