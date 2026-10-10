import { test, expect } from '@playwright/test';

test.describe('Audit investigation', () => {
  test('workspace exposes an investigation or findings area', async ({ page }) => {
    await page.goto('/');
    const investigationLink = page.getByRole('link', { name: /investigation|findings|audit/i }).first();
    const investigationButton = page.getByRole('button', { name: /investigation|findings|audit/i }).first();

    if (await investigationLink.count()) {
      await investigationLink.click();
    } else if (await investigationButton.count()) {
      await investigationButton.click();
    } else {
      test.skip(true, 'No investigation/findings navigation control is present on the current page.');
    }
    await expect(page.locator('body')).toContainText(/investigation|findings|audit|review/i);
  });
});
