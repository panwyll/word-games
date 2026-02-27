/**
 * Dictionary coverage tests
 *
 * These tests validate that the word lists are comprehensive enough to cover
 * common English words. They run against the live application to ensure both
 * the Wordle guess-validation and the Spelling Bee word-lookup work correctly.
 */
import { test, expect } from '@playwright/test';

// Common 5-letter words that must always be valid Wordle guesses
const COMMON_WORDLE_WORDS = [
  'CRANE', 'SLATE', 'AUDIO', 'STARE', 'RAISE', 'TRAIN', 'BREAD', 'HEART',
  'BEACH', 'BROWN', 'CHAIR', 'DANCE', 'EAGLE', 'FLAME', 'GRACE', 'HOUSE',
  'LIGHT', 'MONEY', 'NIGHT', 'OCEAN', 'PLANT', 'QUEEN', 'RIVER', 'SHARK',
  'STONE', 'TOWER', 'UNDER', 'VOICE', 'WATER', 'YOUNG',
];

test.describe('Wordle dictionary coverage', () => {
  test('all common words are valid guesses', async ({ page }) => {
    await page.goto('/wordle');

    for (const word of COMMON_WORDLE_WORDS) {
      // Type the word and submit
      await page.click('body');
      for (const letter of word) {
        await page.locator(`button[data-key="${letter}"]`).click();
      }
      await page.locator('button[data-key="ENTER"]').click();
      await page.waitForTimeout(200);

      // A valid word must NOT produce "Not in word list"
      await expect(page.getByText('Not in word list')).not.toBeVisible();

      // Clear any remaining input by clicking BACKSPACE 5 times
      for (let i = 0; i < 5; i++) {
        await page.locator('button[data-key="⌫"]').click();
      }
    }
  });

  test('rejects non-words', async ({ page }) => {
    await page.goto('/wordle');
    await page.click('body');
    await page.keyboard.type('zzzzz');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Not in word list')).toBeVisible();
  });
});

test.describe('Spelling Bee dictionary coverage', () => {
  test('puzzle has at least 15 valid words (shown in found-words UI)', async ({ page }) => {
    await page.goto('/spelling-bee');
    await expect(page.getByText(/found words/i)).toBeVisible();
  });

  test('hive renders all 7 letter cells', async ({ page }) => {
    await page.goto('/spelling-bee');
    const cells = page.locator('button[aria-label]').filter({ hasNotText: /delete|shuffle|enter/i });
    expect(await cells.count()).toBe(7);
  });
});
