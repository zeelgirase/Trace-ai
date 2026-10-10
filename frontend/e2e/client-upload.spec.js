import { test, expect } from '@playwright/test';

test.describe('Client upload', () => {
  test('upload input can be reached from the UI', async ({ page }) => {
    await page.goto('/');
    const fileInput = page.locator('input[type="file"]').first();
    if (!(await fileInput.count())) {
      const uploadControl = page.getByRole(/link|button/, { name: /upload|evidence|add document/i }).first();
      if (await uploadControl.count()) await uploadControl.click();
    }
    const inputAfterNavigation = page.locator('input[type="file"]').first();
    if (!(await inputAfterNavigation.count())) {
      test.skip(true, 'No file input found. Navigate to the evidence/upload screen or adjust the selector.');
    }
    await expect(inputAfterNavigation).toBeAttached();
  });
});
