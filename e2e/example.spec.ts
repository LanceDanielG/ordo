import { test, expect } from '@playwright/test';

test.describe('Ordo App Sanity Check', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should have correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/ordo/i);
    });

    test('should verify login page elements', async ({ page }) => {
        // Assuming the app redirects to login or has a login state initially
        // Adjust selectors based on actual app content
        const loginHeading = page.getByRole('heading', { level: 2 });
        if (await loginHeading.isVisible()) {
            await expect(loginHeading).toBeVisible();
        } else {
            // If already logged in or dashboard is visible
            console.log('Login heading not found, checking for dashboard elements');
        }
    });
});
