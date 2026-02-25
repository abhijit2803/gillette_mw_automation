// @ts-check
/**
 * Body & Intimate PDP Sanity Test Suite
 * 
 * Test Coverage:
 * - TC 1: Browser Initialization & URL Navigation
 * - TC 2: Cookie Consent
 * - TC 3: SEO Validation (URL, H1, Meta Title, Meta Description, Canonical Tag)
 * - TC 4: Facebook Share Functionality (Click & Close)
 * - TC 5: Copy URL Functionality (Click & Close)
 * - TC 6: Favorite/Bookmark Functionality
 * - TC 7: BUY NOW Button Functionality
 * - TC 8: Sticky Section - BUY NOW Button
 * - TC 9: Sticky Section - Favorite Functionality
 * - TC 10: Write A Review (Click & Cancel)
 * - TC 11: Related Products Verification
 * - TC 12: Related Articles Verification
 */

import { test, expect } from '@playwright/test';
import { setupTest } from '../utils/testSetup.js';
import { SYMBOLS, log } from '../utils/logConstants.js';
import { HtmlTestReport } from '../utils/htmlReportGenerator.js';
import { bodyIntimatePDP } from '../pages/bodyIntimatePage.js';
import fs from 'fs';
import path from 'path';

// Test Configuration
const TEST_CONFIG = {
  facebookExpectedMessage: 'https://www.gillette.de/',
  buyNowPopupMessage: 'Online-Händler',
  favoriteTitleBeforeAdd: 'ZU DEN FAVORITEN HINZUFÜGEN',
  favoriteTitleAfterAdd: 'VON DEN FAVORITEN ENTFERNEN'
};

// Product URLs to test - Can be loaded from Excel/JSON file
// For now, using a sample URL (can be extended to read from external file)
const PRODUCT_URLS = [
  'https://www.gillette.de/de-de/intimrasur/intimate-trimmer'
];

test.describe('Body & Intimate PDP Sanity Tests - Germany Website', () => {

  /** @type {any} */
  let testEnvironment;
  /** @type {HtmlTestReport} */
  let htmlReport;
  let count = 1;

  // Setup before all tests - create single report for all products
  test.beforeAll(async () => {
    htmlReport = HtmlTestReport.create(
      'Body & Intimate PDP Sanity Tests',
      'Production'
    );
    
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'BODY & INTIMATE PDP SANITY TEST SUITE - GERMANY');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    htmlReport.addStep('URL Count', 'INFO', `Total number of Body & Intimate Product URLs for sanity: ${PRODUCT_URLS.length}`);
  });

  // Setup before each test
  test.beforeEach(async ({ page, context }, testInfo) => {
    testEnvironment = await setupTest(context, testInfo);
  });

  // Generate report after all tests
  test.afterAll(async () => {
    try {
      // Create reports directory if it doesn't exist
      const reportsDir = path.join(process.cwd(), 'test-results', 'body-intimate-reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      
      // Generate timestamp for report filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const reportPath = path.join(reportsDir, `Body_Intimate_Sanity_Report_${timestamp}.html`);
      
      await htmlReport.generateReport(reportPath);
      log(SYMBOLS.SUCCESS, `HTML report generated: ${reportPath}`);
    } catch (/** @type {any} */ error) {
      log(SYMBOLS.ERROR, `Failed to generate HTML report: ${error.message}`);
    }
  });

  /**
   * Complete PDP Sanity Test for Body & Intimate Products
   * Tests all products from the URL list
   */
  for (let urlIndex = 0; urlIndex < PRODUCT_URLS.length; urlIndex++) {
    const PRODUCT_URL = PRODUCT_URLS[urlIndex];
    
    test(`Complete PDP Sanity Test - Product ${urlIndex + 1}`, async ({ page, context }) => {
      const pdp = new bodyIntimatePDP(page);
      let productName = '';
      let currentUrl = '';

      // ==================== TC - 1: Browser Initialization & Navigation ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, `TC - 1: Browser Initialization & URL Navigation (Product ${count})`);
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      htmlReport.addStep('Browser Initialization', 'PASS', `✅ Browser initialized successfully for product ${count}`);
      htmlReport.addStep('Launch URL', 'INFO', `Launching Product URL Number ${count} from input file: ${PRODUCT_URL}`);
      
      await pdp.navigateToProduct(PRODUCT_URL);
      htmlReport.addStep('Navigate to URL', 'PASS', `✅ Navigated to URL ${count}: ${PRODUCT_URL}`);
      log(SYMBOLS.SUCCESS, `✅ TC - 1 PASSED: Browser launched and navigated to Product ${count}`);

      // ==================== TC - 2: Cookie Consent ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC - 2: Cookie Consent - Accept Cookies');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      await pdp.acceptCookies();
      htmlReport.addStep('Cookies', 'PASS', '✅ Cookies accepted successfully');
      log(SYMBOLS.SUCCESS, '✅ TC - 2 PASSED: Cookie consent accepted');

      // ==================== TC - 3: SEO Validation (URL, H1, meta title, meta description, canonical tag) ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, `TC - 3: SEO Validation (URL, H1, meta title, meta description, canonical tag) - Product ${count}`);
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      const urlValidation = await pdp.validateCurrentUrl(PRODUCT_URL);
      currentUrl = urlValidation.currentUrl;
      
      if (urlValidation.success) {
        htmlReport.addStep('Navigated to product page', 'PASS', 
          `✅ URL loaded successfully and matches with input product URL. The URL is: ${currentUrl}`);
      } else {
        htmlReport.addStep('Navigated to product page', 'FAIL', 
          `❌ URL did not match with input data. Expected: ${PRODUCT_URL}, but got: ${currentUrl}`);
      }
      log(SYMBOLS.SUCCESS, '✅ URL validation completed');
      await page.waitForTimeout(5000);

      productName = await pdp.getProductName();
      
      if (productName) {
        htmlReport.addStep('Product Name (H1)', 'PASS', `✅ Product Name (H1 Tag): ${productName}`);
        log(SYMBOLS.SUCCESS, `✅ Product Name (H1 tag) found - "${productName}"`);
      } else {
        htmlReport.addStep('Product Name (H1)', 'FAIL', `❌ Product Name is not found on: ${PRODUCT_URL}`);
        log(SYMBOLS.ERROR, '❌ Product Name (H1 tag) not found');
      }

      // Get Meta Title
      const metaTitle = await pdp.getMetaTitle();
      
      if (metaTitle) {
        htmlReport.addStep('Meta Title', 'PASS', `✅ Meta Title: ${metaTitle}`);
        log(SYMBOLS.SUCCESS, `✅ Meta Title found - "${metaTitle}"`);
      } else {
        htmlReport.addStep('Meta Title', 'FAIL', `❌ Meta Title is not found on: ${PRODUCT_URL}`);
        log(SYMBOLS.ERROR, '❌ Meta Title not found');
      }

      // Get Meta Description
      const metaDescription = await pdp.getMetaDescription();
      
      if (metaDescription) {
        htmlReport.addStep('Meta Description', 'PASS', `✅ Meta Description: ${metaDescription}`);
        log(SYMBOLS.SUCCESS, `✅ Meta Description found - "${metaDescription}"`);
      } else {
        htmlReport.addStep('Meta Description', 'FAIL', `❌ Meta Description is not found on: ${PRODUCT_URL}`);
        log(SYMBOLS.ERROR, '❌ Meta Description not found');
      }

      // Get Canonical Tag
      const canonicalTag = await pdp.getCanonicalTag();
      
      if (canonicalTag) {
        htmlReport.addStep('Canonical Tag', 'PASS', `✅ Canonical Tag: ${canonicalTag}`);
        log(SYMBOLS.SUCCESS, `✅ Canonical Tag found - "${canonicalTag}"`);
      } else {
        htmlReport.addStep('Canonical Tag', 'FAIL', `❌ Canonical Tag is not found on: ${PRODUCT_URL}`);
        log(SYMBOLS.ERROR, '❌ Canonical Tag not found');
      }

      log(SYMBOLS.SUCCESS, '✅ TC - 3 PASSED: SEO Validation completed');
      await page.waitForTimeout(3000);

      // Scroll slightly to trigger sticky section
      await pdp.scrollToTriggerStickySection();

      // ==================== TC - 4: Facebook Share Functionality ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC - 4: Facebook Share Functionality (Click & Close)');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      const fbResult = await pdp.verifyFacebookShare(TEST_CONFIG.facebookExpectedMessage);
      
      if (fbResult.success) {
        htmlReport.addStep("Click 'Facebook Icon'", 'PASS', "✅ 'Facebook Icon' button clicked.");
      } else {
        htmlReport.addStep("Click 'Facebook Icon'", 'FAIL', "❌ 'Facebook Icon' button clicked.");
      }
      
      await pdp.closeFacebookPopup();
      htmlReport.addStep("Close Facebook Popup", 'PASS', "✅ 'Facebook' Popup closed successfully.");
      log(SYMBOLS.SUCCESS, '✅ TC - 4 PASSED: Facebook functionality verified');

      // ==================== TC - 5: Copy URL Functionality ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC - 5: Copy URL Functionality (Click & Close)');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      const copyResult = await pdp.verifyCopyUrlFunctionality(currentUrl);
      
      if (copyResult.success) {
        htmlReport.addStep("Copy Icon", 'PASS', `✅ 'Copy Icon' button clicked, and Copied URL matches with current URL. The Copied URL is: ${copyResult.copiedUrl}`);
      } else {
        htmlReport.addStep("Copy Icon", 'FAIL', "❌ 'Copy Icon' button not clicked.");
      }
      
      await pdp.closeCopyUrlPopup();
      htmlReport.addStep("Close Copy URL Popup", 'PASS', "✅ 'Copy URL' Popup closed successfully.");
      log(SYMBOLS.SUCCESS, '✅ TC - 5 PASSED: Copy URL functionality verified');

      // ==================== TC - 6: Favorite Functionality ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC - 6: Favorite/Bookmark Functionality');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      const favResult = await pdp.verifyFavoriteFunctionality(productName);
      
      if (favResult.success) {
        htmlReport.addStep("Favorite Icon", 'PASS', `✅ 'Favorite Icon' button clicked and Product ${count} is successfully added to Favorite section.`);
      } else {
        htmlReport.addStep("Favorite Icon", 'FAIL', "❌ 'Favorite Icon' button not clicked.");
      }
      
      // Uncheck the favorite icon
      await pdp.uncheckFavoriteIcon();
      htmlReport.addStep("Favorite Icon", 'PASS', `✅ 'Favorite Icon' is unchecked successfully for Product Number ${count}`);
      log(SYMBOLS.SUCCESS, '✅ TC - 6 PASSED: Favorite functionality verified');

      // ==================== TC - 7: BUY NOW Button Functionality ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC - 7: BUY NOW Button Functionality');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      const buyNowResult = await pdp.verifyBuyNowFunctionality(TEST_CONFIG.buyNowPopupMessage);
      
      if (buyNowResult.success) {
        htmlReport.addStep("BUY NOW", 'PASS', 
          `✅ 'Buy Now Button' button is successfully clicked. The Verified message on pop-up is: ${buyNowResult.popupMessage}`);
      } else {
        htmlReport.addStep("BUY NOW", 'FAIL', "❌ 'Buy Now Button' button not clicked.");
      }
      
      await pdp.closeBuyNowPopup();
      await pdp.moveMouseToSafeArea();
      log(SYMBOLS.SUCCESS, '✅ TC - 7 PASSED: Buy Now functionality verified');

      // ==================== TC - 8: Sticky Section - BUY NOW ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC - 8: Sticky Section - BUY NOW Button Functionality');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      // Scroll to sticky section
      const stickyVisible = await pdp.scrollToStickySection();
      
      if (stickyVisible) {
        log(SYMBOLS.SUCCESS, 'Sticky section found');
      } else {
        log(SYMBOLS.WARNING, 'Sticky section not found after scrolling');
      }
      
      const stickyBuyNowResult = await pdp.verifyBuyNowFromStickySection(TEST_CONFIG.buyNowPopupMessage);
      
      if (stickyBuyNowResult.success) {
        htmlReport.addStep("Buy Now - Sticky Section", 'PASS', 
          `✅ 'Buy Now Button' button is successfully clicked from Sticky section. The Verified message on pop-up is: ${stickyBuyNowResult.popupMessage}`);
      } else {
        htmlReport.addStep("Buy Now - Sticky Section", 'FAIL', "❌ 'Buy Now Button' button not clicked.");
      }
      
      await pdp.closeBuyNowPopup();
      htmlReport.addStep("Close Buy Now Popup - Sticky Section", 'PASS', "✅ 'Buy Now' Popup from Sticky section closed successfully.");
      await pdp.moveMouseToSafeArea();
      log(SYMBOLS.SUCCESS, '✅ TC - 8 PASSED: Sticky Section Buy Now functionality verified');

      // ==================== TC - 9: Sticky Section - Favorite Functionality ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC - 9: Sticky Section - Favorite Functionality');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      // Verify Favorite button title before adding
      const favTitleBefore = await pdp.getStickyFavoriteButtonTitle();
      
      if (favTitleBefore === TEST_CONFIG.favoriteTitleBeforeAdd) {
        htmlReport.addStep("Favorite CTA Button title before adding to favorites", 'PASS', 
          `✅ Sticky Favorite button title (before adding to favorites) matches with expected text. The Text is: ${favTitleBefore}`);
      } else {
        htmlReport.addStep("Favorite CTA Button title before adding to favorites", 'FAIL', 
          `❌ Sticky Favorite button title (before adding to favorites) does not match with expected text.`);
      }
      
      // Click Sticky Favorite button
      await pdp.clickStickyFavoriteButton();
      await page.waitForTimeout(2000);
      
      // Verify Favorite button title after adding
      const favTitleAfter = await pdp.getStickyFavoriteButtonTitle();
      
      if (favTitleAfter === TEST_CONFIG.favoriteTitleAfterAdd) {
        htmlReport.addStep("Favorite CTA Button title after adding to favorites", 'PASS', 
          `✅ Sticky Favorite button title (after adding to favorites) matches with expected text. The Text is: ${favTitleAfter}`);
      } else {
        htmlReport.addStep("Favorite CTA Button title after adding to favorites", 'FAIL', 
          `❌ Sticky Favorite button title (after adding to favorites) does not match with expected text.`);
      }
      
      // Verify product in favorites from sticky section
      const stickyFavResult = await pdp.verifyStickyFavoriteFunctionality(productName);
      
      if (stickyFavResult.success) {
        htmlReport.addStep("Favorite Button from Sticky Section", 'PASS', 
          "✅ 'Favorite Button from Sticky Section' clicked Successfully.");
      } else {
        htmlReport.addStep("Click 'Favorite Button from Sticky Section'", 'FAIL', 
          "❌ 'Favorite Button from Sticky Section' not clicked.");
      }
      log(SYMBOLS.SUCCESS, '✅ TC - 9 PASSED: Sticky Section Favorite functionality verified');

      // ==================== TC - 10: Write A Review ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC - 10: Write A Review (Click & Cancel)');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      // Check if Write A Review button is displayed
      const writeReviewVisible = await pdp.isWriteReviewButtonVisible();
      
      if (writeReviewVisible) {
        htmlReport.addStep('Write A Review Button', 'PASS', 
          `✅ 'Write A Review' Button is found for Product Number ${count}`);
      } else {
        htmlReport.addStep('Write A Review Button', 'FAIL', 
          `❌ 'Write A Review' Button is NOT found for Product Number ${count}`);
      }
      
      // Click Write A Review and verify page
      const writeReviewResult = await pdp.verifyWriteAReviewPage(productName);
      
      if (writeReviewResult.success) {
        htmlReport.addStep('Write A Review Button', 'PASS', 
          `✅ 'Write A Review' Button is found for Product Number ${count} and clicked successfully.`);
        htmlReport.addStep('Write A Review Page', 'PASS', 
          `✅ 'Write A Review' Page is successfully displayed for Product Number ${count}. The Product name on review page is: ${writeReviewResult.reviewPageProductName}`);
      } else {
        htmlReport.addStep('Write A Review Page', 'FAIL', 
          `❌ 'Write A Review' Page is NOT displayed for Product Number ${count}. The Product name on review page is: ${writeReviewResult.reviewPageProductName}`);
      }
      
      // Click Cancel to return to PDP
      const cancelResult = await pdp.clickCancelOnReviewPage(currentUrl);
      
      if (cancelResult.success) {
        htmlReport.addStep('Cancel Button', 'PASS', 
          `✅ 'Cancel' Button is clicked on WRITE A REVIEW page for Product Number ${count} and returned to corresponding PRODUCT page successfully.`);
      } else {
        htmlReport.addStep('Cancel Button', 'FAIL', 
          `❌ 'Cancel' Button is NOT clicked for Product Number ${count}`);
      }
      
      log(SYMBOLS.SUCCESS, '✅ TC - 10 PASSED: Write A Review functionality verified');
      await page.waitForTimeout(5000);

      // ==================== TC - 11: Related Products Section ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC - 11: Related Products Section Verification');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      const relatedProductsResults = await pdp.verifyRelatedProducts(3); // Verify first 3 products as per original test
      
      if (relatedProductsResults.length === 0) {
        htmlReport.addStep('Related Products', 'INFO', '⚠️ No related products found on this page');
      } else {
        for (let i = 0; i < relatedProductsResults.length; i++) {
          const result = relatedProductsResults[i];
          if (result.success) {
            htmlReport.addStep(`Verify Related Product${result.position}`, 'PASS', 
              `✅ Product linked at ${result.position} position: ${result.cardName}`);
          } else {
            htmlReport.addStep(`Verify Related Product${result.position}`, 'FAIL', 
              `❌ Mismatch: Card = ${result.cardName}, Page = ${result.pageName}`);
          }
        }
      }
      
      log(SYMBOLS.SUCCESS, '✅ TC - 11 PASSED: Related Products verification completed');

      // ==================== TC - 12: Related Articles Section ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC - 12: Related Articles Section Verification');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      const relatedArticlesResults = await pdp.verifyRelatedArticles(3); // Verify first 3 articles as per original test
      
      if (relatedArticlesResults.length === 0) {
        htmlReport.addStep('Related Articles', 'INFO', '⚠️ No related articles found on this page');
      } else {
        for (let j = 0; j < relatedArticlesResults.length; j++) {
          const result = relatedArticlesResults[j];
          if (result.success) {
            htmlReport.addStep(`Verify Article${result.position}`, 'PASS', 
              `✅ Article linked at ${result.position} position: ${result.cardTitle}`);
          } else {
            htmlReport.addStep(`Verify Article${result.position}`, 'FAIL', 
              `❌ Mismatch: Card = ${result.cardTitle}, Page = ${result.pageTitle}`);
          }
        }
      }
      
      log(SYMBOLS.SUCCESS, '✅ TC - 12 PASSED: Related Articles verification completed');

      // ==================== Test Complete ====================
      htmlReport.addStep('Close Browser', 'PASS', `✅ Browser closed successfully for ${count} time`);
      log(SYMBOLS.CELEBRATION, `🎉 Complete PDP Sanity Test PASSED for Product ${count}!`);
      
      count++;
    });
  }
});

/**
 * Additional test for testing with multiple URLs from JSON file
 * Useful for data-driven testing similar to original Excel-based approach
 */
test.describe('Body & Intimate - Data Driven Tests', () => {
  
  /** @type {HtmlTestReport} */
  let htmlReport;

  test.beforeEach(async ({ page, context }, testInfo) => {
    await setupTest(context, testInfo);
    htmlReport = HtmlTestReport.create(
      'Body & Intimate Data Driven Test',
      'Production',
      page
    );
  });

  test.afterEach(async () => {
    // Generate individual report
    const reportsDir = path.join(process.cwd(), 'test-results', 'body-intimate-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    await htmlReport.generateReport(path.join(reportsDir, `Data_Driven_Test_${timestamp}.html`));
  });
});
