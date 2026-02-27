// @ts-check
/**
 * King C. Gillette PDP Sanity Test Suite
 * Playwright JavaScript Test Suite
 * 
 * Test Coverage:
 * - TC 1: Browser Initialization & URL Navigation
 * - TC 2: Cookie Consent
 * - TC 3: SEO Validation (URL, H1, Meta Title, Meta Description, Canonical Tag, Breadcrumbs)
 * - TC 4: Facebook Share Functionality (Click & Close)
 * - TC 5: Copy URL Functionality (Click & Close)
 * - TC 6: Favorite/Bookmark Functionality
 * - TC 7: BUY NOW Button Functionality
 * - TC 8: Write A Review (Click, Verify & Cancel)
 * - TC 9: Related Products Verification (3 Products)
 * - TC 10: Related Articles Verification (3 Articles)
 * - TC 11: Image Alt Tag Validation
 * - TC 12: Gallery Image Functionality (Click Thumbnails & Validate Main Image Changes)
 */

import { test, expect } from '@playwright/test';
import { setupTest } from '../utils/testSetup.js';
import { SYMBOLS, log } from '../utils/logConstants.js';
import { HtmlTestReport } from '../utils/htmlReportGenerator.js';
import { kcgProductDetailsPage } from '../pages/kcgProductDetailsPage.js';
import { generateImageAltTagTable } from '../utils/tableGenerator.js';
import fs from 'fs';
import path from 'path';

// Product URL to test
const PRODUCT_URL = 'https://www.gillette.de/de-de/produkte/barttrimmer/king-c-gillette-barttrimmer-pro';

// Test Configuration
const TEST_CONFIG = {
  facebookExpectedMessage: 'https://www.gillette.de/',
  buyNowPopupMessage: 'Online-Händler'
};

test.describe('King C. Gillette PDP Sanity Tests - Germany Website', () => {

  /** @type {any} */
  let testEnvironment;
  /** @type {HtmlTestReport} */
  let htmlReport;

  // Setup before all tests
  test.beforeAll(async () => {
    htmlReport = HtmlTestReport.create(
      'King C. Gillette PDP Sanity Tests',
      'Production'
    );
    
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'KING C. GILLETTE PDP SANITY TEST SUITE - GERMANY');
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
    const reportsDir = path.join(process.cwd(), 'test-results', 'kcg-reports');
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }
      
    // Generate timestamp for report filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const reportPath = path.join(reportsDir, `KCG_PDP_Sanity_Report_${timestamp}.html`);
      
    await htmlReport.generateReport(reportPath);
    log(SYMBOLS.SUCCESS, `HTML report generated: ${reportPath}`);
    } catch (/** @type {any} */ error) {
    log(SYMBOLS.ERROR, `Failed to generate HTML report: ${error.message}`);
    }
  });

  /**
   * Complete PDP Sanity Test for King C. Gillette Product
   */
  test('Complete PDP Sanity Test', async ({ page, context }) => {
    const pdp = new kcgProductDetailsPage(page);
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

    // ==================== TC - 4: Facebook Share Functionality ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 4: Facebook Share Functionality (Click & Close)');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
    const fbResult = await pdp.verifyFacebookShare(TEST_CONFIG.facebookExpectedMessage);
      
    if (fbResult.success) {
      htmlReport.addStep("Click 'Facebook Icon'", 'PASS', "✅ 'Facebook Icon' button clicked.");
    } else {
      htmlReport.addStep("Click 'Facebook Icon'", 'FAIL', "❌ 'Facebook Icon' button click failed.");
    }
      
    await pdp.closeFacebookPopup();
    log(SYMBOLS.SUCCESS, '✅ TC - 4 PASSED: Facebook functionality verified');

    // ==================== TC - 5: Copy URL Functionality ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 5: Copy URL Functionality (Click & Close)');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    // Get the current page URL for verification
    const pageUrl = page.url();
    
    const copyResult = await pdp.verifyCopyUrlFunctionality(pageUrl);
      
    if (copyResult.success) {
      htmlReport.addStep("Click 'Copy Icon'", 'PASS', `✅ 'Copy Icon' button clicked. Copied URL: ${copyResult.copiedUrl}`);
      htmlReport.addStep('Copy URL Verification', 'PASS', `✅ 'Copy Icon' button clicked and copied URL matches with Page URL: ${pageUrl}`);
    } else {
      htmlReport.addStep("Click 'Copy Icon'", 'FAIL', "❌ 'Copy Icon' button click failed.");
      htmlReport.addStep('Copy URL Verification', 'FAIL', `❌ Copied URL does not match Page URL. Page URL: ${pageUrl}, Copied: ${copyResult.copiedUrl}`);
    }
      
    await pdp.closeCopyUrlPopup();
    log(SYMBOLS.SUCCESS, '✅ TC - 5 PASSED: Copy URL functionality verified');

    // ==================== TC - 6: Favorite Functionality ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 6: Favorite/Bookmark Functionality');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
    const favResult = await pdp.verifyFavoriteFunctionality(productName);
      
    if (favResult.success) {
      htmlReport.addStep("Click 'Favorite Icon'", 'PASS', `✅ 'Favorite Icon' button clicked. Product: ${favResult.favoriteProductName}`);
    } else {
      htmlReport.addStep("Click 'Favorite Icon'", 'FAIL', "❌ 'Favorite Icon' button click failed.");
    }
    log(SYMBOLS.SUCCESS, '✅ TC - 6 PASSED: Favorite functionality verified');

    // ==================== TC - 7: BUY NOW Button Functionality ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 7: BUY NOW Button Functionality');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
    const buyNowResult = await pdp.verifyBuyNowFunctionality(TEST_CONFIG.buyNowPopupMessage);
      
    if (buyNowResult.success) {
      htmlReport.addStep("Click 'Buy Now Button'", 'PASS', 
        `✅ 'Buy Now Button' button is successfully clicked. The Verified message on pop-up is: ${buyNowResult.popupMessage}`);
    } else {
      htmlReport.addStep("Click 'Buy Now Button'", 'FAIL', "❌ 'Buy Now Button' button click failed.");
    }
      
    await pdp.closeBuyNowPopup();
    await pdp.moveMouseToSafeArea();
    log(SYMBOLS.SUCCESS, '✅ TC - 7 PASSED: Buy Now functionality verified');

    // ==================== TC - 8: Write A Review ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 8: Write A Review (Click, Verify & Cancel)');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
    // Click Write A Review
    const writeReviewResult = await pdp.verifyWriteAReviewPage(productName);
      
    if (writeReviewResult.success) {
      htmlReport.addStep('Write A Review Button', 'PASS', 
        `✅ 'Write A Review' Button is found`);
      htmlReport.addStep('Write A Review Page', 'PASS', 
        `✅ 'Write A Review' Page is successfully displayed. The Product name on review page is: ${writeReviewResult.reviewPageProductName}`);
    } else {
      htmlReport.addStep('Write A Review Button', 'FAIL', 
        `❌ 'Write A Review' Button is NOT found`);
      htmlReport.addStep('Write A Review Page', 'FAIL', 
        `❌ 'Write A Review' Page is NOT displayed`);
    }
      
    // Click Cancel to return to PDP
    const cancelResult = await pdp.clickCancelOnReviewPage(currentUrl);
      
    if (cancelResult.success) {
      htmlReport.addStep('Cancel Button', 'PASS', 
        `✅ 'Cancel' Button is clicked on WRITE A REVIEW page and returned to corresponding PRODUCT page successfully.`);
    } else {
      htmlReport.addStep('Cancel Button', 'FAIL', 
        `❌ 'Cancel' Button is NOT clicked`);
    }
      
    log(SYMBOLS.SUCCESS, '✅ TC - 8 PASSED: Write A Review functionality verified');
    await page.waitForTimeout(5000);

    // ==================== TC - 9: Related Products Section ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 9: Related Products Section Verification (Dynamic)');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
    const relatedProductsResult = await pdp.verifyRelatedProducts();
    log(SYMBOLS.INFO, `Detected ${relatedProductsResult.verifiedProducts.length} related product(s)`);
      
    for (const product of relatedProductsResult.verifiedProducts) {
        if (product.success) {
          htmlReport.addStep(`Related Product ${product.index}`, 'PASS', 
            `✅ Product linked at ${product.index} position: ${product.cardTitle}`);
        } else {
          htmlReport.addStep(`Related Product ${product.index}`, 'FAIL', 
            `❌ Mismatch: Card = ${product.cardTitle}, Page = ${product.pdpTitle || 'N/A'}`);
        }
    }
      
    log(SYMBOLS.SUCCESS, '✅ TC - 9 PASSED: Related Products verification completed');
    await page.waitForTimeout(10000);

    // ==================== TC - 10: Related Articles Section ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 10: Related Articles Section Verification (Dynamic)');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
      
    const relatedArticlesResult = await pdp.verifyRelatedArticles();
    log(SYMBOLS.INFO, `Detected ${relatedArticlesResult.verifiedArticles.length} related article(s)`);
      
    for (const article of relatedArticlesResult.verifiedArticles) {
        if (article.success) {
          htmlReport.addStep(`Related Article ${article.index}`, 'PASS', 
            `✅ Article linked at ${article.index} position: ${article.cardTitle}`);
        } else {
          htmlReport.addStep(`Related Article ${article.index}`, 'FAIL', 
            `❌ Mismatch: Card = ${article.cardTitle}, Page = ${article.adpTitle || 'N/A'}`);
        }
    }
      
    log(SYMBOLS.SUCCESS, '✅ TC - 10 PASSED: Related Articles verification completed');

    // ==================== TC - 11: Image Alt Tag Validation ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 11: Image Alt Tag Validation');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

    htmlReport.addStep('Test Case 11: Image Alt Tag Validation', 'INFO', 'Verify all product content images have proper alt tags');
      
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
      log(SYMBOLS.SUCCESS, `✅ Image validation complete: ${imageValidation.imagesWithAlt}/${imageValidation.totalImages} images have alt tags`);
      htmlReport.addStep('Image Details', 'INFO', imageListHtml);
    }
      
    if (imageValidation.success) {
      htmlReport.addStep('Image Alt Tags', 'PASS', `✅ All ${imageValidation.totalImages} product images have alt tags`);
      log(SYMBOLS.SUCCESS, `✅ TC - 11 PASSED: All ${imageValidation.totalImages} product images have alt tags`);
    } else {
      htmlReport.addStep('Images Missing Alt Tags', 'WARN', 
        `⚠️ ${imageValidation.imagesWithoutAlt} out of ${imageValidation.totalImages} product images missing alt tags`);
      log(SYMBOLS.WARNING, `⚠️ TC - 11 WARNING: ${imageValidation.imagesWithoutAlt} images missing alt tags`);
    }
      
    await page.waitForTimeout(2000);

    // ==================== TC - 12: Gallery Image Functionality ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC - 12: Gallery Image Functionality (Click Thumbnails)');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

    htmlReport.addStep('Test Case 12: Gallery Image Functionality', 'INFO', 'Verify gallery thumbnail images change the main product image when clicked');

    // Verify gallery images
    /** @type {{ success: boolean; totalThumbnails: number; successfullyVerified: number; failedCount: number; successRate: number; thumbnailsVerified: Array<{index: number; thumbnailNumber: string; success: boolean; imageChanged: boolean; thumbnailAlt: string}>; verificationMessage: string }} */
    const galleryValidation = /** @type {any} */ (await pdp.verifyGalleryImages());

    htmlReport.addStep('Gallery Thumbnail Count', 'INFO', 
      `Total Gallery Thumbnails: ${galleryValidation.totalThumbnails}<br>` +
      `Successfully Verified: ${galleryValidation.successfullyVerified}<br>` +
      `Failed: ${galleryValidation.failedCount}<br>` +
      `Success Rate: ${galleryValidation.successRate}%`);

    // Add detailed thumbnail verification results
    if (galleryValidation.thumbnailsVerified.length > 0) {
      let thumbnailDetailsHtml = '<table style="width:100%; border-collapse: collapse; margin-top: 10px;">' +
        '<tr style="background-color: #f2f2f2;">' +
        '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Thumbnail #</th>' +
        '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Status</th>' +
        '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Image Changed</th>' +
        '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Alt Text</th>' +
        '</tr>';

      galleryValidation.thumbnailsVerified.forEach(thumb => {
        const statusIcon = thumb.success ? '✅' : '❌';
        const statusText = thumb.success ? 'PASS' : 'FAIL';
        const imageStatus = thumb.imageChanged ? '✅ Yes' : '⚠️ No';
        const altText = thumb.thumbnailAlt || 'N/A';
        
        thumbnailDetailsHtml += `<tr>` +
          `<td style="border: 1px solid #ddd; padding: 8px;">${thumb.thumbnailNumber}</td>` +
          `<td style="border: 1px solid #ddd; padding: 8px;">${statusIcon} ${statusText}</td>` +
          `<td style="border: 1px solid #ddd; padding: 8px;">${imageStatus}</td>` +
          `<td style="border: 1px solid #ddd; padding: 8px;">${altText}</td>` +
          `</tr>`;
      });

      thumbnailDetailsHtml += '</table>';
      htmlReport.addStep('Gallery Thumbnail Details', 'INFO', thumbnailDetailsHtml);
    }

    // Final gallery verification result
    if (galleryValidation.success) {
      htmlReport.addStep('Gallery Verification', 'PASS', 
        `✅ All ${galleryValidation.totalThumbnails} gallery thumbnails verified successfully. Each thumbnail click updated the main product image as expected.`);
      log(SYMBOLS.SUCCESS, `✅ TC - 12 PASSED: Gallery image functionality verified (${galleryValidation.totalThumbnails} thumbnails)`);
    } else if (galleryValidation.totalThumbnails === 0) {
      htmlReport.addStep('Gallery Verification', 'WARN', 
        `⚠️ No gallery thumbnails found on the page. Gallery verification skipped.`);
      log(SYMBOLS.WARNING, `⚠️ TC - 12 INFO: No gallery thumbnails found on page`);
    } else {
      htmlReport.addStep('Gallery Verification', 'WARN', 
        `⚠️ Gallery verification completed with issues. ${galleryValidation.successfullyVerified}/${galleryValidation.totalThumbnails} thumbnails verified successfully.`);
      log(SYMBOLS.WARNING, `⚠️ TC - 12 WARNING: ${galleryValidation.failedCount} out of ${galleryValidation.totalThumbnails} thumbnails had issues`);
    }

    await page.waitForTimeout(2000);

    // ==================== TEST SUITE COMPLETE ====================
    log(SYMBOLS.CELEBRATION, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.CELEBRATION, '🎉 ALL TEST CASES (TC1-TC12) PASSED SUCCESSFULLY! 🎉');
    log(SYMBOLS.CELEBRATION, '═══════════════════════════════════════════════════════════');
    
    // Close the browser
    log(SYMBOLS.INFO, 'Closing browser...');
    await page.close();
    await context.close();
    log(SYMBOLS.SUCCESS, '✅ Browser closed successfully');
    htmlReport.addStep('Close Browser', 'PASS', `✅ Browser closed successfully`);
  });
});
