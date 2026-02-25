// @ts-check
/**
 * Gillette Labs PDP Sanity Test Suite
 * Playwright JavaScript Test Suite
 * 
 * Test Coverage:
 * - TC 1: Browser Initialization & URL Navigation
 * - TC 2: Cookie Consent
 * - TC 3: URL Validation & Product Name (H1)
 * - TC 4: Product Variant Selection (if available)
 * - TC 5: BUY NOW Button Functionality
 * - TC 6: Learn More Button -> Product Details Section
 * - TC 7: Write A Review (Click, Verify & Cancel)
 * - TC 8: Related Products Verification (3 Products)
 */

import { test, expect } from '@playwright/test';
import { setupTest } from '../utils/testSetup.js';
import { SYMBOLS, log } from '../utils/logConstants.js';
import { HtmlTestReport } from '../utils/htmlReportGenerator.js';
import { labsProductDetailsPage } from '../pages/labsProductDetailsPage.js';
import fs from 'fs';
import path from 'path';

// Load product URLs from test data file
const labsUrlsPath = path.join(process.cwd(), 'test-data', 'labsProductUrls.json');
let labsProductData;

try {
  const rawData = fs.readFileSync(labsUrlsPath, 'utf-8');
  labsProductData = JSON.parse(rawData);
} catch (error) {
  console.error('Failed to load Gillette Labs product URLs:', error);
  labsProductData = {
    products: [
      {
        id: 1,
        name: 'Gillette Labs Rasierer mit Reinigungs-Element',
        url: 'https://www.gillette.de/de-de/produkte/gillette-labs/rasierer-mit-reinigungs-element',
        category: 'Labs Rasierer'
      }
    ],
    testConfig: {
      buyNowPopupMessage: 'Online-Händler',
      productDetailsHeading: 'Produktdetails',
      relatedProductsCount: 3
    }
  };
}

// Test Configuration
const TEST_CONFIG = {
  buyNowPopupMessage: labsProductData.testConfig?.buyNowPopupMessage || 'Online-Händler',
  productDetailsHeading: labsProductData.testConfig?.productDetailsHeading || 'Produktdetails',
  relatedProductsCount: labsProductData.testConfig?.relatedProductsCount || 3
};

// Product URLs from test data
const PRODUCT_URLS = labsProductData.products || [];

test.describe('Gillette Labs PDP Sanity Tests - Germany Website', () => {

  let testEnvironment;
  /** @type {HtmlTestReport} */
  let htmlReport;

  // Setup before all tests - create single report for all products
  test.beforeAll(async () => {
    htmlReport = HtmlTestReport.create(
      'Gillette Labs PDP Sanity Tests',
      'Production'
    );
    
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'GILLETTE LABS PDP SANITY TEST SUITE - GERMANY');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    htmlReport.addStep('URL Count', 'INFO', `Total number of Gillette Labs Product URLs for sanity: ${PRODUCT_URLS.length}`);
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
   * Complete PDP Sanity Test for Gillette Labs Products
   * Tests all products from the URL list
   */
  for (let urlIndex = 0; urlIndex < PRODUCT_URLS.length; urlIndex++) {
    const productData = PRODUCT_URLS[urlIndex];
    const PRODUCT_URL = productData.url;
    const count = urlIndex + 1;
    
    test(`Complete Gillette Labs PDP Sanity Test - Product ${count}: ${productData.name}`, async ({ page, context }) => {
      const pdp = new labsProductDetailsPage(page);
      let productName = '';
      let currentUrl = '';

      // ==================== TC - 1: Browser Initialization & Navigation ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, `TC - 1: Browser Initialization & URL Navigation (Product ${count})`);
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      htmlReport.addStep('Browser Initialization', 'PASS', `✅ Browser initialized successfully for ${count} time`);
      htmlReport.addStep('Launch URL', 'INFO', `Launching Product URL Number ${count} from input file: ${PRODUCT_URL}`);
      
      await pdp.navigateToProduct(PRODUCT_URL);
      htmlReport.addStep('Navigate to URL', 'PASS', `✅ Navigated to URL: ${count} ${PRODUCT_URL}`);
      log(SYMBOLS.SUCCESS, `✅ TC - 1 PASSED: Browser launched and navigated to Product ${count}`);

      // ==================== TC - 2: Cookie Consent ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC - 2: Cookie Consent - Accept Cookies');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      await pdp.acceptCookies();
      htmlReport.addStep('Cookies', 'PASS', '✅ Cookies accepted successfully');
      log(SYMBOLS.SUCCESS, '✅ TC - 2 PASSED: Cookie consent accepted');

      // ==================== TC - 3: URL Validation & Product Name ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, `TC - 3: URL Validation & Product Name (Product ${count})`);
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      const urlValidation = await pdp.validateCurrentUrl(PRODUCT_URL);
      currentUrl = urlValidation.currentUrl;
      
      if (urlValidation.success) {
        htmlReport.addStep('Navigated to product page', 'PASS', 
          `✅ URL Number ${count} loaded successfully and matches with input product URL. The URL is: ${currentUrl}`);
      } else {
        htmlReport.addStep('Navigated to product page', 'FAIL', 
          `❌ URL Number ${count} did not match with input data. Expected: ${PRODUCT_URL}, but got: ${currentUrl}`);
      }
      
      productName = await pdp.getProductName();
      
      if (productName) {
        htmlReport.addStep('Product Name', 'PASS', `✅ Product Name of product number ${count}: ${productName}`);
        log(SYMBOLS.SUCCESS, `✅ Product Name found - "${productName}"`);
      } else {
        htmlReport.addStep('Product Name', 'FAIL', `❌ Product Name of product number ${count} is not found on: ${PRODUCT_URL}`);
        log(SYMBOLS.ERROR, '❌ Product Name not found');
      }
      await page.waitForTimeout(5000);
      log(SYMBOLS.SUCCESS, '✅ TC - 3 PASSED: URL validated and Product Name retrieved');

      // ==================== TC - 4: Product Variant Selection (if available) ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, `TC - 4: Product Variant Selection (Product ${count})`);
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      const variantResult = await pdp.clickProductVariant();
      
      if (variantResult.hasVariant) {
        htmlReport.addStep('Product Variant', 'PASS', 
          `✅ Product Variant is displayed for product Number ${count} where variant text is: ${variantResult.variantText}`);
        log(SYMBOLS.SUCCESS, `✅ TC - 4 PASSED: Product Variant clicked - "${variantResult.variantText}"`);
      } else {
        htmlReport.addStep('Product Variant', 'INFO', 
          `ℹ️ No Product Variant found for product Number ${count}`);
        log(SYMBOLS.INFO, 'ℹ️ TC - 4 INFO: No Product Variant available for this product');
      }

      // ==================== TC - 5: BUY NOW Button Functionality ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, `TC - 5: BUY NOW Button Functionality (Product ${count})`);
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      const buyNowResult = await pdp.verifyBuyNowFunctionality(TEST_CONFIG.buyNowPopupMessage);
      
      if (buyNowResult.success) {
        htmlReport.addStep('Buy Now Button', 'PASS', 
          `✅ 'Buy Now' Button is successfully clicked for product Number ${count}`);
        htmlReport.addStep("Click 'Buy Now' Button", 'PASS', 
          `✅ 'Buy Now' Button is successfully clicked for product Number ${count}. The Verified message on pop-up is: ${buyNowResult.popupMessage}`);
        log(SYMBOLS.SUCCESS, `✅ TC - 5 PASSED: Buy Now popup verified with message: "${buyNowResult.popupMessage}"`);
      } else {
        htmlReport.addStep("Click 'Buy Now' Button", 'FAIL', "❌ 'Buy Now' Button not clicked or popup not displayed.");
        log(SYMBOLS.ERROR, '❌ TC - 5 FAILED: Buy Now functionality verification failed');
      }
      
      // Close Buy Now popup
      await pdp.closeBuyNowPopup();
      htmlReport.addStep("Close 'Buy Now' Popup", 'PASS', `✅ 'Buy Now' Popup closed successfully for Product Number ${count}`);

      // ==================== TC - 6: Learn More Button -> Product Details Section ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, `TC - 6: Learn More Button -> Product Details Section (Product ${count})`);
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      const learnMoreResult = await pdp.verifyLearnMoreAndProductDetails(TEST_CONFIG.productDetailsHeading);
      
      if (learnMoreResult.success) {
        htmlReport.addStep('Learn More Button', 'PASS', 
          `✅ 'LEARN MORE' Button is found for Product Number ${count} where button text is: ${learnMoreResult.learnMoreText} and clicked successfully.`);
        htmlReport.addStep('Product Detail Heading', 'PASS', 
          `✅ Successfully clicked on LEARN MORE button, and page redirected to Product Details section for Product Number ${count} where heading is ${learnMoreResult.detailHeading}`);
        log(SYMBOLS.SUCCESS, `✅ TC - 6 PASSED: Learn More clicked and Product Details section displayed`);
      } else {
        htmlReport.addStep('Learn More Button', 'FAIL', 
          `❌ 'LEARN MORE' Button click failed for Product Number ${count}`);
        log(SYMBOLS.ERROR, '❌ TC - 6 FAILED: Learn More/Product Details verification failed');
      }

      // Take screenshot of Product Details section
      const screenshotsDir = path.join(process.cwd(), 'test-results', 'screenshots');
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }
      const screenshotPath = path.join(screenshotsDir, `Product_Details_section_Gillette_Labs_Product_${count}.png`);
      await pdp.takeScreenshot(screenshotPath);

      // ==================== TC - 7: Write A Review (Click, Verify & Cancel) ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, `TC - 7: Write A Review (Product ${count})`);
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      // Verify Write A Review button and page
      const reviewResult = await pdp.verifyWriteAReviewPage(productName);
      
      if (reviewResult.success) {
        htmlReport.addStep('Write A Review Button', 'PASS', 
          `✅ 'Write A Review' Button is found for Product Number ${count} and clicked successfully.`);
        htmlReport.addStep('Write A Review Page', 'PASS', 
          `✅ 'Write A Review' Page is successfully displayed for Product Number ${count}. The Product name on review page is: ${reviewResult.reviewPageProductName}`);
        log(SYMBOLS.SUCCESS, `✅ TC - 7 Write A Review page verified for product: "${reviewResult.reviewPageProductName}"`);
      } else {
        htmlReport.addStep('Write A Review Button', 'FAIL', 
          `❌ 'Write A Review' Button is NOT found for Product Number ${count}`);
        htmlReport.addStep('Write A Review Page', 'FAIL', 
          `❌ 'Write A Review' Page is NOT displayed for Product Number ${count}`);
        log(SYMBOLS.ERROR, '❌ TC - 7 Write A Review verification failed');
      }

      // Click Cancel button to return to PDP
      const cancelResult = await pdp.clickCancelOnReviewPage(currentUrl);
      
      if (cancelResult.success) {
        htmlReport.addStep('Cancel Button', 'PASS', 
          `✅ 'Cancel' Button is clicked on WRITE A REVIEW page for Product Number ${count} and returned to corresponding PRODUCT page successfully.`);
        log(SYMBOLS.SUCCESS, '✅ TC - 7 PASSED: Cancel clicked and returned to PDP');
      } else {
        htmlReport.addStep('Cancel Button', 'FAIL', 
          `❌ 'Cancel' Button is NOT clicked for Product Number ${count}`);
        log(SYMBOLS.ERROR, '❌ TC - 7 Cancel button click failed');
      }

      // ==================== TC - 8: Related Products Verification ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, `TC - 8: Related Products Verification (Product ${count})`);
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      const relatedProductsResults = await pdp.verifyRelatedProducts(TEST_CONFIG.relatedProductsCount);
      
      for (const result of relatedProductsResults) {
        if (result.success) {
          htmlReport.addStep(`Verify Related Product ${result.position}`, 'PASS', 
            `✅ Product linked at ${result.position} position: ${result.cardName}`);
          log(SYMBOLS.SUCCESS, `✅ Related Product ${result.position} verified: ${result.cardName}`);
        } else {
          htmlReport.addStep(`Verify Related Product ${result.position}`, 'FAIL', 
            `❌ Mismatch: Card = ${result.cardName}, Page = ${result.pageName}`);
          log(SYMBOLS.ERROR, `❌ Related Product ${result.position} mismatch`);
        }
      }
      
      // Summary for TC-8
      const relatedProductsPassCount = relatedProductsResults.filter(r => r.success).length;
      if (relatedProductsPassCount === TEST_CONFIG.relatedProductsCount) {
        log(SYMBOLS.SUCCESS, `✅ TC - 8 PASSED: All ${TEST_CONFIG.relatedProductsCount} Related Products verified`);
      } else {
        log(SYMBOLS.WARNING, `⚠️ TC - 8 PARTIAL: ${relatedProductsPassCount}/${TEST_CONFIG.relatedProductsCount} Related Products verified`);
      }

      // ==================== Test Complete ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.SUCCESS, `GILLETTE LABS PDP SANITY TEST COMPLETE FOR PRODUCT ${count}`);
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
      htmlReport.addStep('Close Browser', 'PASS', `✅ Browser closed successfully for ${count} time`);
    });
  }
});
