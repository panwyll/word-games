import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Word Games/);
    await expect(page.getByRole('heading', { name: 'Word Games' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Wordle/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Connections/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Spelling Bee/ }).first()).toBeVisible();
  });

  test('wordle page loads', async ({ page }) => {
    await page.goto('/wordle');
    await expect(page.getByRole('heading', { name: 'Wordle' })).toBeVisible();
  });

  test('connections page loads', async ({ page }) => {
    await page.goto('/connections');
    await expect(page.getByRole('heading', { name: 'Connections' })).toBeVisible();
  });

  test('spelling bee page loads', async ({ page }) => {
    await page.goto('/spelling-bee');
    await expect(page.getByRole('heading', { name: /Spelling Bee/i })).toBeVisible();
  });
});
