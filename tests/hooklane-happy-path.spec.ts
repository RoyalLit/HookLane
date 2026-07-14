import { test, expect } from '@playwright/test'

test.describe('Hooklane Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()))
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message))
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('guest can search artist, play quiz (skip all rounds), and view score', async ({ page }) => {
    // 1. Hero loads with wordmark
    await expect(page.locator('h1:has-text("HOOKLANE")').first()).toBeVisible()

    // 2. Search for artist
    const searchInput = page.locator('input[aria-label="Search artists"]')
    await searchInput.fill('Weeknd')
    await page.waitForTimeout(800)

    // 3. Results appear, select first
    const firstResult = page.locator('button:has-text("Weeknd")').first()
    await expect(firstResult).toBeVisible({ timeout: 10000 })
    await firstResult.click()

    // 4. Difficulty picker appears
    await expect(page.locator('text=Weeknd')).toBeVisible({ timeout: 5000 })

    // 5. Select Medium difficulty
    await page.locator('button:has-text("Medium")').click()

    // 6. Quiz loads
    await expect(page.locator('text=Loading')).toBeHidden({ timeout: 30000 })

    // 7. Quiz screen visible
    await expect(page.locator('[role="progressbar"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button[role="radio"]').first()).toBeVisible()

    // 8. Skip all 10 rounds quickly using the "I don't know" button
    for (let i = 0; i < 10; i++) {
      // Click skip button
      const skipBtn = page.locator('button:has-text("I don\'t know")')
      if (await skipBtn.isVisible()) {
        await skipBtn.click({ force: true })
      } else {
        // Fallback: answer first option
        await page.locator('button[role="radio"]').first().click({ force: true })
      }
      await page.waitForTimeout(300)

      // Click Next (or See Results on last round)
      const nextBtn = page.locator('button:has-text("Next"), button:has-text("See Results")').first()
      await nextBtn.click({ force: true })
      await page.waitForTimeout(300)
    }

    // 11. Score screen loads
    await expect(page.locator('text=SCORE HISTORY')).toBeVisible({ timeout: 10000 })

    // 12. Action buttons present
    await expect(page.locator('button:has-text("Play Again")')).toBeVisible()
    await expect(page.locator('button:has-text("New Artist")')).toBeVisible()

    // 13. Share modal opens
    await page.locator('button:has-text("Share Score")').click()
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    console.log('✅ Happy path complete (10 rounds skipped)')
  })
})