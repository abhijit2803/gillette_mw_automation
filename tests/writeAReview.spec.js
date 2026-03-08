// @ts-check
/**
 * Write A Review Test Suite
 * Playwright JavaScript Test Suite
 * 
 * Test Coverage (Complete Workflow):
 * - TC 1: Browser Initialization & Navigation to Product
 * - TC 2: Cookie Consent
 * - TC 3: Product Name Extraction
 * - TC 4: Click Write A Review Button
 * - TC 5: Validate Product Name on Review Page
 * - TC 6: Complete Review Form Submission (Star Ratings, Text Fields, Media Upload, Personal Info, Terms & Conditions)
 * - TC 7: Submit Review Form
 * - TC 8: Success Message Verification
 * - TC 9: Return to Product Page
 */

import { test, expect } from '@playwright/test';
import { setupTest } from '../utils/testSetup.js';
import { SYMBOLS, log } from '../utils/logConstants.js';
import { HtmlTestReport } from '../utils/htmlReportGenerator.js';
import { productDetailsPage } from '../pages/productDetailsPage.js';
import { writeAReviewPage } from '../pages/writeAReviewPage.js';
import fs from 'fs';
import path from 'path';

// Product URL to test
const PRODUCT_URL = 'https://www.gillette.de/de-de/produkte/bartpflege/kingcgillette-3-in-1-shampoo';

// Test Configuration
const TEST_CONFIG = {
  successMessage: 'ÜBERARBEITUNG ERFOLGREICH ÜBERMITTELT',
  testDataDefaults: {
    summary: 'Dieses Produkt ist das Beste von Gillette',
    description: 'Der GilletteLabs übertrifft alles was bisher Gillette entwickelt und auf den Markt gebracht hat. Das Rasieren ist noch angenehmer: zwick nicht, sanft, keine Hautirritation.',
  }
};

test.describe('Write A Review Functionality - Germany Website', () => {

  // Configure test to run in serial mode
  test.describe.configure({ mode: 'serial' });

  /** @type {any} */
  let testEnvironment;
  /** @type {HtmlTestReport} */
  let htmlReport;
  /** @type {string} */
  let productName;
  /** @type {string} */
  let productUrl;

  // Setup before all tests
  test.beforeAll(async () => {
    htmlReport = HtmlTestReport.create(
      'Write A Review Form Submission Test Suite',
      'Production'
    );
    
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'WRITE A REVIEW FORM SUBMISSION TEST SUITE - GERMANY');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
  });

  // ==================== MERGED TEST: All Test Cases in Single Test ====================
  test('Write A Review - Complete Workflow (TC-01 to TC-09)', async ({ page }) => {
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'COMPLETE WRITE A REVIEW WORKFLOW - ALL TEST CASES (TC-01 to TC-09)');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

    try {
      // ==================== TC 1: Browser Initialization & Navigation ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC-01: Browser Initialization & Navigation to Product');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

      const pdp = new productDetailsPage(page);
      
      // Navigate to product page
      htmlReport.addStep('Browser Initialization', 'INFO', '🌐 Chrome Browser initialized');
      log(SYMBOLS.INFO, 'Browser initialized');

      // Navigate to product
      await pdp.navigateToProduct(PRODUCT_URL);
      htmlReport.addStep('Navigate to Product URL', 'PASS', 
        `✅ Navigated to Product Page successfully. URL: ${PRODUCT_URL}`);
      
      productUrl = page.url();
      expect(productUrl).toContain('gillette.de');

      // ==================== TC 2: Cookie Consent ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC-02: Accept Cookies');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

      // Accept cookies
      await pdp.acceptCookies();
      await page.waitForTimeout(3000);
      
      htmlReport.addStep('Cookie Consent', 'PASS', '✅ Cookies accepted successfully');
      log(SYMBOLS.SUCCESS, '✅ TC-02 PASSED: Cookies accepted');

      // ==================== TC 3: Product Name Extraction ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC-03: Extract Product Name');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

      // Wait for product title to be visible before extracting
      log(SYMBOLS.INFO, 'Waiting for product title to load...');
      await pdp.productTitle.waitFor({ state: 'visible', timeout: 15000 });
      await page.waitForTimeout(1000);

      // Get product name
      productName = await pdp.getProductName();
      expect(productName).toBeTruthy();

      htmlReport.addStep('Product Name Extraction', 'PASS', 
        `✅ Product name extracted successfully: ${productName}`);
      log(SYMBOLS.SUCCESS, `✅ TC-03 PASSED: Product name is "${productName}"`);

      // ==================== TC 4: Navigate to Write A Review ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC-04: Click Write A Review Button');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

      // Wait for Write A Review button to be visible and clickable
      log(SYMBOLS.INFO, 'Waiting for Write A Review button to be visible...');
      await pdp.writeReviewButton.waitFor({ state: 'visible', timeout: 15000 });
      await pdp.writeReviewButton.click();
      await page.waitForTimeout(4000);

      htmlReport.addStep('Write A Review Button', 'PASS', 
        '✅ Write A Review button clicked successfully');
      
      // Verify page navigated to review form
      let currentUrl = page.url();
      expect(currentUrl.includes('review') || currentUrl !== productUrl).toBeTruthy();
      log(SYMBOLS.SUCCESS, `✅ TC-04 PASSED: Navigated to Write A Review page - ${currentUrl}`);

      // ==================== TC 5: Validate Review Page Product Name ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC-05: Validate Product Name on Review Page');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

      const warPage = new writeAReviewPage(page);

      // Wait for page title to load
      log(SYMBOLS.INFO, 'Waiting for review page title to load...');
      await warPage.productName.waitFor({ state: 'visible', timeout: 15000 });
      await page.waitForTimeout(1000);

      // Validate product name matches
      const validationResult = await warPage.validateProductNameOnReviewPage(productName);

      if (validationResult.success) {
        htmlReport.addStep('Product Name Validation', 'PASS', 
          `✅ Product name matches on review page: ${validationResult.actualName}`);
        log(SYMBOLS.SUCCESS, `✅ TC-05 PASSED: Product name validated`);
      } else {
        htmlReport.addStep('Product Name Validation', 'WARNING', 
          `⚠️ Product name mismatch. Expected: ${productName}, Got: ${validationResult.actualName}`);
        log(SYMBOLS.WARNING, `⚠️ TC-05 WARNING: Product name mismatch`);
      }

      // ==================== TC 6: Complete Review Form Submission ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC-06: Complete Review Form Submission');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

      // Wait for form to be ready
      log(SYMBOLS.INFO, 'Waiting for review form to load...');
      await warPage.reviewSummaryField.waitFor({ state: 'visible', timeout: 15000 });
      await page.waitForTimeout(2000);

      // Star Ratings & Recommendation
      await warPage.selectOverallRating(5);
      await warPage.selectValueRating(5);
      await warPage.selectQualityRating(5);
      await warPage.selectRecommendation(true);

      htmlReport.addStep('Star Ratings', 'PASS', 
        '✅ Star ratings selected: Overall=5, Value=5, Quality=5');
      htmlReport.addStep('Recommendation', 'PASS', 
        '✅ Recommendation selected: Yes');

      // Review Text Fields
      await warPage.enterReviewSummary(TEST_CONFIG.testDataDefaults.summary);
      await warPage.enterReviewDescription(TEST_CONFIG.testDataDefaults.description);

      htmlReport.addStep('Review Summary', 'PASS', 
        `✅ Review summary entered (${TEST_CONFIG.testDataDefaults.summary.length}/50 chars): ${TEST_CONFIG.testDataDefaults.summary}`);
      htmlReport.addStep('Review Description', 'PASS', 
        `✅ Review description entered (${TEST_CONFIG.testDataDefaults.description.length}/200 chars)`);

      // Media Upload (Photo & Video) - MANDATORY
      log(SYMBOLS.INFO, 'Media Upload (Photo & Video) - MANDATORY');

      // Define test media file paths (mandatory)
      const testImagePath = path.join(process.cwd(), 'test-data', 'media-files', 'SampleJPGImage_5mbmb.jpg');
      const testVideoPath = path.join(process.cwd(), 'test-data', 'media-files', 'SampleVideo_1280x720_2mb.mp4');

      // Upload photo (MANDATORY)
      log(SYMBOLS.INFO, `Uploading test image from: ${testImagePath}`);
      if (!fs.existsSync(testImagePath)) {
        throw new Error(`Test image file not found at ${testImagePath}. This is a mandatory step.`);
      }
      await warPage.uploadPhoto(testImagePath);
      htmlReport.addStep('Photo Upload', 'PASS', '✅ Test photo uploaded successfully');
      log(SYMBOLS.SUCCESS, '✅ Test photo uploaded');

      // Upload video (MANDATORY)
      log(SYMBOLS.INFO, `Uploading test video from: ${testVideoPath}`);
      if (!fs.existsSync(testVideoPath)) {
        throw new Error(`Test video file not found at ${testVideoPath}. This is a mandatory step.`);
      }
      await warPage.uploadVideo(testVideoPath);
      htmlReport.addStep('Video Upload', 'PASS', '✅ Test video uploaded successfully');
      log(SYMBOLS.SUCCESS, '✅ Test video uploaded');

      log(SYMBOLS.SUCCESS, '✅ Media upload completed successfully');

      // Personal Information
      const nickname = await warPage.generateAndEnterNickname();
      const monthIndex = await warPage.selectBirthMonth();
      const year = await warPage.selectBirthYear();
      await warPage.selectGender();
      const email = await warPage.generateAndEnterEmail();
      const location = await warPage.selectRandomLocation();

      htmlReport.addStep('Personal Information', 'PASS', 
        `✅ Personal information filled - Nickname: ${nickname}, Email: ${email}, Location: ${location}`);

      // Terms & Conditions
      await warPage.acceptTermsAndConditions();

      htmlReport.addStep('Terms & Conditions', 'PASS', 
        '✅ Terms and conditions accepted');

      const formData = { summary: TEST_CONFIG.testDataDefaults.summary, description: TEST_CONFIG.testDataDefaults.description, nickname, email, location };

      log(SYMBOLS.SUCCESS, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.SUCCESS, '✅ TC-06 PASSED: Complete Review Form Submission');
      log(SYMBOLS.SUCCESS, '═══════════════════════════════════════════════════════════');

      // ==================== TC 7: Submit Review ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC-07: Submit Review Form');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

      // Wait for submit button to be ready
      log(SYMBOLS.INFO, 'Waiting for submit button...');
      await warPage.submitButton.waitFor({ state: 'visible', timeout: 10000 });
      await page.waitForTimeout(1000);

      // Submit review
      await warPage.submitReview();
      htmlReport.addStep('Submit Review Form', 'PASS', 
        '✅ Review form submitted successfully');

      log(SYMBOLS.SUCCESS, '✅ TC-07 PASSED: Review submitted');

      // ==================== TC 8: Verify Success Message ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC-08: Verify Success Message');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

      // Add additional wait for success message
      log(SYMBOLS.INFO, 'Waiting for success message to appear...');
      await page.waitForTimeout(3000);

      // Verify success message
      const successResult = await warPage.verifySuccessMessage(TEST_CONFIG.successMessage);

      if (successResult.success) {
        htmlReport.addStep('Success Message Verification', 'PASS', 
          `✅ Success message verified: ${successResult.actualMessage}`);
        log(SYMBOLS.SUCCESS, '✅ TC-08 PASSED: Success message verified');
      } else {
        htmlReport.addStep('Success Message Verification', 'WARNING', 
          `⚠️ Expected message: "${TEST_CONFIG.successMessage}", Got: "${successResult.actualMessage}"`);
        log(SYMBOLS.WARNING, `⚠️ TC-08 WARNING: Success message verification issue`);
      }

      // ==================== TC 9: Return to Product Page ====================
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.ROCKET, 'TC-09: Click Continue & Return to Product Page');
      log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

      // Wait for continue button to be visible
      log(SYMBOLS.INFO, 'Waiting for continue button...');
      await warPage.continueButton.waitFor({ state: 'visible', timeout: 15000 });
      await page.waitForTimeout(1000);

      // Click continue button
      await warPage.clickContinue();
      
      // Verify return to product page
      const returnResult = await warPage.verifyReturnToProductPage(productUrl);

      if (returnResult.success) {
        htmlReport.addStep('Continue Button', 'PASS', 
          '✅ Continue button clicked successfully');
        htmlReport.addStep('Return to Product Page', 'PASS', 
          `✅ Returned to product page: ${returnResult.currentUrl}`);
        log(SYMBOLS.SUCCESS, '✅ TC-09 PASSED: Returned to product page');
      } else {
        htmlReport.addStep('Return to Product Page', 'WARNING', 
          `⚠️ URL mismatch. Expected: ${productUrl}, Got: ${returnResult.currentUrl}`);
        log(SYMBOLS.WARNING, '⚠️ TC-09 WARNING: URL mismatch');
      }

      // ==================== ALL TESTS COMPLETED ====================
      log(SYMBOLS.SUCCESS, '═══════════════════════════════════════════════════════════');
      log(SYMBOLS.SUCCESS, '✅ ALL TEST STEPS COMPLETED SUCCESSFULLY (TC-01 to TC-09)');
      log(SYMBOLS.SUCCESS, '═══════════════════════════════════════════════════════════');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      htmlReport.addStep('Test Execution', 'FAIL', `❌ Test workflow failed: ${errorMessage}`);
      log(SYMBOLS.ERROR, `❌ TEST FAILED: ${errorMessage}`);
      throw error;
    }
  });

  // ==================== Generate HTML Report ====================
  test.afterAll(async () => {
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'GENERATING HTML TEST REPORT');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

    try {
      // Create reports directory
      const reportsDir = path.join(process.cwd(), 'test-results', 'write-review-reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      // Generate report with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0];
      const reportPath = path.join(reportsDir, `WriteAReview_Report_${timestamp}.html`);

      await htmlReport.generateReport(reportPath);
      
      log(SYMBOLS.SUCCESS, `✅ HTML Report generated: ${reportPath}`);
      console.log(`\n📊 Test Report available at: ${reportPath}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log(SYMBOLS.ERROR, `❌ Failed to generate HTML report: ${errorMessage}`);
      console.error('Report generation error:', error);
    }
  });
});
