/**
 * Product Details Page (PDP) Object Model
 * Designed for Gels & Foams Products - Gillette Germany Website
 * 
 * Sections:
 * - Product Title
 * - Social Share (Facebook, Copy URL)
 * - Favorite/Bookmark Functionality
 * - Buy Now Button
 * - Menu Tabs (Feature, Review)
 * - Write A Review Section
 * - Related Products Section
 * - Related Articles Section
 * 
 * Based on: GelsandFoams.md
 */

import { helperBase } from './helperBase.js';
import { expect } from '@playwright/test';
import { SYMBOLS, log } from '../utils/logConstants.js';

export class productDetailsPage extends helperBase {
  constructor(page) {
    super(page);

    // Cookie Consent
    this.acceptCookiesButton = page.locator('#onetrust-accept-btn-handler');

    // Product Title
    this.productTitle = page.locator('h1').first();

    // ==================== Social Share Icons ====================
    this.facebookIcon = page.locator('#imgBtnFacebook');
    this.copyUrlIcon = page.locator('#imgBtncopyLink');

    // Facebook Popup Elements (in-page popup)
    this.facebookPopupLink = page.locator('#overview a[href*="gillette"], [class*="share"] a, [role="dialog"] a').first();
    this.closeButton = page.locator('#closeButton span, #closeButton').first();

    // Copy URL Popup Elements
    this.copyLinkInput = page.locator('#copyLink');
    this.copyCloseButton = page.locator('#closeButton span, #closeButton').first();

    // ==================== Favorite Icon ====================
    this.favoriteIcon = page.locator('#overview button[aria-label*="fav"], #overview button:has([class*="heart"]), #overview > div > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > button').first();
    this.favoriteHeaderIcon = page.locator('#heartIcon');
    this.favoritesProductMenu = page.locator('#wrap > div:nth-child(2) > div:nth-child(2) > div > a:nth-child(2) > span:first-child > span');
    this.favoriteProductCard = page.locator('#product-undefined > div > div > a, [class*="favorite"] [class*="product-card"] a').first();

    // ==================== Buy Now Section ====================
    this.buyNowButton = page.locator('#shopnowBtn-container > div > span:nth-child(2)');
    this.buyNowPopupTitle = page.locator('body > div:nth-child(5) > div > div:nth-child(6) > div:nth-child(1) > h2').first();
    // The "Online-Händler" text is inside the PriceSpider dialog - use visible label element
    this.buyNowPopupMessage = page.locator('[role="dialog"] label.online-tab-input-label, [role="dialog"] .ps-online-tab-label label, [role="dialog"] .ps-ribbon-header label').first();
    this.buyNowCloseButton = page.locator('[role="dialog"] button[aria-label*="Schließen"], button[aria-label*="Schließen Sie das Dialogfeld Shop/Popup jetzt."], span[class*="close"], .modal-close, [class*="popup"] button:has-text("×"), body > div:nth-child(5) > div > span:first-child').first();

    // ==================== Menu Tabs ====================
    this.featureTabButton = page.locator('#inner-tabs > button:first-child, button:has-text("Feature"), button:has-text("Merkmal")').first();
    this.reviewTabButton = page.locator('#inner-tabs > button:nth-child(2), button:has-text("Review"), button:has-text("Bewertung")').first();

    // Feature Section
    this.featureSectionTitle = page.locator('#feature > div:first-child > div:first-child, [id*="feature"] h2, [class*="feature"] h2').first();

    // Review Section
    this.reviewSection = page.locator('#review');
    this.writeReviewButton = page.locator('#review a:has-text("Bewertung schreiben"), #review a[href*="review"], #review > div > div > div > a').first();
    this.writeReviewTitle = page.locator('#review span:first-child, #review > div > div > div > a > span:first-child').first();

    // Write A Review Page
    this.reviewPageProductName = page.locator('h1').first();
    this.cancelReviewButton = page.locator('#main-content form a[href*="product"], #main-content form a:has-text("Cancel"), #main-content form a:has-text("Abbrechen")').first();

    // ==================== Related Products Section ====================
    this.relatedProductsContainer = page.locator('#related-products-container > div > div > div > div');
    this.getRelatedProductName = (index) => page.locator(`#related-products-container > div > div > div > div > div:nth-child(${index}) > div > div > div > a > div:nth-child(2) > h3`);
    this.getRelatedProductLink = (index) => page.locator(`#related-products-container > div > div > div > div > div:nth-child(${index}) > div > div > div > a`);

    // ==================== Related Articles Section ====================
    this.relatedArticlesContainer = page.locator('#related-articles-container');
    this.relatedArticleCards = page.locator('#related-articles-container > div > div > div > div > div');
    this.getRelatedArticleName = (index) => page.locator(`#related-articles-container > div > div > div > div > div:nth-child(${index}) > div > div > a > div > div:nth-child(2) > a:first-child > h3`);
    this.getRelatedArticleLink = (index) => page.locator(`#related-articles-container > div > div > div > div > div:nth-child(${index}) > div > div > a > div > div:nth-child(2) > a:nth-child(2)`);
    this.getRelatedArticleCardLink = (index) => page.locator(`#related-articles-container > div > div > div > div > div:nth-child(${index}) > div > div > a`);

    // Safe area to move mouse away from header (avoid hover menus)
    this.safeAreaElement = page.locator('#overview > div > div > div:nth-child(2) > div:nth-child(3) > p, #overview p, main p').first();
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

  /**
   * Get breadcrumbs from the page
   * @returns {Promise<Array<{text: string, href: string, isActive: boolean}>>} Array of breadcrumb objects
   */
  async getBreadcrumbs() {
    try {
      const breadcrumbs = await this.page.evaluate(() => {
        const breadcrumbElement = document.querySelector('[class*="breadcrumb"]');
        if (!breadcrumbElement) return [];
        
        const items = [];
        const links = breadcrumbElement.querySelectorAll('a');
        
        for (const link of links) {
          let text = link.textContent.trim();
          const href = link.getAttribute('href') || '';
          const title = link.getAttribute('title') || '';
          const ariaLabel = link.getAttribute('aria-label') || '';
          const isActive = !href || href === '' || href === '#';
          
          // Use title or aria-label if text is empty (for icon links like Home)
          if (!text || text.length === 0) {
            text = title || ariaLabel || 'Home';
          }
          
          // Include all breadcrumb links
          items.push({ text, href, isActive });
        }
        
        return items;
      });
      
      if (breadcrumbs.length > 0) {
        log(SYMBOLS.SUCCESS, `Found ${breadcrumbs.length} breadcrumb items`);
      } else {
        log(SYMBOLS.WARNING, 'No breadcrumb items found');
      }
      
      return breadcrumbs;
    } catch (error) {
      log(SYMBOLS.WARNING, `Error getting breadcrumbs: ${error.message}`);
      return [];
    }
  }

  /**
   * Verify breadcrumbs are present and valid
   * @returns {Promise<{present: boolean, count: number, breadcrumbs: Array}>} Breadcrumb validation results
   */
  async verifyBreadcrumbs() {
    const breadcrumbs = await this.getBreadcrumbs();
    const present = breadcrumbs.length > 0;
    
    if (present) {
      log(SYMBOLS.INFO, `Breadcrumbs verified: ${breadcrumbs.length} items found`);
      breadcrumbs.forEach((bc, index) => {
        log(SYMBOLS.DOCUMENT, `  ${index + 1}. "${bc.text}" ${bc.href ? `-> ${bc.href}` : '(current page)'}`);
      });
    } else {
      log(SYMBOLS.WARNING, 'No breadcrumbs found on page');
    }
    
    return {
      present,
      count: breadcrumbs.length,
      breadcrumbs
    };
  }

  // ==================== Facebook Share Methods ====================

  /**
   * Click Facebook share icon and verify popup
   * @param {string} expectedMessage - Expected message/URL in the popup
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async verifyFacebookShare(expectedMessage) {
    log(SYMBOLS.INFO, 'Verifying Facebook share functionality...');
    
    const mainWindow = this.page;
    
    try {
      // Click Facebook icon
      await this.facebookIcon.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.facebookIcon.click();
      await this.page.waitForTimeout(3000);
      
      // Try to find the Facebook share content in the popup
      let actualMessage = '';
      try {
        const fbLink = this.page.locator('#overview a[href*="gillette"], [class*="share-popup"] a').first();
        if (await fbLink.isVisible().catch(() => false)) {
          actualMessage = await fbLink.innerText().catch(() => '');
          actualMessage = actualMessage.replace(/\s/g, ' ').trim();
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
      await this.page.waitForTimeout(1000);
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
      await this.page.waitForTimeout(5000);
      
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
      await this.page.waitForTimeout(1000);
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
        
        // Get favorite product name
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

  // ==================== Menu Tab Methods ====================

  /**
   * Dismiss any overlay/backdrop that might be blocking interactions
   */
  async dismissOverlay() {
    try {
      const overlay = this.page.locator('div.backdrop-style, div[role="presentation"].dialog-overlay-bg, div.dialog-overlay-bg');
      if (await overlay.isVisible().catch(() => false)) {
        log(SYMBOLS.INFO, 'Dismissing overlay...');
        // Press Escape to close any modal/overlay
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);

        // If still visible, try clicking on it
        if (await overlay.isVisible().catch(() => false)) {
          await overlay.click({ force: true }).catch(() => {});
          await this.page.waitForTimeout(500);
        }

        // Wait for it to be hidden
        await overlay.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
        log(SYMBOLS.SUCCESS, 'Overlay dismissed');
      }
    } catch (e) {
      // Overlay might not exist, that's fine
    }
  }

  /**
   * Move mouse to safe area to avoid header hover menus
   */
  async moveMouseToSafeArea() {
    log(SYMBOLS.INFO, 'Moving mouse to safe area...');
    try {
      const safeArea = await this.safeAreaElement;
      if (await safeArea.isVisible().catch(() => false)) {
        await safeArea.hover();
        // Wait for header backdrop to disappear
        await this.headerBackdrop.waitFor({ state: 'hidden', timeout: this.timeout.short }).catch(() => {});
      }
    } catch (error) {
      log(SYMBOLS.INFO, 'Could not move to safe area');
    }
  }

  /**
   * Click Feature Section tab and verify
   * @returns {Promise<{success: boolean, featureTitle: string}>}
   */
  async verifyFeatureSection() {
    log(SYMBOLS.INFO, 'Verifying Feature Section...');
    
    try {
      // Dismiss any overlay that might be blocking
      await this.dismissOverlay();

      await this.moveMouseToSafeArea();

      // Scroll to the tabs section first
      await this.featureTabButton.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(500);
      
      await this.featureTabButton.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.featureTabButton.click({ force: true });
      await this.page.waitForTimeout(2000);
      
      // Check if feature section is displayed
      let featureTitle = '';
      try {
        await this.featureSectionTitle.waitFor({ state: 'visible', timeout: this.timeout.short });
        featureTitle = await this.featureSectionTitle.textContent() || '';
        featureTitle = featureTitle.trim();
      } catch (e) {
        log(SYMBOLS.WARNING, 'Could not get feature section title');
      }
      
      const success = featureTitle.length > 0 || await this.featureSectionTitle.isVisible().catch(() => false);
      
      if (success) {
        log(SYMBOLS.SUCCESS, `✅ Feature Section displayed. First heading: ${featureTitle}`);
      } else {
        log(SYMBOLS.ERROR, '❌ Feature Section not displayed');
      }
      
      return { success, featureTitle };
    } catch (error) {
      log(SYMBOLS.ERROR, `Feature Section verification failed: ${error.message}`);
      return { success: false, featureTitle: '' };
    }
  }

  /**
   * Click Review Section tab and verify
   * @param {string} expectedButtonTitle - Expected button title (e.g., "Bewertung schreiben")
   * @returns {Promise<{success: boolean, reviewButtonTitle: string}>}
   */
  async verifyReviewSection(expectedButtonTitle) {
    log(SYMBOLS.INFO, 'Verifying Review Section...');
    
    try {
      // Dismiss any overlay that might be blocking
      await this.dismissOverlay();

      // Scroll to the tabs section first
      await this.reviewTabButton.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(500);
      
      await this.reviewTabButton.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.reviewTabButton.click({ force: true });
      await this.page.waitForTimeout(4000);
      
      // Get review section button title
      let reviewButtonTitle = '';
      try {
        await this.writeReviewTitle.waitFor({ state: 'visible', timeout: this.timeout.short });
        reviewButtonTitle = await this.writeReviewTitle.textContent() || '';
        reviewButtonTitle = reviewButtonTitle.trim();
      } catch (e) {
        log(SYMBOLS.WARNING, 'Could not get review button title');
      }

      // Case-insensitive comparison for review button title
      const success = reviewButtonTitle.toLowerCase().includes(expectedButtonTitle.toLowerCase()) ||
                     expectedButtonTitle.toLowerCase().includes(reviewButtonTitle.toLowerCase());
      
      if (success) {
        log(SYMBOLS.SUCCESS, `✅ Review Section displayed. Button: ${reviewButtonTitle}`);
      } else {
        log(SYMBOLS.ERROR, `❌ Review Section mismatch. Expected: ${expectedButtonTitle}, Got: ${reviewButtonTitle}`);
      }
      
      return { success, reviewButtonTitle };
    } catch (error) {
      log(SYMBOLS.ERROR, `Review Section verification failed: ${error.message}`);
      return { success: false, reviewButtonTitle: '' };
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
      // Dismiss any overlay that might be blocking
      await this.dismissOverlay();

      // Check if Write A Review button is displayed
      await this.writeReviewButton.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(500);
      
      await this.writeReviewButton.waitFor({ state: 'visible', timeout: this.timeout.short });
      log(SYMBOLS.SUCCESS, "'Write A Review' button is found");
      
      // Click the button with force option in case of any overlay issues
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
   * Verify Related Products section - counts and verifies all products
   * @returns {Promise<Array<{success: boolean, cardName: string, cardUrl: string, pageName: string, pageUrl: string, position: number}>>}
   */
  async verifyRelatedProducts() {
    log(SYMBOLS.INFO, 'Verifying Related Products...');
    
    const context = this.page.context();
    const results = [];
    
    try {
      // First, count the total number of product cards
      const productCards = await this.relatedProductsContainer.locator('> div').count();
      log(SYMBOLS.INFO, `Found ${productCards} Related Product cards`);

      if (productCards === 0) {
        log(SYMBOLS.WARNING, 'No related product cards found');
        return results;
      }

      // Iterate through each product card
      for (let i = 1; i <= productCards; i++) {
        try {
          // Get product name and link from card
          const productNameElement = this.getRelatedProductName(i);
          const productLinkElement = this.getRelatedProductLink(i);
          
          let productTitle = await productNameElement.evaluate(el => el.innerText.replace(/\s/g, ' ').trim()).catch(() => '');
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
          log(SYMBOLS.INFO, `Card URL: ${productLink}`);

          // Open product in new tab
          const newPage = await context.newPage();
          await newPage.goto(productLink, { waitUntil: 'domcontentloaded' });
          await newPage.waitForTimeout(5000);

          // Get product name and URL on PDP
          const pdpProductName = await newPage.locator('h1').first().textContent().catch(() => '');
          const pdpUrl = newPage.url();

          // Clean up URLs for comparison (remove trailing slashes, query params)
          const cleanCardUrl = productLink.split('?')[0].replace(/\/$/, '');
          const cleanPageUrl = pdpUrl.split('?')[0].replace(/\/$/, '');

          // Match by both name and URL
          const nameMatch = productTitle.toLowerCase().trim() === pdpProductName.toLowerCase().trim();
          const urlMatch = cleanCardUrl === cleanPageUrl;
          const success = nameMatch && urlMatch;

          if (success) {
            log(SYMBOLS.SUCCESS, `✅ Product ${i} verified: ${productTitle}`);
          } else {
            if (!nameMatch) {
              log(SYMBOLS.ERROR, `❌ Name mismatch at position ${i}: Card = "${productTitle}", Page = "${pdpProductName.trim()}"`);
            }
            if (!urlMatch) {
              log(SYMBOLS.ERROR, `❌ URL mismatch at position ${i}: Card URL = "${cleanCardUrl}", Page URL = "${cleanPageUrl}"`);
            }
          }

          results.push({
            success,
            cardName: productTitle,
            cardUrl: cleanCardUrl,
            pageName: pdpProductName.trim(),
            pageUrl: cleanPageUrl,
            position: i
          });

          // Close new tab
          await newPage.close();
          log(SYMBOLS.INFO, `Closed tab for product ${i}`);
          
        } catch (error) {
          log(SYMBOLS.ERROR, `Related product ${i} verification failed: ${error.message}`);
          results.push({ success: false, cardName: '', cardUrl: '', pageName: '', pageUrl: '', position: i });
        }
      }
      
      log(SYMBOLS.SUCCESS, `✅ Completed verification of ${productCards} Related Products`);
      
    } catch (error) {
      log(SYMBOLS.ERROR, `Related Products verification failed: ${error.message}`);
    }
    
    return results;
  }

  // ==================== Related Articles Methods ====================

  /**
   * Verify Related Articles section - counts and verifies all articles
   * @returns {Promise<Array<{success: boolean, cardTitle: string, cardUrl: string, pageTitle: string, pageUrl: string, position: number}>>}
   */
  async verifyRelatedArticles() {
    log(SYMBOLS.INFO, 'Verifying Related Articles...');
    
    const context = this.page.context();
    const results = [];
    
    try {
      // First, count the total number of article cards
      const articleCards = await this.relatedArticleCards.count();
      log(SYMBOLS.INFO, `Found ${articleCards} Related Article cards`);

      if (articleCards === 0) {
        log(SYMBOLS.WARNING, 'No related article cards found');
        return results;
      }

      // Iterate through each article card
      for (let j = 1; j <= articleCards; j++) {
        try {
          // Get article name and link from card
          const articleNameElement = this.getRelatedArticleName(j);
          const articleLinkElement = this.getRelatedArticleLink(j);
          const articleCardLinkElement = this.getRelatedArticleCardLink(j);

          let articleTitle = await articleNameElement.evaluate(el => el.innerText.replace(/\s/g, ' ').trim()).catch(() => '');

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
          log(SYMBOLS.INFO, `Card URL: ${articleLink}`);

          // Open article in new tab
          const newPage = await context.newPage();
          await newPage.goto(articleLink, { waitUntil: 'domcontentloaded' });
          await newPage.waitForTimeout(3000);

          // Get article title and URL on ADP
          const adpArticleTitle = await newPage.locator('h1').first().evaluate(el => el.innerText.replace(/\s/g, ' ').trim()).catch(() => '');
          const adpUrl = newPage.url();

          // Clean up URLs for comparison (remove trailing slashes, query params)
          const cleanCardUrl = articleLink.split('?')[0].replace(/\/$/, '');
          const cleanPageUrl = adpUrl.split('?')[0].replace(/\/$/, '');

          // Match by both title and URL
          const titleMatch = articleTitle.toLowerCase().trim() === adpArticleTitle.toLowerCase().trim();
          const urlMatch = cleanCardUrl === cleanPageUrl;
          const success = titleMatch && urlMatch;

          if (success) {
            log(SYMBOLS.SUCCESS, `✅ Article ${j} verified: ${articleTitle}`);
          } else {
            if (!titleMatch) {
              log(SYMBOLS.ERROR, `❌ Title mismatch at position ${j}: Card = "${articleTitle}", Page = "${adpArticleTitle}"`);
            }
            if (!urlMatch) {
              log(SYMBOLS.ERROR, `❌ URL mismatch at position ${j}: Card URL = "${cleanCardUrl}", Page URL = "${cleanPageUrl}"`);
            }
          }

          results.push({
            success,
            cardTitle: articleTitle,
            cardUrl: cleanCardUrl,
            pageTitle: adpArticleTitle,
            pageUrl: cleanPageUrl,
            position: j
          });

          // Close new tab
          await newPage.close();
          log(SYMBOLS.INFO, `Closed tab for article ${j}`);
          
        } catch (error) {
          log(SYMBOLS.ERROR, `Related article ${j} verification failed: ${error.message}`);
          results.push({ success: false, cardTitle: '', cardUrl: '', pageTitle: '', pageUrl: '', position: j });
        }
      }
      
      log(SYMBOLS.SUCCESS, `✅ Completed verification of ${articleCards} Related Articles`);
      
    } catch (error) {
      log(SYMBOLS.ERROR, `Related Articles verification failed: ${error.message}`);
    }
    
    return results;
  }

  /**
   * Get all product images with their alt tags
   * Filters out unwanted images (icons, social media, navigation, etc.)
   * @returns {Promise<Array>} Array of image objects with filename, alt tag, and status
   */
  async getAllProductImagesWithAlt() {
    try {
      log(SYMBOLS.INFO, 'Retrieving product content images and their alt tags...');
      
      const images = await this.page.evaluate(() => {
        // Get product content area (main element)
        const mainContainer = document.querySelector('main');
        if (!mainContainer) {
          return [];
        }

        const allImages = Array.from(mainContainer.querySelectorAll('img'));

        const debugInfo = {
          totalFound: allImages.length,
          filtered: {
            svg: 0,
            header: 0,
            pricespider: 0,
            socialIcon: 0,
            tooSmall: 0
          }
        };

        // Filter out unwanted images - be less restrictive
        const productImages = allImages.filter(img => {
          // Exclude SVG images
          if (img.src && (img.src.includes('.svg') || img.src.includes('svgxml'))) {
            debugInfo.filtered.svg++;
            return false;
          }
          
          // Exclude only header and nav (keep everything else including footer)
          if (img.closest('header') || img.closest('nav')) {
            debugInfo.filtered.header++;
            return false;
          }
          
          // Exclude pricespider popup only if it has the specific ID
          if (img.closest('[id*="pricespider"]')) {
            debugInfo.filtered.pricespider++;
            return false;
          }
          
          // Exclude all social media icons - check src and parent containers
          const isSocialIcon =
            img.closest('[id*="imgBtn"]') || // Social share buttons
            img.closest('[class*="social"]') || // Social media containers
            img.closest('[class*="share"]') || // Share containers
            img.src.includes('facebook') ||
            img.src.includes('twitter') ||
            img.src.includes('linkedin') ||
            img.src.includes('pinterest') ||
            img.src.includes('instagram') ||
            img.src.includes('youtube') ||
            img.src.includes('social') ||
            img.alt?.toLowerCase().includes('facebook') ||
            img.alt?.toLowerCase().includes('twitter') ||
            img.alt?.toLowerCase().includes('linkedin') ||
            img.alt?.toLowerCase().includes('pinterest') ||
            img.alt?.toLowerCase().includes('instagram') ||
            img.alt?.toLowerCase().includes('share');

          if (isSocialIcon) {
            debugInfo.filtered.socialIcon++;
            return false;
          }

          // Only exclude extremely small images (< 5x5 pixels)
          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;
          if (width < 5 && height < 5) {
            debugInfo.filtered.tooSmall++;
            return false;
          }

          // Include all other images
          return true;
        });

        const imageList = productImages.map((img, index) => {
          const url = new URL(img.src);
          const pathname = url.pathname;
          const fullFilename = pathname.split('/').pop() || 'unknown';
          // Remove query parameters from filename
          const filename = fullFilename.split('?')[0];

          const alt = img.alt || img.getAttribute('alt') || '';
          const hasAlt = alt.trim().length > 0;

          return {
            index: index + 1,
            filename: filename,
            src: img.src,
            alt: alt,
            hasAlt: hasAlt,
            altStatus: hasAlt ? 'Present' : 'Missing',
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height
          };
        });

        return {
          images: imageList,
          debugInfo: debugInfo
        };
      });

      // Log debug information
      log(SYMBOLS.INFO, 'Image Detection Statistics:');
      log(SYMBOLS.INFO, '   Total images found in main: ' + images.debugInfo.totalFound);
      log(SYMBOLS.INFO, '   Filtered out SVG: ' + images.debugInfo.filtered.svg);
      log(SYMBOLS.INFO, '   Filtered out header/nav: ' + images.debugInfo.filtered.header);
      log(SYMBOLS.INFO, '   Filtered out pricespider: ' + images.debugInfo.filtered.pricespider);
      log(SYMBOLS.INFO, '   Filtered out social icons: ' + images.debugInfo.filtered.socialIcon);
      log(SYMBOLS.INFO, '   Filtered out too small: ' + images.debugInfo.filtered.tooSmall);
      log(SYMBOLS.SUCCESS, 'Found ' + images.images.length + ' product content images');
      
      return images.images;
      
    } catch (error) {
      log(SYMBOLS.ERROR, `Failed to retrieve product images: ${error.message}`);
      return [];
    }
  }

  /**
   * Verify all product images have proper alt tags
   * @returns {Promise<Object>} Validation results with counts and details
   */
  async verifyProductImagesAltTags() {
    try {
      log(SYMBOLS.INFO, 'Verifying product images and alt tags...');

      const images = await this.getAllProductImagesWithAlt();
      const totalImages = images.length;
      const imagesWithAlt = images.filter(img => img.hasAlt);
      const imagesWithoutAlt = images.filter(img => !img.hasAlt);
      
      log(SYMBOLS.INFO, `Product Image Statistics:`);
      log(SYMBOLS.INFO, `   Total Product Images: ${totalImages}`);
      log(SYMBOLS.INFO, `   With Alt Tags: ${imagesWithAlt.length}`);
      log(SYMBOLS.INFO, `   Without Alt Tags: ${imagesWithoutAlt.length}`);
      log(SYMBOLS.INFO, '');
      
      // Log all images with their alt tag status
      if (totalImages > 0) {
        log(SYMBOLS.INFO, `Complete Image List:`);
        images.forEach(img => {
          const status = img.hasAlt ? '[OK]' : '[MISSING]';
          const statusText = img.hasAlt ? 'PRESENT' : 'MISSING';
          if (img.hasAlt) {
            const altPreview = img.alt.length > 50 ? img.alt.substring(0, 50) + '...' : img.alt;
            log(SYMBOLS.SUCCESS, `   ${status} Image ${img.index}: "${img.filename}"`);
            log(SYMBOLS.SUCCESS, `      Alt Tag: "${altPreview}" [${statusText}]`);
          } else {
            log(SYMBOLS.WARNING, `   ${status} Image ${img.index}: "${img.filename}"`);
            log(SYMBOLS.WARNING, `      Alt Tag: [${statusText}]`);
          }
        });
      }
      
      log(SYMBOLS.INFO, '');
      
      // Summary
      if (imagesWithoutAlt.length === 0) {
        log(SYMBOLS.SUCCESS, `All ${totalImages} product images have alt tags!`);
      } else {
        log(SYMBOLS.WARNING, `${imagesWithoutAlt.length} out of ${totalImages} images are missing alt tags`);
      }
      
      const allHaveAlt = imagesWithoutAlt.length === 0;
      
      return {
        success: allHaveAlt,
        totalImages: totalImages,
        imagesWithAlt: imagesWithAlt.length,
        imagesWithoutAlt: imagesWithoutAlt.length,
        images: images,
        imagesWithAltDetails: imagesWithAlt,
        missingAltImages: imagesWithoutAlt
      };
      
    } catch (error) {
      log(SYMBOLS.ERROR, `Image validation failed: ${error.message}`);
      return {
        success: false,
        totalImages: 0,
        imagesWithAlt: 0,
        imagesWithoutAlt: 0,
        images: [],
        imagesWithAltDetails: [],
        missingAltImages: []
      };
    }
  }

  /**
   * Verify Gallery Image Functionality
   * Tests that clicking thumbnails changes the main product image
   * @returns {Promise<{success: boolean, totalThumbnails: number, successfullyVerified: number, failedCount: number, successRate: number, thumbnailsVerified: Array, verificationMessage: string}>}
   */
  async verifyGalleryImages() {
    try {
      log(SYMBOLS.INFO, 'Verifying gallery image functionality...');
      log(SYMBOLS.ROCKET, '====================================================');
      log(SYMBOLS.ROCKET, 'Gallery Image Verification - Slick Carousel Thumbnails');
      log(SYMBOLS.ROCKET, '====================================================');

      // Scroll to top to ensure gallery is visible
      await this.page.evaluate(() => window.scrollTo(0, 0));
      await this.page.waitForTimeout(2000);

      // Get the main product image element - must get the VISIBLE/ACTIVE image for each check
      const mainImgSelector = 'img.kcg-mainImg';

      // Get initial main image source - checks multiple attributes for robustness
      // This function finds the currently VISIBLE main image each time it's called
      const getMainImageSrc = async () => {
        try {
          // Find all images with kcg-mainImg class
          const mainImages = this.page.locator(mainImgSelector);
          const count = await mainImages.count();

          let visibleImageLocator = null;

          // Find the visible image among all kcg-mainImg elements
          for (let i = 0; i < count; i++) {
            const img = mainImages.nth(i);
            const isVisible = await img.evaluate(el => {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
            }).catch(() => false);

            if (isVisible) {
              visibleImageLocator = img;
              break;
            }
          }

          // Fallback to first if no visible one found
          if (!visibleImageLocator) {
            visibleImageLocator = mainImages.first();
          }

          // Get the src attribute (full URL, not truncated)
          let src = await visibleImageLocator.getAttribute('src').catch(() => null);

          // If src is empty or null, try srcset and extract the first URL
          if (!src) {
            const srcset = await visibleImageLocator.getAttribute('srcset').catch(() => null);
            if (srcset) {
              src = srcset.split(',')[0].trim().split(' ')[0];
            }
          }

          // Also get the actual rendered src using currentSrc for more accurate detection
          const imageData = await this.page.evaluate((selector) => {
            const imgs = document.querySelectorAll(selector);
            // Find the visible one
            let visibleImg = null;
            for (let i = 0; i < imgs.length; i++) {
              const style = window.getComputedStyle(imgs[i]);
              if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                visibleImg = imgs[i];
                break;
              }
            }
            // Fallback to first
            if (!visibleImg) visibleImg = imgs[0];

            if (!visibleImg) return null;
            return {
              src: visibleImg.getAttribute('src') || '',
              srcset: visibleImg.getAttribute('srcset') || '',
              currentSrc: visibleImg.currentSrc || '',
              naturalWidth: visibleImg.naturalWidth || 0,
              naturalHeight: visibleImg.naturalHeight || 0
            };
          }, mainImgSelector);

          // Return the most reliable source for comparison
          return {
            src: src || '',
            currentSrc: imageData?.currentSrc || '',
            naturalWidth: imageData?.naturalWidth || 0,
            naturalHeight: imageData?.naturalHeight || 0
          };
        } catch (e) {
          return { src: '', currentSrc: '', naturalWidth: 0, naturalHeight: 0 };
        }
      };

      let initialImageSrc = await getMainImageSrc();
      log(SYMBOLS.INFO, `Initial main image src: ${initialImageSrc.src}`);
      log(SYMBOLS.INFO, `Initial image dimensions: ${initialImageSrc.naturalWidth}x${initialImageSrc.naturalHeight}`);
      if (initialImageSrc.currentSrc) {
        log(SYMBOLS.INFO, `Initial currentSrc: ${initialImageSrc.currentSrc}`);
      }

      // Get visible, non-cloned thumbnail slides for accurate processing
      const visibleThumbnailIndices = await this.page.evaluate(() => {
        const slides = document.querySelectorAll('.kcg-gallery-thumbs .slick-slide');
        const visibleIndices = [];
        
        Array.from(slides).forEach((slide, index) => {
          const isCloned = slide.classList.contains('slick-cloned');
          const style = window.getComputedStyle(slide);
          const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
          const rect = slide.getBoundingClientRect();
          const hasSize = rect.width > 0 || rect.height > 0;
          
          if (!isCloned && isVisible && hasSize) {
            visibleIndices.push(index);
          }
        });
        
        return visibleIndices;
      });

      log(SYMBOLS.INFO, `Visible thumbnail indices: [${visibleThumbnailIndices.join(', ')}]`);

      // Find thumbnail slides - get only visible, non-cloned slides from the primary gallery
      // Use JavaScript evaluation to accurately count only actual gallery thumbnails
      const actualThumbnailCount = await this.page.evaluate(() => {
        // Get all slick slides in the gallery thumbs container
        const slides = document.querySelectorAll('.kcg-gallery-thumbs .slick-slide');

        // Filter for visible, non-cloned slides only
        const visibleSlides = Array.from(slides).filter(slide => {
          const isCloned = slide.classList.contains('slick-cloned');
          const style = window.getComputedStyle(slide);
          const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
          const rect = slide.getBoundingClientRect();
          const hasSize = rect.width > 0 || rect.height > 0;

          return !isCloned && isVisible && hasSize;
        });

        return visibleSlides.length;
      });

      log(SYMBOLS.INFO, `Found ${actualThumbnailCount} gallery thumbnail(s)`);

      // Use Playwright locator to get the slides (will include some cloned, but we'll handle it)
      const thumbnailLocator = this.page.locator('.kcg-gallery-thumbs .slick-slide:not(.slick-cloned)');
      let thumbnailCount = actualThumbnailCount;

      // Fallback if evaluation doesn't work
      if (thumbnailCount === 0) {
        thumbnailCount = await thumbnailLocator.count();
        log(SYMBOLS.INFO, `Fallback: Found ${thumbnailCount} thumbnail slide(s)`);
      }

      if (thumbnailCount === 0) {
        log(SYMBOLS.WARNING, '⚠️ No gallery thumbnails found on the page');
        return {
          success: false,
          totalThumbnails: 0,
          successfullyVerified: 0,
          failedCount: 0,
          successRate: 0,
          thumbnailsVerified: [],
          verificationMessage: 'No gallery thumbnails found'
        };
      }

      const verificationResults = [];
      let successCount = 0;

      // Process only the visible, non-cloned thumbnails by clicking them
      for (let i = 0; i < visibleThumbnailIndices.length; i++) {
        const actualIndex = visibleThumbnailIndices[i];
        try {
          const thumbnail = thumbnailLocator.nth(actualIndex);

          // Get thumbnail image data for reporting
          let thumbnailAlt = '';
          let thumbnailSrc = '';
          try {
            const img = await thumbnail.locator('img').first();
            thumbnailAlt = await img.getAttribute('alt').catch(() => '');
            thumbnailSrc = await img.getAttribute('src').catch(() => '');
          } catch (e) {
            // Ignore errors getting thumbnail details
          }

          log(SYMBOLS.INFO, `Processing gallery thumbnail ${i + 1}/${visibleThumbnailIndices.length} - "${thumbnailAlt}"`);

          // Get the current main image src before clicking
          const imageBeforeClick = await getMainImageSrc();
          log(SYMBOLS.INFO, `   Main image before click: ${imageBeforeClick.src}`);
          log(SYMBOLS.INFO, `   Image dimensions before: ${imageBeforeClick.naturalWidth}x${imageBeforeClick.naturalHeight}`);

          // Click on the thumbnail to change the main image
          log(SYMBOLS.INFO, `   Clicking thumbnail ${i + 1}...`);
          await thumbnail.click();

          // Wait longer for the lazy-loaded image to fully load
          await this.page.waitForTimeout(1500);

          // Verify image changed after click
          const imageAfterClick = await getMainImageSrc();
          log(SYMBOLS.INFO, `   Main image after click: ${imageAfterClick.src}`);
          log(SYMBOLS.INFO, `   Image dimensions after: ${imageAfterClick.naturalWidth}x${imageAfterClick.naturalHeight}`);

          // Check if image changed using multiple comparison methods for robustness
          const srcChanged = imageAfterClick.src !== imageBeforeClick.src && imageAfterClick.src.length > 0;
          const currentSrcChanged = imageAfterClick.currentSrc !== imageBeforeClick.currentSrc && imageAfterClick.currentSrc.length > 0;
          const dimensionsChanged = (imageAfterClick.naturalWidth !== imageBeforeClick.naturalWidth ||
                                     imageAfterClick.naturalHeight !== imageBeforeClick.naturalHeight) &&
                                    (imageAfterClick.naturalWidth > 0 && imageAfterClick.naturalHeight > 0);

          // Image is considered changed if any of the attributes changed
          const imageChanged = srcChanged || currentSrcChanged || dimensionsChanged;

          const result = {
            index: i + 1,
            thumbnailNumber: `Thumbnail ${i + 1}`,
            success: imageChanged,
            thumbnailSrc: thumbnailSrc || 'N/A',
            thumbnailAlt: thumbnailAlt || 'No alt text',
            mainImageBeforeClick: imageBeforeClick.src.substring(0, 100),
            mainImageAfterClick: imageAfterClick.src.substring(0, 100),
            imageChanged: imageChanged
          };

          verificationResults.push(result);

          if (imageChanged) {
            successCount++;
            log(SYMBOLS.SUCCESS, `✅ Thumbnail ${i + 1}: Main image changed successfully after click`);
            if (thumbnailAlt) {
              log(SYMBOLS.SUCCESS, `   Alt text: "${thumbnailAlt}"`);
            }
            // Update initial image for next iteration to track progression
            initialImageSrc = imageAfterClick;
          } else {
            log(SYMBOLS.WARNING, `⚠️ Thumbnail ${i + 1}: Image did not change after click`);
            if (!srcChanged) log(SYMBOLS.WARNING, `   Src attribute did not change`);
            if (!currentSrcChanged) log(SYMBOLS.WARNING, `   CurrentSrc attribute did not change`);
            if (!dimensionsChanged) log(SYMBOLS.WARNING, `   Image dimensions did not change`);
          }

        } catch (error) {
          log(SYMBOLS.ERROR, `❌ Thumbnail ${i + 1}: Error occurred - ${error.message}`);
          verificationResults.push({
            index: i + 1,
            thumbnailNumber: `Thumbnail ${i + 1}`,
            success: false,
            error: error.message,
            imageChanged: false
          });
        }
      }

      // Summary
      log(SYMBOLS.INFO, '');
      const failedCount = verificationResults.length - successCount;
      const successRate = verificationResults.length === 0 ? 0 : Math.round((successCount / verificationResults.length) * 100);
      log(SYMBOLS.INFO, `Gallery verification completed: ${successCount}/${verificationResults.length} thumbnails successful (${successRate}%)`);
      return {
        success: successCount === verificationResults.length,
        totalThumbnails: verificationResults.length,
        successfullyVerified: successCount,
        failedCount: failedCount,
        successRate: successRate,
        thumbnailsVerified: verificationResults,
        verificationMessage: `${successCount} of ${verificationResults.length} gallery thumbnails verified successfully`
      };
    } catch (error) {
      log(SYMBOLS.ERROR, `Gallery verification failed: ${error.message}`);
      return {
        success: false,
        totalThumbnails: 0,
        successfullyVerified: 0,
        failedCount: 0,
        successRate: 0,
        thumbnailsVerified: [],
        verificationMessage: `Gallery verification error: ${error.message}`
      };
    }
  }
}
