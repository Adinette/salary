import { test, expect } from '@playwright/test';

test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Home Page');
});

test('navigates to about page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.locator('h1')).toHaveText('About Page');
});
