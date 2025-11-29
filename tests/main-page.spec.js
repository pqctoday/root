import { test, expect } from '@playwright/test';

test.describe('PQCToday Main Page', () => {
    test('should load the main page successfully', async ({ page }) => {
        await page.goto('/');

        // Check page title
        await expect(page).toHaveTitle(/PQCToday/);

        // Check header logo is visible
        const logo = page.locator('#logo-img');
        await expect(logo).toBeVisible();

        // Check logo text is visible
        const logoText = page.locator('#logo-text');
        await expect(logoText).toBeVisible();
        await expect(logoText).toHaveText('PQCToday');
    });

    test('should display all topic cards', async ({ page }) => {
        await page.goto('/');

        // Wait for topic grid to load
        const topicGrid = page.locator('#main-topic-grid');
        await expect(topicGrid).toBeVisible();

        // Check that topic cards are displayed
        const topicCards = page.locator('.grid-item');
        await expect(topicCards).toHaveCount(10); // Should have 10 topics

        // Verify specific topics exist
        await expect(page.locator('text=Quantum')).toBeVisible();
        await expect(page.locator('text=Threats')).toBeVisible();
        await expect(page.locator('text=QRA')).toBeVisible();
        await expect(page.locator('text=Protocols')).toBeVisible();
        await expect(page.locator('text=Standards')).toBeVisible();
    });

    test('should have working topic card images', async ({ page }) => {
        await page.goto('/');

        // Wait for images to load
        await page.waitForLoadState('networkidle');

        // Check that topic card images are loaded
        const images = page.locator('.grid-item img');
        const count = await images.count();

        // Verify at least some images loaded successfully
        expect(count).toBeGreaterThan(0);

        // Check first image has correct src path
        const firstImage = images.first();
        const src = await firstImage.getAttribute('src');
        expect(src).toContain('/root/assets/');
    });

    test('should navigate to subtopics page when clicking a topic', async ({ page }) => {
        await page.goto('/');

        // Click on Quantum topic
        await page.locator('text=Quantum').click();

        // Should navigate to subtopics page
        await expect(page).toHaveURL(/subtopics\.html\?topic=Quantum/);
    });
});
