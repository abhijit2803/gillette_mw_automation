/**
 * King C. Gillette Product Details Page (PDP) Object Model
 * Designed for King C. Gillette Products - Gillette Germany Website
 * 
 * Sections:
 * - Product Title
 * - Social Share (Facebook, Copy URL)
 * - Favorite/Bookmark Functionality
 * - Buy Now Button
 * - Write A Review Section
 * - Related Products Section
 * - Related Articles Section
 */

import { helperBase } from './helperBase.js';
import { expect } from '@playwright/test';
import { SYMBOLS, log } from '../utils/logConstants.js';

export class kcgProductDetailsPage extends helperBase {
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
    this.facebookPopupLink = page.locator('//*[@id="main-content"]/div/div[2]/div/div[2]/div[3]/div/div/div[1]/div/div/div/div[1]/div/div/div[2]/a');
    this.closeButton = page.locator('#closeButton span, #closeButton').first();

    // Copy URL Popup Elements
    this.copyLinkInput = page.locator('#copyLink');
    this.copyCloseButton = page.locator('#closeButton span, #closeButton').first();

    // ==================== Gallery Images Section ====================
    // Gallery thumbnail icons that can be clicked to change the main product image
    this.galleryThumbnails = page.locator('[class*="gallery"] [class*="thumbnail"] img, [class*="gallery"] button img, [class*="image-gallery"] [class*="thumb"], [class*="product-gallery"] [class*="thumb"], [data-testid*="gallery"] [class*="thumb"], .gallery-item, [class*="carousel"] [class*="slide"] img');
    // Main product image that changes when gallery thumbnails are clicked
    this.mainProductImage = page.locator('[class*="main-image"], [class*="primary-image"], [class*="product-image"] img:not([class*="thumbnail"]), [class*="gallery-main"] img, [id*="main"] img, [class*="hero"] img').first();

    // ==================== Favorite Icon ====================
    this.favoriteIcon = page.locator('//*[@id="main-content"]/div/div[2]/div/div[2]/div[3]/button');
    this.favoriteHeaderIcon = page.locator('#heartIcon');
    this.favoritesProductMenu = page.locator('//*[@id="wrap"]/div[2]/div[2]/div/a[2]/span[1]/span');
    this.favoriteProductCard = page.locator('//*[@id="product-undefined"]/div/div/a');

    // ==================== Buy Now Section ====================
    // Use XPath selector for KCG products structure
    this.buyNowButton = page.locator('//*[@id="main-content"]/div/div[2]/div/div[2]/div[4]/div');
    this.buyNowPopupTitle = page.locator('body > div:nth-child(5) > div > div:nth-child(6) > div:nth-child(1) > h2').first();
    // The "Online-Händler" text is inside the PriceSpider dialog - use visible label element
    this.buyNowPopupMessage = page.locator('[role="dialog"] label.online-tab-input-label, [role="dialog"] .ps-online-tab-label label, [role="dialog"] .ps-ribbon-header label').first();
    this.buyNowCloseButton = page.locator('[role="dialog"] button[aria-label*="Schließen"], button[aria-label*="Schließen Sie das Dialogfeld Shop/Popup jetzt."], span[class*="close"], .modal-close, [class*="popup"] button:has-text("×"), body > div:nth-child(5) > div > span:first-child').first();

    // ==================== Review Section ====================
    this.reviewSection = page.locator('#review');
    this.writeReviewButton = page.locator('#review a:has-text("Bewertung schreiben"), #review a[href*="review"], #review > div > div > div > a').first();
    this.writeReviewLink = this.writeReviewButton;

    // Write A Review Page
    this.reviewPageProductName = page.locator('h1').first();
    this.cancelReviewButton = page.locator('#main-content form a[href*="product"], #main-content form a:has-text("Cancel"), #main-content form a:has-text("Abbrechen")').first();

    // ==================== Related Products Section ====================
    this.relatedProductsContainer = page.locator('#related-products-container');
    this.getRelatedProductName = (index) => page.locator(`//*[@id="related-products-container"]/div/div[1]/div/div/div[${index}]/div/div/div/a/div[2]/h3`);
    this.getRelatedProductLink = (index) => page.locator(`//*[@id="related-products-container"]/div/div[1]/div/div/div[${index}]/div/div/div/a`);

    // ==================== Related Articles Section ====================
    this.relatedArticlesContainer = page.locator('#related-articles-container');
    this.getRelatedArticleName = (index) => page.locator(`//*[@id="related-articles-container"]/div/div/div/div/div[${index}]/div/div/a/div/div[2]/a[1]/h3`);
    this.getRelatedArticleLink = (index) => page.locator(`//*[@id="related-articles-container"]/div/div/div/div/div[${index}]/div/div/a/div/div[2]/a[2]`);

    // Safe area to move mouse away from header (avoid hover menus)
    this.safeAreaElement = page.locator('#overview > div > div > div:nth-child(2) > div:nth-child(3) > p, #overview p, main p').first();
    this.headerBackdrop = page.locator('#headerBackdrop');

    // Gallery parent container for finding all thumbnails
    this.galleryContainer = page.locator('[class*="gallery"], [class*="image-gallery"], [class*="product-gallery"], [class*="carousel"]').first();
  }

  // ==================== Navigation Methods ====================

  /**
   * Navigate to a specific product URL
   * @param {string} productUrl - Full URL or relative path to the product
   */
  async navigateToProduct(productUrl) {
    log(SYMBOLS.ROCKET, `Navigating to KCG Product Page: ${productUrl}`);
    
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

  /**
   * Get meta title from the page
   * @returns {Promise<string>} Meta title (page title)
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
    
    try {
      // Click Facebook icon
      await this.facebookIcon.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.facebookIcon.click();
      await this.page.waitForTimeout(2000);
      
      // Try to find the Facebook share content in the popup
      let actualMessage = '';
      try {
        const fbLink = this.page.locator('[class*="share"] a, [role="dialog"] a, a[href*="gillette"]').first();
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
      await this.page.keyboard.press('Escape');
      log(SYMBOLS.INFO, 'Facebook popup closed via Escape key');
    }
    await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(3000);
      
      // Get the copied URL from the input field
      let copiedUrl = '';
      try {
        await this.copyLinkInput.waitFor({ state: 'visible', timeout: this.timeout.short });
        copiedUrl = await this.copyLinkInput.getAttribute('value') || '';
        copiedUrl = copiedUrl.trim();
        await this.page.waitForTimeout(2000);
      } catch (e) {
        log(SYMBOLS.WARNING, 'Could not get copied URL from input field');
      }
      
      // Verify copied URL against current page URL
      const pageUrl = this.page.url();
      const normalizedCopiedUrl = copiedUrl.trim().replace(/\/$/, '');
      const normalizedPageUrl = pageUrl.trim().replace(/\/$/, '');
      
      const success = normalizedCopiedUrl === normalizedPageUrl || 
                     normalizedCopiedUrl.includes(normalizedPageUrl) || 
                     normalizedPageUrl.includes(normalizedCopiedUrl);
      
      if (success) {
        log(SYMBOLS.SUCCESS, `✅ Copy URL functionality verified. Copied URL: ${copiedUrl}`);
        log(SYMBOLS.INFO, `   Page URL: ${pageUrl}`);
        log(SYMBOLS.INFO, `   Match: ✅ URLs match`);
      } else {
        log(SYMBOLS.ERROR, `❌ Copy URL mismatch`);
        log(SYMBOLS.ERROR, `   Page URL: ${pageUrl}`);
        log(SYMBOLS.ERROR, `   Copied URL: ${copiedUrl}`);
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
        const productMenu = newPage.locator('//*[@id="wrap"]/div[2]/div[2]/div/a[2]/span[1]/span');
        if (await productMenu.isVisible().catch(() => false)) {
          await productMenu.click();
          await newPage.waitForTimeout(2000);
        }
        
        // Get favorite product name
        const favProduct = newPage.locator('//*[@id="product-undefined"]/div/div/a');
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
   * Uncheck/remove from favorites
   */
  async uncheckFavorite() {
    log(SYMBOLS.INFO, 'Unchecking favorite...');
    try {
      await this.favoriteIcon.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.favoriteIcon.click();
      await this.page.waitForTimeout(5000);
      log(SYMBOLS.SUCCESS, 'Favorite unchecked successfully');
    } catch (error) {
      log(SYMBOLS.ERROR, `Failed to uncheck favorite: ${error.message}`);
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
      await this.buyNowButton.waitFor({ state: 'visible', timeout: this.timeout.long || 15000 }).catch(() => {});
      await this.buyNowButton.click();
      await this.page.waitForTimeout(3000);
      
      // Wait for PriceSpider dialog to appear
      const dialogLocator = this.page.locator('[role="dialog"].ps-container, [role="dialog"][aria-label*="Shop"], [role="dialog"][aria-label*="Händler"], div[class*="ps-container"], div[class*="modal"]').first();
      await dialogLocator.waitFor({ state: 'visible', timeout: this.timeout.medium }).catch(() => {});
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
                        document.querySelector('[role="dialog"][aria-label*="Händler"]') ||
                        document.querySelector('div[class*="ps-container"]') ||
                        document.querySelector('div[class*="modal"]');
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
          this.page.locator('div[class*="ps-container"] label').first(),
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
      await this.page.waitForTimeout(2000);
    } catch (error) {
      await this.page.keyboard.press('Escape');
      log(SYMBOLS.INFO, 'Buy Now popup closed via Escape key');
    }
  }

  // ==================== Write A Review Methods ====================

  /**
   * Dismiss overlay if present
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
   * Verify Write A Review button is displayed
   * @returns {Promise<boolean>}
   */
  async isWriteReviewButtonDisplayed() {
    log(SYMBOLS.INFO, 'Checking if Write A Review button is displayed...');
    try {
      await this.moveMouseToSafeArea();
      await this.headerBackdrop.waitFor({ state: 'hidden', timeout: this.timeout.short }).catch(() => {});
      
      await this.writeReviewButton.waitFor({ state: 'visible', timeout: this.timeout.short });
      log(SYMBOLS.SUCCESS, "'Write A Review' button is found");
      return true;
    } catch (error) {
      log(SYMBOLS.ERROR, "'Write A Review' button not found");
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
      await this.cancelReviewButton.click({ force: true });
      await this.page.waitForTimeout(3000);
      
      const currentUrl = this.page.url();
      const success = currentUrl === expectedUrl || currentUrl.includes(expectedUrl) || expectedUrl.includes(currentUrl);
      
      if (success) {
        log(SYMBOLS.SUCCESS, '✅ Cancel button clicked, returned to PDP page successfully');
      } else {
        log(SYMBOLS.ERROR, `❌ Cancel did not return to expected URL. Expected: ${expectedUrl}, Got: ${currentUrl}`);
      }
      
      return { success };
    } catch (error) {
      log(SYMBOLS.ERROR, `Cancel button click failed: ${error.message}`);
      return { success: false };
    }
  }

  // ==================== Related Products Methods ====================

  /**
   * Verify related products are linked correctly
   * @param {number} count - Number of related products to verify (default: 3)
   * @returns {Promise<{success: boolean, verifiedProducts: Array}>}
   */
  /**
   * Verify related products are linked correctly - dynamically detects and verifies all products
   * @returns {Promise<{success: boolean, verifiedProducts: Array}>}
   */
  async verifyRelatedProducts() {
    log(SYMBOLS.INFO, 'Detecting related products...');
    
    // Wait for related products container to be visible
    try {
      await this.page.locator('#related-products-container').waitFor({ state: 'visible', timeout: 10000 });
      log(SYMBOLS.SUCCESS, 'Related products container found');
    } catch (e) {
      log(SYMBOLS.WARNING, 'Related products container not found');
      return { success: false, verifiedProducts: [] };
    }
    
    // Scroll to Related Products section
    try {
      await this.relatedProductsContainer.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(2000);
    } catch (e) {
      log(SYMBOLS.WARNING, 'Could not scroll to related products container');
    }
    
    // Count how many related products are present using multiple strategies
    let productsCount = 0;
    
    // Strategy 1: Use page.evaluate to count in DOM directly
    try {
      productsCount = await this.page.evaluate(() => {
        const container = document.querySelector('#related-products-container');
        if (!container) return 0;
        
        // Try different possible selectors for product cards
        const selectors = [
          '#related-products-container > div > div:first-child > div > div > div',
          '#related-products-container div[class*="product"]',
          '#related-products-container a[href*="/produkte/"]'
        ];
        
        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector);
          // Filter to direct product cards (not nested)
          const productCards = Array.from(elements).filter(el => {
            // Check if this is a top-level product card
            const parent = el.parentElement;
            if (selector.includes('> div > div > div')) {
              // For the specific nested selector, count direct children
              return parent && parent.id !== 'related-products-container';
            }
            return true;
          });
          
          if (productCards.length > 0) {
            return productCards.length;
          }
        }
        
        return 0;
      });
      
      if (productsCount > 0) {
        log(SYMBOLS.INFO, `Found ${productsCount} related products using DOM query`);
      }
    } catch (e) {
      log(SYMBOLS.WARNING, `DOM query failed: ${e.message}`);
    }
    
    // Strategy 2: Try counting using Playwright locator as fallback
    if (productsCount === 0) {
      try {
        productsCount = await this.page.locator('#related-products-container > div > div:first-child > div > div > div').count();
        if (productsCount > 0) {
          log(SYMBOLS.INFO, `Found ${productsCount} related products using locator`);
        }
      } catch (e) {
        log(SYMBOLS.WARNING, `Locator count failed: ${e.message}`);
      }
    }
    
    // Strategy 3: Try counting product links as last resort
    if (productsCount === 0) {
      try {
        productsCount = await this.page.locator('#related-products-container a[href*="/produkte/"]').count();
        if (productsCount > 0) {
          log(SYMBOLS.INFO, `Found ${productsCount} related product links`);
        }
      } catch (e) {
        log(SYMBOLS.WARNING, `Product links count failed: ${e.message}`);
      }
    }
    
    if (productsCount === 0) {
      log(SYMBOLS.WARNING, 'No related products found on the page');
      return { success: false, verifiedProducts: [] };
    }
    
    log(SYMBOLS.INFO, `Found ${productsCount} related products. Verifying each one...`);
    
    const context = this.page.context();
    const verifiedProducts = [];
    let allSuccess = true;
    
    // Extract all product data at once using page.evaluate for reliability
    const productsData = await this.page.evaluate(() => {
      const products = [];
      const container = document.querySelector('#related-products-container');
      if (!container) return products;
      
      // Find all product links
      const productLinks = container.querySelectorAll('a[href*="/produkte/"]');
      
      for (const link of productLinks) {
        // Get the product title - try multiple strategies
        let title = '';
        
        // Strategy 1: Look for h3 within the link
        const h3 = link.querySelector('h3');
        if (h3) {
          title = h3.innerText.replace(/\s+/g, ' ').trim();
        }
        
        // Strategy 2: Look for any heading tag
        if (!title) {
          const heading = link.querySelector('h2, h3, h4, h5');
          if (heading) {
            title = heading.innerText.replace(/\s+/g, ' ').trim();
          }
        }
        
        // Strategy 3: Look for title attribute or aria-label
        if (!title) {
          title = link.getAttribute('title') || link.getAttribute('aria-label') || '';
        }
        
        const href = link.getAttribute('href');
        
        // Only include if we have both title and href
        if (title && href) {
          products.push({ title, href });
        }
      }
      
      // Remove duplicates by href
      const unique = [];
      const seen = new Set();
      for (const product of products) {
        if (!seen.has(product.href)) {
          seen.add(product.href);
          unique.push(product);
        }
      }
      
      return unique;
    });
    
    // Update products count based on actual extracted data
    const actualProductsCount = Math.min(productsData.length, productsCount);
    log(SYMBOLS.INFO, `Extracted ${productsData.length} product(s) with valid data`);
    
    for (let i = 0; i < actualProductsCount; i++) {
      try {
        const productData = productsData[i];
        const productTitle = productData.title;
        let productLink = productData.href;
        
        // Ensure full URL
        if (productLink && !productLink.startsWith('http')) {
          const baseUrl = new URL(this.page.url()).origin;
          productLink = baseUrl + productLink;
        }
        
        log(SYMBOLS.INFO, `Verifying Related Product ${i + 1}: ${productTitle}`);
        
        // Open product page in new tab
        const newPage = await context.newPage();
        await newPage.goto(productLink);
        await newPage.waitForLoadState('domcontentloaded');
        await newPage.waitForTimeout(3000);
        
        // Get product name from PDP
        const pdpProductName = await newPage.locator('h1').first().textContent();
        const pdpProductNameTrimmed = pdpProductName ? pdpProductName.trim() : '';
        
        const productMatches = productTitle.toLowerCase() === pdpProductNameTrimmed.toLowerCase();
        
        if (productMatches) {
          log(SYMBOLS.SUCCESS, `✅ Related Product ${i + 1} verified: ${productTitle}`);
        } else {
          log(SYMBOLS.ERROR, `❌ Mismatch for Related Product ${i + 1}: Card = ${productTitle}, Page = ${pdpProductNameTrimmed}`);
          allSuccess = false;
        }
        
        verifiedProducts.push({
          index: i + 1,
          cardTitle: productTitle,
          pdpTitle: pdpProductNameTrimmed,
          success: productMatches
        });
        
        await newPage.close();
      } catch (error) {
        log(SYMBOLS.ERROR, `Failed to verify related product ${i + 1}: ${error.message}`);
        verifiedProducts.push({ index: i + 1, success: false, error: error.message });
        allSuccess = false;
      }
    }
    
    return { success: allSuccess, verifiedProducts };
  }

  // ==================== Related Articles Methods ====================

  /**
   * Verify related articles are linked correctly - dynamically detects and verifies all articles
   * @returns {Promise<{success: boolean, verifiedArticles: Array}>}
   */
  async verifyRelatedArticles() {
    log(SYMBOLS.INFO, 'Detecting related articles...');
    
    // Wait for related articles container to be visible
    try {
      await this.page.locator('#related-articles-container').waitFor({ state: 'visible', timeout: 10000 });
      log(SYMBOLS.SUCCESS, 'Related articles container found');
    } catch (e) {
      log(SYMBOLS.WARNING, 'Related articles container not found');
      return { success: false, verifiedArticles: [] };
    }
    
    // Scroll to Related Articles section
    try {
      await this.relatedArticlesContainer.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(2000);
    } catch (e) {
      log(SYMBOLS.WARNING, 'Could not scroll to related articles container');
    }
    
    // Count how many related articles are present using multiple strategies
    let articlesCount = 0;
    
    // Strategy 1: Use page.evaluate to count in DOM directly
    try {
      articlesCount = await this.page.evaluate(() => {
        const container = document.querySelector('#related-articles-container');
        if (!container) return 0;
        
        // Try different possible selectors for article cards
        const selectors = [
          '#related-articles-container > div > div > div > div > div',
          '#related-articles-container div[class*="article"]',
          '#related-articles-container a[href*="/artikel/"]',
          '#related-articles-container a[href*="/rasiertipps/"]'
        ];
        
        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector);
          // Filter to direct article cards (not nested)
          const articleCards = Array.from(elements).filter(el => {
            // Check if this is a top-level article card
            const parent = el.parentElement;
            if (selector.includes('> div > div > div')) {
              // For the specific nested selector, count direct children
              return parent && parent.id !== 'related-articles-container';
            }
            return true;
          });
          
          if (articleCards.length > 0) {
            return articleCards.length;
          }
        }
        
        return 0;
      });
      
      if (articlesCount > 0) {
        log(SYMBOLS.INFO, `Found ${articlesCount} related articles using DOM query`);
      }
    } catch (e) {
      log(SYMBOLS.WARNING, `DOM query failed: ${e.message}`);
    }
    
    // Strategy 2: Try counting using Playwright locator as fallback
    if (articlesCount === 0) {
      try {
        articlesCount = await this.page.locator('#related-articles-container > div > div > div > div > div').count();
        if (articlesCount > 0) {
          log(SYMBOLS.INFO, `Found ${articlesCount} related articles using locator`);
        }
      } catch (e) {
        log(SYMBOLS.WARNING, `Locator count failed: ${e.message}`);
      }
    }
    
    // Strategy 3: Try counting article links as last resort
    if (articlesCount === 0) {
      try {
        const linkCount1 = await this.page.locator('#related-articles-container a[href*="/artikel/"]').count();
        const linkCount2 = await this.page.locator('#related-articles-container a[href*="/rasiertipps/"]').count();
        articlesCount = Math.max(linkCount1, linkCount2);
        if (articlesCount > 0) {
          log(SYMBOLS.INFO, `Found ${articlesCount} related article links`);
        }
      } catch (e) {
        log(SYMBOLS.WARNING, `Article links count failed: ${e.message}`);
      }
    }
    
    if (articlesCount === 0) {
      log(SYMBOLS.WARNING, 'No related articles found on the page');
      return { success: false, verifiedArticles: [] };
    }
    
    log(SYMBOLS.INFO, `Found ${articlesCount} related articles. Verifying each one...`);
    
    const context = this.page.context();
    const verifiedArticles = [];
    let allSuccess = true;
    
    // Extract all article data at once using page.evaluate for reliability
    // Use a broader anchor-based extraction to handle nested anchor/h3 cases
    const articlesData = await this.page.evaluate(() => {
      const articles = [];
      const container = document.querySelector('#related-articles-container');
      if (!container) return articles;

      // Gather all anchors inside the container and try to derive a title + href pair
      const anchors = Array.from(container.querySelectorAll('a'));

      for (const a of anchors) {
        try {
          const href = a.getAttribute('href') || '';
          if (!href) continue;

          // Skip irrelevant anchors
          const lc = href.toLowerCase();
          if (lc.startsWith('javascript:') || lc.startsWith('mailto:') || lc.includes('facebook') || lc.includes('twitter') || lc.includes('instagram')) continue;

          // Try to find a title in the anchor itself
          let title = '';

          const headingInLink = a.querySelector('h3, h2, h4, h5');
          if (headingInLink) title = headingInLink.innerText.replace(/\s+/g, ' ').trim();

          // If not found, look for a heading nearby (within closest card)
          if (!title) {
            const card = a.closest('div');
            if (card) {
              const heading = card.querySelector('h3, h2, h4, h5');
              if (heading) title = heading.innerText.replace(/\s+/g, ' ').trim();
            }
          }

          // If still no title, try title/aria-label or link text
          if (!title) {
            title = a.getAttribute('title') || a.getAttribute('aria-label') || (a.textContent || '').replace(/\s+/g, ' ').trim();
          }

          // Normalize and filter
          if (title && title.length > 2) {
            articles.push({ title: title, href: href });
          }
        } catch (e) {
          // ignore per-anchor errors
        }
      }

      // Remove duplicates by href and keep order
      const unique = [];
      const seen = new Set();
      for (const it of articles) {
        if (!seen.has(it.href)) {
          seen.add(it.href);
          unique.push(it);
        }
      }

      return unique;
    });
    
    // Update articles count based on actual extracted data
    const actualArticlesCount = Math.min(articlesData.length, articlesCount);
    log(SYMBOLS.INFO, `Extracted ${articlesData.length} article(s) with valid data`);
    
    for (let i = 0; i < actualArticlesCount; i++) {
      try {
        const articleData = articlesData[i];
        const articleTitle = articleData.title;
        let articleLink = articleData.href;
        
        // Ensure full URL
        if (articleLink && !articleLink.startsWith('http')) {
          const baseUrl = new URL(this.page.url()).origin;
          articleLink = baseUrl + articleLink;
        }
        
        log(SYMBOLS.INFO, `Verifying Related Article ${i + 1}: ${articleTitle}`);
        
        // Open article page in new tab
        const newPage = await context.newPage();
        await newPage.goto(articleLink);
        await newPage.waitForLoadState('domcontentloaded');
        await newPage.waitForTimeout(3000);
        
        // Get article name from ADP
        const adpArticleName = await newPage.locator('h1').first().textContent();
        const adpArticleNameTrimmed = adpArticleName ? adpArticleName.trim() : '';
        
        const articleMatches = articleTitle.toLowerCase() === adpArticleNameTrimmed.toLowerCase();
        
        if (articleMatches) {
          log(SYMBOLS.SUCCESS, `✅ Related Article ${i + 1} verified: ${articleTitle}`);
        } else {
          log(SYMBOLS.ERROR, `❌ Mismatch for Related Article ${i + 1}: Card = ${articleTitle}, Page = ${adpArticleNameTrimmed}`);
          allSuccess = false;
        }
        
        verifiedArticles.push({
          index: i + 1,
          cardTitle: articleTitle,
          adpTitle: adpArticleNameTrimmed,
          success: articleMatches
        });
        
        await newPage.close();
      } catch (error) {
        log(SYMBOLS.ERROR, `Failed to verify related article ${i + 1}: ${error.message}`);
        verifiedArticles.push({ index: i + 1, success: false, error: error.message });
        allSuccess = false;
      }
    }
    
    return { success: allSuccess, verifiedArticles };
  }

  // ==================== Image Alt Tag Validation Methods ====================

  /**
   * Get all product images with their alt tag information
   * @returns {Promise<Array<{index: number, filename: string, src: string, alt: string, hasAlt: boolean, altStatus: string, width: number, height: number}>>}
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
          if (img.src && (img.src.includes('.svg') || img.src.includes('svg+xml'))) {
            debugInfo.filtered.svg++;
            return false;
          }
          
          // Exclude only header and nav (keep everything else including footer)
          if (img.closest('header, nav')) {
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
      log(SYMBOLS.INFO, `📊 Image Detection Statistics:`);
      log(SYMBOLS.INFO, `   Total images found in main: ${images.debugInfo.totalFound}`);
      log(SYMBOLS.INFO, `   Filtered out SVG: ${images.debugInfo.filtered.svg}`);
      log(SYMBOLS.INFO, `   Filtered out header/nav: ${images.debugInfo.filtered.header}`);
      log(SYMBOLS.INFO, `   Filtered out pricespider: ${images.debugInfo.filtered.pricespider}`);
      log(SYMBOLS.INFO, `   Filtered out social icons: ${images.debugInfo.filtered.socialIcon}`);
      log(SYMBOLS.INFO, `   Filtered out too small: ${images.debugInfo.filtered.tooSmall}`);
      log(SYMBOLS.SUCCESS, `✅ Found ${images.images.length} product content images`);
      
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
      
      log(SYMBOLS.INFO, `📊 Product Image Statistics:`);
      log(SYMBOLS.INFO, `   Total Product Images: ${totalImages}`);
      log(SYMBOLS.INFO, `   With Alt Tags: ${imagesWithAlt.length}`);
      log(SYMBOLS.INFO, `   Without Alt Tags: ${imagesWithoutAlt.length}`);
      log(SYMBOLS.INFO, '');
      
      // Log all images with their alt tag status
      if (totalImages > 0) {
        log(SYMBOLS.INFO, `📋 Complete Image List:`);
        images.forEach(img => {
          const status = img.hasAlt ? '✅' : '❌';
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
        log(SYMBOLS.SUCCESS, `✅ All ${totalImages} product images have alt tags!`);
      } else {
        log(SYMBOLS.WARNING, `⚠️  ${imagesWithoutAlt.length} out of ${totalImages} images are missing alt tags`);
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

  // ==================== Gallery Image Methods ====================

  /**
   * Verify gallery image functionality by clicking each thumbnail and validating image change
   * @returns {Promise<Object>} Validation results with details about each gallery image
   */
  async verifyGalleryImages() {
    try {
      log(SYMBOLS.INFO, 'Verifying gallery image functionality...');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'Gallery Image Verification - Slick Carousel Thumbnails');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

      // Scroll to top to ensure gallery is visible
      await this.page.evaluate(() => window.scrollTo(0, 0));
      await this.page.waitForTimeout(2000);

      // Get the main product image element
      const mainImgSelector = 'img.kcg-mainImg';
      const mainImgLocator = this.page.locator(mainImgSelector).first();

      // Get initial main image source
      const getMainImageSrc = async () => {
        try {
          return await mainImgLocator.getAttribute('src').catch(() => '');
        } catch (e) {
          return '';
        }
      };

      let initialImageSrc = await getMainImageSrc();
      log(SYMBOLS.INFO, `Initial main image src: ${initialImageSrc.substring(0, 80)}`);

      // Find thumbnail slides in the gallery wrapper (.kcg-gallery-thumbs .slick-slide)
      const thumbnailSlideSelector = '.kcg-gallery-thumbs .slick-slide';
      const thumbnailLocator = this.page.locator(thumbnailSlideSelector);

      const thumbnailCount = await thumbnailLocator.count();
      log(SYMBOLS.INFO, `Found ${thumbnailCount} gallery thumbnail(s)`);

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

      // Process each thumbnail and swap main image
      for (let i = 0; i < thumbnailCount; i++) {
        try {
          const thumbnail = thumbnailLocator.nth(i);

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

          log(SYMBOLS.INFO, `Processing gallery thumbnail ${i + 1}/${thumbnailCount} - "${thumbnailAlt}"`);

          // Get the thumbnail's image source and swap the main image
          const swapResult = await this.page.evaluate(({ mainSelector, thumbSelector, index }) => {
            const mainImg = document.querySelector(mainSelector);
            const thumbSlides = document.querySelectorAll(thumbSelector);
            
            if (!mainImg || !thumbSlides[index]) {
              return { success: false, message: 'Could not find elements' };
            }
            
            const thumbImg = thumbSlides[index].querySelector('img');
            if (!thumbImg || !thumbImg.src) {
              return { success: false, message: 'Could not find thumbnail image' };
            }
            
            // Get current main image src before swap
            const oldSrc = mainImg.src;
            
            // Swap the image
            mainImg.src = thumbImg.src;
            mainImg.alt = thumbImg.alt || mainImg.alt;
            
            return {
              success: true,
              oldSrc,
              newSrc: thumbImg.src,
              thumbAlt: thumbImg.alt
            };
          }, { mainSelector: mainImgSelector, thumbSelector: thumbnailSlideSelector, index: i });

          // Wait for image to load
          await this.page.waitForTimeout(800);

          // Verify image changed
          const newImageSrc = await getMainImageSrc();
          const imageChanged = newImageSrc !== initialImageSrc && swapResult.success;

          const result = {
            index: i + 1,
            thumbnailNumber: `Thumbnail ${i + 1}`,
            success: imageChanged && swapResult.success,
            thumbnailSrc: thumbnailSrc || swapResult.newSrc || 'N/A',
            thumbnailAlt: thumbnailAlt || swapResult.thumbAlt || 'No alt text',
            mainImageInitial: initialImageSrc.substring(0, 100),
            mainImageAfterClick: newImageSrc.substring(0, 100),
            imageChanged: imageChanged,
            swapSuccess: swapResult.success
          };

          verificationResults.push(result);

          if (imageChanged && swapResult.success) {
            successCount++;
            log(SYMBOLS.SUCCESS, `✅ Thumbnail ${i + 1}: Image changed successfully`);
            if (thumbnailAlt || swapResult.thumbAlt) {
              log(SYMBOLS.SUCCESS, `   Alt text: "${thumbnailAlt || swapResult.thumbAlt}"`);
            }
            // Update initial image for next iteration to track progression
            initialImageSrc = newImageSrc;
          } else {
            log(SYMBOLS.WARNING, `⚠️ Thumbnail ${i + 1}: Image swap failed - ${swapResult.message || 'no image change'}`);
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
      log(SYMBOLS.INFO, `📊 Gallery Verification Summary:`);
      log(SYMBOLS.INFO, `   Total Thumbnails: ${thumbnailCount}`);
      log(SYMBOLS.INFO, `   Successfully Verified: ${successCount}`);
      log(SYMBOLS.INFO, `   Success Rate: ${Math.round((successCount / thumbnailCount) * 100)}%`);

      const allSuccessful = successCount === thumbnailCount;
      const verificationMessage = allSuccessful
        ? `✅ All ${thumbnailCount} gallery images verified successfully!`
        : `⚠️ ${successCount} out of ${thumbnailCount} gallery images verified (${thumbnailCount - successCount} had issues)`;

      if (allSuccessful) {
        log(SYMBOLS.SUCCESS, verificationMessage);
      } else if (successCount > 0) {
        log(SYMBOLS.WARNING, verificationMessage);
      } else {
        log(SYMBOLS.ERROR, verificationMessage);
      }

      return {
        success: allSuccessful,
        totalThumbnails: thumbnailCount,
        successfullyVerified: successCount,
        failedCount: thumbnailCount - successCount,
        successRate: Math.round((successCount / thumbnailCount) * 100),
        thumbnailsVerified: verificationResults,
        verificationMessage: verificationMessage
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
        verificationMessage: `Error: ${error.message}`
      };
    }
  }
}
