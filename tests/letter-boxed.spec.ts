import { test, expect } from '@playwright/test';

test.describe('Letter Boxed Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/letter-boxed');
  });

  test('shows letter box with 12 letters', async ({ page }) => {
    const letterButtons = page.locator('button').filter({ hasNotText: /delete|clear|submit|undo/i });
    const count = await letterButtons.count();
    expect(count).toBeGreaterThanOrEqual(12);
  });

  test('shows progress indicator', async ({ page }) => {
    await expect(page.getByText(/\d+ \/ 12 letters/i)).toBeVisible();
  });

  test('shows word count', async ({ page }) => {
    await expect(page.getByText(/\d+ words?/i)).toBeVisible();
  });

  test('shows instructions', async ({ page }) => {
    await expect(page.getByText(/form a word chain/i)).toBeVisible();
    await expect(page.getByText(/no consecutive letters/i)).toBeVisible();
  });

  test('can type with physical keyboard', async ({ page }) => {
    // Type a 3-letter word
    await page.keyboard.type('MAP');
    // Check that something appears in the input area
    const inputArea = page.locator('text=/[A-Z]{3,}/').first();
    await expect(inputArea).toBeVisible();
  });

  test('submit button is visible', async ({ page }) => {
    await expect(page.getByTestId('submit-word')).toBeVisible();
  });

  test('can clear input', async ({ page }) => {
    await page.keyboard.type('TEST');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.getByText('Type or click letters')).toBeVisible();
  });

  test('shows remaining letters', async ({ page }) => {
    await expect(page.getByText(/remaining:/i)).toBeVisible();
  });

  test('can press enter to submit', async ({ page }) => {
    await page.keyboard.type('MAP');
    await page.keyboard.press('Enter');
    // Wait for feedback message to appear (either "Not in word list" or success message)
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 2000 });
  });

  test('archive link is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /archive/i })).toBeVisible();
  });

  test('shows game title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /letter boxed/i })).toBeVisible();
  });
});
