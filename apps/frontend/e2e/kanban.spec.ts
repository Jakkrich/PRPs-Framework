import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/PRPs Dashboard/);
});

test('shows kanban columns', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Pending')).toBeVisible();
    await expect(page.getByText('Planning')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();
    await expect(page.getByText('Review')).toBeVisible();
    await expect(page.getByText('Done')).toBeVisible();
});

test('can click task detailed view', async ({ page }) => {
    await page.goto('/');
    // Check if any task card exists
    const firstTask = page.locator('.cursor-pointer').first();
    if (await firstTask.isVisible()) {
        await firstTask.click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByRole('tablist')).toBeVisible();
    }
});
