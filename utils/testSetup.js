/**
 * Test Setup Utilities
 * Common setup functions used across all test files
 */

import { getEnvironment } from './helper.js';
import { SYMBOLS, log } from './logConstants.js';

/**
 * Clear browser context (cookies, permissions, etc.)
 * @param {Object} context - Playwright browser context
 */
export async function clearBrowserContext(context) {
  await context.clearCookies();
  await context.clearPermissions();
}

/**
 * Setup test environment and return environment info
 * @param {Object} testInfo - Playwright test info object
 * @returns {string} - Environment name (prod/qa)
 */
export function setupTestEnvironment(testInfo) {
  const testEnvironment = getEnvironment(testInfo);
  log(SYMBOLS.ROCKET, `Test Environment: ${testEnvironment.toUpperCase()}`);
  return testEnvironment;
}

/**
 * Complete test setup - combines context clearing and environment detection
 * @param {Object} context - Playwright browser context  
 * @param {Object} testInfo - Playwright test info object
 * @returns {Promise<string>} - Environment name (prod/qa)
 */
export async function setupTest(context, testInfo) {
  // Clear browser context for clean state
  await clearBrowserContext(context);
  
  // Setup and return environment
  return setupTestEnvironment(testInfo);
}

/**
 * Attach failure screenshot to test report
 * @param {Object} page - Playwright page object
 * @param {Object} testInfo - Playwright test info object
 */
export async function attachFailureScreenshot(page, testInfo) {
  if (testInfo.status === 'failed') {
    // Create sanitized filename from test name
    const testName = testInfo.title.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
    const timestamp = Date.now();
    const screenshotName = `failure-${testName}-${timestamp}`;
    
    // Take screenshot on failure
    const screenshot = await page.screenshot();
    await testInfo.attach(screenshotName, {
      body: screenshot,
      contentType: 'image/png'
    });
  }
}