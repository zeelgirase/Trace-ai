import { test, expect } from '@playwright/test';

test.describe('Public navigation', () => {
  test('home route renders a non-empty page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('page has a title and visible primary content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/trace|audit|revenue/i);
    await expect(page.locator('main, [role="main"], body').first()).toBeVisible();
  });

  test('login entry point is reachable when provided', async ({ page }) => {
    await page.goto('/');
    const loginLink = page.getByRole('link', { name: /log in|sign in|client login/i }).first();
    if (!(await loginLink.count())) {
      test.skip(true, 'No public login link found on the home page.');
    }
    await loginLink.click();
    await expect(page).toHaveURL(/login/i);
  });
});
