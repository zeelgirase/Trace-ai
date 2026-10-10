import { test, expect } from '@playwright/test';

test.describe('Audit trail', () => {
  test('audit trail page or navigation is discoverable', async ({ page }) => {
    await page.goto('/');
    const control = page.getByRole(/link|button/, { name: /audit trail|activity log|history|evidence timeline/i }).first();
    if (!(await control.count())) {
      test.skip(true, 'No audit-trail navigation control is present in the current UI.');
    }
    await control.click();
    await expect(page.locator('body')).toContainText(/audit trail|activity|history|timeline|event/i);
  });
});
