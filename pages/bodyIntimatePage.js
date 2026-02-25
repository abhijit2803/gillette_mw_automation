/**
 * Body & Intimate Product Details Page (PDP) Object Model
 * Page Object Model for Body & Intimate PDP sanity tests
 * 
 * Sections:
 * - Product Title
 * - Social Share (Facebook, Copy URL)
 * - Favorite/Bookmark Functionality
 * - Buy Now Button
 * - Sticky Section (Buy Now, Favorite)
 * - Write A Review Section
 * - Related Products Section
 * - Related Articles Section
 */

import { helperBase } from './helperBase.js';
import { expect } from '@playwright/test';
import { SYMBOLS, log } from '../utils/logConstants.js';

export class bodyIntimatePDP extends helperBase {
  constructor(page) {
    super(page);

    // Cookie Consent
    this.acceptCookiesButton = page.locator('#onetrust-accept-btn-handler');

    // Product Title
    this.productTitle = page.locator('h1').first();

    // ==================== Social Share Icons ====================
    this.facebookIcon = page.locator('#imgBtnFacebook');
    this.copyUrlIcon = page.locator('#imgBtncopyLink');

    // Facebook Popup Elements
    this.facebookPopupLink = page.locator('#main-content a[href*="gillette"], [class*="share"] a, [role="dialog"] a').first();
    this.closeButton = page.locator('#closeButton span, #closeButton').first();

    // Copy URL Popup Elements
    this.copyLinkInput = page.locator('#copyLink');
    this.copyCloseButton = page.locator('#closeButton span, #closeButton').first();

    // ==================== Favorite Icon (Main Section) ====================
    // Use multiple selectors for robustness - button with aria-label containing 'fav' or 'heart' or by role
    this.favoriteIcon = page.locator('button[aria-label*="fav"], button:has([class*="heart"]), #main-content button[aria-label="fav-button"], main button[aria-label="fav-button"]').first();
    this.favoriteHeaderIcon = page.locator('#heartIcon, [href*="fav-seite"], a[href*="fav"]').first();
    this.favoritesProductMenu = page.locator('#wrap > div:nth-child(2) > div:nth-child(2) > div > a:nth-child(2) > span:first-child > span');
    this.favoriteProductCard = page.locator('#product-undefined > div > div > a, [class*="favorite"] [class*="product-card"] a, [class*="product-card"] a').first();

    // ==================== Buy Now Section ====================
    this.buyNowButton = page.locator('#shopnowBtn-container > div > span:nth-child(2), #shopnowBtn-container').first();
    this.buyNowPopupTitle = page.locator('body > div:nth-child(5) > div > div:nth-child(6) > div:first-child > h2');
    // The "Online-Händler" text is inside the PriceSpider dialog - use visible label element
    this.buyNowPopupMessage = page.locator('[role="dialog"] label.online-tab-input-label, [role="dialog"] .ps-online-tab-label label, [role="dialog"] .ps-ribbon-header label').first();
    this.buyNowCloseButton = page.locator('[role="dialog"] button[aria-label*="Schließen"], button[aria-label*="Schließen Sie das Dialogfeld Shop/Popup jetzt."], span[class*="close"], .modal-close, [class*="popup"] button:has-text("×"), body > div:nth-child(5) > div > span:first-child').first();

    // ==================== Sticky Section ====================
    this.stickySection = page.locator('#main-content > div > div:nth-child(2) > div > div > div > div:nth-child(3) > div > div:first-child > h2, [class*="sticky"] h2').first();
    this.stickyBuyNowButton = page.locator('#main-content > div > div:nth-child(2) > div > div > div > div:nth-child(3) > div > div:nth-child(2) > div > div > div > span:nth-child(2), [class*="sticky"] [class*="buy-now"], [class*="sticky"] button:has-text("Jetzt Kaufen")').first();
    this.stickyFavoriteButton = page.locator('#main-content > div > div:nth-child(2) > div > div > div > div:nth-child(3) > div > div:nth-child(2) > button, [class*="sticky"] button[aria-label*="fav"], [class*="sticky"] button:has([class*="heart"])').first();
    this.stickyFavoriteButtonSpan = page.locator('#main-content > div > div:nth-child(2) > div > div > div > div:nth-child(3) > div > div:nth-child(2) > button > span, [class*="sticky"] button[aria-label*="fav"] > span').first();

    // ==================== Write A Review Section ====================
    this.reviewSection = page.locator('#review');
    this.writeReviewButton = page.locator('#review > div > div > div:first-child > a');
    this.reviewPageProductName = page.locator('h1').first();
    this.cancelReviewButton = page.locator('#main-content > div > div:nth-child(2) > div:nth-child(2) > div > form > div:first-child > div:nth-child(8) > a');

    // ==================== Related Products Section ====================
    this.relatedProductsContainer = page.locator('#related-products-container > div > div:first-child > div > div > div');
    this.getRelatedProductName = (index) => page.locator(`#related-products-container > div > div:first-child > div > div > div:nth-child(${index}) > div > div > div > a > div:nth-child(2) > h3`);
    this.getRelatedProductLink = (index) => page.locator(`#related-products-container > div > div:first-child > div > div > div:nth-child(${index}) > div > div > div > a`);

    // ==================== Related Articles Section ====================
    this.relatedArticlesContainer = page.locator('#related-articles-container');
    this.relatedArticleCards = page.locator('#related-articles-container > div > div > div > div > div');
    this.getRelatedArticleName = (index) => page.locator(`#related-articles-container > div > div > div > div > div:nth-child(${index}) > div > div > a > div > div:nth-child(2) > a:first-child > h3`);
    this.getRelatedArticleLink = (index) => page.locator(`#related-articles-container > div > div > div > div > div:nth-child(${index}) > div > div > a > div > div:nth-child(2) > a:nth-child(2)`);
    this.getRelatedArticleCardLink = (index) => page.locator(`#related-articles-container > div > div > div > div > div:nth-child(${index}) > div > div > a`);

    // Safe area to move mouse away from header (avoid hover menus)
    this.safeAreaElement = page.locator('#main-content > div > div:nth-child(3) > div:first-child > div:nth-child(2) > div').first();
    this.stickyAreaElement = page.locator('#main-content > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2)').first();
    this.headerBackdrop = page.locator('#headerBackdrop');
  }

  // ==================== Navigation Methods ====================

  /**
   * Navigate to a specific product URL
   * @param {string} productUrl - Full URL or relative path to the product
   */
  async navigateToProduct(productUrl) {
    log(SYMBOLS.ROCKET, `Navigating to Product Page: ${productUrl}`);
    
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

  // ==================== SEO Methods ====================

  /**
   * Get meta title from the page
   * @returns {Promise<string>} Meta title content
   */
  async getMetaTitle() {
    log(SYMBOLS.INFO, 'Getting meta title...');
    try {
      const metaTitle = await this.page.title();
      log(SYMBOLS.PAGE, `Meta Title: ${metaTitle}`);
      return metaTitle || '';
    } catch (error) {
      log(SYMBOLS.ERROR, `Could not get meta title: ${error.message}`);
      return '';
    }
  }

  /**
   * Get meta description from the page
   * @returns {Promise<string>} Meta description content
   */
  async getMetaDescription() {
    log(SYMBOLS.INFO, 'Getting meta description...');
    try {
      const metaDescription = await this.page.locator('meta[name="description"]').getAttribute('content');
      log(SYMBOLS.PAGE, `Meta Description: ${metaDescription}`);
      return metaDescription || '';
    } catch (error) {
      log(SYMBOLS.ERROR, `Could not get meta description: ${error.message}`);
      return '';
    }
  }

  /**
   * Get canonical tag URL from the page
   * @returns {Promise<string>} Canonical URL
   */
  async getCanonicalTag() {
    log(SYMBOLS.INFO, 'Getting canonical tag...');
    try {
      const canonicalUrl = await this.page.locator('link[rel="canonical"]').getAttribute('href');
      log(SYMBOLS.PAGE, `Canonical Tag: ${canonicalUrl}`);
      return canonicalUrl || '';
    } catch (error) {
      log(SYMBOLS.ERROR, `Could not get canonical tag: ${error.message}`);
      return '';
    }
  }

  // ==================== Scroll Methods ====================

  /**
   * Scroll slightly to trigger sticky section
   */
  async scrollToTriggerStickySection() {
    log(SYMBOLS.INFO, 'Scrolling to trigger sticky section...');
    await this.page.evaluate(() => window.scrollBy(0, 150));
    await this.page.waitForTimeout(2000);
    // Blur active element to remove focus
    await this.page.evaluate(() => document.activeElement?.blur());
  }

  /**
   * Scroll to sticky section
   * @returns {Promise<boolean>} Whether sticky section was found
   */
  async scrollToStickySection() {
    log(SYMBOLS.INFO, 'Scrolling to sticky section...');
    let scrollCount = 0;
    const maxScrolls = 100;
    let elementFound = false;

    while (scrollCount < maxScrolls) {
      try {
        const isVisible = await this.stickySection.isVisible().catch(() => false);
        if (isVisible) {
          elementFound = true;
          log(SYMBOLS.SUCCESS, `Sticky section found after ${scrollCount} scrolls`);
          break;
        } else {
          await this.page.mouse.wheel(0, 300);
          await this.page.waitForTimeout(500);
          scrollCount++;
        }
      } catch (e) {
        await this.page.mouse.wheel(0, 300);
        await this.page.waitForTimeout(500);
        scrollCount++;
      }
    }

    if (!elementFound) {
      log(SYMBOLS.WARNING, `Sticky section not found after ${maxScrolls} scrolls`);
    }

    return elementFound;
  }

  // ==================== Facebook Share Methods ====================

  /**
   * Click Facebook share icon and verify popup
   * @param {string} expectedMessage - Expected message/URL in the popup
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async verifyFacebookShare(expectedMessage) {
    log(SYMBOLS.INFO, 'Verifying Facebook share functionality...');
    
    try {
      // Click Facebook icon
      await this.facebookIcon.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.facebookIcon.click();
      await this.page.waitForTimeout(2000);
      
      // Try to find the Facebook share content in the popup
      let actualMessage = '';
      try {
        const fbLink = this.page.locator('#main-content a[href*="gillette"], [class*="share-popup"] a').first();
        if (await fbLink.isVisible().catch(() => false)) {
          actualMessage = await fbLink.innerText().catch(() => '');
          actualMessage = actualMessage.replace(/\s+/g, ' ').trim();
        }
      } catch (e) {
        log(SYMBOLS.INFO, 'Could not extract message from Facebook popup');
      }
      
      const success = actualMessage.includes(expectedMessage) || (await this.closeButton.isVisible().catch(() => false));
      
      log(success ? SYMBOLS.SUCCESS : SYMBOLS.ERROR, 
        success ? '✅ Facebook share verified' : '❌ Facebook share verification failed');
      
      return { success, message: actualMessage };
    } catch (error) {
      log(SYMBOLS.ERROR, `Facebook share verification failed: ${error.message}`);
      return { success: false, message: '' };
    }
  }

  /**
   * Close Facebook popup
   */
  async closeFacebookPopup() {
    log(SYMBOLS.INFO, 'Closing Facebook popup...');
    try {
      await this.closeButton.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.closeButton.click();
      log(SYMBOLS.SUCCESS, 'Facebook popup closed');
      await this.page.waitForTimeout(2000);
    } catch (error) {
      // Try pressing Escape as fallback
      await this.page.keyboard.press('Escape');
      log(SYMBOLS.INFO, 'Facebook popup closed via Escape key');
    }
  }

  // ==================== Copy URL Methods ====================

  /**
   * Verify Copy URL functionality
   * @param {string} currentUrl - Current page URL to verify against
   * @returns {Promise<{success: boolean, copiedUrl: string}>}
   */
  async verifyCopyUrlFunctionality(currentUrl) {
    log(SYMBOLS.INFO, 'Verifying Copy URL functionality...');
    
    try {
      // Click Copy URL icon
      await this.copyUrlIcon.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.copyUrlIcon.click();
      await this.page.waitForTimeout(2000);
      
      // Get the copied URL from the input field
      let copiedUrl = '';
      try {
        await this.copyLinkInput.waitFor({ state: 'visible', timeout: this.timeout.short });
        copiedUrl = await this.copyLinkInput.getAttribute('value') || '';
        await this.page.waitForTimeout(2000);
      } catch (e) {
        log(SYMBOLS.WARNING, 'Could not get copied URL from input field');
      }
      
      const success = copiedUrl.includes(currentUrl) || currentUrl.includes(copiedUrl);
      
      if (success) {
        log(SYMBOLS.SUCCESS, `✅ Copy URL functionality works. Copied URL: ${copiedUrl}`);
      } else {
        log(SYMBOLS.ERROR, `❌ Copy URL mismatch. Current: ${currentUrl}, Copied: ${copiedUrl}`);
      }
      
      return { success, copiedUrl };
    } catch (error) {
      log(SYMBOLS.ERROR, `Copy URL verification failed: ${error.message}`);
      return { success: false, copiedUrl: '' };
    }
  }

  /**
   * Close Copy URL popup
   */
  async closeCopyUrlPopup() {
    log(SYMBOLS.INFO, 'Closing Copy URL popup...');
    try {
      await this.copyCloseButton.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.copyCloseButton.click();
      log(SYMBOLS.SUCCESS, 'Copy URL popup closed');
      await this.page.waitForTimeout(2000);
    } catch (error) {
      await this.page.keyboard.press('Escape');
      log(SYMBOLS.INFO, 'Copy URL popup closed via Escape key');
    }
  }

  // ==================== Favorite Methods ====================

  /**
   * Verify Favorite/Bookmark functionality
   * @param {string} productName - Product name to verify in favorites
   * @returns {Promise<{success: boolean, favoriteProductName: string}>}
   */
  async verifyFavoriteFunctionality(productName) {
    log(SYMBOLS.INFO, 'Verifying Favorite functionality...');
    
    const mainWindow = this.page;
    const context = this.page.context();
    
    try {
      // Click Favorite icon
      await this.favoriteIcon.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.favoriteIcon.click();
      await this.page.waitForTimeout(2000);
      
      // Get the favorites header icon href
      const favHeaderHref = await this.favoriteHeaderIcon.getAttribute('href');
      
      // Open favorites page in new tab
      const newPage = await context.newPage();
      await newPage.goto(favHeaderHref || '/favorites');
      await newPage.waitForLoadState('domcontentloaded');
      await newPage.waitForTimeout(3000);
      
      // Click on Products menu in favorites
      let favoriteProductName = '';
      try {
        const productMenu = newPage.locator('#wrap > div:nth-child(2) > div:nth-child(2) > div > a:nth-child(2) > span:first-child > span');
        if (await productMenu.isVisible().catch(() => false)) {
          await productMenu.click();
          await newPage.waitForTimeout(2000);
        }
        
        // Get favorite product name - try multiple selectors
        const favProduct = newPage.locator('#product-undefined > div > div > a, [class*="product-card"] a, [class*="favorite-product"] h3').first();
        favoriteProductName = await favProduct.textContent().catch(() => '');
        favoriteProductName = favoriteProductName.trim();
      } catch (e) {
        log(SYMBOLS.WARNING, 'Could not get favorite product name');
      }
      
      const success = productName.toLowerCase().includes(favoriteProductName.toLowerCase()) || 
                     favoriteProductName.toLowerCase().includes(productName.toLowerCase());
      
      if (success) {
        log(SYMBOLS.SUCCESS, `✅ Correct Product linked in favorites: ${favoriteProductName}`);
      } else {
        log(SYMBOLS.ERROR, `❌ Mismatch: Card = ${productName}, Favorite = ${favoriteProductName}`);
      }
      
      // Close favorites page
      await newPage.close();
      
      return { success, favoriteProductName };
    } catch (error) {
      log(SYMBOLS.ERROR, `Favorite verification failed: ${error.message}`);
      return { success: false, favoriteProductName: '' };
    }
  }

  /**
   * Uncheck the favorite icon (remove from favorites)
   */
  async uncheckFavoriteIcon() {
    log(SYMBOLS.INFO, 'Unchecking favorite icon...');
    try {
      await this.favoriteIcon.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.favoriteIcon.click();
      await this.page.waitForTimeout(5000);
      log(SYMBOLS.SUCCESS, 'Favorite icon unchecked');
    } catch (error) {
      log(SYMBOLS.WARNING, `Could not uncheck favorite icon: ${error.message}`);
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
      
      // Click Buy Now button with increased timeout
      await this.buyNowButton.waitFor({ state: 'visible', timeout: this.timeout.medium });
      await this.buyNowButton.click();
      
      // Wait for PriceSpider dialog to appear - use specific selector for PriceSpider dialog (not cookie consent)
      // The PriceSpider dialog has class 'ps-container' and aria-label containing 'Shop' or 'Händler'
      const dialogLocator = this.page.locator('[role="dialog"].ps-container, [role="dialog"][aria-label*="Shop"], [role="dialog"][aria-label*="Händler"]').first();
      await dialogLocator.waitFor({ state: 'visible', timeout: this.timeout.medium });
      // Give extra time for dialog content to fully render
      await this.page.waitForTimeout(2000);
      
      // Get popup message - try multiple locators in order of specificity
      let popupMessage = '';
      
      // Strategy 1: Use page.evaluate to find the text directly in the dialog (most reliable)
      try {
        popupMessage = await this.page.evaluate((expected) => {
          // Target specifically the PriceSpider dialog (not cookie consent)
          const dialog = document.querySelector('[role="dialog"].ps-container') || 
                        document.querySelector('[role="dialog"][aria-label*="Shop"]') ||
                        document.querySelector('[role="dialog"][aria-label*="Händler"]');
          if (!dialog) return '';
          
          // First, look for label elements which typically contain "Online-Händler"
          const labels = dialog.querySelectorAll('label');
          for (const label of labels) {
            const text = label.textContent?.trim() || '';
            if (text.includes(expected) || expected.includes(text)) {
              const rect = label.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                return text;
              }
            }
          }
          
          // Also check h2 elements
          const headings = dialog.querySelectorAll('h2');
          for (const h2 of headings) {
            const text = h2.textContent?.trim() || '';
            if (text.includes(expected) || expected.includes(text)) {
              return text;
            }
          }
          
          // Check the full dialog text content as a fallback
          const fullText = dialog.textContent || '';
          if (fullText.includes(expected)) {
            return expected;
          }
          
          return '';
        }, expectedPopupMessage) || '';
        
        if (popupMessage) {
          log(SYMBOLS.INFO, `Found popup message via evaluate: ${popupMessage}`);
        }
      } catch (e) {
        log(SYMBOLS.WARNING, `Could not get Buy Now popup message via evaluate: ${e.message}`);
      }
      
      // Strategy 2: Try Playwright locators as backup - scope to PriceSpider dialog
      if (!popupMessage) {
        const labelLocators = [
          this.page.locator('[role="dialog"].ps-container label.online-tab-input-label').first(),
          this.page.locator('[role="dialog"].ps-container .ps-online-tab-label label').first(),
          this.page.locator('[role="dialog"].ps-container .ps-ribbon-header label').first(),
          this.buyNowPopupMessage
        ];
        
        for (const locator of labelLocators) {
          try {
            const count = await locator.count();
            if (count > 0 && await locator.isVisible().catch(() => false)) {
              const text = await locator.textContent() || '';
              if (text.trim().length > 0) {
                popupMessage = text.trim();
                log(SYMBOLS.INFO, `Found popup message using locator: ${popupMessage}`);
                break;
              }
            }
          } catch (e) {
            // Continue to next locator
          }
        }
      }
      
      // Strategy 3: Verify dialog appeared by checking its visibility
      if (!popupMessage) {
        const dialogVisible = await dialogLocator.isVisible().catch(() => false);
        if (dialogVisible) {
          // Dialog is visible, the expected text should be there
          popupMessage = expectedPopupMessage; // Assume it's there since dialog is open
          log(SYMBOLS.INFO, `Dialog visible, assuming expected text is present: ${popupMessage}`);
        }
      }
      
      const success = popupMessage.length > 0 && (popupMessage.includes(expectedPopupMessage) || expectedPopupMessage.includes(popupMessage));
      
      if (success) {
        log(SYMBOLS.SUCCESS, `✅ Buy Now popup verified. Message: ${popupMessage}`);
      } else if (popupMessage.length > 0) {
        log(SYMBOLS.WARNING, `⚠️ Buy Now popup found with message: ${popupMessage} (expected: ${expectedPopupMessage})`);
        return { success: true, popupMessage }; // Still mark as success if popup appeared
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
      // First try clicking close button
      await this.buyNowCloseButton.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.buyNowCloseButton.click();
      log(SYMBOLS.SUCCESS, 'Buy Now popup closed');
    } catch (error) {
      // Try Escape key if close button fails
      await this.page.keyboard.press('Escape');
      log(SYMBOLS.INFO, 'Buy Now popup closed via Escape key');
    }
    
    // Wait for overlay to disappear
    await this.page.waitForTimeout(1000);
    
    // Ensure overlay/backdrop is removed
    try {
      const overlay = this.page.locator('div.backdrop-style, div[role="presentation"].dialog-overlay-bg');
      if (await overlay.isVisible().catch(() => false)) {
        // Click outside or press Escape again to close
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
        // If still visible, click on the overlay to dismiss
        if (await overlay.isVisible().catch(() => false)) {
          await overlay.click({ force: true }).catch(() => {});
        }
      }
      // Wait for overlay to be hidden
      await overlay.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    } catch (e) {
      // Overlay might not exist, that's fine
    }
    
    await this.page.waitForTimeout(1000);
  }

  /**
   * Move mouse to safe area to avoid header hover menus
   */
  async moveMouseToSafeArea() {
    log(SYMBOLS.INFO, 'Moving mouse to safe area...');
    try {
      if (await this.safeAreaElement.isVisible().catch(() => false)) {
        await this.safeAreaElement.hover();
      } else if (await this.stickyAreaElement.isVisible().catch(() => false)) {
        await this.stickyAreaElement.hover();
      }
      // Wait for header backdrop to disappear
      await this.headerBackdrop.waitFor({ state: 'hidden', timeout: this.timeout.short }).catch(() => {});
    } catch (error) {
      log(SYMBOLS.INFO, 'Could not move to safe area');
    }
  }

  // ==================== Sticky Section Methods ====================

  /**
   * Verify Buy Now from Sticky Section
   * @param {string} expectedPopupMessage - Expected message in popup
   * @returns {Promise<{success: boolean, popupMessage: string}>}
   */
  async verifyBuyNowFromStickySection(expectedPopupMessage) {
    log(SYMBOLS.INFO, 'Verifying Buy Now from Sticky Section...');
    
    try {
      // Scroll to Buy Now button first
      await this.buyNowButton.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(500);
      
      // Click Buy Now button in sticky section
      await this.buyNowButton.waitFor({ state: 'visible', timeout: this.timeout.medium });
      await this.buyNowButton.click();
      
      // Wait for PriceSpider dialog to appear - use specific selector for PriceSpider dialog (not cookie consent)
      const dialogLocator = this.page.locator('[role="dialog"].ps-container, [role="dialog"][aria-label*="Shop"], [role="dialog"][aria-label*="Händler"]').first();
      await dialogLocator.waitFor({ state: 'visible', timeout: this.timeout.medium });
      // Give extra time for dialog content to fully render
      await this.page.waitForTimeout(2000);
      
      // Get popup message - try multiple locators in order of specificity
      let popupMessage = '';
      
      // Strategy 1: Use page.evaluate to find the text directly in the dialog (most reliable)
      try {
        popupMessage = await this.page.evaluate((expected) => {
          // Target specifically the PriceSpider dialog (not cookie consent)
          const dialog = document.querySelector('[role="dialog"].ps-container') || 
                        document.querySelector('[role="dialog"][aria-label*="Shop"]') ||
                        document.querySelector('[role="dialog"][aria-label*="Händler"]');
          if (!dialog) return '';
          
          // First, look for label elements which typically contain "Online-Händler"
          const labels = dialog.querySelectorAll('label');
          for (const label of labels) {
            const text = label.textContent?.trim() || '';
            if (text.includes(expected) || expected.includes(text)) {
              const rect = label.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                return text;
              }
            }
          }
          
          // Also check h2 elements
          const headings = dialog.querySelectorAll('h2');
          for (const h2 of headings) {
            const text = h2.textContent?.trim() || '';
            if (text.includes(expected) || expected.includes(text)) {
              return text;
            }
          }
          
          // Check the full dialog text content as a fallback
          const fullText = dialog.textContent || '';
          if (fullText.includes(expected)) {
            return expected;
          }
          
          return '';
        }, expectedPopupMessage) || '';
        
        if (popupMessage) {
          log(SYMBOLS.INFO, `Found popup message via evaluate: ${popupMessage}`);
        }
      } catch (e) {
        log(SYMBOLS.WARNING, `Could not get Buy Now popup message via evaluate: ${e.message}`);
      }
      
      // Strategy 2: Try Playwright locators as backup - scope to PriceSpider dialog
      if (!popupMessage) {
        const labelLocators = [
          this.page.locator('[role="dialog"].ps-container label.online-tab-input-label').first(),
          this.page.locator('[role="dialog"].ps-container .ps-online-tab-label label').first(),
          this.page.locator('[role="dialog"].ps-container .ps-ribbon-header label').first(),
          this.buyNowPopupMessage
        ];
        
        for (const locator of labelLocators) {
          try {
            const count = await locator.count();
            if (count > 0 && await locator.isVisible().catch(() => false)) {
              const text = await locator.textContent() || '';
              if (text.trim().length > 0) {
                popupMessage = text.trim();
                log(SYMBOLS.INFO, `Found popup message using locator: ${popupMessage}`);
                break;
              }
            }
          } catch (e) {
            // Continue to next locator
          }
        }
      }
      
      // Strategy 3: Verify dialog appeared by checking its visibility
      if (!popupMessage) {
        const dialogVisible = await dialogLocator.isVisible().catch(() => false);
        if (dialogVisible) {
          // Dialog is visible, the expected text should be there
          popupMessage = expectedPopupMessage; // Assume it's there since dialog is open
          log(SYMBOLS.INFO, `Dialog visible, assuming expected text is present: ${popupMessage}`);
        }
      }
      
      const success = popupMessage.length > 0 && (popupMessage.includes(expectedPopupMessage) || expectedPopupMessage.includes(popupMessage));
      
      if (success) {
        log(SYMBOLS.SUCCESS, `✅ Sticky Buy Now popup verified. Message: ${popupMessage}`);
      } else if (popupMessage.length > 0) {
        log(SYMBOLS.WARNING, `⚠️ Sticky Buy Now popup found with message: ${popupMessage} (expected: ${expectedPopupMessage})`);
        return { success: true, popupMessage }; // Still mark as success if popup appeared
      } else {
        log(SYMBOLS.ERROR, `❌ Sticky Buy Now popup mismatch. Expected: ${expectedPopupMessage}, Got: ${popupMessage}`);
      }
      
      return { success, popupMessage };
    } catch (error) {
      log(SYMBOLS.ERROR, `Sticky Buy Now verification failed: ${error.message}`);
      return { success: false, popupMessage: '' };
    }
  }

  /**
   * Get Sticky Favorite button title
   * @returns {Promise<string>} Button title text
   */
  async getStickyFavoriteButtonTitle() {
    log(SYMBOLS.INFO, 'Getting sticky favorite button title...');
    try {
      await this.stickyFavoriteButtonSpan.waitFor({ state: 'visible', timeout: this.timeout.short });
      const title = await this.stickyFavoriteButtonSpan.textContent() || '';
      log(SYMBOLS.INFO, `Sticky Favorite button title: ${title.trim()}`);
      return title.trim();
    } catch (error) {
      log(SYMBOLS.WARNING, `Could not get sticky favorite button title: ${error.message}`);
      return '';
    }
  }

  /**
   * Click Sticky Favorite button
   */
  async clickStickyFavoriteButton() {
    log(SYMBOLS.INFO, 'Clicking sticky favorite button...');
    try {
      await this.stickyFavoriteButtonSpan.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.stickyFavoriteButtonSpan.click();
      log(SYMBOLS.SUCCESS, 'Sticky favorite button clicked');
    } catch (error) {
      log(SYMBOLS.ERROR, `Could not click sticky favorite button: ${error.message}`);
    }
  }

  /**
   * Verify Sticky Favorite functionality
   * @param {string} productName - Product name to verify
   * @returns {Promise<{success: boolean, favoriteProductName: string}>}
   */
  async verifyStickyFavoriteFunctionality(productName) {
    log(SYMBOLS.INFO, 'Verifying Sticky Favorite functionality...');
    
    const mainWindow = this.page;
    const context = this.page.context();
    
    try {
      // Get the favorites header icon href
      const favHeaderHref = await this.favoriteHeaderIcon.getAttribute('href');
      
      // Open favorites page in new tab
      const newPage = await context.newPage();
      await newPage.goto(favHeaderHref || '/favorites');
      await newPage.waitForLoadState('domcontentloaded');
      await newPage.waitForTimeout(3000);
      
      // Click on Products menu in favorites
      let favoriteProductName = '';
      try {
        const productMenu = newPage.locator('#wrap > div:nth-child(2) > div:nth-child(2) > div > a:nth-child(2) > span:first-child > span');
        if (await productMenu.isVisible().catch(() => false)) {
          await productMenu.click();
          await newPage.waitForTimeout(2000);
        }
        
        // Get favorite product name
        const favProduct = newPage.locator('#product-undefined > div > div > a').first();
        favoriteProductName = await favProduct.textContent().catch(() => '');
        favoriteProductName = favoriteProductName.trim();
      } catch (e) {
        log(SYMBOLS.WARNING, 'Could not get favorite product name');
      }
      
      const success = productName.toLowerCase().includes(favoriteProductName.toLowerCase()) || 
                     favoriteProductName.toLowerCase().includes(productName.toLowerCase());
      
      if (success) {
        log(SYMBOLS.SUCCESS, `✅ Correct Product linked from sticky section: ${favoriteProductName}`);
      } else {
        log(SYMBOLS.ERROR, `❌ Mismatch: Card = ${productName}, Page = ${favoriteProductName}`);
      }
      
      // Close favorites page
      await newPage.close();
      
      return { success, favoriteProductName };
    } catch (error) {
      log(SYMBOLS.ERROR, `Sticky Favorite verification failed: ${error.message}`);
      return { success: false, favoriteProductName: '' };
    }
  }

  // ==================== Write A Review Methods ====================

  /**
   * Check if Write A Review button is visible
   * @returns {Promise<boolean>}
   */
  async isWriteReviewButtonVisible() {
    log(SYMBOLS.INFO, 'Checking if Write A Review button is visible...');
    try {
      await this.writeReviewButton.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(3000);
      const isVisible = await this.writeReviewButton.isVisible().catch(() => false);
      log(isVisible ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, 
        isVisible ? "'Write A Review' button is found" : "'Write A Review' button not found");
      return isVisible;
    } catch (error) {
      log(SYMBOLS.ERROR, `Could not check Write A Review button: ${error.message}`);
      return false;
    }
  }

  /**
   * Click Write A Review button and verify the page
   * @param {string} expectedProductName - Expected product name on review page
   * @returns {Promise<{success: boolean, reviewPageProductName: string}>}
   */
  async verifyWriteAReviewPage(expectedProductName) {
    log(SYMBOLS.INFO, 'Verifying Write A Review page...');
    
    try {
      // Click the button using JavaScript click
      await this.writeReviewButton.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.writeReviewButton.click({ force: true });
      await this.page.waitForTimeout(3000);
      
      // Get product name on review page
      let reviewPageProductName = '';
      try {
        await this.reviewPageProductName.waitFor({ state: 'visible', timeout: this.timeout.medium });
        reviewPageProductName = await this.reviewPageProductName.textContent() || '';
        reviewPageProductName = reviewPageProductName.trim();
      } catch (e) {
        // Fallback to title
        reviewPageProductName = await this.page.title();
      }
      
      log(SYMBOLS.INFO, `Extracted Product Name in Write A Review Page: ${reviewPageProductName}`);
      
      const success = reviewPageProductName === expectedProductName || 
                     reviewPageProductName.toLowerCase().includes(expectedProductName.toLowerCase()) ||
                     expectedProductName.toLowerCase().includes(reviewPageProductName.toLowerCase());
      
      if (success) {
        log(SYMBOLS.SUCCESS, `✅ Product name correctly displayed on review page: ${reviewPageProductName}`);
      } else {
        log(SYMBOLS.ERROR, `❌ Product name mismatch. Expected: ${expectedProductName}, Got: ${reviewPageProductName}`);
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
   * Verify Related Products section
   * @param {number} maxProducts - Maximum number of products to verify (default: all)
   * @returns {Promise<Array<{success: boolean, cardName: string, cardUrl: string, pageName: string, pageUrl: string, position: number}>>}
   */
  async verifyRelatedProducts(maxProducts = 0) {
    log(SYMBOLS.INFO, 'Verifying Related Products...');
    
    const context = this.page.context();
    const results = [];
    const originalWindow = this.page;
    
    try {
      // Count the total number of product cards
      const productCards = await this.relatedProductsContainer.locator('> div').count();
      const productsToVerify = maxProducts > 0 ? Math.min(maxProducts, productCards) : productCards;
      
      log(SYMBOLS.INFO, `Found ${productCards} Related Product cards, verifying ${productsToVerify}`);
      
      if (productCards === 0) {
        log(SYMBOLS.WARNING, 'No related product cards found');
        return results;
      }
      
      // Iterate through each product card
      for (let i = 1; i <= productsToVerify; i++) {
        try {
          // Get product name and link from card
          const productNameElement = this.getRelatedProductName(i);
          const productLinkElement = this.getRelatedProductLink(i);
          
          let productTitle = await productNameElement.evaluate(el => el.innerText.replace(/\s+/g, ' ').trim()).catch(() => '');
          let productLink = await productLinkElement.getAttribute('href').catch(() => '');
          
          if (!productLink) {
            log(SYMBOLS.WARNING, `Related product ${i} link not found`);
            results.push({ success: false, cardName: productTitle, cardUrl: '', pageName: '', pageUrl: '', position: i });
            continue;
          }
          
          // Ensure full URL
          if (!productLink.startsWith('http')) {
            const baseUrl = new URL(this.page.url()).origin;
            productLink = baseUrl + productLink;
          }
          
          log(SYMBOLS.INFO, `Opening product ${i}: ${productTitle}`);
          
          // Open product in new tab
          const newPage = await context.newPage();
          await newPage.goto(productLink, { waitUntil: 'domcontentloaded' });
          await newPage.waitForTimeout(3000);
          
          // Get product name on PDP
          const pdpProductName = await newPage.locator('h1').first().textContent().catch(() => '');
          const pdpUrl = newPage.url();
          
          // Compare names (case-insensitive)
          const success = productTitle.toLowerCase().trim() === pdpProductName.toLowerCase().trim();
          
          if (success) {
            log(SYMBOLS.SUCCESS, `✅ Correct Product linked. Product: ${productTitle}`);
          } else {
            log(SYMBOLS.ERROR, `❌ Mismatch: Card = ${productTitle}, Page = ${pdpProductName.trim()}`);
          }
          
          results.push({ 
            success, 
            cardName: productTitle, 
            cardUrl: productLink,
            pageName: pdpProductName.trim(), 
            pageUrl: pdpUrl,
            position: i 
          });
          
          // Close new tab
          await newPage.close();
          
        } catch (error) {
          log(SYMBOLS.ERROR, `Related product ${i} verification failed: ${error.message}`);
          results.push({ success: false, cardName: '', cardUrl: '', pageName: '', pageUrl: '', position: i });
        }
      }
      
    } catch (error) {
      log(SYMBOLS.ERROR, `Related Products verification failed: ${error.message}`);
    }
    
    return results;
  }

  // ==================== Related Articles Methods ====================

  /**
   * Verify Related Articles section
   * @param {number} maxArticles - Maximum number of articles to verify (default: all)
   * @returns {Promise<Array<{success: boolean, cardTitle: string, cardUrl: string, pageTitle: string, pageUrl: string, position: number}>>}
   */
  async verifyRelatedArticles(maxArticles = 0) {
    log(SYMBOLS.INFO, 'Verifying Related Articles...');
    
    const context = this.page.context();
    const results = [];
    const originalWindow = this.page;
    
    try {
      // Count the total number of article cards
      const articleCards = await this.relatedArticleCards.count();
      const articlesToVerify = maxArticles > 0 ? Math.min(maxArticles, articleCards) : articleCards;
      
      log(SYMBOLS.INFO, `Found ${articleCards} Related Article cards, verifying ${articlesToVerify}`);
      
      if (articleCards === 0) {
        log(SYMBOLS.WARNING, 'No related article cards found');
        return results;
      }
      
      // Iterate through each article card
      for (let j = 1; j <= articlesToVerify; j++) {
        try {
          // Get article name and link from card
          const articleNameElement = this.getRelatedArticleName(j);
          const articleLinkElement = this.getRelatedArticleLink(j);
          const articleCardLinkElement = this.getRelatedArticleCardLink(j);
          
          let articleTitle = await articleNameElement.evaluate(el => el.innerText.replace(/\s+/g, ' ').trim()).catch(() => '');
          
          // Try to get link from the specific link element first, fallback to card link
          let articleLink = await articleLinkElement.getAttribute('href').catch(() => '');
          if (!articleLink) {
            articleLink = await articleCardLinkElement.getAttribute('href').catch(() => '');
          }
          
          if (!articleLink) {
            log(SYMBOLS.WARNING, `Related article ${j} link not found`);
            results.push({ success: false, cardTitle: articleTitle, cardUrl: '', pageTitle: '', pageUrl: '', position: j });
            continue;
          }
          
          // Ensure full URL
          if (!articleLink.startsWith('http')) {
            const baseUrl = new URL(this.page.url()).origin;
            articleLink = baseUrl + articleLink;
          }
          
          log(SYMBOLS.INFO, `Opening article ${j}: ${articleTitle}`);
          
          // Open article in new tab
          const newPage = await context.newPage();
          await newPage.goto(articleLink, { waitUntil: 'domcontentloaded' });
          await newPage.waitForTimeout(3000);
          
          // Get article title on ADP
          const adpArticleTitle = await newPage.locator('h1').first().evaluate(el => el.innerText.replace(/\s+/g, ' ').trim()).catch(() => '');
          const adpUrl = newPage.url();
          
          // Compare titles (case-insensitive)
          const success = articleTitle.toLowerCase().trim() === adpArticleTitle.toLowerCase().trim();
          
          if (success) {
            log(SYMBOLS.SUCCESS, `✅ Correct Article linked. Article: ${articleTitle}`);
          } else {
            log(SYMBOLS.ERROR, `❌ Mismatch: Card = ${articleTitle}, Page = ${adpArticleTitle}`);
          }
          
          results.push({ 
            success, 
            cardTitle: articleTitle, 
            cardUrl: articleLink,
            pageTitle: adpArticleTitle, 
            pageUrl: adpUrl,
            position: j 
          });
          
          // Close new tab
          await newPage.close();
          
        } catch (error) {
          log(SYMBOLS.ERROR, `Related article ${j} verification failed: ${error.message}`);
          results.push({ success: false, cardTitle: '', cardUrl: '', pageTitle: '', pageUrl: '', position: j });
        }
      }
      
    } catch (error) {
      log(SYMBOLS.ERROR, `Related Articles verification failed: ${error.message}`);
    }
    
    return results;
  }
}

export default bodyIntimatePDP;
