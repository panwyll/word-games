import { test, expect } from '@playwright/test';

test.describe('Auth Pages', () => {
  test('signup page loads', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByRole('heading', { name: /pricing/i })).toBeVisible();
    await expect(page.getByText('$4.99')).toBeVisible();
    await expect(page.getByText(/Upgrade to Premium/)).toBeVisible();
  });

  test('/account redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/account');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login shows error for wrong credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText(/Invalid email or password/i)).toBeVisible({ timeout: 5000 });
  });

  test('signup validates password length', async ({ page }) => {
    await page.goto('/signup');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('short');
    await page.getByRole('button', { name: 'Create account' }).click();
    // HTML5 validation or our error
    const pwInput = page.getByLabel('Password');
    const validity = await pwInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);
  });
});

test.describe('Premium Gate', () => {
  test('wordle archive shows premium gate for unauthenticated users', async ({ page }) => {
    await page.goto('/wordle/archive');
    await expect(page.getByText(/Premium Feature/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('link', { name: /Upgrade to Premium/i })).toBeVisible();
  });

  test('connections archive shows premium gate for unauthenticated users', async ({ page }) => {
    await page.goto('/connections/archive');
    await expect(page.getByText(/Premium Feature/i)).toBeVisible({ timeout: 5000 });
  });

  test('spelling bee archive shows premium gate for unauthenticated users', async ({ page }) => {
    await page.goto('/spelling-bee/archive');
    await expect(page.getByText(/Premium Feature/i)).toBeVisible({ timeout: 5000 });
  });
});
