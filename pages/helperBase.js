/**
 * Base Page Object Model
 * Contains common functionality that can be inherited by all page objects
 */

import { SYMBOLS, log } from '../utils/logConstants.js';

export class helperBase {
  constructor(page) {
    this.page = page;
    this.timeout = {
      short: 5000,
      medium: 10000,
      long: 70000
    };
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - The URL to navigate to
   */
  async navigate(url) {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad() {
    try {
      await this.page.waitForLoadState('load', { timeout: this.timeout.long });
    } catch (error) {
      log(SYMBOLS.WARNING, 'Load state timeout, continuing...');
    }
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle() {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: this.timeout.medium });
    } catch (error) {
      log(SYMBOLS.WARNING, 'Network idle timeout, continuing...');
    }
  }

  /**
   * Take a screenshot
   * @param {string} path - Path to save the screenshot
   * @param {Object} options - Screenshot options
   */
  async takeScreenshot(path, options = {}) {
    const defaultOptions = {
      path,
      fullPage: true,
      ...options
    };
    
    try {
      await this.page.screenshot(defaultOptions);
      log(SYMBOLS.SUCCESS, `Screenshot saved: ${path}`);
    } catch (error) {
      log(SYMBOLS.WARNING, `Screenshot failed: ${error.message}`);
    }
  }

  /**
   * Wait for element to be visible with error handling
   * @param {Object} element - Playwright locator
   * @param {number} timeout - Timeout in milliseconds
   * @returns {boolean} - True if element is visible, false otherwise
   */
  async isElementVisible(element, timeout = this.timeout.short) {
    try {
      await element.waitFor({ state: 'visible', timeout });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for element to be present and visible
   * @param {Object} element - Playwright locator
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(element, timeout = this.timeout.short) {
    try {
      await element.waitFor({ state: 'visible', timeout });
    } catch (error) {
      throw new Error(`Element not visible within ${timeout}ms: ${error.message}`);
    }
  }

  /**
   * Wait for element to be enabled
   * @param {Object} element - Playwright locator
   * @param {number} timeout - Timeout in milliseconds
   * @returns {boolean} - True if element is enabled, false otherwise
   */
  async isElementEnabled(element, timeout = this.timeout.short) {
    try {
      await element.waitFor({ state: 'attached', timeout });
      return await element.isEnabled();
    } catch (error) {
      return false;
    }
  }

  /**
   * Safe click with retry mechanism
   * @param {Object} element - Playwright locator
   * @param {Object} options - Click options
   */
  async safeClick(element, options = {}) {
    const maxRetries = 3;
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        await element.waitFor({ state: 'visible', timeout: this.timeout.short });
        
        // Add timeout to prevent indefinite waiting
        const clickOptions = {
          timeout: 8000,
          ...options
        };
        
        await element.click(clickOptions);
        return;
      } catch (error) {
        lastError = error;
        log(SYMBOLS.WARNING, `Click attempt ${i + 1} failed: ${error.message}`);
        
        // Don't wait if it's the last attempt
        if (i < maxRetries - 1) {
          await this.page.waitForTimeout(1000);
        }
      }
    }
    
    throw new Error(`Failed to click element after ${maxRetries} attempts. Last error: ${lastError.message}`);
  }

  /**
   * Safe fill with clear and retry
   * @param {Object} element - Playwright locator
   * @param {string} text - Text to fill
   */
  async safeFill(element, text) {
    try {
      await element.waitFor({ state: 'visible', timeout: this.timeout.short });
      await element.clear();
      await element.fill(text);
    } catch (error) {
      log(SYMBOLS.WARNING, `Fill failed: ${error.message}`);
      // Retry with different approach
      await element.click();
      await this.page.keyboard.press('Control+A');
      await this.page.keyboard.type(text);
    }
  }

  /**
   * Get current URL
   * @returns {string} - Current page URL
   */
  getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Check if current URL contains pattern
   * @param {string|RegExp} pattern - URL pattern to check
   * @returns {boolean} - True if URL matches pattern
   */
  isUrlMatching(pattern) {
    const currentUrl = this.getCurrentUrl();
    if (pattern instanceof RegExp) {
      return pattern.test(currentUrl);
    }
    return currentUrl.includes(pattern);
  }

}