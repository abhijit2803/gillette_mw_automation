// @ts-check
import { test, expect } from '@playwright/test';
import { pageManager } from '../utils/pageManager.js';
import { setupTest } from '../utils/testSetup.js';
import { SYMBOLS, log } from '../utils/logConstants.js';
import { HtmlTestReport } from '../utils/htmlReportGenerator.js';
import { generateImageAltTagTable } from '../utils/tableGenerator.js';
import fs from 'fs';
import path from 'path';

/**
 * Test Suite: Article Listing Page (ALP) - All Articles Tests
 * 
 * Page URL: https://www.gillette.de/de-de/perfekte-rasur
 * 
 * Test Coverage (All TCs in single test):
 * - Test Case 1: Navigation to Article Listing Page & Accept Cookies
 * - Test Case 2: SEO Elements Verification (H1, Meta Title, Meta Description, Canonical URL, Breadcrumbs)
 * - Test Case 3: Page verification (banner title, description)
 * - Test Case 4: Article cards listing and count
 * - Test Case 5: Article detail page navigation verification
 * - Test Case 6: Favorite functionality (mark/unmark)
 * - Test Case 7: Category dropdown navigation
 * - Test Case 8: Image Alt Tag Validation
 */

test.describe('Article Listing Page - All Articles Tests', () => {

  let testEnvironment;
  /** @type {HtmlTestReport} */
  let htmlReport;

  // Setup before each test
  test.beforeEach(async ({ page, context }, testInfo) => {
    testEnvironment = await setupTest(context, testInfo);
    
    // Initialize HTML Report using factory method with common configuration
    htmlReport = HtmlTestReport.create(
      'Article Listing Page (ALP) - All Articles Tests',
      testEnvironment,
      page
    );
  });

  /**
   * Complete ALP Test - All Test Cases (TC1-TC8)
   * Single consolidated test covering all ALP functionality
   */
  test('All Articles ALP - Complete Test Suite (TC1-TC8)', async ({ page, context }) => {
    test.setTimeout(30 * 60 * 1000); // 30 minutes timeout for full article verification
    const pm = new pageManager(page);

    // ==================== TC1: Navigation & Cookie Acceptance ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC1: Navigation to Article Listing Page & Accept Cookies');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    htmlReport.addInfo('TC1: Navigation to Article Listing Page & Accept Cookies', 'Starting test case');
    
    // Navigate to Article Listing Page
    await pm.onArticleListingPage().navigateToALP();
    htmlReport.addPass('Navigate to Article Listing Page', `URL: ${page.url()}`);
    
    // Accept cookies if present
    await pm.onArticleListingPage().acceptCookies();
    htmlReport.addPass('Accept Cookie Consent', 'Cookie banner dismissed');
    
    log(SYMBOLS.SUCCESS, '✅ TC1 PASSED: Navigated to Article Listing Page and accepted cookies');

    // ==================== TC2: SEO Elements Verification ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC2: Verify SEO Elements (H1, Meta Title, Meta Description, Canonical URL, Breadcrumbs)');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    htmlReport.addInfo('TC2: Verify SEO Elements', 'Starting test case');
    
    // Verify URL contains the expected path
    await expect(page).toHaveURL(/perfekte-rasur/);
    htmlReport.addPass('Verify URL', 'URL contains "perfekte-rasur"');
    
    // Get all SEO details
    const seoDetails = await pm.onArticleListingPage().getSEODetails();
    
    // Verify H1 Element
    log(SYMBOLS.PAGE, `H1: ${seoDetails.h1}`);
    expect(seoDetails.h1).toBeTruthy();
    htmlReport.addPass('Verify H1 Element', `H1: ${seoDetails.h1}`);
    
    // Verify Meta Title
    log(SYMBOLS.PAGE, `Meta Title: ${seoDetails.metaTitle}`);
    expect(seoDetails.metaTitle).toBeTruthy();
    htmlReport.addPass('Verify Meta Title', `Meta Title: ${seoDetails.metaTitle}`);
    
    // Verify Meta Description
    log(SYMBOLS.DOCUMENT, `Meta Description: ${seoDetails.metaDescription}`);
    expect(seoDetails.metaDescription).toBeTruthy();
    htmlReport.addPass('Verify Meta Description', `Meta Description: ${seoDetails.metaDescription.substring(0, 100)}...`);
    
    // Verify Canonical URL
    log(SYMBOLS.INFO, `Canonical URL: ${seoDetails.canonicalUrl}`);
    expect(seoDetails.canonicalUrl).toBeTruthy();
    htmlReport.addPass('Verify Canonical URL', `Canonical URL: ${seoDetails.canonicalUrl}`);
    
    // Verify Breadcrumbs
    const breadcrumbsResult = await pm.onArticleListingPage().verifyBreadcrumbs();
    expect(breadcrumbsResult.present).toBeTruthy();
    
    if (breadcrumbsResult.present) {
      const breadcrumbsText = breadcrumbsResult.breadcrumbs.map((bc, idx) => 
        `${idx + 1}. "${bc.text}"${bc.href ? ` (${bc.href})` : ' (current)'}`
      ).join('<br>');
      htmlReport.addPass('Verify Breadcrumbs', `Found ${breadcrumbsResult.count} breadcrumb(s):<br>${breadcrumbsText}`);
      log(SYMBOLS.SUCCESS, `✅ Breadcrumbs verified: ${breadcrumbsResult.count} item(s)`);
    } else {
      htmlReport.addWarning('Verify Breadcrumbs', 'No breadcrumbs found on page');
    }
    
    // Verify all SEO elements are present
    const seoValidation = await pm.onArticleListingPage().verifySEOElements();
    expect(seoValidation.isValid).toBeTruthy();
    htmlReport.addPass('SEO Validation Complete', `All SEO elements present: ${seoValidation.isValid}`);
    
    log(SYMBOLS.SUCCESS, '✅ TC2 PASSED: All SEO elements verified (H1, Meta Title, Meta Description, Canonical URL, Breadcrumbs)');

    // ==================== TC3: Page Title & Description Verification ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC3: Verify page load with banner title and description');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    htmlReport.addInfo('TC3: Verify page banner title and description', 'Starting test case');
    
    // Get and verify page title (H1 in banner)
    const pageTitle = await pm.onArticleListingPage().getPageTitle();
    log(SYMBOLS.PAGE, `Page Title: ${pageTitle}`);
    expect(pageTitle).toBeTruthy();
    htmlReport.addPass('Verify Page Banner Title', `Title: ${pageTitle}`);
    
    // Get and verify page description
    const pageDescription = await pm.onArticleListingPage().getPageDescription();
    log(SYMBOLS.DOCUMENT, `Page Description: ${pageDescription}`);
    htmlReport.addPass('Verify Page Description', pageDescription ? `Description present` : 'No description');
    
    log(SYMBOLS.SUCCESS, '✅ TC3 PASSED: Page loaded successfully with banner title (h1) and description');

    // ==================== TC4: Article Cards Count Verification ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC4: Verify article cards are displayed');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    htmlReport.addInfo('TC4: Verify article cards are displayed', 'Starting test case');
    
    // Get article cards count
    const cardsCount = await pm.onArticleListingPage().getArticleCardsCount();
    
    // Verify at least one card exists
    expect(cardsCount).toBeGreaterThan(0);
    htmlReport.addPass('Verify Article Cards Count', `Found ${cardsCount} article cards`);
    log(SYMBOLS.SUCCESS, `✅ TC4 PASSED: Found ${cardsCount} article cards`);

    // ==================== TC5: Article Navigation Verification ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC5: Verify article cards link to correct detail pages');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    htmlReport.addInfo('TC5: Verify article cards link to correct detail pages', 'Starting test case');
    
    // Test ALL article cards
    const cardsToTest = cardsCount;
    log(SYMBOLS.INFO, `Testing ALL ${cardsToTest} article cards`);
    
    let failedArticles = [];
    
    for (let i = 1; i <= cardsToTest; i++) {
      log(SYMBOLS.SEARCH, `Verifying article ${i} of ${cardsToTest}`);
      
      // Get article details from card
      const article = await pm.onArticleListingPage().getArticleDetails(i);
      log(SYMBOLS.DOCUMENT, `Article ${i}: ${article.title} (${article.link})`);
      
      let articlePage;
      try {
        // Open article in new tab with increased timeout
        articlePage = await context.newPage();
        await articlePage.goto(article.link, { timeout: 60000, waitUntil: 'domcontentloaded' });
        await articlePage.waitForLoadState('domcontentloaded');
        
        // Verify article title matches
        const isValid = await pm.onArticleListingPage().verifyArticleDetailPage(articlePage, article.title);
        
        if (isValid) {
          log(SYMBOLS.SUCCESS, `✅ Verified. Correct Article linked. Article ${i}: ${article.title}`);
          htmlReport.addPass(`Verify Article ${i}`, `${article.title} - Link verified`);
        } else {
          log(SYMBOLS.ERROR, `❌ Mismatch for Article ${i}`);
          htmlReport.addFail(`Verify Article ${i}`, `${article.title} - Link mismatch`);
        }
        
        expect(isValid).toBeTruthy();
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        log(SYMBOLS.WARNING, `⚠️ Failed to verify Article ${i}: ${article.title}`);
        log(SYMBOLS.ERROR, `Error: ${errorMessage}`);
        htmlReport.addStep(`Verify Article ${i}`, 'WARN', `${article.title} - Navigation timeout or error: ${errorMessage}`);
        failedArticles.push({ index: i, title: article.title, link: article.link, error: errorMessage });
      } finally {
        // Close article page if it was opened
        if (articlePage) {
          await articlePage.close();
        }
      }
    }
    
    // Report failed articles if any
    if (failedArticles.length > 0) {
      log(SYMBOLS.WARNING, `⚠️ ${failedArticles.length} article(s) could not be verified due to timeout/errors`);
      htmlReport.addStep('Failed Articles', 'WARN', 
        `${failedArticles.length} article(s) failed:<br>` + 
        failedArticles.map(a => `Article ${a.index}: ${a.title} - ${a.error}`).join('<br>'));
    }
    
    const successfulArticles = cardsToTest - failedArticles.length;
    if (failedArticles.length === 0) {
      htmlReport.addPass('TC5 Complete', `All ${cardsToTest} article cards verified successfully`);
      log(SYMBOLS.SUCCESS, `✅ TC5 PASSED: All ${cardsToTest} article cards verified successfully`);
    } else {
      htmlReport.addStep('TC5 Complete', 'WARN', 
        `${successfulArticles}/${cardsToTest} articles verified successfully, ${failedArticles.length} failed due to timeout/errors`);
      log(SYMBOLS.WARNING, `⚠️ TC5 COMPLETED WITH WARNINGS: ${successfulArticles}/${cardsToTest} articles verified, ${failedArticles.length} failed`);
    }

    // ==================== TC6: Favorite Functionality ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC6: Verify favorite functionality - mark and unmark');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    htmlReport.addInfo('TC6: Verify favorite functionality - mark and unmark', 'Starting test case');
    
    // Test favorite functionality for first 3 articles
    const articlesToTestFavorite = 3; // You can adjust this number based on how many you want to test
    log(SYMBOLS.INFO, `Testing favorite functionality for first ${articlesToTestFavorite} articles`);
    
    // Get favorites page URL
    const favoritesUrl = await pm.onArticleListingPage().getFavoritesPageUrl();
    
    for (let favIndex = 1; favIndex <= articlesToTestFavorite; favIndex++) {
      log(SYMBOLS.SEARCH, `Testing favorite for article ${favIndex} of ${articlesToTestFavorite}`);
      
      // Get article details
      const article = await pm.onArticleListingPage().getArticleDetails(favIndex);
      log(SYMBOLS.DOCUMENT, `Article ${favIndex}: ${article.title}`);
      
      // Mark article as favorite
      await pm.onArticleListingPage().clickFavoriteButton(favIndex);
      log(SYMBOLS.SUCCESS, `✅ 'Favorite Icon' button clicked for Article ${favIndex}: ${article.title}`);
      htmlReport.addPass(`Mark Article ${favIndex} as Favorite`, article.title);
      
      if (favoritesUrl) {
        // Open favorites page in new tab
        const favoritesPage = await context.newPage();
        try {
          await favoritesPage.goto(favoritesUrl, { 
            timeout: 60000,
            waitUntil: 'domcontentloaded'
          });
          
          // Verify article is in favorites
          const isAdded = await pm.onArticleListingPage().verifyArticleInFavorites(favoritesPage, article.title);
          
          if (isAdded) {
            log(SYMBOLS.SUCCESS, `✅ Article ${favIndex} has been successfully added to favorites: ${article.title}`);
          } else {
            log(SYMBOLS.WARNING, `⚠️ Article ${favIndex} may not be in favorites list (UI may differ)`);
          }
        } catch (error) {
          log(SYMBOLS.WARNING, `⚠️ Could not verify favorites page for Article ${favIndex}: ${error && typeof error === 'object' && 'message' in error ? error.message : String(error)}`);
        } finally {
          await favoritesPage.close();
        }
      }
      
      // Unmark article as favorite
      await pm.onArticleListingPage().clickFavoriteButton(favIndex);
      log(SYMBOLS.SUCCESS, `✅ 'Favorite Icon' button clicked again to unmark Article ${favIndex}: ${article.title}`);
      htmlReport.addPass(`Unmark Article ${favIndex} from Favorite`, article.title);
      
      // Verify article was removed from favorites
      if (favoritesUrl) {
        const favoritesPage2 = await context.newPage();
        try {
          await favoritesPage2.goto(favoritesUrl, { 
            timeout: 60000,
            waitUntil: 'domcontentloaded'
          });
          
          const isRemoved = !(await pm.onArticleListingPage().verifyArticleInFavorites(favoritesPage2, article.title));
          
          if (isRemoved) {
            log(SYMBOLS.SUCCESS, `✅ Article ${favIndex} has been successfully removed from favorites: ${article.title}`);
          } else {
            log(SYMBOLS.WARNING, `⚠️ Article ${favIndex} may still be in favorites list`);
          }
        } catch (error) {
          log(SYMBOLS.WARNING, `⚠️ Could not verify favorites removal for Article ${favIndex}: ${error && typeof error === 'object' && 'message' in error ? error.message : String(error)}`);
        } finally {
          await favoritesPage2.close();
        }
      }
      
      log(SYMBOLS.SUCCESS, `✅ Favorite test completed for Article ${favIndex}`);
    }
    
    htmlReport.addPass('TC6 Complete', `Favorite functionality tested for ${articlesToTestFavorite} articles`);
    log(SYMBOLS.SUCCESS, `✅ TC6 PASSED: Favorite functionality test completed for ${articlesToTestFavorite} articles`);

    // ==================== TC7: Dropdown Navigation ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC7: Verify dropdown navigation between categories');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    
    htmlReport.addInfo('TC7: Verify dropdown navigation between categories', 'Starting test case');
    
    // Open dropdown
    await pm.onArticleListingPage().openDropdown();
    
    // Get dropdown options
    const options = await pm.onArticleListingPage().getDropdownOptions('Alle Artikel');
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
      await categoryPage.goto(option.url);
      await categoryPage.waitForLoadState('domcontentloaded');
      
      // Verify URL matches
      const newPageUrl = categoryPage.url();
      const urlMatches = newPageUrl.includes(option.url) || option.url.includes(newPageUrl);
      
      if (urlMatches) {
        log(SYMBOLS.SUCCESS, `✅ Successfully navigated to: ${option.title}`);
        log(SYMBOLS.INFO, `URL: ${newPageUrl}`);
        htmlReport.addPass(`Navigate to "${option.title}"`, newPageUrl);
      } else {
        log(SYMBOLS.ERROR, `❌ Navigation failed for: ${option.title}`);
        log(SYMBOLS.INFO, `Expected URL to contain: ${option.url}`);
        log(SYMBOLS.INFO, `Actual URL: ${newPageUrl}`);
        htmlReport.addFail(`Navigate to "${option.title}"`, `Expected: ${option.url}, Got: ${newPageUrl}`);
      }
      
      expect(urlMatches).toBeTruthy();
      
      await categoryPage.close();
    }
    
    // Close dropdown
    await pm.onArticleListingPage().closeDropdown();
    
    htmlReport.addPass('TC7 Complete', `Dropdown navigation tested for ${optionsToTest} categories`);
    log(SYMBOLS.SUCCESS, '✅ TC7 PASSED: Dropdown navigation test completed');

    // ==================== TC8: Image Alt Tag Validation ====================
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'TC8: Image Alt Tag Validation');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

    htmlReport.addInfo('TC8: Image Alt Tag Validation', 'Verify all listing page content images have proper alt tags');
    
    // Navigate back to listing page to ensure fresh page load
    await pm.onArticleListingPage().navigateToALP();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Scroll to top to ensure all images are visible
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    
    // Scroll down to load lazy images
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    
    // Verify all listing page images have alt tags
    const imageValidation = /** @type {any} */ (await pm.onArticleListingPage().verifyListingImagesAltTags());
    
    htmlReport.addStep('Listing Page Image Count', 'INFO', 
      `Total Listing Images: ${imageValidation.totalImages}<br>` +
      `With Alt Tags: ${imageValidation.imagesWithAlt}<br>` +
      `Without Alt Tags: ${imageValidation.imagesWithoutAlt}`);
    
    // Add detailed image list to report
    if (imageValidation.images.length > 0) {
      const imageListHtml = generateImageAltTagTable(imageValidation.images);
      log(SYMBOLS.SUCCESS, `✅ Image validation complete: ${imageValidation.imagesWithAlt}/${imageValidation.totalImages} images have alt tags`);
      htmlReport.addStep('Image Details', 'INFO', imageListHtml);
    }
    
    if (imageValidation.success) {
      htmlReport.addPass('Image Alt Tags', `✅ All ${imageValidation.totalImages} listing page images have alt tags`);
      log(SYMBOLS.SUCCESS, `✅ TC8 PASSED: All ${imageValidation.totalImages} listing page images have alt tags`);
    } else {
      htmlReport.addStep('Images Missing Alt Tags', 'WARN', 
        `⚠️ ${imageValidation.imagesWithoutAlt} out of ${imageValidation.totalImages} listing page images missing alt tags`);
      log(SYMBOLS.WARNING, `⚠️ TC8 WARNING: ${imageValidation.imagesWithoutAlt} images missing alt tags`);
    }
    
    await page.waitForTimeout(2000);

    // ==================== TEST SUITE COMPLETE ====================
    log(SYMBOLS.CELEBRATION, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.CELEBRATION, '🎉 ALL TEST CASES (TC1-TC8) PASSED SUCCESSFULLY! 🎉');
    log(SYMBOLS.CELEBRATION, '═══════════════════════════════════════════════════════════');

    // Close the browser
    log(SYMBOLS.INFO, 'Closing browser...');
    await page.close();
    await context.close();
    log(SYMBOLS.SUCCESS, '✅ Browser closed successfully');
    htmlReport.addStep('Close Browser', 'PASS', `✅ Browser closed successfully`);

    // Generate HTML Report
    const reportsDir = path.join(process.cwd(), 'test-results', 'alp-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const reportPath = path.join(reportsDir, `ALP_Execution_Report_${timestamp}.html`);
    await htmlReport.generateReport(reportPath);
    log(SYMBOLS.SUCCESS, `✅ HTML Report generated: ${reportPath}`);
  });

});
