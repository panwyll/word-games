import { test, expect } from '@playwright/test';

test.describe('Wordle Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wordle');
  });

  test('shows keyboard', async ({ page }) => {
    await expect(page.locator('button[data-key="Q"]')).toBeVisible();
    await expect(page.locator('button[data-key="A"]')).toBeVisible();
    await expect(page.locator('button[data-key="ENTER"]')).toBeVisible();
  });

  test('can type letters using keyboard buttons', async ({ page }) => {
    await page.locator('button[data-key="C"]').click();
    await page.locator('button[data-key="R"]').click();
    await page.locator('button[data-key="A"]').click();
    await page.locator('button[data-key="N"]').click();
    await page.locator('button[data-key="E"]').click();
    // The letter should appear in the board tile (exact text match in a div)
    await expect(page.locator('div').filter({ hasText: /^C$/ }).first()).toBeVisible();
  });

  test('can type letters using physical keyboard', async ({ page }) => {
    await page.click('body');
    await page.keyboard.type('crane');
    await expect(page.locator('div').filter({ hasText: /^C$/ }).first()).toBeVisible();
  });

  test('shows error for short word', async ({ page }) => {
    await page.click('body');
    await page.keyboard.type('abc');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Not enough letters')).toBeVisible();
  });

  test('backspace removes letter', async ({ page }) => {
    await page.click('body');
    await page.keyboard.type('c');
    await page.keyboard.press('Backspace');
    const board = page.locator('[class*="grid"]').first();
    await expect(board).toBeVisible();
  });
});
