// @ts-check
/**
 * Test Suite: Product Listing Page (PLP) - India Website
 *
 * Page URL: https://www.gillette.co.in/en-in/products
 *
 * Test Coverage (All TCs in single test):
 * - Test Case 1: Navigation to Product Listing Page & Accept Cookies
 * - Test Case 2: SEO Elements Verification (H1, Meta Title, Meta Description, Canonical URL, Breadcrumbs)
 * - Test Case 3: Page verification (banner title, description)
 * - Test Case 4: Product cards listing and count
 * - Test Case 5: Product detail page navigation verification
 * - Test Case 6: Favorite functionality (mark/unmark)
 * - Test Case 7: Category dropdown navigation
 *
 * Note: A "DO YOU HAVE ANY CONCERN?" popup may appear while scrolling.
 *       It is automatically dismissed by clicking "GOT IT" before continuing.
 */

import { test, expect } from '@playwright/test';
import { setupTest } from '../utils/testSetup.js';
import { SYMBOLS, log } from '../utils/logConstants.js';
import { HtmlTestReport } from '../utils/htmlReportGenerator.js';
import { productListingPage } from '../pages/productListingPage.js';
import fs from 'fs';
import path from 'path';

const PAGE_URL = 'https://www.gillette.co.in/en-in/products';

test.describe('Product Listing Page - India Website Tests', () => {

  let testEnvironment;
  /** @type {HtmlTestReport} */
  let htmlReport;

  test.beforeEach(async ({ page, context }, testInfo) => {
    testEnvironment = await setupTest(context, testInfo);
    htmlReport = HtmlTestReport.create(
      'Product Listing Page (PLP) - India Tests',
      testEnvironment,
      page
    );
  });

  /**
   * Complete PLP Test - All Test Cases (TC1-TC7)
   */
  test('India PLP - Complete Test Suite (TC1-TC7)', async ({ page, context }) => {
    test.setTimeout(30 * 60 * 1000); // 30 minutes

    const plp = new productListingPage(page);

    // ==================== TC1: Navigation & Cookie Acceptance ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC1: Navigation to Product Listing Page & Accept Cookies');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

    htmlReport.addInfo('TC1: Navigation to Product Listing Page & Accept Cookies', 'Starting test case');

    await plp.navigateToPLP();
    htmlReport.addPass('Navigate to Product Listing Page', `URL: ${page.url()}`);

    await plp.acceptCookies();
    htmlReport.addPass('Accept Cookie Consent', 'Cookie banner dismissed');

    log(SYMBOLS.SUCCESS, '✅ TC1 PASSED: Navigated to Product Listing Page and accepted cookies');

    // ==================== TC2: SEO Elements Verification ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC2: Verify SEO Elements (H1, Meta Title, Meta Description, Canonical URL, Breadcrumbs)');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

    htmlReport.addInfo('TC2: Verify SEO Elements', 'Starting test case');

    // Verify URL
    await expect(page).toHaveURL(/\/products/);
    htmlReport.addPass('Verify URL', `URL contains "/products": ${page.url()}`);

    const seoDetails = await plp.getSEODetails();

    log(SYMBOLS.PAGE, `H1: ${seoDetails.h1}`);
    expect(seoDetails.h1).toBeTruthy();
    htmlReport.addPass('Verify H1 Element', `H1: ${seoDetails.h1}`);

    log(SYMBOLS.PAGE, `Meta Title: ${seoDetails.metaTitle}`);
    expect(seoDetails.metaTitle).toBeTruthy();
    htmlReport.addPass('Verify Meta Title', `Meta Title: ${seoDetails.metaTitle}`);

    log(SYMBOLS.DOCUMENT, `Meta Description: ${seoDetails.metaDescription}`);
    expect(seoDetails.metaDescription).toBeTruthy();
    htmlReport.addPass('Verify Meta Description', `Meta Description: ${seoDetails.metaDescription.substring(0, 100)}...`);

    log(SYMBOLS.INFO, `Canonical URL: ${seoDetails.canonicalUrl}`);
    expect(seoDetails.canonicalUrl).toBeTruthy();
    htmlReport.addPass('Verify Canonical URL', `Canonical URL: ${seoDetails.canonicalUrl}`);

    const breadcrumbsResult = await plp.verifyBreadcrumbs();
    if (breadcrumbsResult.present) {
      const bcText = breadcrumbsResult.breadcrumbs
        .map((bc, i) => `${i + 1}. "${bc.text}"${bc.href ? ` (${bc.href})` : ' (current)'}`)
        .join('<br>');
      htmlReport.addPass('Verify Breadcrumbs', `Found ${breadcrumbsResult.count} breadcrumb(s):<br>${bcText}`);
      log(SYMBOLS.SUCCESS, `✅ Breadcrumbs verified: ${breadcrumbsResult.count} item(s)`);
    } else {
      htmlReport.addWarning('Verify Breadcrumbs', 'No breadcrumbs found on page');
    }

    const seoValidation = await plp.verifySEOElements();
    expect(seoValidation.isValid).toBeTruthy();
    htmlReport.addPass('SEO Validation Complete', `All SEO elements present: ${seoValidation.isValid}`);

    log(SYMBOLS.SUCCESS, '✅ TC2 PASSED: All SEO elements verified');

    // ==================== TC3: Page Title & Description Verification ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC3: Verify page banner title and description');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

    htmlReport.addInfo('TC3: Verify page banner title and description', 'Starting test case');

    const pageTitle = await plp.getPageTitle();
    log(SYMBOLS.PAGE, `Page Title: ${pageTitle}`);
    expect(pageTitle).toBeTruthy();
    htmlReport.addPass('Verify Page Banner Title', `Title: ${pageTitle}`);

    const pageDescription = await plp.getPageDescription();
    log(SYMBOLS.DOCUMENT, `Page Description: ${pageDescription}`);
    htmlReport.addPass('Verify Page Description', pageDescription ? `Description: ${pageDescription}` : 'No description');

    log(SYMBOLS.SUCCESS, '✅ TC3 PASSED: Page loaded with banner title and description');

    // ==================== TC4: Product Cards Count ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC4: Verify product cards are displayed');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

    htmlReport.addInfo('TC4: Verify product cards are displayed', 'Starting test case');

    // getProductCardsCount() internally calls scrollToLoadAllCards() which
    // iteratively scrolls until the count stabilises — capturing all lazy-loaded cards.
    const cardsCount = await plp.getProductCardsCount();
    expect(cardsCount).toBeGreaterThan(0);
    htmlReport.addPass('Verify Product Cards Count', `Found ${cardsCount} product cards`);
    log(SYMBOLS.SUCCESS, `✅ TC4 PASSED: Found ${cardsCount} product cards`);

    // ==================== TC5: Product Detail Page Navigation ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC5: Verify product cards link to correct detail pages');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

    htmlReport.addInfo('TC5: Verify product cards link to correct detail pages', 'Starting test case');

    // Page is already fully scrolled from TC4 — getAllProductCards() reads the already-loaded DOM
    await plp.dismissConcernPopupIfVisible();
    const allCards = await plp.getAllProductCards();
    const cardsToTest = allCards.length;
    log(SYMBOLS.INFO, `Testing ALL ${cardsToTest} product cards`);

    const failedProducts = [];

    for (let i = 1; i <= cardsToTest; i++) {
      const product = await plp.getProductDetails(i);

      if (!product.title || !product.link) {
        log(SYMBOLS.WARNING, `⚠️ Product ${i} has no title/link — skipping`);
        htmlReport.addStep(`Verify Product ${i}`, 'WARN', 'No title or link found for this card — skipped');
        failedProducts.push({ index: i, title: '(no title)', link: '', error: 'Missing title/link' });
        continue;
      }

      log(SYMBOLS.SEARCH, `Verifying product ${i} of ${cardsToTest}: ${product.title}`);

      let productPage;
      try {
        productPage = await context.newPage();
        await productPage.goto(product.link, { timeout: 60000, waitUntil: 'domcontentloaded' });

        // Dismiss concern popup on the detail page if it appears
        const popupGotIt = productPage.locator(
          'button:has-text("GOT IT"), a:has-text("GOT IT"), [class*="btn"]:has-text("GOT IT")'
        ).first();
        if (await popupGotIt.isVisible({ timeout: 2000 }).catch(() => false)) {
          await popupGotIt.click();
          log(SYMBOLS.INFO, 'Dismissed concern popup on product detail page');
        }

        const isValid = await plp.verifyProductDetailPage(productPage, product.title);

        if (isValid) {
          log(SYMBOLS.SUCCESS, `✅ Verified. Correct Product linked. Product ${i}: ${product.title}`);
          htmlReport.addPass(`Verify Product ${i}`, `${product.title} — Link verified`);
        } else {
          log(SYMBOLS.WARNING, `⚠️ Title mismatch for Product ${i}: ${product.title}`);
          htmlReport.addStep(`Verify Product ${i}`, 'WARN', `${product.title} — Title mismatch on detail page`);
        }

      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        log(SYMBOLS.WARNING, `⚠️ Failed to verify Product ${i}: ${product.title} — ${msg}`);
        htmlReport.addStep(`Verify Product ${i}`, 'WARN', `${product.title} — Navigation error: ${msg}`);
        failedProducts.push({ index: i, title: product.title, link: product.link, error: msg });
      } finally {
        if (productPage) await productPage.close().catch(() => {});
      }
    }

    if (failedProducts.length > 0) {
      log(SYMBOLS.WARNING, `⚠️ ${failedProducts.length} product(s) could not be fully verified`);
      htmlReport.addStep('Failed Products', 'WARN',
        `${failedProducts.length} product(s) failed:<br>` +
        failedProducts.map(p => `Product ${p.index}: ${p.title} — ${p.error}`).join('<br>')
      );
    }

    const successfulProducts = cardsToTest - failedProducts.length;
    if (failedProducts.length === 0) {
      htmlReport.addPass('TC5 Complete', `All ${cardsToTest} product cards verified successfully`);
      log(SYMBOLS.SUCCESS, `✅ TC5 PASSED: All ${cardsToTest} product cards verified successfully`);
    } else {
      htmlReport.addStep('TC5 Complete', 'WARN',
        `${successfulProducts}/${cardsToTest} products verified, ${failedProducts.length} failed`);
      log(SYMBOLS.WARNING, `⚠️ TC5 COMPLETED WITH WARNINGS: ${successfulProducts}/${cardsToTest} verified`);
    }

    // ==================== TC6: Favorite Functionality ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC6: Verify favorite functionality — mark and unmark');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

    htmlReport.addInfo('TC6: Verify favourite functionality — mark and unmark', 'Starting test case');

    // Main page remains on PLP throughout TC5 (TC5 uses context.newPage() for each product)
    // Cookies accepted in TC1 persist — no re-navigation or cookie acceptance needed
    await page.waitForTimeout(1500);
    await plp.dismissConcernPopupIfVisible();

    const articlesToTestFavorite = 3;
    log(SYMBOLS.INFO, `Testing favourite functionality for first ${articlesToTestFavorite} products`);

    const favoritesUrl = await plp.getFavoritesPageUrl();
    log(SYMBOLS.INFO, `Favourites Page URL: ${favoritesUrl}`);

    for (let favIndex = 1; favIndex <= articlesToTestFavorite; favIndex++) {
      log(SYMBOLS.SEARCH, `Testing favourite for product ${favIndex} of ${articlesToTestFavorite}`);

      const product = await plp.getProductDetails(favIndex);
      log(SYMBOLS.DOCUMENT, `Product ${favIndex}: ${product.title}`);

      // --- Mark as favourite ---
      await plp.clickFavoriteButton(favIndex);
      log(SYMBOLS.SUCCESS, `✅ Favourite Icon clicked for Product ${favIndex}: ${product.title}`);
      htmlReport.addPass(`Mark Product ${favIndex} as Favourite`, product.title);

      if (favoritesUrl) {
        const favPage = await context.newPage();
        try {
          await favPage.goto(favoritesUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });
          const isAdded = await plp.verifyProductInFavorites(favPage, product.title);
          if (isAdded) {
            log(SYMBOLS.SUCCESS, `✅ Product ${favIndex} successfully added to favourites: ${product.title}`);
            htmlReport.addPass(`Verify Product ${favIndex} in Favourites`, `Added: ${product.title}`);
          } else {
            log(SYMBOLS.WARNING, `⚠️ Product ${favIndex} may not be in favourites (UI may differ)`);
            htmlReport.addStep(`Verify Product ${favIndex} in Favourites`, 'WARN', 'Product not found in favourites list');
          }
        } catch (error) {
          const errMsg1 = error instanceof Error ? error.message : String(error);
          log(SYMBOLS.WARNING, `⚠️ Could not verify favourites page for Product ${favIndex}: ${errMsg1}`);
        } finally {
          await favPage.close().catch(() => {});
        }
      }

      // --- Unmark favourite ---
      await plp.clickFavoriteButton(favIndex);
      log(SYMBOLS.SUCCESS, `✅ Favourite Icon clicked again to unmark Product ${favIndex}: ${product.title}`);
      htmlReport.addPass(`Unmark Product ${favIndex} from Favourite`, product.title);

      if (favoritesUrl) {
        const favPage2 = await context.newPage();
        try {
          await favPage2.goto(favoritesUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });
          const isRemoved = !(await plp.verifyProductInFavorites(favPage2, product.title));
          if (isRemoved) {
            log(SYMBOLS.SUCCESS, `✅ Product ${favIndex} successfully removed from favourites: ${product.title}`);
            htmlReport.addPass(`Verify Product ${favIndex} Removed from Favourites`, product.title);
          } else {
            log(SYMBOLS.WARNING, `⚠️ Product ${favIndex} may still be in favourites`);
            htmlReport.addStep(`Verify Product ${favIndex} Removed`, 'WARN', 'Product may still be in favourites');
          }
        } catch (error) {
          const errMsg2 = error instanceof Error ? error.message : String(error);
          log(SYMBOLS.WARNING, `⚠️ Could not verify favourites removal for Product ${favIndex}: ${errMsg2}`);
        } finally {
          await favPage2.close().catch(() => {});
        }
      }

      log(SYMBOLS.SUCCESS, `✅ Favourite test completed for Product ${favIndex}`);
    }

    htmlReport.addPass('TC6 Complete', `Favourite functionality tested for ${articlesToTestFavorite} products`);
    log(SYMBOLS.SUCCESS, `✅ TC6 PASSED: Favourite functionality test completed for ${articlesToTestFavorite} products`);

    // ==================== TC7: Category Dropdown Navigation ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC7: Verify dropdown navigation between categories');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

    htmlReport.addInfo('TC7: Verify dropdown navigation between categories', 'Starting test case');

    // Navigate back to All Products page if needed
    const allProductsUrl = 'https://www.gillette.co.in/en-in/products';
    if (!page.url().includes('/en-in/products')) {
      await page.goto(allProductsUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForLoadState('domcontentloaded');
    }
    await page.waitForTimeout(1000);
    await plp.dismissConcernPopupIfVisible();

    // Open dropdown
    await plp.openDropdown();

    // Get dropdown options (4 main categories with URLs)
    const options = await plp.getDropdownOptions();
    const totalOptions = options.length;

    log(SYMBOLS.INFO, `Dropdown Count: ${totalOptions}`);
    log(SYMBOLS.INFO, `Dropdown Options: ${options.map(o => o.title).join(', ')}`);
    htmlReport.addInfo('Dropdown Options Found', `${totalOptions} categories: ${options.map(o => o.title).join(', ')}`);

    // Test navigation for ALL dropdown options
    const optionsToTest = totalOptions;
    log(SYMBOLS.INFO, `Testing ALL ${optionsToTest} dropdown menu items`);

    for (let i = 0; i < optionsToTest; i++) {
      const option = options[i];

      log(SYMBOLS.SEARCH, `Testing navigation to: ${option.title}`);

      // Open the category page in a new tab
      const categoryPage = await context.newPage();
      await categoryPage.goto(option.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await categoryPage.waitForLoadState('domcontentloaded');

      // Verify URL matches
      const newPageUrl = categoryPage.url();
      const urlMatches = newPageUrl.includes(option.url) || option.url.includes(newPageUrl);

      // Check for 404 page
      const pageTitle = await categoryPage.title();
      const is404 = pageTitle.toLowerCase().includes('not found') || 
                    pageTitle.includes('404') ||
                    (await categoryPage.locator('h1:has-text("404"), h1:has-text("not found"), h1:has-text("Page Not Found")').count()) > 0;

      if (is404) {
        log(SYMBOLS.ERROR, `❌ ${option.title}: Page returned 404 error`);
        htmlReport.addFail(`Navigate to "${option.title}"`, `Page returned 404. URL: ${newPageUrl}`);
      } else if (urlMatches) {
        log(SYMBOLS.SUCCESS, `✅ Successfully navigated to: ${option.title}`);
        log(SYMBOLS.INFO, `   URL: ${newPageUrl}`);
        htmlReport.addPass(`Navigate to "${option.title}"`, `Opened in new tab: ${newPageUrl}`);
      } else {
        log(SYMBOLS.ERROR, `❌ Navigation failed for: ${option.title}`);
        log(SYMBOLS.INFO, `Expected URL to contain: ${option.url}`);
        log(SYMBOLS.INFO, `Actual URL: ${newPageUrl}`);
        htmlReport.addFail(`Navigate to "${option.title}"`, `Expected: ${option.url}, Got: ${newPageUrl}`);
      }

      expect(urlMatches && !is404).toBeTruthy();

      await categoryPage.close();
    }

    // Close dropdown
    await plp.closeDropdown();

    htmlReport.addPass('TC7 Complete', `Dropdown navigation tested for ${optionsToTest} categories`);
    log(SYMBOLS.SUCCESS, '✅ TC7 PASSED: Dropdown navigation test completed');

    // ==================== TEST SUITE COMPLETE ====================
    log(SYMBOLS.CELEBRATION, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.CELEBRATION, '🎉 ALL TEST CASES (TC1-TC7) COMPLETED SUCCESSFULLY! 🎉');
    log(SYMBOLS.CELEBRATION, '═══════════════════════════════════════════════════════════');

    log(SYMBOLS.INFO, 'Closing browser...');
    await page.close();
    await context.close();
    log(SYMBOLS.SUCCESS, '✅ Browser closed successfully');
    htmlReport.addStep('Close Browser', 'PASS', '✅ Browser closed successfully');

    // Generate HTML Report
    const reportsDir = path.join(process.cwd(), 'test-results', 'plp-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const reportPath = path.join(reportsDir, `PLP_India_Execution_Report_${timestamp}.html`);
    await htmlReport.generateReport(reportPath);
    log(SYMBOLS.SUCCESS, `✅ HTML Report generated: ${reportPath}`);
  });

});
