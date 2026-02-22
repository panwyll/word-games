import { test, expect } from '@playwright/test';

test.describe('Connections Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/connections');
  });

  test('can select and deselect words', async ({ page }) => {
    const firstButton = page.locator('button').filter({ hasNotText: /shuffle|submit|deselect/i }).first();
    await firstButton.click();
    const buttonText = await firstButton.textContent();
    expect(buttonText).toBeTruthy();
    await firstButton.click();
  });

  test('submit button is disabled with fewer than 4 selections', async ({ page }) => {
    const submitButton = page.getByTestId('submit-guess');
    await expect(submitButton).toBeDisabled();
  });

  test('can select 4 words and submit', async ({ page }) => {
    const wordButtons = page.locator('button').filter({ hasNotText: /shuffle|submit|deselect/i });

    await wordButtons.nth(0).click();
    await wordButtons.nth(1).click();
    await wordButtons.nth(2).click();
    await wordButtons.nth(3).click();

    const submitButton = page.getByTestId('submit-guess');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await page.waitForTimeout(500);
  });

  test('shuffle button works', async ({ page }) => {
    const shuffleButton = page.getByText('Shuffle');
    await expect(shuffleButton).toBeVisible();
    await shuffleButton.click();
    await expect(page.getByRole('heading', { name: 'Connections' })).toBeVisible();
  });
});
