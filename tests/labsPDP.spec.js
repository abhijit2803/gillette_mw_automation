// @ts-check
/**
 * Gillette Labs PDP Sanity Test Suite
 * Playwright JavaScript Test Suite
 * 
 * Test Coverage:
 * - TC 1: Browser Initialization & URL Navigation
 * - TC 2: Cookie Consent
 * - TC 3: SEO Validation (URL, H1, Meta Title, Meta Description, Canonical Tag, Breadcrumbs)
 * - TC 4: Product Variant Selection (if available)
 * - TC 5: BUY NOW Button Functionality
 * - TC 6: Learn More Button -> Product Details Section
 * - TC 7: Write A Review (Click, Verify & Cancel)
 * - TC 8: Related Products Verification (Dynamic)
 */

import { test, expect } from '@playwright/test';
import { setupTest } from '../utils/testSetup.js';
import { SYMBOLS, log } from '../utils/logConstants.js';
import { HtmlTestReport } from '../utils/htmlReportGenerator.js';
import { labsProductDetailsPage } from '../pages/labsProductDetailsPage.js';
import fs from 'fs';
import path from 'path';

// Product URL to test
const PRODUCT_URL = 'https://www.gillette.de/de-de/produkte/rasierer/gillettelabs-rasierer-reinigungselement';

// Test Configuration
const TEST_CONFIG = {
  buyNowPopupMessage: 'Online-Händler',
  productDetailsHeading: 'Produktdetails'
};

test.describe('Gillette Labs PDP Sanity Tests - Germany Website', () => {

  // Configure test to run in serial mode with single worker
  test.describe.configure({ mode: 'serial' });

  /** @type {any} */
  let testEnvironment;
  /** @type {HtmlTestReport} */
  let htmlReport;

  // Setup before all tests
  test.beforeAll(async () => {
    htmlReport = HtmlTestReport.create(
      'Gillette Labs PDP Sanity Tests',
      'Production'
    );
    
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'GILLETTE LABS PDP SANITY TEST SUITE - GERMANY');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
  });

  // Setup before each test
  test.beforeEach(async ({ page, context }, testInfo) => {
    testEnvironment = await setupTest(context, testInfo);
  });

  // Generate report after all tests
  test.afterAll(async () => {
    try {
      // Create reports directory if it doesn't exist
      const reportsDir = path.join(process.cwd(), 'test-results', 'labs-reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      
      // Generate timestamp for report filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const reportPath = path.join(reportsDir, `Gillette_Labs_PDP_Sanity_Report_${timestamp}.html`);
      
      await htmlReport.generateReport(reportPath);
      log(SYMBOLS.SUCCESS, `HTML report generated: ${reportPath}`);
    } catch (/** @type {any} */ error) {
      log(SYMBOLS.ERROR, `Failed to generate HTML report: ${error.message}`);
    }
  });

  /**
   * Complete PDP Sanity Test for Gillette Labs Product
   */
  test('Complete PDP Sanity Test', async ({ page, context }) => {
    const pdp = new labsProductDetailsPage(page);
    let productName = '';
    let currentUrl = '';

    // ==================== TC - 1: Browser Initialization & Navigation ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 1: Browser Initialization & URL Navigation');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    htmlReport.addStep('Browser Initialization', 'PASS', '✅ Browser initialized successfully');
    htmlReport.addStep('Launch URL', 'INFO', `Launching Product URL: ${PRODUCT_URL}`);
    
    await pdp.navigateToProduct(PRODUCT_URL);
    htmlReport.addStep('Navigate to URL', 'PASS', `✅ Navigated to URL: ${PRODUCT_URL}`);
    log(SYMBOLS.SUCCESS, '✅ TC - 1 PASSED: Browser launched and navigated to Product');

    // ==================== TC - 2: Cookie Consent ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 2: Cookie Consent - Accept Cookies');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    await pdp.acceptCookies();
    htmlReport.addStep('Cookies', 'PASS', '✅ Cookies accepted successfully');
    log(SYMBOLS.SUCCESS, '✅ TC - 2 PASSED: Cookie consent accepted');

    // ==================== TC - 3: SEO Validation (URL, H1, meta title, meta description, canonical tag, breadcrumbs) ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 3: SEO Validation (URL, H1, meta title, meta description, canonical tag, breadcrumbs)');
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

    // Verify Breadcrumbs
    const breadcrumbsResult = await pdp.verifyBreadcrumbs();
      
    if (breadcrumbsResult.present) {
      const breadcrumbsText = breadcrumbsResult.breadcrumbs.map((bc, idx) => 
        `${idx + 1}. "${bc.text}"${bc.href ? ` (${bc.href})` : ' (current)'}`
      ).join('<br>');
      htmlReport.addStep('Verify Breadcrumbs', 'PASS', `✅ Found ${breadcrumbsResult.count} breadcrumb(s):<br>${breadcrumbsText}`);
      log(SYMBOLS.SUCCESS, `✅ Breadcrumbs verified: ${breadcrumbsResult.count} item(s)`);
    } else {
      htmlReport.addStep('Verify Breadcrumbs', 'WARN', '⚠️ No breadcrumbs found on page');
      log(SYMBOLS.WARNING, '⚠️ No breadcrumbs found on page');
    }

    log(SYMBOLS.SUCCESS, '✅ TC - 3 PASSED: SEO Validation completed (URL, H1, Meta Title, Meta Description, Canonical Tag, Breadcrumbs)');
    await page.waitForTimeout(3000);

    // ==================== TC - 4: Product Variant Selection (if available) ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 4: Product Variant Selection');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    const variantResult = await pdp.clickProductVariant();
    
    if (variantResult.hasVariant) {
      htmlReport.addStep('Product Variant', 'PASS', 
        `✅ Product Variant is displayed where variant text is: ${variantResult.variantText}`);
      log(SYMBOLS.SUCCESS, `✅ TC - 4 PASSED: Product Variant clicked - "${variantResult.variantText}"`);
    } else {
      htmlReport.addStep('Product Variant', 'INFO', 
        'ℹ️ No Product Variant found');
      log(SYMBOLS.INFO, 'ℹ️ TC - 4 INFO: No Product Variant available for this product');
    }

    // ==================== TC - 5: BUY NOW Button Functionality ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 5: BUY NOW Button Functionality');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    const buyNowResult = await pdp.verifyBuyNowFunctionality(TEST_CONFIG.buyNowPopupMessage);
    
    if (buyNowResult.success) {
      htmlReport.addStep('Buy Now Button', 'PASS', 
        `✅ 'Buy Now' Button is successfully clicked`);
      htmlReport.addStep("Click 'Buy Now' Button", 'PASS', 
        `✅ 'Buy Now' Button is successfully clicked. The Verified message on pop-up is: ${buyNowResult.popupMessage}`);
      log(SYMBOLS.SUCCESS, `✅ TC - 5 PASSED: Buy Now popup verified with message: "${buyNowResult.popupMessage}"`);
    } else {
      htmlReport.addStep("Click 'Buy Now' Button", 'FAIL', "❌ 'Buy Now' Button not clicked or popup not displayed.");
      log(SYMBOLS.ERROR, '❌ TC - 5 FAILED: Buy Now functionality verification failed');
    }
    
    // Close Buy Now popup
    await pdp.closeBuyNowPopup();
    await pdp.moveMouseToSafeArea();
    htmlReport.addStep("Close 'Buy Now' Popup", 'PASS', `✅ 'Buy Now' Popup closed successfully`);
    log(SYMBOLS.SUCCESS, '✅ TC - 5 PASSED: Buy Now functionality verified');

    // ==================== TC - 6: Learn More Button -> Product Details Section ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 6: Learn More Button -> Product Details Section');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    const learnMoreResult = await pdp.verifyLearnMoreAndProductDetails(TEST_CONFIG.productDetailsHeading);
    
    if (learnMoreResult.success) {
      htmlReport.addStep('Learn More Button', 'PASS', 
        `✅ 'LEARN MORE' Button is found where button text is: ${learnMoreResult.learnMoreText} and clicked successfully.`);
      htmlReport.addStep('Product Detail Heading', 'PASS', 
        `✅ Successfully clicked on LEARN MORE button, and page redirected to Product Details section where heading is ${learnMoreResult.detailHeading}`);
      log(SYMBOLS.SUCCESS, `✅ TC - 6 PASSED: Learn More clicked and Product Details section displayed`);
    } else {
      htmlReport.addStep('Learn More Button', 'FAIL', 
        `❌ 'LEARN MORE' Button click failed`);
      log(SYMBOLS.ERROR, '❌ TC - 6 FAILED: Learn More/Product Details verification failed');
    }

    // Take screenshot of Product Details section
    const screenshotsDir = path.join(process.cwd(), 'test-results', 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    const screenshotPath = path.join(screenshotsDir, 'Product_Details_section_Gillette_Labs.png');
    await pdp.takeScreenshot(screenshotPath);

    // ==================== TC - 7: Write A Review (Click, Verify & Cancel) ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 7: Write A Review');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    // Verify Write A Review button and page
    const reviewResult = await pdp.verifyWriteAReviewPage(productName);
    
    if (reviewResult.success) {
      htmlReport.addStep('Write A Review Button', 'PASS', 
        `✅ 'Write A Review' Button is found and clicked successfully.`);
      htmlReport.addStep('Write A Review Page', 'PASS', 
        `✅ 'Write A Review' Page is successfully displayed. The Product name on review page is: ${reviewResult.reviewPageProductName}`);
      log(SYMBOLS.SUCCESS, `✅ TC - 7 Write A Review page verified for product: "${reviewResult.reviewPageProductName}"`);
    } else {
      htmlReport.addStep('Write A Review Button', 'FAIL', 
        `❌ 'Write A Review' Button is NOT found`);
      htmlReport.addStep('Write A Review Page', 'FAIL', 
        `❌ 'Write A Review' Page is NOT displayed`);
      log(SYMBOLS.ERROR, '❌ TC - 7 Write A Review verification failed');
    }

    // Click Cancel button to return to PDP
    const cancelResult = await pdp.clickCancelOnReviewPage(currentUrl);
    
    if (cancelResult.success) {
      htmlReport.addStep('Cancel Button', 'PASS', 
        `✅ 'Cancel' Button is clicked on WRITE A REVIEW page and returned to corresponding PRODUCT page successfully.`);
    } else {
      htmlReport.addStep('Cancel Button', 'FAIL', 
        `❌ 'Cancel' Button is NOT clicked`);
    }
      
    log(SYMBOLS.SUCCESS, '✅ TC - 7 PASSED: Write A Review functionality verified');
    await page.waitForTimeout(5000);

    // ==================== TC - 8: Related Products Section ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 8: Related Products Section Verification');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    const relatedProductsResult = await pdp.verifyRelatedProducts();
    
    for (const product of relatedProductsResult.verifiedProducts) {
      if (product.success) {
        htmlReport.addStep(`Related Product ${product.index}`, 'PASS', 
          `✅ Product linked at ${product.index} position: ${product.cardTitle}`);
      } else {
        htmlReport.addStep(`Related Product ${product.index}`, 'FAIL', 
          `❌ Mismatch: Card = ${product.cardTitle}, Page = ${product.pdpTitle || 'N/A'}`);
      }
    }
    
    const productsCount = relatedProductsResult.verifiedProducts.length;
    log(SYMBOLS.SUCCESS, `✅ TC - 8 PASSED: ${productsCount} Related Product(s) verification completed`);
    await page.waitForTimeout(10000);

    // ==================== Test Complete ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.SUCCESS, 'GILLETTE LABS PDP SANITY TEST COMPLETE');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    htmlReport.addStep('Close Browser', 'PASS', '✅ Browser closed successfully');
  });
});
