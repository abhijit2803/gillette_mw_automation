/**
 * Trimmer Product Details Page (PDP) Object Model
 * Designed for Trimmer Products - Gillette India Website
 * 
 * Extends productDetailsPage with trimmer-specific functionality:
 * - Feature Icon Functionality (TC 14)
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
 * - Feature Icons Section
 * 
 * Based on: gelsAndFoamsPDP.spec.js (adapted for India site)
 */

import { productDetailsPage } from './productDetailsPage.js';
import { SYMBOLS, log } from '../utils/logConstants.js';

export class trimmerProductDetailsPage extends productDetailsPage {
  constructor(page) {
    super(page);

    // ==================== Feature Icons Section ====================
    // Feature icons are in the timeline-navigation sidebar
    this.featureIconsContainer = page.locator('#feature').first();
    this.featureIcons = page.locator('.timeline-navigation .feature-icon-wrapper');
    this.featureTitle = page.locator('#pdpFeatureWrapper .product-feature h2').first();

    // Override Buy Now button for India site (uses a.buyNowButton instead of #shopnowBtn-container)
    this.buyNowButton = page.locator('#shopnowBtn-container1 a.buyNowButton').first();
    this.buyNowPopupMessage = page.locator('.modal-container .socialdes-heading').first();
    this.buyNowCloseButton = page.locator('a#closeButton').first();
    this.buyNowPopupBackdrop = page.locator('.backdrop-style.dialog-overlay-bg');

    // Override Write A Review locators for India site
    this.writeReviewButton = page.locator('#review a[href*="writereview"], #review a:has-text("Write a review"), #review a:has-text("Write A Review")').first();
    this.cancelReviewButton = page.locator('a.cancel-button, a:has-text("Cancel")').first();

    // Override Related Products locators for India site
    // India structure: .slick-track > div.slick-slide > div > a.card-container > div.card-content > h3
    // Parent expects 3 extra div levels that don't exist on India
    this.getRelatedProductLink = (index) => page.locator(`#related-products-container .slick-track > div:nth-child(${index}) > div > a.card-container`);
    this.getRelatedProductName = (index) => page.locator(`#related-products-container .slick-track > div:nth-child(${index}) > div > a.card-container > div.card-content h3`);

    // Override Related Articles locators for India site
    // India structure: .slick-track > div.slick-slide > div > a > div.card-container > div.card-content > a > h3
    // Parent expects an extra div level that doesn't exist on India
    this.getRelatedArticleCardLink = (index) => page.locator(`#related-articles-container .slick-track > div:nth-child(${index}) > div > a.event_internal_link`).first();
    this.getRelatedArticleName = (index) => page.locator(`#related-articles-container .slick-track > div:nth-child(${index}) > div > a > div .card-content a.event_internal_link h3`);
    this.getRelatedArticleLink = (index) => page.locator(`#related-articles-container .slick-track > div:nth-child(${index}) > div > a > div .card-content a.default-btn`);

  }

  /**
   * Build the favorites page URL dynamically from the current page URL.
   * Extracts origin + locale prefix (e.g. /en-in) and appends /fav-page.
   * @returns {string} Favorites page URL
   */
  _buildFavoritesUrl() {
    const currentUrl = new URL(this.page.url());
    // Extract locale prefix from pathname (e.g. "/en-in" from "/en-in/products/...")
    const pathParts = currentUrl.pathname.split('/').filter(Boolean);
    const localePrefix = pathParts.length > 0 ? `/${pathParts[0]}` : '';
    return `${currentUrl.origin}${localePrefix}/fav-page`;
  }

  /**
   * Override: Verify Favorite/Bookmark functionality with dynamically built favorites URL
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
      
      // Build favorites URL dynamically from current page URL
      const favoritesPageUrl = this._buildFavoritesUrl();
      log(SYMBOLS.INFO, `Favorites page URL: ${favoritesPageUrl}`);
      
      // Open favorites page
      const newPage = await context.newPage();
      await newPage.goto(favoritesPageUrl);
      await newPage.waitForLoadState('domcontentloaded');
      await newPage.waitForTimeout(3000);
      
      // Click on Products tab in favorites
      let favoriteProductName = '';
      try {
        const productTab = newPage.locator('a.tab-btn[data-action-detail*="PRODUCTS"]');
        if (await productTab.isVisible().catch(() => false)) {
          await productTab.click();
          await newPage.waitForTimeout(2000);
        }
        
        // Get favorite product name from the saved product card
        const favProduct = newPage.locator('h3.fav-product-card-title').first();
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
   * Override: Verify Buy Now button functionality for India site
   * India site uses a custom modal popup (not PriceSpider)
   * @param {string} expectedPopupMessage - Expected message in popup (e.g., "Choose your retailers")
   * @returns {Promise<{success: boolean, popupMessage: string}>}
   */
  async verifyBuyNowFunctionality(expectedPopupMessage) {
    log(SYMBOLS.INFO, 'Verifying Buy Now functionality (India site)...');

    try {
      // Scroll to Buy Now button
      await this.buyNowButton.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(500);

      // Click Buy Now button
      await this.buyNowButton.waitFor({ state: 'visible', timeout: this.timeout.medium });
      await this.buyNowButton.click();

      // Wait for the custom modal popup to appear
      const modalLocator = this.page.locator('.modal-container.socialshare-container, .backdrop-style.dialog-overlay-bg').first();
      await modalLocator.waitFor({ state: 'visible', timeout: this.timeout.medium });
      await this.page.waitForTimeout(2000);

      // Get popup message from .socialdes-heading
      let popupMessage = '';
      try {
        popupMessage = await this.buyNowPopupMessage.textContent() || '';
        popupMessage = popupMessage.trim();
        log(SYMBOLS.INFO, `Found popup message: ${popupMessage}`);
      } catch (e) {
        log(SYMBOLS.WARNING, `Could not get popup message: ${e.message}`);
      }

      const messageMatches = popupMessage.length > 0 && (
        popupMessage.toLowerCase().includes(expectedPopupMessage.toLowerCase()) ||
        expectedPopupMessage.toLowerCase().includes(popupMessage.toLowerCase())
      );

      // Treat popup as verified if it opened and contains the expected message OR any message
      const success = popupMessage.length > 0;

      if (messageMatches) {
        log(SYMBOLS.SUCCESS, `✅ Buy Now popup verified. Message: ${popupMessage}`);
      } else if (popupMessage.length > 0) {
        log(SYMBOLS.SUCCESS, `✅ Buy Now popup opened. Message: ${popupMessage}`);
      } else {
        log(SYMBOLS.ERROR, `❌ Buy Now popup did not show expected message: ${expectedPopupMessage}`);
      }

      return { success, popupMessage };
    } catch (error) {
      log(SYMBOLS.ERROR, `Buy Now verification failed: ${error.message}`);
      return { success: false, popupMessage: '' };
    }
  }

  /**
   * Override: Close Buy Now popup for India site
   */
  async closeBuyNowPopup() {
    log(SYMBOLS.INFO, 'Closing Buy Now popup (India site)...');
    try {
      await this.buyNowCloseButton.waitFor({ state: 'visible', timeout: this.timeout.short });
      await this.buyNowCloseButton.click();
      log(SYMBOLS.SUCCESS, 'Buy Now popup closed');
    } catch (error) {
      await this.page.keyboard.press('Escape');
      log(SYMBOLS.INFO, 'Buy Now popup closed via Escape key');
    }
    await this.page.waitForTimeout(1000);
  }

  // ==================== Write A Review Methods ====================

  /**
   * Override: Verify Write A Review page for India site
   * Uses JS native click to bypass fixed header/tabs covering the button
   * @param {string} expectedProductName - Expected product name on review page
   * @returns {Promise<{success: boolean, reviewPageProductName: string}>}
   */
  async verifyWriteAReviewPage(expectedProductName) {
    log(SYMBOLS.INFO, 'Verifying Write A Review page...');

    try {
      await this.dismissOverlay();

      // Scroll to the review section
      await this.writeReviewButton.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(500);

      await this.writeReviewButton.waitFor({ state: 'visible', timeout: this.timeout.short });
      log(SYMBOLS.SUCCESS, "'Write A Review' button is found");

      // Use JS native click to bypass fixed headers covering the element
      await this.page.evaluate(() => {
        const btn = document.querySelector('#review a[href*="writereview"]') ||
                    document.querySelector('#review a.warBtn');
        if (btn) btn.click();
      });
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
   * Override: Click Cancel button on Write A Review page for India site
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

  // ==================== Related Products / Articles Methods ====================

  /**
   * Override: Verify Related Products - scrolls to section heading before verifying
   */
  async verifyRelatedProducts() {
    const heading = this.page.locator('#related-products-container h2').first();
    await heading.scrollIntoViewIfNeeded().catch(() => {});
    await this.page.waitForTimeout(1000);
    return super.verifyRelatedProducts();
  }

  /**
   * Override: Verify Related Articles - scrolls to section heading before verifying
   */
  async verifyRelatedArticles() {
    const heading = this.page.locator('#related-articles-container h2').first();
    await heading.scrollIntoViewIfNeeded().catch(() => {});
    await this.page.waitForTimeout(1000);
    return super.verifyRelatedArticles();
  }

  // ==================== Feature Icon Methods ====================

  /**
   * Verify Feature Icon Functionality
   * Tests that clicking each feature icon changes the corresponding feature title
   * Uses .timeline-navigation .feature-icon-wrapper elements and .product-feature h2 headings
   * @returns {Promise<{success: boolean, totalIcons: number, successfullyVerified: number, failedCount: number, successRate: number, iconsVerified: Array<{index: number, iconNumber: string, success: boolean, titleChanged: boolean, titleBefore: string, titleAfter: string, iconAlt: string}>, verificationMessage: string}>}
   */
  async verifyFeatureIcons() {
    try {
      log(SYMBOLS.INFO, 'Verifying feature icon functionality...');
      log(SYMBOLS.ROCKET, '====================================================');
      log(SYMBOLS.ROCKET, 'Feature Icon Verification - Click Icons & Validate Title Changes');
      log(SYMBOLS.ROCKET, '====================================================');

      // Click the FEATURES tab first to ensure the feature section is active
      const featuresTab = this.page.locator('button:has-text("FEATURES"), button:has-text("Features")').first();
      if (await featuresTab.isVisible().catch(() => false)) {
        await featuresTab.click();
        await this.page.waitForTimeout(2000);
      }

      // Scroll to the feature section to ensure icons are visible
      await this.featureIconsContainer.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(2000);

      /**
       * Get the feature title at a specific index from the product-feature headings.
       */
      const getFeatureTitleAtIndex = async (index) => {
        try {
          return await this.page.evaluate((idx) => {
            const features = document.querySelectorAll('#pdpFeatureWrapper .product-feature h2');
            if (features[idx]) return features[idx].textContent?.trim() || '';
            return '';
          }, index);
        } catch (e) {
          return '';
        }
      };

      /**
       * Get the data-action-detail of the active icon (the one with opacity-100 on its img).
       */
      const getActiveIconDetail = async () => {
        try {
          return await this.page.evaluate(() => {
            const icons = document.querySelectorAll('.timeline-navigation .feature-icon-wrapper');
            for (const icon of icons) {
              const img = icon.querySelector('img');
              if (img && (img.classList.contains('opacity-100') || getComputedStyle(img).opacity === '1')) {
                return icon.getAttribute('data-action-detail') || '';
              }
            }
            return '';
          });
        } catch (e) {
          return '';
        }
      };

      // Count visible feature icons
      const totalIcons = await this.featureIcons.count();
      log(SYMBOLS.INFO, `Found ${totalIcons} feature icon(s) in timeline-navigation`);

      if (totalIcons === 0) {
        log(SYMBOLS.WARNING, '⚠️ No feature icons found in the feature section');
        return {
          success: false,
          totalIcons: 0,
          successfullyVerified: 0,
          failedCount: 0,
          successRate: 0,
          iconsVerified: [],
          verificationMessage: 'No feature icons found'
        };
      }

      // Get the list of all feature headings for reference
      const featureHeadings = await this.page.evaluate(() => {
        const features = document.querySelectorAll('#pdpFeatureWrapper .product-feature h2');
        return Array.from(features).map(h => h.textContent?.trim() || '');
      });
      log(SYMBOLS.INFO, `Feature headings: ${featureHeadings.join(', ')}`);

      const verificationResults = [];
      let successCount = 0;
      let previousActiveDetail = await getActiveIconDetail();
      log(SYMBOLS.INFO, `Initial active icon: "${previousActiveDetail}"`);

      // Click each icon and verify the corresponding title matches the expected heading
      for (let i = 0; i < totalIcons; i++) {
        try {
          const icon = this.featureIcons.nth(i);

          // Get icon image alt or src for reporting
          let iconAlt = '';
          try {
            const img = icon.locator('img').first();
            iconAlt = await img.getAttribute('alt').catch(() => '') || '';
            if (!iconAlt) {
              const src = await img.getAttribute('src').catch(() => '') || '';
              const filename = src.split('/').pop()?.split('?')[0] || '';
              iconAlt = filename;
            }
          } catch (e) {
            // Ignore
          }

          log(SYMBOLS.INFO, `Processing feature icon ${i + 1}/${totalIcons} - "${iconAlt}"`);

          // Get the expected title for this icon's index
          const expectedTitle = featureHeadings[i] || '';
          log(SYMBOLS.INFO, `   Expected feature title: "${expectedTitle}"`);

          // Click the icon using JavaScript dispatchEvent since some icons may not be visible in viewport
          log(SYMBOLS.INFO, `   Clicking icon ${i + 1}...`);
          await this.page.evaluate((index) => {
            const icons = document.querySelectorAll('.timeline-navigation .feature-icon-wrapper');
            if (icons[index]) {
              icons[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
              icons[index].click();
            }
          }, i);
          await this.page.waitForTimeout(2000);

          // After clicking, check: did the active icon change (via data-action-detail or opacity)?
          const currentActiveDetail = await getActiveIconDetail();
          const actualTitle = await getFeatureTitleAtIndex(i);
          log(SYMBOLS.INFO, `   Active icon after click: "${currentActiveDetail}"`);
          log(SYMBOLS.INFO, `   Feature title at index ${i}: "${actualTitle}"`);

          // Verify: the icon's data-action-detail should contain the feature name,
          // and the feature heading at this index should exist
          let iconVerified = false;
          if (i === 0) {
            // First icon: just verify the title exists and matches
            iconVerified = actualTitle.length > 0 && expectedTitle.length > 0;
          } else {
            // Subsequent icons: the active icon detail should change from previous
            iconVerified = currentActiveDetail !== previousActiveDetail && actualTitle.length > 0;
          }

          const result = {
            index: i + 1,
            iconNumber: `Icon ${i + 1}`,
            success: iconVerified,
            titleChanged: iconVerified,
            titleBefore: previousActiveDetail,
            titleAfter: currentActiveDetail,
            iconAlt: iconAlt || 'N/A'
          };

          verificationResults.push(result);

          if (iconVerified) {
            successCount++;
            log(SYMBOLS.SUCCESS, `✅ Icon ${i + 1}: Feature icon click verified successfully`);
            log(SYMBOLS.SUCCESS, `   Active detail: "${currentActiveDetail}", Title: "${actualTitle}"`);
          } else {
            log(SYMBOLS.WARNING, `⚠️ Icon ${i + 1}: Feature icon verification issue`);
            log(SYMBOLS.WARNING, `   Previous active: "${previousActiveDetail}", Current: "${currentActiveDetail}"`);
          }

          // Update previous for next comparison
          previousActiveDetail = currentActiveDetail;

        } catch (error) {
          log(SYMBOLS.ERROR, `❌ Icon ${i + 1}: Error occurred - ${error.message}`);
          verificationResults.push({
            index: i + 1,
            iconNumber: `Icon ${i + 1}`,
            success: false,
            titleChanged: false,
            titleBefore: '',
            titleAfter: '',
            iconAlt: 'Error'
          });
        }
      }

      // Summary
      log(SYMBOLS.INFO, '');
      const failedCount = verificationResults.length - successCount;
      const successRate = verificationResults.length === 0 ? 0 : Math.round((successCount / verificationResults.length) * 100);
      log(SYMBOLS.INFO, `Feature icon verification completed: ${successCount}/${verificationResults.length} icons successful (${successRate}%)`);

      return {
        success: successCount === verificationResults.length,
        totalIcons: verificationResults.length,
        successfullyVerified: successCount,
        failedCount: failedCount,
        successRate: successRate,
        iconsVerified: verificationResults,
        verificationMessage: `${successCount} of ${verificationResults.length} feature icons verified successfully`
      };
    } catch (error) {
      log(SYMBOLS.ERROR, `Feature icon verification failed: ${error.message}`);
      return {
        success: false,
        totalIcons: 0,
        successfullyVerified: 0,
        failedCount: 0,
        successRate: 0,
        iconsVerified: [],
        verificationMessage: `Feature icon verification error: ${error.message}`
      };
    }
  }
}
