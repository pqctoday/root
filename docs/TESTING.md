# Playwright Testing Guide

## Overview

Automated end-to-end tests for the PQCToday website using Playwright. Tests run against the production site at https://pqctoday.github.io/root/

## Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### View test report
```bash
npm run test:report
```

### Run specific test file
```bash
npx playwright test tests/main-page.spec.js
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Coverage

### Main Page Tests (`tests/main-page.spec.js`)
- ✅ Page loads successfully
- ✅ Logo and branding visible
- ✅ All 10 topic cards displayed
- ✅ Topic card images load correctly
- ✅ Navigation to subtopics works

### Subtopics Page Tests (`tests/subtopics-page.spec.js`)
- ✅ Subtopics page loads for valid topics
- ✅ Subtopics are displayed correctly
- ✅ Quiz section is visible
- ✅ Home link navigation works
- ✅ Invalid topic handling

### Section Pages Tests (`tests/section-pages.spec.js`)
- ✅ Section pages load successfully
- ✅ Logo displays with correct path
- ✅ Home link works correctly
- ✅ Content is displayed
- ✅ Quiz button is present
- ✅ Multiple section pages tested

## Test Configuration

Tests are configured in `playwright.config.js`:
- **Base URL:** https://pqctoday.github.io/root
- **Browsers:** Chromium, Firefox, WebKit
- **Retries:** 2 retries in CI, 0 locally
- **Screenshots:** Captured on failure
- **Trace:** Captured on first retry

## CI/CD Integration

To run tests in CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npm test
```

## Writing New Tests

### Test Structure
```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');
    
    // Your test assertions
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Best Practices
1. Use descriptive test names
2. Test one thing per test
3. Use data-testid attributes for stable selectors
4. Clean up after tests if needed
5. Keep tests independent

## Debugging Tests

### Debug mode
```bash
npx playwright test --debug
```

### Show browser
```bash
npx playwright test --headed
```

### Slow down execution
```bash
npx playwright test --slow-mo=1000
```

### Generate test code
```bash
npx playwright codegen https://pqctoday.github.io/root/
```

## Troubleshooting

### Tests failing locally but passing in CI
- Clear browser cache
- Update Playwright: `npm install -D @playwright/test@latest`
- Reinstall browsers: `npx playwright install`

### Timeout errors
- Increase timeout in test: `test.setTimeout(60000)`
- Check network connectivity
- Verify site is accessible

### Element not found
- Wait for element: `await page.waitForSelector('selector')`
- Check if selector is correct
- Verify element exists on page

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
