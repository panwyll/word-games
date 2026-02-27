import { test, expect } from '@playwright/test';

test.describe('Letter Boxed Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/letter-boxed');
  });

  test('shows the box with letters', async ({ page }) => {
    // Check that letter buttons are visible
    await expect(page.locator('button').filter({ hasText: /^[A-Z]$/ }).first()).toBeVisible();
  });

  test('can click letters to form a word', async ({ page }) => {
    // Click some letters to form a word
    const firstLetter = await page.locator('button').filter({ hasText: /^[A-Z]$/ }).first();
    await firstLetter.click();
    
    // Check that the letter appears in the center display
    const text = await firstLetter.textContent();
    await expect(page.locator('div').filter({ hasText: new RegExp(`^${text}$`) })).toBeVisible();
  });

  test('shows Delete and Enter buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Delete/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Enter/i })).toBeVisible();
  });

  test('Delete button is disabled when no letters typed', async ({ page }) => {
    const deleteButton = page.getByRole('button', { name: /Delete/i });
    await expect(deleteButton).toBeDisabled();
  });

  test('Enter button is disabled when word is too short', async ({ page }) => {
    const enterButton = page.getByRole('button', { name: /Enter/i });
    await expect(enterButton).toBeDisabled();
  });

  test('shows progress indicator', async ({ page }) => {
    await expect(page.getByText(/Letters used:/i)).toBeVisible();
  });

  test('shows game rules', async ({ page }) => {
    await expect(page.getByText(/Words must be at least 4 letters/i)).toBeVisible();
    await expect(page.getByText(/Each word must start with the last letter/i)).toBeVisible();
    await expect(page.getByText(/Cannot use consecutive letters from the same side/i)).toBeVisible();
  });
});
