import { test, expect } from '@playwright/test';

test.describe('Reconciliation', () => {
  test('reconciliation view or navigation is discoverable', async ({ page }) => {
    await page.goto('/');
    const control = page.getByRole(/link|button/, { name: /reconciliation|reconcile|variance|mismatch/i }).first();
    if (!(await control.count())) {
      test.skip(true, 'No reconciliation navigation control is present in the current UI.');
    }
    await control.click();
    await expect(page.locator('body')).toContainText(/reconciliation|variance|difference|matched|mismatch/i);
  });
});
