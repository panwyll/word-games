import { test, expect } from '@playwright/test';

test.describe('Spelling Bee Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spelling-bee');
  });

  test('shows hive cells', async ({ page }) => {
    const cells = page.locator('button[aria-label]').filter({ hasNotText: /delete|shuffle|enter/i });
    await expect(cells.first()).toBeVisible();
  });

  test('shows score', async ({ page }) => {
    await expect(page.getByText(/score:/i)).toBeVisible();
  });

  test('shows rank', async ({ page }) => {
    await expect(page.getByText(/beginner|moving up|good|solid|nice|great|amazing|queen bee/i)).toBeVisible();
  });

  test('can click letters to build word', async ({ page }) => {
    const cells = page.locator('button[aria-label]').filter({ hasNotText: /delete|shuffle|enter/i });
    if (await cells.count() > 0) {
      await cells.first().click();
      await cells.first().click();
      await cells.first().click();
      await cells.first().click();
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

  test('found words section exists', async ({ page }) => {
    await expect(page.getByText(/found words/i)).toBeVisible();
  });
});
