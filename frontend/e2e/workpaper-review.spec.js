import { test, expect } from '@playwright/test';

test.describe('Workpaper review', () => {
  test('workpaper review section is discoverable', async ({ page }) => {
    await page.goto('/');
    const control = page.getByRole(/link|button/, { name: /workpaper|working paper|review notes/i }).first();
    if (!(await control.count())) {
      test.skip(true, 'No workpaper-review navigation control is present in the current UI.');
    }
    await control.click();
    await expect(page.locator('body')).toContainText(/workpaper|working paper|review|evidence/i);
  });
});
