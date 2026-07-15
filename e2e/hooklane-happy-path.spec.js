import { test, expect } from '@playwright/test';

test('Hooklane happy path: select artist, answer question, finish quiz', async ({ page }) => {
  // 1. Go to the home page
  await page.goto('/');

  // 2. See the hero and start playing
  const searchInput = page.getByPlaceholder('Search any artist...');
  await expect(searchInput).toBeVisible();
  
  // Search for an artist (e.g., Drake)
  await searchInput.fill('Drake');
  
  // Wait for the dropdown results and click the first one
  const searchResult = page.locator('button').filter({ hasText: 'Drake' }).first();
  await expect(searchResult).toBeVisible({ timeout: 15000 });
  await searchResult.click();

  // 3. Select difficulty
  const mediumDifficulty = page.locator('button').filter({ hasText: 'Medium' }).first();
  await expect(mediumDifficulty).toBeVisible();
  await mediumDifficulty.click();

  // 4. Wait for quiz screen
  // The header should contain Drake
  await expect(page.locator('h1').filter({ hasText: 'Drake' })).toBeVisible({ timeout: 20000 }); // Quiz loading might take a bit

  // Play 10 rounds to finish the quiz quickly
  for (let i = 0; i < 10; i++) {
    // Click skip
    const skipButton = page.locator('button').filter({ hasText: 'Skip' });
    await expect(skipButton).toBeVisible();
    await skipButton.click();

    // Click next
    const nextButton = page.locator('button', { hasText: /^Next$|^See Results$/ });
    await expect(nextButton).toBeVisible();
    await nextButton.click();
  }

  // 5. Arrive at Score Screen
  const playAgain = page.locator('button').filter({ hasText: 'Play Again' });
  await expect(playAgain).toBeVisible({ timeout: 15000 });
});
