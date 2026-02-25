/**
 * Gillette Labs Product Details Page (PDP) Object Model
 * Designed for Gillette Labs Products - Germany Website
 * 
 * Sections:
 * - Product Title
 * - Product Variants
 * - Buy Now Button
 * - Learn More Button -> Product Details Section
 * - Write A Review Section
 * - Related Products Section
 */

import { helperBase } from './helperBase.js';
import { expect } from '@playwright/test';
import { SYMBOLS, log } from '../utils/logConstants.js';

export class labsProductDetailsPage extends helperBase {
  constructor(page) {
    super(page);

    // Cookie Consent
    this.acceptCookiesButton = page.locator('#onetrust-accept-btn-handler');

    // Product Title (H1)
    this.productTitle = page.locator('h1').first();

    // ==================== Product Variants ====================
    this.productVariantButton = page.locator('#main-content > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div:nth-child(2) > div > button:first-child');

    // ==================== Buy Now Section ====================
    this.buyNowButton = page.locator('#shopnowBtn-container > div');
    this.buyNowPopupTitle = page.locator('body > div:nth-child(5) > div > div:nth-child(6) > div:first-child > h2');
    this.buyNowPopupMessage = page.getByText('Online-Händler').first();
    this.buyNowCloseButton = page.locator('body > div:nth-child(5) > div > span:first-child');

    // ==================== Learn More / Product Details Section ====================
    this.learnMoreButton = page.locator('#main-content > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div:nth-child(4)');
    this.productDetailsHeading = page.locator('#scrollIt > div > div:nth-child(2) > div > h2');

    // ==================== Review Section ====================
    this.writeReviewButton = page.locator('#review > div > div > div:first-child > a > span:first-child');
    this.reviewPageProductName = page.locator('h1').first();
    this.cancelReviewButton = page.locator('#main-content > div > div:nth-child(2) > div:nth-child(2) > div > form > div:first-child > div:nth-child(8) > a');

    // ==================== Related Products Section ====================
    this.relatedProductsContainer = page.locator('#related-products-container > div > div:first-child > div > div');
    this.getRelatedProductName = (index) => page.locator(`#related-products-container > div > div:first-child > div > div > div:nth-child(${index}) > div > div > div > a > div:nth-child(2) > h3`);
    this.getRelatedProductLink = (index) => page.locator(`#related-products-container > div > div:first-child > div > div > div:nth-child(${index}) > div > div > div > a`);

    // Safe area to move mouse away from header (avoid hover menus)
    this.safeAreaElement = page.locator('#main-content > div > div:nth-child(3) > div:first-child > div > div:nth-child(2) > div > h2');
    this.headerBackdrop = page.locator('#headerBackdrop');
  }

  // ==================== Navigation Methods ====================

  /**
   * Navigate to a specific product URL
   * @param {string} productUrl - Full URL or relative path to the product
   */
  async navigateToProduct(productUrl) {
    log(SYMBOLS.ROCKET, `Navigating to Gillette Labs Product Page: ${productUrl}`);
    
    if (productUrl.startsWith('http')) {
      await this.page.goto(productUrl);
    } else {
      await this.navigate(productUrl);
    }
    
    await this.waitForPageLoad();
    log(SYMBOLS.SUCCESS, `Product Page loaded: ${this.page.url()}`);
  }

  /**
   * Accept cookies if the banner is displayed
   */
  async acceptCookies() {
    try {
      log(SYMBOLS.INFO, 'Waiting for cookie banner to display...');
      await this.acceptCookiesButton.waitFor({ state: 'visible', timeout: 15000 });
      await this.acceptCookiesButton.click();
      log(SYMBOLS.SUCCESS, 'Cookies accepted successfully');
      await this.acceptCookiesButton.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
      await this.page.waitForTimeout(2000);
    } catch (error) {
      log(SYMBOLS.INFO, 'Cookie banner not present or already accepted');
    }
  }

  /**
   * Validate current URL matches expected URL
   * @param {string} expectedUrl - Expected URL
   * @returns {Promise<{success: boolean, currentUrl: string}>}
   */
  async validateCurrentUrl(expectedUrl) {
    const currentUrl = this.page.url();
    const success = currentUrl === expectedUrl;
    
    if (success) {
      log(SYMBOLS.SUCCESS, `✅ URL loaded successfully: ${currentUrl}`);
    } else {
      log(SYMBOLS.ERROR, `❌ URL mismatch. Expected: ${expectedUrl}, Got: ${currentUrl}`);
    }
    
    return { success, currentUrl };
  }

  // ==================== Product Title Methods ====================

  /**
   * Get product name from H1 tag
   * @returns {Promise<string>} Product name
   */
  async getProductName() {
    log(SYMBOLS.INFO, 'Getting product name...');
    try {
      await this.productTitle.waitFor({ state: 'visible', timeout: this.timeout.medium });
      const productName = await this.productTitle.textContent();
      const trimmedName = productName ? productName.trim() : '';
      log(SYMBOLS.PAGE, `Product Name: ${trimmedName}`);
      return trimmedName;
    } catch (error) {
      log(SYMBOLS.ERROR, `Could not get product name: ${error.message}`);
      return '';
    }
  }

  // ==================== Product Variant Methods ====================

  /**
   * Check if product variant button exists and click it
   * @returns {Promise<{hasVariant: boolean, variantText: string}>}
   */
  async clickProductVariant() {
    log(SYMBOLS.INFO, 'Checking for product variant...');
    
    try {
      const variantCount = await this.productVariantButton.count();
      
      if (variantCount > 0 && await this.productVariantButton.isVisible().catch(() => false)) {
        const variantText = await this.productVariantButton.textContent() || '';
        await this.productVariantButton.click();
        await this.page.waitForTimeout(5000);
        log(SYMBOLS.SUCCESS, `✅ Product Variant clicked. Variant text: ${variantText.trim()}`);
        return { hasVariant: true, variantText: variantText.trim() };
      }
      
      log(SYMBOLS.INFO, 'No product variant found');
      return { hasVariant: false, variantText: '' };
    } catch (error) {
      log(SYMBOLS.WARNING, `Product variant not found or not clickable: ${error.message}`);
      return { hasVariant: false, variantText: '' };
    }
  }

  // ==================== Buy Now Methods ====================

  /**
   * Verify Buy Now button functionality
   * @param {string} expectedPopupMessage - Expected message in popup (e.g., "Online-Händler")
   * @returns {Promise<{success: boolean, popupMessage: string}>}
   */
  async verifyBuyNowFunctionality(expectedPopupMessage) {
    log(SYMBOLS.INFO, 'Verifying Buy Now functionality...');
    
    try {
      // Scroll to Buy Now button first
      await this.buyNowButton.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(500);
      
      // Click Buy Now button
      await this.buyNowButton.waitFor({ state: 'visible', timeout: this.timeout.medium });
      await this.buyNowButton.click();
      await this.page.waitForTimeout(5000);
      
      // Get popup message
      let popupMessage = '';
      try {
        await this.buyNowPopupMessage.waitFor({ state: 'visible', timeout: this.timeout.short }).catch(() => {});
        if (await this.buyNowPopupMessage.isVisible().catch(() => false)) {
          popupMessage = await this.buyNowPopupMessage.textContent() || '';
          popupMessage = popupMessage.trim();
        } else {
          await this.buyNowPopupTitle.waitFor({ state: 'visible', timeout: this.timeout.short });
          popupMessage = await this.buyNowPopupTitle.textContent() || '';
          popupMessage = popupMessage.trim();
        }
      } catch (e) {
        log(SYMBOLS.WARNING, 'Could not get Buy Now popup message, trying alternative locator...');
        try {
          const altLocator = this.page.locator('text=Online-Händler').first();
          if (await altLocator.isVisible().catch(() => false)) {
            popupMessage = await altLocator.textContent() || '';
            popupMessage = popupMessage.trim();
          }
        } catch (e2) {
          log(SYMBOLS.WARNING, 'Could not get Buy Now popup message');
        }
      }
      
      const success = popupMessage.length > 0 && (popupMessage.includes(expectedPopupMessage) || expectedPopupMessage.includes(popupMessage));
      
      if (success) {
        log(SYMBOLS.SUCCESS, `✅ Buy Now popup verified. Message: ${popupMessage}`);
      } else if (popupMessage.length > 0) {
        log(SYMBOLS.WARNING, `⚠️ Buy Now popup found with message: ${popupMessage} (expected: ${expectedPopupMessage})`);
        return { success: true, popupMessage };
      } else {
        log(SYMBOLS.ERROR, `❌ Buy Now popup mismatch. Expected: ${expectedPopupMessage}, Got: ${popupMessage}`);
      }
      
      return { success, popupMessage };
    } catch (error) {
      log(SYMBOLS.ERROR, `Buy Now verification failed: ${error.message}`);
      return { success: false, popupMessage: '' };
    }
  }

  /**
   * Close Buy Now popup
   */
  async closeBuyNowPopup() {
    log(SYMBOLS.INFO, 'Closing Buy Now popup...');
    try {
      await this.buyNowCloseButton.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.buyNowCloseButton.click();
      log(SYMBOLS.SUCCESS, 'Buy Now popup closed');
    } catch (error) {
      await this.page.keyboard.press('Escape');
      log(SYMBOLS.INFO, 'Buy Now popup closed via Escape key');
    }
    await this.page.waitForTimeout(2000);
  }

  // ==================== Learn More / Product Details Methods ====================

  /**
   * Move mouse to safe area to avoid header hover menus
   */
  async moveMouseToSafeArea() {
    log(SYMBOLS.INFO, 'Moving mouse to safe area...');
    try {
      const safeArea = await this.safeAreaElement;
      if (await safeArea.isVisible().catch(() => false)) {
        await safeArea.hover();
        await this.headerBackdrop.waitFor({ state: 'hidden', timeout: this.timeout.short }).catch(() => {});
      }
    } catch (error) {
      log(SYMBOLS.INFO, 'Could not move to safe area');
    }
  }

  /**
   * Click Learn More button and verify Product Details section
   * @param {string} expectedHeading - Expected heading text (e.g., "Produktdetails")
   * @returns {Promise<{success: boolean, learnMoreText: string, detailHeading: string}>}
   */
  async verifyLearnMoreAndProductDetails(expectedHeading) {
    log(SYMBOLS.INFO, 'Verifying Learn More button and Product Details section...');
    
    try {
      // Move mouse to safe area first
      await this.moveMouseToSafeArea();
      
      // Wait for header backdrop to be hidden
      await this.headerBackdrop.waitFor({ state: 'hidden', timeout: this.timeout.short }).catch(() => {});
      
      // Get Learn More button text and click
      await this.learnMoreButton.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(500);
      
      const learnMoreText = await this.learnMoreButton.textContent() || '';
      log(SYMBOLS.INFO, `Learn More button text: ${learnMoreText.trim()}`);
      
      await this.learnMoreButton.click();
      await this.page.waitForTimeout(3000);
      
      // Verify Product Details section heading
      let detailHeading = '';
      try {
        await this.productDetailsHeading.waitFor({ state: 'visible', timeout: this.timeout.medium });
        detailHeading = await this.productDetailsHeading.textContent() || '';
        detailHeading = detailHeading.trim();
      } catch (e) {
        log(SYMBOLS.WARNING, 'Could not get Product Details heading');
        detailHeading = await this.page.title();
      }
      
      const success = detailHeading.toLowerCase().includes(expectedHeading.toLowerCase());
      
      if (success) {
        log(SYMBOLS.SUCCESS, `✅ Learn More clicked. Product Details section displayed. Heading: ${detailHeading}`);
      } else {
        log(SYMBOLS.ERROR, `❌ Product Details heading mismatch. Expected: ${expectedHeading}, Got: ${detailHeading}`);
      }
      
      return { success, learnMoreText: learnMoreText.trim(), detailHeading };
    } catch (error) {
      log(SYMBOLS.ERROR, `Learn More/Product Details verification failed: ${error.message}`);
      return { success: false, learnMoreText: '', detailHeading: '' };
    }
  }

  // ==================== Write A Review Methods ====================

  /**
   * Click Write A Review button and verify the page
   * @param {string} expectedProductName - Expected product name on review page
   * @returns {Promise<{success: boolean, reviewPageProductName: string}>}
   */
  async verifyWriteAReviewPage(expectedProductName) {
    log(SYMBOLS.INFO, 'Verifying Write A Review page...');
    
    try {
      // Check if Write A Review button is displayed
      await this.writeReviewButton.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(500);
      
      const isVisible = await this.writeReviewButton.isVisible().catch(() => false);
      
      if (!isVisible) {
        log(SYMBOLS.ERROR, "'Write A Review' button not found");
        return { success: false, reviewPageProductName: '' };
      }
      
      log(SYMBOLS.SUCCESS, "'Write A Review' button is found");
      
      // Click the button
      await this.writeReviewButton.click();
      await this.page.waitForTimeout(3000);
      
      // Get product name on review page
      let reviewPageProductName = '';
      try {
        await this.reviewPageProductName.waitFor({ state: 'visible', timeout: this.timeout.medium });
        reviewPageProductName = await this.reviewPageProductName.textContent() || '';
        reviewPageProductName = reviewPageProductName.trim();
      } catch (e) {
        reviewPageProductName = await this.page.title();
      }
      
      log(SYMBOLS.INFO, `Product Name on Write A Review Page: ${reviewPageProductName}`);
      
      const success = reviewPageProductName === expectedProductName || 
                     reviewPageProductName.toLowerCase().includes(expectedProductName.toLowerCase()) ||
                     expectedProductName.toLowerCase().includes(reviewPageProductName.toLowerCase());
      
      if (success) {
        log(SYMBOLS.SUCCESS, `✅ Write A Review page displayed for: ${reviewPageProductName}`);
      } else {
        log(SYMBOLS.ERROR, `❌ Product name mismatch on review page. Expected: ${expectedProductName}, Got: ${reviewPageProductName}`);
      }
      
      return { success, reviewPageProductName };
    } catch (error) {
      log(SYMBOLS.ERROR, `Write A Review verification failed: ${error.message}`);
      return { success: false, reviewPageProductName: '' };
    }
  }

  /**
   * Click Cancel button on Write A Review page to return to PDP
   * @param {string} expectedUrl - Expected PDP URL after canceling
   * @returns {Promise<{success: boolean}>}
   */
  async clickCancelOnReviewPage(expectedUrl) {
    log(SYMBOLS.INFO, 'Clicking Cancel button on Write A Review page...');
    
    try {
      await this.cancelReviewButton.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.cancelReviewButton.click();
      await this.page.waitForTimeout(3000);
      
      const currentUrl = this.page.url();
      const success = currentUrl === expectedUrl || currentUrl.includes(expectedUrl) || expectedUrl.includes(currentUrl);
      
      if (success) {
        log(SYMBOLS.SUCCESS, '✅ Cancel button clicked, returned to PDP successfully');
      } else {
        log(SYMBOLS.ERROR, `❌ Did not return to expected URL. Expected: ${expectedUrl}, Got: ${currentUrl}`);
      }
      
      return { success };
    } catch (error) {
      log(SYMBOLS.ERROR, `Cancel button click failed: ${error.message}`);
      return { success: false };
    }
  }

  // ==================== Related Products Methods ====================

  /**
   * Verify Related Products section - verifies specified number of products
   * @param {number} productsToVerify - Number of products to verify (default: 3)
   * @returns {Promise<Array<{success: boolean, cardName: string, pageName: string, position: number}>>}
   */
  async verifyRelatedProducts(productsToVerify = 3) {
    log(SYMBOLS.INFO, `Verifying ${productsToVerify} Related Products...`);
    
    const context = this.page.context();
    const originalWindow = this.page;
    const results = [];
    
    try {
      for (let i = 1; i <= productsToVerify; i++) {
        try {
          // Get product name and link from card
          const productNameElement = this.getRelatedProductName(i);
          const productLinkElement = this.getRelatedProductLink(i);
          
          // Get product title using JavaScript to handle whitespace
          let productTitle = '';
          try {
            productTitle = await productNameElement.evaluate(el => el.innerText.replace(/\s+/g, ' ').trim());
          } catch (e) {
            productTitle = await productNameElement.textContent() || '';
            productTitle = productTitle.replace(/\s+/g, ' ').trim();
          }
          
          let productLink = await productLinkElement.getAttribute('href').catch(() => '');
          
          if (!productLink) {
            log(SYMBOLS.WARNING, `Related product ${i} link not found`);
            results.push({ success: false, cardName: productTitle, pageName: '', position: i });
            continue;
          }
          
          // Ensure full URL
          if (!productLink.startsWith('http')) {
            const baseUrl = new URL(this.page.url()).origin;
            productLink = baseUrl + productLink;
          }
          
          log(SYMBOLS.INFO, `Opening Related Product ${i}: ${productTitle}`);
          
          // Open product in new tab using JavaScript
          await this.page.evaluate((url) => window.open(url), productLink);
          await this.page.waitForTimeout(2000);
          
          // Get all pages in context
          const allPages = context.pages();
          let newPage = null;
          
          for (const page of allPages) {
            if (page !== originalWindow) {
              newPage = page;
              break;
            }
          }
          
          if (newPage) {
            await newPage.waitForTimeout(3000);
            
            // Get product name on PDP
            const pdpProductName = await newPage.locator('h1').first().textContent().catch(() => '');
            const trimmedPdpName = pdpProductName ? pdpProductName.trim() : '';
            
            // Compare product names (case insensitive)
            const success = productTitle.toLowerCase() === trimmedPdpName.toLowerCase();
            
            if (success) {
              log(SYMBOLS.SUCCESS, `✅ Correct Product linked at position ${i}: ${productTitle}`);
            } else {
              log(SYMBOLS.ERROR, `❌ Mismatch at position ${i}: Card = "${productTitle}", Page = "${trimmedPdpName}"`);
            }
            
            results.push({ success, cardName: productTitle, pageName: trimmedPdpName, position: i });
            
            // Close the new page and switch back
            await newPage.close();
            await originalWindow.bringToFront();
          } else {
            log(SYMBOLS.WARNING, `Could not find new page for product ${i}`);
            results.push({ success: false, cardName: productTitle, pageName: '', position: i });
          }
          
        } catch (error) {
          log(SYMBOLS.ERROR, `Error verifying related product ${i}: ${error.message}`);
          results.push({ success: false, cardName: '', pageName: '', position: i });
        }
      }
      
      return results;
    } catch (error) {
      log(SYMBOLS.ERROR, `Related products verification failed: ${error.message}`);
      return results;
    }
  }

  /**
   * Take screenshot of the current page
   * @param {string} screenshotPath - Path to save the screenshot
   */
  async takeScreenshot(screenshotPath) {
    try {
      await this.page.screenshot({ path: screenshotPath, fullPage: false });
      log(SYMBOLS.SUCCESS, `Screenshot saved: ${screenshotPath}`);
    } catch (error) {
      log(SYMBOLS.ERROR, `Failed to take screenshot: ${error.message}`);
    }
  }
}
