import { test, expect } from '@playwright/test';

test.describe('Letter Boxed Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/letter-boxed');
  });

  test('shows letter box with letters', async ({ page }) => {
    const letters = page.locator('button[aria-label^="Letter"]');
    await expect(letters.first()).toBeVisible();
    const count = await letters.count();
    expect(count).toBe(12); // Should have 12 letters (3 per side × 4 sides)
  });

  test('shows progress indicator', async ({ page }) => {
    await expect(page.getByText(/letters: \d+ \/ \d+/i)).toBeVisible();
    await expect(page.getByText(/words: \d+/i)).toBeVisible();
  });

  test('can click letters to build word', async ({ page }) => {
    const letters = page.locator('button[aria-label^="Letter"]');
    if (await letters.count() > 0) {
      await letters.first().click();
      await letters.nth(4).click(); // Click a letter from a different side
      await letters.nth(8).click();
    }
    await expect(page.locator('.animate-pulse')).toBeVisible();
  });

  test('enter button is visible', async ({ page }) => {
    await expect(page.getByTestId('enter-word')).toBeVisible();
  });

  test('can type with physical keyboard', async ({ page }) => {
    await page.keyboard.type('test');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
  });

  test('shows your words section', async ({ page }) => {
    await expect(page.getByText(/your words/i)).toBeVisible();
  });

  test('shows remaining letters section', async ({ page }) => {
    await expect(page.getByText(/remaining letters/i)).toBeVisible();
  });

  test('has delete and clear buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /delete/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /clear/i })).toBeVisible();
  });

  test('shows game title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /letter boxed/i })).toBeVisible();
    await expect(page.getByText(/connect letters/i)).toBeVisible();
  });

  test('has archive link', async ({ page }) => {
    await expect(page.getByRole('link', { name: /archive/i })).toBeVisible();
  });
});
