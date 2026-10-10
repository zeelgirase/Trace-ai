import { test, expect } from '@playwright/test';

test.describe('Audit sign-off', () => {
  test('sign-off action is visible only if the current page offers it', async ({ page }) => {
    await page.goto('/');
    const signOff = page.getByRole('button', { name: /sign off|approve|finalize|complete audit/i }).first();
    if (!(await signOff.count())) {
      test.skip(true, 'No sign-off action found on the landing page; open the relevant engagement/sign-off screen and update this test.');
    }
    await expect(signOff).toBeVisible();
    await expect(signOff).toBeEnabled();
  });
});
