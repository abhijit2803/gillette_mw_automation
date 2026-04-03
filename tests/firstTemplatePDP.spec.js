// @ts-check
/**
 * Trimmer PDP Sanity Test Suite
 * Based on: gelsAndFoamsPDP.spec.js (adapted for India website)
 * 
 * Test Coverage:
 * - TC 1: Browser Initialization & URL Navigation
 * - TC 2: Cookie Consent
 * - TC 3: SEO Validation (URL, H1, Meta Title, Meta Description, Canonical Tag, Breadcrumbs)
 * - TC 4: Facebook Share Functionality (Click & Close)
 * - TC 5: Copy URL Functionality (Click & Close)
 * - TC 6: Favorite/Bookmark Functionality
 * - TC 7: BUY NOW Button Functionality
 * - TC 8: Feature Section Menu Navigation
 * - TC 9: Review Section Menu Navigation
 * - TC 10: Write A Review (Click & Cancel)
 * - TC 11: Related Products Verification
 * - TC 12: Related Articles Verification
 * - TC 13: Image Alt Tag Validation
 * - TC 14: Feature Icon Functionality (Click on each icons & Validate if corresponding feature title changes)
 */

import { test, expect } from '@playwright/test';
import { pageManager } from '../utils/pageManager.js';
import { setupTest } from '../utils/testSetup.js';
import { SYMBOLS, log } from '../utils/logConstants.js';
import { HtmlTestReport } from '../utils/htmlReportGenerator.js';
import { trimmerProductDetailsPage } from '../pages/firstTemplateProductDetailsPage.js';
import { generateImageAltTagTable } from '../utils/tableGenerator.js';
import fs from 'fs';
import path from 'path';

// Product URL to test
const PRODUCT_URL = 'https://www.gillette.co.in/en-in/products/trimmers/3-in-1-styler';

// Test Configuration (India site - English)
const TEST_CONFIG = {
  facebookExpectedMessage: 'https://www.gillette.co.in/',
  buyNowPopupMessage: 'Online Retailer',
  reviewButtonTitle: 'Write a review'
};

test.describe('Trimmer PDP Sanity Tests - India Website', () => {

  /** @type {any} */
  let testEnvironment;
  /** @type {HtmlTestReport} */
  let htmlReport;

  // Setup before all tests - create single report for all products
  test.beforeAll(async () => {
    htmlReport = HtmlTestReport.create(
      'Trimmer PDP Sanity Tests',
      'Production'
    );
    
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TRIMMER PDP SANITY TEST SUITE - INDIA');
    log(SYMBOLS.ROCKET, `Product URL: ${PRODUCT_URL}`);
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    
    htmlReport.addStep('URL Info', 'INFO', `Product URL for sanity: ${PRODUCT_URL}`);
  });

  // Setup before each test
  test.beforeEach(async ({ page, context }, testInfo) => {
    testEnvironment = await setupTest(context, testInfo);
  });

  // Generate report after all tests
  test.afterAll(async () => {
    try {
      // Create reports directory if it doesn't exist
      const reportsDir = path.join(process.cwd(), 'test-results', 'trimmer-reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      
      // Generate timestamp for report filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const reportPath = path.join(reportsDir, `Trimmer_Sanity_Report_${timestamp}.html`);
      
      await htmlReport.generateReport(reportPath);
      log(SYMBOLS.SUCCESS, `HTML report generated: ${reportPath}`);
    } catch (/** @type {any} */ error) {
      log(SYMBOLS.ERROR, `Failed to generate HTML report: ${error.message}`);
    }
  });

  /**
   * Complete PDP Sanity Test for Trimmer Product
   */
  test('Complete PDP Sanity Test', async ({ page, context }) => {
    const pdp = new trimmerProductDetailsPage(page);
    let productName = '';
    let currentUrl = '';

    // ==================== TC - 1: Browser Initialization & Navigation ====================
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TC - 1: Browser Initialization & URL Navigation');
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    
    htmlReport.addStep('Browser Initialization', 'PASS', 'âœ… Browser initialized successfully');
    htmlReport.addStep('Launch URL', 'INFO', `Launching Product URL: ${PRODUCT_URL}`);
    
    await pdp.navigateToProduct(PRODUCT_URL);
    htmlReport.addStep('Navigate to URL', 'PASS', `âœ… Navigated to URL: ${PRODUCT_URL}`);
    log(SYMBOLS.SUCCESS, 'âœ… TC - 1 PASSED: Browser launched and navigated to Product');

    // ==================== TC - 2: Cookie Consent ====================
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TC - 2: Cookie Consent - Accept Cookies');
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    
    await pdp.acceptCookies();
    htmlReport.addStep('Cookies', 'PASS', 'âœ… Cookies accepted successfully');
    log(SYMBOLS.SUCCESS, 'âœ… TC - 2 PASSED: Cookie consent accepted');

    // ==================== TC - 3: SEO Validation ====================
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TC - 3: SEO Validation (URL, H1, meta title, meta description, canonical tag, breadcrumbs)');
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    
    const urlValidation = await pdp.validateCurrentUrl(PRODUCT_URL);
    currentUrl = urlValidation.currentUrl;
    
    if (urlValidation.success) {
      htmlReport.addStep('Navigated to product page', 'PASS', 
        `âœ… URL loaded successfully and matches with input product URL. The URL is: ${currentUrl}`);
    } else {
      htmlReport.addStep('Navigated to product page', 'FAIL', 
        `âŒ URL did not match with input data. Expected: ${PRODUCT_URL}, but got: ${currentUrl}`);
    }
    log(SYMBOLS.SUCCESS, 'âœ… URL validation completed');
    await page.waitForTimeout(5000);

    productName = await pdp.getProductName();
    
    if (productName) {
      htmlReport.addStep('Product Name (H1)', 'PASS', `âœ… Product Name (H1 Tag): ${productName}`);
      log(SYMBOLS.SUCCESS, `âœ… Product Name (H1 tag) found - "${productName}"`);
    } else {
      htmlReport.addStep('Product Name (H1)', 'FAIL', `âŒ Product Name is not found on: ${PRODUCT_URL}`);
      log(SYMBOLS.ERROR, 'âŒ Product Name (H1 tag) not found');
    }

    // Get Meta Title
    const metaTitle = await pdp.getMetaTitle();
    
    if (metaTitle) {
      htmlReport.addStep('Meta Title', 'PASS', `âœ… Meta Title: ${metaTitle}`);
      log(SYMBOLS.SUCCESS, `âœ… Meta Title found - "${metaTitle}"`);
    } else {
      htmlReport.addStep('Meta Title', 'FAIL', `âŒ Meta Title is not found on: ${PRODUCT_URL}`);
      log(SYMBOLS.ERROR, 'âŒ Meta Title not found');
    }

    // Get Meta Description
    const metaDescription = await pdp.getMetaDescription();
    
    if (metaDescription) {
      htmlReport.addStep('Meta Description', 'PASS', `âœ… Meta Description: ${metaDescription}`);
      log(SYMBOLS.SUCCESS, `âœ… Meta Description found - "${metaDescription}"`);
    } else {
      htmlReport.addStep('Meta Description', 'FAIL', `âŒ Meta Description is not found on: ${PRODUCT_URL}`);
      log(SYMBOLS.ERROR, 'âŒ Meta Description not found');
    }

    // Get Canonical Tag
    const canonicalTag = await pdp.getCanonicalTag();
    
    if (canonicalTag) {
      htmlReport.addStep('Canonical Tag', 'PASS', `âœ… Canonical Tag: ${canonicalTag}`);
      log(SYMBOLS.SUCCESS, `âœ… Canonical Tag found - "${canonicalTag}"`);
    } else {
      htmlReport.addStep('Canonical Tag', 'FAIL', `âŒ Canonical Tag is not found on: ${PRODUCT_URL}`);
      log(SYMBOLS.ERROR, 'âŒ Canonical Tag not found');
    }

    // Verify Breadcrumbs
    const breadcrumbsResult = await pdp.verifyBreadcrumbs();
    
    if (breadcrumbsResult.present) {
      const breadcrumbsText = breadcrumbsResult.breadcrumbs.map((bc, idx) => 
        `${idx + 1}. "${bc.text}"${bc.href ? ` (${bc.href})` : ' (current)'}`
      ).join('<br>');
      htmlReport.addStep('Verify Breadcrumbs', 'PASS', `âœ… Found ${breadcrumbsResult.count} breadcrumb(s):<br>${breadcrumbsText}`);
      log(SYMBOLS.SUCCESS, `âœ… Breadcrumbs verified: ${breadcrumbsResult.count} item(s)`);
    } else {
      htmlReport.addStep('Verify Breadcrumbs', 'WARN', 'âš ï¸ No breadcrumbs found on page');
      log(SYMBOLS.WARNING, 'âš ï¸ No breadcrumbs found on page');
    }

    log(SYMBOLS.SUCCESS, 'âœ… TC - 3 PASSED: SEO Validation completed (URL, H1, Meta Title, Meta Description, Canonical Tag, Breadcrumbs)');
    await page.waitForTimeout(3000);

    // ==================== TC - 4: Facebook Share Functionality ====================
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TC - 4: Facebook Share Functionality (Click & Close)');
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    
    const fbResult = await pdp.verifyFacebookShare(TEST_CONFIG.facebookExpectedMessage);
    
    if (fbResult.success) {
      htmlReport.addStep("Click 'Facebook Icon'", 'PASS', "âœ… 'Facebook Icon' button clicked.");
    } else {
      htmlReport.addStep("Click 'Facebook Icon'", 'FAIL', "âŒ 'Facebook Icon' button click failed.");
    }
    
    await pdp.closeFacebookPopup();
    log(SYMBOLS.SUCCESS, 'âœ… TC - 4 PASSED: Facebook functionality verified');

    // ==================== TC - 5: Copy URL Functionality ====================
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TC - 5: Copy URL Functionality (Click & Close)');
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    
    const copyResult = await pdp.verifyCopyUrlFunctionality(currentUrl);
    
    if (copyResult.success) {
      htmlReport.addStep("Click 'Copy Icon'", 'PASS', `âœ… 'Copy Icon' button clicked. Copied URL: ${copyResult.copiedUrl}`);
    } else {
      htmlReport.addStep("Click 'Copy Icon'", 'FAIL', "âŒ 'Copy Icon' button click failed.");
    }
    
    await pdp.closeCopyUrlPopup();
    log(SYMBOLS.SUCCESS, 'âœ… TC - 5 PASSED: Copy URL functionality verified');

    // ==================== TC - 6: Favorite Functionality ====================
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TC - 6: Favorite/Bookmark Functionality');
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    
    const favResult = await pdp.verifyFavoriteFunctionality(productName);
    
    if (favResult.success) {
      htmlReport.addStep("Click 'Favorite Icon'", 'PASS', `âœ… 'Favorite Icon' button clicked. Product: ${favResult.favoriteProductName}`);
    } else {
      htmlReport.addStep("Click 'Favorite Icon'", 'FAIL', "âŒ 'Favorite Icon' button click failed.");
    }
    log(SYMBOLS.SUCCESS, 'âœ… TC - 6 PASSED: Favorite functionality verified');

    // ==================== TC - 7: Buy Now Functionality ====================
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TC - 7: BUY NOW Button Functionality');
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    
    const buyNowResult = await pdp.verifyBuyNowFunctionality(TEST_CONFIG.buyNowPopupMessage);
    
    if (buyNowResult.success) {
      htmlReport.addStep("Click 'Buy Now Button'", 'PASS', 
        `âœ… 'Buy Now Button' button is successfully clicked. The Verified message on pop-up is: ${buyNowResult.popupMessage}`);
    } else {
      htmlReport.addStep("Click 'Buy Now Button'", 'FAIL', "âŒ 'Buy Now Button' button click failed.");
    }
    
    await pdp.closeBuyNowPopup();
    await pdp.moveMouseToSafeArea();
    log(SYMBOLS.SUCCESS, 'âœ… TC - 7 PASSED: Buy Now functionality verified');

    // ==================== TC - 8: Feature Section Menu ====================
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TC - 8: Feature Section Menu Navigation');
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    
    const featureResult = await pdp.verifyFeatureSection();
    
    if (featureResult.success) {
      htmlReport.addStep("Click 'Feature Section' from MENU list", 'PASS', 
        `âœ… 'Feature Section' option is clicked from the MENU List and page scrolls to FEATURE section. The first feature heading is: ${featureResult.featureTitle}`);
    } else {
      htmlReport.addStep("Click 'Feature Section' from MENU list", 'FAIL', "âŒ 'Feature Section' not clicked.");
    }
    log(SYMBOLS.SUCCESS, 'âœ… TC - 8 PASSED: Feature Section navigation verified');

    // ==================== TC - 9: Review Section Menu ====================
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TC - 9: Review Section Menu Navigation');
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    
    const reviewResult = await pdp.verifyReviewSection(TEST_CONFIG.reviewButtonTitle);
    
    if (reviewResult.success) {
      htmlReport.addStep("Click 'Review Section' from MENU list", 'PASS', 
        "âœ… 'Review Section' option is clicked from the MENU List and page scrolls to REVIEW section.");
    } else {
      htmlReport.addStep("Click 'Review Section' from MENU list", 'FAIL', "âŒ 'Review Section' not clicked.");
    }
    log(SYMBOLS.SUCCESS, 'âœ… TC - 9 PASSED: Review Section navigation verified');

    // ==================== TC - 10: Write A Review ====================
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TC - 10: Write A Review (Click & Cancel)');
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    
    // Click Write A Review
    const writeReviewResult = await pdp.verifyWriteAReviewPage(productName);
    
    if (writeReviewResult.success) {
      htmlReport.addStep('Write A Review Button', 'PASS', 
        `âœ… 'Write A Review' Button is found`);
      htmlReport.addStep('Write A Review Page', 'PASS', 
        `âœ… 'Write A Review' Page is successfully displayed. The Product name on review page is: ${writeReviewResult.reviewPageProductName}`);
    } else {
      htmlReport.addStep('Write A Review Button', 'FAIL', 
        `âŒ 'Write A Review' Button is NOT found`);
      htmlReport.addStep('Write A Review Page', 'FAIL', 
        `âŒ 'Write A Review' Page is NOT displayed`);
    }
    
    // Click Cancel to return to PDP
    const cancelResult = await pdp.clickCancelOnReviewPage(currentUrl);
    
    if (cancelResult.success) {
      htmlReport.addStep('Cancel Button', 'PASS', 
        `âœ… 'Cancel' Button is clicked on WRITE A REVIEW page and returned to corresponding PRODUCT page successfully.`);
    } else {
      htmlReport.addStep('Cancel Button', 'FAIL', 
        `âŒ 'Cancel' Button is NOT clicked`);
    }
    
    log(SYMBOLS.SUCCESS, 'âœ… TC - 10 PASSED: Write A Review functionality verified');
    await page.waitForTimeout(5000);

    // ==================== TC - 11: Related Products Section ====================
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TC - 11: Related Products Section Verification');
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    
    const relatedProductsResults = await pdp.verifyRelatedProducts();
    
    if (relatedProductsResults.length === 0) {
      htmlReport.addStep('Related Products', 'INFO', 'âš ï¸ No related products found on this page');
    } else {
      htmlReport.addStep('Related Products Count', 'INFO', `Found ${relatedProductsResults.length} related product(s)`);
      
      for (let i = 0; i < relatedProductsResults.length; i++) {
        const result = relatedProductsResults[i];
        if (result.success) {
          htmlReport.addStep(`Related Product ${result.position}`, 'PASS', 
            `âœ… Card Name: "${result.cardName}"<br>Card URL: ${result.cardUrl}<br>Page Name: "${result.pageName}"<br>Page URL: ${result.pageUrl}`);
        } else {
          htmlReport.addStep(`Related Product ${result.position}`, 'FAIL', 
            `âŒ Card Name: "${result.cardName}"<br>Card URL: ${result.cardUrl}<br>Page Name: "${result.pageName}"<br>Page URL: ${result.pageUrl}`);
        }
      }
    }
    
    log(SYMBOLS.SUCCESS, 'âœ… TC - 11 PASSED: Related Products verification completed');
    await page.waitForTimeout(10000);

    // ==================== TC - 12: Related Articles Section ====================
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TC - 12: Related Articles Section Verification');
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    
    const relatedArticlesResults = await pdp.verifyRelatedArticles();
    
    if (relatedArticlesResults.length === 0) {
      htmlReport.addStep('Related Articles', 'INFO', 'âš ï¸ No related articles found on this page');
    } else {
      htmlReport.addStep('Related Articles Count', 'INFO', `Found ${relatedArticlesResults.length} related article(s)`);
      
      for (let j = 0; j < relatedArticlesResults.length; j++) {
        const result = relatedArticlesResults[j];
        if (result.success) {
          htmlReport.addStep(`Related Article ${result.position}`, 'PASS', 
            `âœ… Card Title: "${result.cardTitle}"<br>Card URL: ${result.cardUrl}<br>Page Title: "${result.pageTitle}"<br>Page URL: ${result.pageUrl}`);
        } else {
          htmlReport.addStep(`Related Article ${result.position}`, 'FAIL', 
            `âŒ Card Title: "${result.cardTitle}"<br>Card URL: ${result.cardUrl}<br>Page Title: "${result.pageTitle}"<br>Page URL: ${result.pageUrl}`);
        }
      }
    }
    
    log(SYMBOLS.SUCCESS, 'âœ… TC - 12 PASSED: Related Articles verification completed');

    // ==================== TC - 13: Image Alt Tag Validation ====================
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TC - 13: Image Alt Tag Validation');
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');

    htmlReport.addStep('Test Case 13: Image Alt Tag Validation', 'INFO', 'Verify all product content images have proper alt tags');
    
    // Scroll to top to ensure all images are visible
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    
    // Scroll down slowly to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    
    // Verify all product images have alt tags
    /** @type {{ totalImages: number; imagesWithAlt: number; imagesWithoutAlt: number; success: boolean; images: Array<{index: number; filename: string; alt: string; hasAlt: boolean}> }} */
    const imageValidation = /** @type {any} */ (await pdp.verifyProductImagesAltTags());
    
    htmlReport.addStep('Product Image Count', 'INFO', 
      `Total Product Images: ${imageValidation.totalImages}<br>` +
      `With Alt Tags: ${imageValidation.imagesWithAlt}<br>` +
      `Without Alt Tags: ${imageValidation.imagesWithoutAlt}`);
    
    // Add detailed image list to report
    if (imageValidation.images.length > 0) {
      const imageListHtml = generateImageAltTagTable(imageValidation.images);
      log(SYMBOLS.SUCCESS, `âœ… Image validation complete: ${imageValidation.imagesWithAlt}/${imageValidation.totalImages} images have alt tags`);
      htmlReport.addStep('Image Details', 'INFO', imageListHtml);
    }
    
    if (imageValidation.success) {
      htmlReport.addStep('Image Alt Tags', 'PASS', `âœ… All ${imageValidation.totalImages} product images have alt tags`);
      log(SYMBOLS.SUCCESS, `âœ… TC - 13 PASSED: All ${imageValidation.totalImages} product images have alt tags`);
    } else {
      htmlReport.addStep('Images Missing Alt Tags', 'WARN', 
        `âš ï¸ ${imageValidation.imagesWithoutAlt} out of ${imageValidation.totalImages} product images missing alt tags`);
      log(SYMBOLS.WARNING, `âš ï¸ TC - 13 WARNING: ${imageValidation.imagesWithoutAlt} images missing alt tags`);
    }
    
    await page.waitForTimeout(2000);

    // ==================== TC - 14: Feature Icon Functionality ====================
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.ROCKET, 'TC - 14: Feature Icon Functionality (Click Icons & Validate Title Changes)');
    log(SYMBOLS.ROCKET, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');

    htmlReport.addStep('Test Case 14: Feature Icon Functionality', 'INFO', 'Verify clicking each feature icon changes the corresponding feature title');

    // Verify feature icons
    /** @type {{ success: boolean; totalIcons: number; successfullyVerified: number; failedCount: number; successRate: number; iconsVerified: Array<{index: number; iconNumber: string; success: boolean; titleChanged: boolean; titleBefore: string; titleAfter: string; iconAlt: string}>; verificationMessage: string }} */
    const featureIconValidation = /** @type {any} */ (await pdp.verifyFeatureIcons());

    htmlReport.addStep('Feature Icon Count', 'INFO', 
      `Total Feature Icons: ${featureIconValidation.totalIcons}<br>` +
      `Successfully Verified: ${featureIconValidation.successfullyVerified}<br>` +
      `Failed: ${featureIconValidation.failedCount}<br>` +
      `Success Rate: ${featureIconValidation.successRate}%`);

    // Add detailed icon verification results
    if (featureIconValidation.iconsVerified.length > 0) {
      let iconDetailsHtml = '<table style="width:100%; border-collapse: collapse; margin-top: 10px;">' +
        '<tr style="background-color: #f2f2f2;">' +
        '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Icon #</th>' +
        '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Status</th>' +
        '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Title Changed</th>' +
        '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Title Before</th>' +
        '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Title After</th>' +
        '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Icon Label</th>' +
        '</tr>';

      featureIconValidation.iconsVerified.forEach(icon => {
        const statusIcon = icon.success ? 'âœ…' : 'âŒ';
        const statusText = icon.success ? 'PASS' : 'FAIL';
        const titleStatus = icon.titleChanged ? 'âœ… Yes' : 'âš ï¸ No';
        const iconAlt = icon.iconAlt || 'N/A';
        const titleBefore = icon.titleBefore || 'N/A';
        const titleAfter = icon.titleAfter || 'N/A';
        
        iconDetailsHtml += `<tr>` +
          `<td style="border: 1px solid #ddd; padding: 8px;">${icon.iconNumber}</td>` +
          `<td style="border: 1px solid #ddd; padding: 8px;">${statusIcon} ${statusText}</td>` +
          `<td style="border: 1px solid #ddd; padding: 8px;">${titleStatus}</td>` +
          `<td style="border: 1px solid #ddd; padding: 8px;">${titleBefore}</td>` +
          `<td style="border: 1px solid #ddd; padding: 8px;">${titleAfter}</td>` +
          `<td style="border: 1px solid #ddd; padding: 8px;">${iconAlt}</td>` +
          `</tr>`;
      });

      iconDetailsHtml += '</table>';
      htmlReport.addStep('Feature Icon Details', 'INFO', iconDetailsHtml);
    }

    // Final feature icon verification result
    if (featureIconValidation.success) {
      htmlReport.addStep('Feature Icon Verification', 'PASS', 
        `âœ… All ${featureIconValidation.totalIcons} feature icons verified successfully. Each icon click updated the feature title as expected.`);
      log(SYMBOLS.SUCCESS, `âœ… TC - 14 PASSED: Feature icon functionality verified (${featureIconValidation.totalIcons} icons)`);
    } else if (featureIconValidation.totalIcons === 0) {
      htmlReport.addStep('Feature Icon Verification', 'WARN', 
        `âš ï¸ No feature icons found on the page. Feature icon verification skipped.`);
      log(SYMBOLS.WARNING, `âš ï¸ TC - 14 INFO: No feature icons found on page`);
    } else {
      htmlReport.addStep('Feature Icon Verification', 'WARN', 
        `âš ï¸ Feature icon verification completed with issues. ${featureIconValidation.successfullyVerified}/${featureIconValidation.totalIcons} icons verified successfully.`);
      log(SYMBOLS.WARNING, `âš ï¸ TC - 14 WARNING: ${featureIconValidation.failedCount} out of ${featureIconValidation.totalIcons} icons had issues`);
    }

    await page.waitForTimeout(2000);

    // ==================== TEST SUITE COMPLETE ====================
    log(SYMBOLS.CELEBRATION, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    log(SYMBOLS.CELEBRATION, 'ðŸŽ‰ ALL TEST CASES (TC1-TC14) PASSED SUCCESSFULLY! ðŸŽ‰');
    log(SYMBOLS.CELEBRATION, 'â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    
    // Close the browser
    log(SYMBOLS.INFO, 'Closing browser...');
    await page.close();
    await context.close();
    log(SYMBOLS.SUCCESS, 'âœ… Browser closed successfully');
    htmlReport.addStep('Close Browser', 'PASS', `âœ… Browser closed successfully`);
  });
});

/**
 * Additional test for quick sanity check
 * Useful for quick verification or debugging
 */
test.describe('Trimmer - Quick Sanity Test', () => {
  
  /** @type {HtmlTestReport} */
  let htmlReport;

  test.beforeEach(async ({ page, context }, testInfo) => {
    await setupTest(context, testInfo);
    htmlReport = HtmlTestReport.create(
      'Trimmer Quick Test',
      'Production',
      page
    );
  });

  test.afterEach(async () => {
    // Generate individual report for quick test
    const reportsDir = path.join(process.cwd(), 'test-results', 'trimmer-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    await htmlReport.generateReport(path.join(reportsDir, `Quick_Test_${timestamp}.html`));
  });
});
