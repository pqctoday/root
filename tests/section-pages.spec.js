import { test, expect } from '@playwright/test';

test.describe('PQCToday Section Pages', () => {
    test('should load a section page successfully', async ({ page }) => {
        await page.goto('/sections/Quantum/QRNG/index.html');

        // Check page loaded
        await expect(page).toHaveTitle(/Quantum Random Number Generation/);

        // Check header logo is visible
        const logo = page.locator('#logo-img');
        await expect(logo).toBeVisible();

        // Verify logo has correct path
        const logoSrc = await logo.getAttribute('src');
        expect(logoSrc).toBe('/root/assets/PQCT_Logo_V01.png');
    });

    test('should have working Home link on section pages', async ({ page }) => {
        await page.goto('/sections/Quantum/QRNG/index.html');

        // Find Home link
        const homeLink = page.locator('a.subheader-link:has-text("Home")');
        await expect(homeLink).toBeVisible();

        // Verify it has correct href
        await expect(homeLink).toHaveAttribute('href', '/root/index.html');

        // Click and verify navigation
        await homeLink.click();
        await expect(page).toHaveURL(/\/root\/$/);
    });

    test('should display content on section pages', async ({ page }) => {
        await page.goto('/sections/Quantum/QRNG/index.html');

        // Check main heading exists
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
        await expect(heading).toContainText('Quantum Random Number Generation');

        // Check content sections exist
        const sections = page.locator('section');
        expect(await sections.count()).toBeGreaterThan(0);
    });

    test('should have quiz button on section pages', async ({ page }) => {
        await page.goto('/sections/Quantum/QRNG/index.html');

        // Check quiz section exists
        const quizFooter = page.locator('#quiz-footer');
        await expect(quizFooter).toBeVisible();

        // Check quiz button exists and has correct link
        const quizButton = page.locator('.quiz-button');
        await expect(quizButton).toBeVisible();
        const href = await quizButton.getAttribute('href');
        expect(href).toContain('quiz.html');
    });

    test('should test multiple section pages', async ({ page }) => {
        const sectionPages = [
            '/sections/Quantum/QKD/index.html',
            '/sections/QRA/ML-KEM/index.html',
            '/sections/Protocols/TLS/index.html',
            '/sections/Countries/US/index.html',
        ];

        for (const pagePath of sectionPages) {
            await page.goto(pagePath);

            // Check logo is visible
            const logo = page.locator('#logo-img');
            await expect(logo).toBeVisible();

            // Check Home link works
            const homeLink = page.locator('a.subheader-link:has-text("Home")');
            await expect(homeLink).toBeVisible();
            await expect(homeLink).toHaveAttribute('href', '/root/index.html');
        }
    });
});
