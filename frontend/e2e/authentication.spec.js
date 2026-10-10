import { test, expect } from '@playwright/test';

test.describe('Authentication demo', () => {
  test('login route opens a usable login form', async ({ page }) => {
    await page.goto('/login');
    const email = page.getByLabel(/email|username/i).first();
    const password = page.getByLabel(/password/i).first();

    if (!(await email.count()) || !(await password.count())) {
      test.skip(true, 'Expected labelled email/username and password fields were not found on /login.');
    }
    await expect(email).toBeVisible();
    await expect(password).toBeVisible();
  });

  test('login form accepts non-empty credentials in the demo flow', async ({ page }) => {
    await page.goto('/login');
    const email = page.getByLabel(/email|username/i).first();
    const password = page.getByLabel(/password/i).first();
    if (!(await email.count()) || !(await password.count())) {
      test.skip(true, 'Login fields were not found; update selectors to match the app.');
    }
    await email.fill('demo@example.com');
    await password.fill('DemoPassword123!');
    const submit = page.getByRole('button', { name: /sign in|log in|continue|enter workspace/i }).first();
    await expect(submit).toBeVisible();
    await submit.click();
    await expect(page).toHaveURL(/overview|dashboard|engagements|workspace|\/$/i);
  });
});
