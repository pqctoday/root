import { test, expect } from '@playwright/test';

test.describe('PQCToday Subtopics Page', () => {
    test('should load subtopics page for Quantum topic', async ({ page }) => {
        await page.goto('/subtopics.html?topic=Quantum');

        // Check page loaded
        await expect(page).toHaveTitle(/PQCToday/);

        // Check header logo is visible
        const logo = page.locator('#logo-img');
        await expect(logo).toBeVisible();

        // Check Home link is visible and working
        const homeLink = page.locator('a.subheader-link:has-text("Home")');
        await expect(homeLink).toBeVisible();
        await expect(homeLink).toHaveAttribute('href', '/root/index.html');
    });

    test('should display subtopics for Quantum', async ({ page }) => {
        await page.goto('/subtopics.html?topic=Quantum');

        // Wait for subtopics grid
        const subtopicGrid = page.locator('#subtopic-grid');
        await expect(subtopicGrid).toBeVisible();

        // Check subtopics are displayed
        await expect(page.locator('text=QRNG')).toBeVisible();
        await expect(page.locator('text=QKD')).toBeVisible();
    });

    test('should display quiz section', async ({ page }) => {
        await page.goto('/subtopics.html?topic=Quantum');

        // Check quiz section exists
        const quizSection = page.locator('#quiz-section');
        await expect(quizSection).toBeVisible();

        // Check quiz button exists
        const quizButton = page.locator('#start-quiz');
        await expect(quizButton).toBeVisible();
    });

    test('should navigate back to main page from Home link', async ({ page }) => {
        await page.goto('/subtopics.html?topic=Quantum');

        // Click Home link
        await page.locator('a.subheader-link:has-text("Home")').click();

        // Should navigate back to main page
        await expect(page).toHaveURL(/\/root\/$/);

        // Main topic grid should be visible
        const topicGrid = page.locator('#main-topic-grid');
        await expect(topicGrid).toBeVisible();
    });

    test('should handle invalid topic gracefully', async ({ page }) => {
        // Navigate to subtopics with invalid topic
        await page.goto('/subtopics.html?topic=InvalidTopic');

        // Should redirect to main page or show error
        // Wait a bit for redirect
        await page.waitForTimeout(1000);

        // Check if redirected to main page
        const url = page.url();
        expect(url).toContain('/root/');
    });
});
