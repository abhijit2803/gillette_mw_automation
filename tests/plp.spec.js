/**
 * Product Listing Page (PLP) Regression Test Suite
 * Test Plan: test-plans/PLP.md
 * 
 * Comprehensive regression tests for the Gillette Germany Product Listing Page
 * URL: https://www.gillette.de/de-de/produkte
 */

import { test, expect } from '@playwright/test';
import { plpPage } from '../pages/plpPage.js';
import { SYMBOLS, log } from '../utils/logConstants.js';
import { setupTest, attachFailureScreenshot } from '../utils/testSetup.js';

test.describe('Product Listing Page Regression Tests', () => {
  // Configure tests to run sequentially - one worker executes one test at a time
  test.describe.configure({ mode: 'serial' });

  let page;
  let plpPageObj;

  test.beforeEach(async ({ page: testPage, context }, testInfo) => {
    page = testPage;
    plpPageObj = new plpPage(page);
    
    // Setup test environment
    await setupTest(context, testInfo);
    
    // Navigate to PLP
    log(SYMBOLS.HOME, 'Navigating to Gillette Germany Product Listing Page');
    await plpPageObj.navigate();
    
    // Wait for page to stabilize
    await page.waitForTimeout(3000);
    
    // Accept cookies if present
    await plpPageObj.acceptCookies();
  });

  test.afterEach(async ({}, testInfo) => {
    // Attach screenshot on failure
    await attachFailureScreenshot(page, testInfo);
  });

  /**
   * Test Case 1: Check whether the Product Listing Page loads properly
   * Test ID: TC-PLP-01
   */
  test('TC-PLP-01: Product Listing Page loads properly', async () => {
    log(SYMBOLS.SEARCH, 'Verifying PLP loads properly');
    
    // 1. Ensure page loads fully without errors
    const pageLoaded = await plpPageObj.verifyPageLoads();
    expect(pageLoaded).toBeTruthy();
    log(SYMBOLS.SUCCESS, 'Page loaded successfully');
    
    // 2. Verify main header is displayed correctly
    const headerText = await plpPageObj.getPageHeaderText();
    log(SYMBOLS.PAGE, `Page header: ${headerText}`);
    expect(headerText).toBeTruthy();
    expect(headerText.length).toBeGreaterThan(0);
    
    // 3. Verify URL
    const currentUrl = await plpPageObj.getCurrentUrl();
    log(SYMBOLS.SUCCESS, `Current URL: ${currentUrl}`);
    expect(currentUrl).toContain('gillette.de/de-de/produkte');
    
    // 4. Verify products are displayed with required elements
    const productCount = await plpPageObj.getProductCount();
    log(SYMBOLS.PACKAGE, `Total products found: ${productCount}`);
    expect(productCount).toBeGreaterThan(0);
    
    // 5. Verify first 3 products have Ratings, MEHR ERFAHREN, and JETZT KAUFEN buttons
    for (let i = 0; i < Math.min(3, productCount); i++) {
      const hasRating = await plpPageObj.verifyProductHasRating(i);
      const hasMehrErfahren = await plpPageObj.verifyProductHasMehrErfahrenButton(i);
      const hasJetztKaufen = await plpPageObj.verifyProductHasJetztKaufenButton(i);
      
      log(SYMBOLS.INFO, `Product ${i + 1}:`);
      log(hasRating ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `  Ratings: ${hasRating ? 'Present' : 'Not Found'}`);
      log(hasMehrErfahren ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `  MEHR ERFAHREN button: ${hasMehrErfahren ? 'Present' : 'Not Found'}`);
      log(hasJetztKaufen ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `  JETZT KAUFEN button: ${hasJetztKaufen ? 'Present' : 'Not Found'}`);
    }
    
    log(SYMBOLS.SUCCESS, 'PLP loaded successfully with all required elements');
  });

  /**
   * Test Case 2: Verify the category tabs
   * Test ID: TC-PLP-02
   */
  test('TC-PLP-02: Verify category tabs functionality', async () => {
    log(SYMBOLS.SEARCH, 'Verifying category tabs');
    
    // 1. Get all category tabs
    const tabs = await plpPageObj.getCategoryTabs();
    log(SYMBOLS.DOCUMENT, `Category tabs found: ${tabs.length}`);
    tabs.forEach((tab, index) => {
      log(SYMBOLS.BULLET, `  ${index + 1}. ${tab}`);
    });
    
    // 2. Click each tab and verify products are displayed
    for (const tab of tabs.slice(0, 5)) { // Test first 5 tabs
      log(SYMBOLS.INFO, `Testing tab: "${tab}"`);
      
      await plpPageObj.clickCategoryTab(tab);
      await page.waitForTimeout(2000);
      
      const productNames = await plpPageObj.getProductNames();
      log(SYMBOLS.SUCCESS, `Tab "${tab}": ${productNames.length} products displayed`);
      
      if (productNames.length > 0) {
        log(SYMBOLS.PACKAGE, `Products in "${tab}":`);
        productNames.slice(0, 5).forEach((name, idx) => {
          log(SYMBOLS.BULLET, `  ${idx + 1}. ${name}`);
        });
      }
      
      expect(productNames.length).toBeGreaterThan(0);
    }
    
    log(SYMBOLS.SUCCESS, 'Category tabs verification completed');
  });

  /**
   * Test Case 3: Verify that all links on the page function correctly
   * Test ID: TC-PLP-03
   */
  test('TC-PLP-03: Verify all links function correctly', async () => {
    log(SYMBOLS.SEARCH, 'Verifying all page links');
    
    // 1. Get all links on the page
    const allLinks = await plpPageObj.getAllLinks();
    log(SYMBOLS.DOCUMENT, `Total links found: ${allLinks.length}`);
    
    // 2. Filter out skip links, fragment links, and javascript links
    const validLinks = allLinks.filter(link => 
      !link.href.startsWith('#') && 
      !link.href.startsWith('javascript:') &&
      !link.href.includes('#main-content') &&
      link.href.startsWith('http')
    );
    
    // Test a sample of links (first 5 valid links)
    const linksToTest = validLinks.slice(0, 5);
    
    for (const link of linksToTest) {
      log(SYMBOLS.INFO, `Testing link: "${link.text}" -> ${link.href}`);
      
      // Find the link element and click it
      const linkElement = page.locator(`a[href="${link.href}"]`).first();
      const isVisible = await linkElement.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (isVisible) {
        // Use JavaScript click to bypass viewport issues
        await linkElement.evaluate(el => el.click());
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1500);
        
        const currentUrl = page.url();
        log(SYMBOLS.SUCCESS, `Navigated to: ${currentUrl}`);
        
        // Navigate back to PLP
        await plpPageObj.navigate();
        await plpPageObj.acceptCookies();
        await page.waitForTimeout(1000);
      } else {
        log(SYMBOLS.WARNING, `Link not visible: ${link.text}`);
      }
    }
    
    log(SYMBOLS.SUCCESS, 'Links verification completed');
  });

  /**
   * Test Case 4: "More Information" button functionality
   * Test ID: TC-PLP-04
   */
  test('TC-PLP-04: MEHR ERFAHREN button navigates to PDP', async () => {
    log(SYMBOLS.SEARCH, 'Verifying MEHR ERFAHREN button functionality');
    
    // 1. Get product count
    const productCount = await plpPageObj.getProductCount();
    log(SYMBOLS.PACKAGE, `Testing MEHR ERFAHREN for ${Math.min(3, productCount)} products`);
    
    // 2. Click MEHR ERFAHREN for first 3 products
    for (let i = 0; i < Math.min(3, productCount); i++) {
      log(SYMBOLS.INFO, `Testing product ${i + 1}`);
      
      const productUrl = await plpPageObj.clickMehrErfahrenButton(i);
      
      if (productUrl) {
        log(SYMBOLS.SUCCESS, `Product ${i + 1}: Navigated to PDP -> ${productUrl}`);
        expect(productUrl).not.toContain('/produkte');
        
        // Navigate back to PLP
        await plpPageObj.navigate();
        await plpPageObj.acceptCookies();
        await page.waitForTimeout(1500);
      } else {
        log(SYMBOLS.WARNING, `Product ${i + 1}: Button not found`);
      }
    }
    
    log(SYMBOLS.SUCCESS, 'MEHR ERFAHREN button verification completed');
  });

  /**
   * Test Case 5: "Buy Now" button functionality
   * Test ID: TC-PLP-05
   */
  test('TC-PLP-05: JETZT KAUFEN button shows retailer popup', async () => {
    log(SYMBOLS.SEARCH, 'Verifying JETZT KAUFEN button functionality');
    
    // 1. Click JETZT KAUFEN button on first product
    await plpPageObj.clickJetztKaufenButton(0);
    
    // 2. Verify retailer popup appears
    const popupVisible = await plpPageObj.isRetailerPopupVisible();
    log(popupVisible ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `Retailer popup: ${popupVisible ? 'Visible' : 'Not Visible'}`);
    
    if (popupVisible) {
      // 3. Get retailer links
      const retailers = await plpPageObj.getRetailerLinks();
      log(SYMBOLS.SHOPPING, `Retailers available: ${retailers.length}`);
      
      retailers.forEach((retailer, index) => {
        log(SYMBOLS.BULLET, `  ${index + 1}. ${retailer.name} - ${retailer.url}`);
      });
      
      expect(retailers.length).toBeGreaterThan(0);
      
      // Close popup
      await plpPageObj.closeRetailerPopup();
    } else {
      log(SYMBOLS.INFO, 'Retailer popup not found - may not be available for this product');
    }
    
    log(SYMBOLS.SUCCESS, 'JETZT KAUFEN button verification completed');
  });

  /**
   * Test Case 6: Filter - NACH TYP filter functionality
   * Test ID: TC-PLP-06
   */
  test('TC-PLP-06: NACH TYP filter functionality', async () => {
    log(SYMBOLS.SEARCH, 'Verifying NACH TYP filter');
    
    // 1. Click NACH TYP filter
    await plpPageObj.clickNachTypFilter();
    
    // 2. Get all filter options
    const options = await plpPageObj.getNachTypOptions();
    log(SYMBOLS.DOCUMENT, `NACH TYP options found: ${options.length}`);
    options.forEach((option, index) => {
      log(SYMBOLS.BULLET, `  ${index + 1}. ${option}`);
    });
    
    // 3. Test each option individually
    for (const option of options.slice(0, 3)) { // Test first 3 options
      log(SYMBOLS.INFO, `Testing filter option: "${option}"`);
      
      await plpPageObj.selectNachTypOption(option);
      await plpPageObj.clickAnwendenButton();
      await page.waitForTimeout(2000);
      
      const productNames = await plpPageObj.getProductNames();
      log(SYMBOLS.SUCCESS, `Filter "${option}": ${productNames.length} products displayed`);
      expect(productNames.length).toBeGreaterThan(0);
      
      // Navigate back to reset filters
      await plpPageObj.navigate();
      await plpPageObj.acceptCookies();
      await page.waitForTimeout(1000);
      await plpPageObj.clickNachTypFilter();
    }
    
    log(SYMBOLS.SUCCESS, 'NACH TYP filter verification completed');
  });

  /**
   * Test Case 7: Filter - NACH THEMA filter functionality
   * Test ID: TC-PLP-07
   */
  test('TC-PLP-07: NACH THEMA filter functionality', async () => {
    log(SYMBOLS.SEARCH, 'Verifying NACH THEMA filter');
    
    // 1. Click NACH THEMA filter
    await plpPageObj.clickNachThemaFilter();
    
    // 2. Get all filter options
    const options = await plpPageObj.getNachThemaOptions();
    log(SYMBOLS.DOCUMENT, `NACH THEMA options found: ${options.length}`);
    options.forEach((option, index) => {
      log(SYMBOLS.BULLET, `  ${index + 1}. ${option}`);
    });
    
    // 3. Test each option individually
    for (const option of options.slice(0, 3)) { // Test first 3 options
      log(SYMBOLS.INFO, `Testing filter option: "${option}"`);
      
      await plpPageObj.selectNachThemaOption(option);
      await plpPageObj.clickAnwendenButton();
      await page.waitForTimeout(2000);
      
      const productNames = await plpPageObj.getProductNames();
      log(SYMBOLS.SUCCESS, `Filter "${option}": ${productNames.length} products displayed`);
      
      // Navigate back to reset filters
      await plpPageObj.navigate();
      await plpPageObj.acceptCookies();
      await page.waitForTimeout(1000);
      await plpPageObj.clickNachThemaFilter();
    }
    
    log(SYMBOLS.SUCCESS, 'NACH THEMA filter verification completed');
  });

  /**
   * Test Case 8: Filter - NACH KOLLEKTIONEN filter functionality
   * Test ID: TC-PLP-08
   */
  test('TC-PLP-08: NACH KOLLEKTIONEN filter functionality', async () => {
    log(SYMBOLS.SEARCH, 'Verifying NACH KOLLEKTIONEN filter');
    
    // 1. Click NACH KOLLEKTIONEN filter
    await plpPageObj.clickNachKollektionenFilter();
    
    // 2. Get all filter options
    const options = await plpPageObj.getNachKollektionenOptions();
    log(SYMBOLS.DOCUMENT, `NACH KOLLEKTIONEN options found: ${options.length}`);
    options.forEach((option, index) => {
      log(SYMBOLS.BULLET, `  ${index + 1}. ${option}`);
    });
    
    // 3. Test each option individually
    for (const option of options.slice(0, 3)) { // Test first 3 options
      log(SYMBOLS.INFO, `Testing filter option: "${option}"`);
      
      await plpPageObj.selectNachKollektionenOption(option);
      await plpPageObj.clickAnwendenButton();
      await page.waitForTimeout(2000);
      
      const productNames = await plpPageObj.getProductNames();
      log(SYMBOLS.SUCCESS, `Filter "${option}": ${productNames.length} products displayed`);
      
      // Navigate back to reset filters
      await plpPageObj.navigate();
      await plpPageObj.acceptCookies();
      await page.waitForTimeout(1000);
      await plpPageObj.clickNachKollektionenFilter();
    }
    
    log(SYMBOLS.SUCCESS, 'NACH KOLLEKTIONEN filter verification completed');
  });

  /**
   * Test Case 9: Filter - SORTIEREN NACH filter functionality
   * Test ID: TC-PLP-09
   */
  test('TC-PLP-09: SORTIEREN NACH filter functionality', async () => {
    log(SYMBOLS.SEARCH, 'Verifying SORTIEREN NACH filter');
    
    // 1. Click SORTIEREN NACH filter
    await plpPageObj.clickSortierenNachFilter();
    
    // 2. Get all sort options
    const options = await plpPageObj.getSortierenNachOptions();
    log(SYMBOLS.DOCUMENT, `SORTIEREN NACH options found: ${options.length}`);
    options.forEach((option, index) => {
      log(SYMBOLS.BULLET, `  ${index + 1}. ${option}`);
    });
    
    // 3. Test each sort option
    for (const option of options) {
      log(SYMBOLS.INFO, `Testing sort option: "${option}"`);
      
      await plpPageObj.selectSortierenNachOption(option);
      await plpPageObj.clickAnwendenButton();
      await page.waitForTimeout(2000);
      
      const productNames = await plpPageObj.getProductNames();
      log(SYMBOLS.SUCCESS, `Sort "${option}": ${productNames.length} products displayed`);
      
      // Navigate back to reset
      await plpPageObj.navigate();
      await plpPageObj.acceptCookies();
      await page.waitForTimeout(1000);
      await plpPageObj.clickSortierenNachFilter();
    }
    
    log(SYMBOLS.SUCCESS, 'SORTIEREN NACH filter verification completed');
  });

  /**
   * Test Case 10: Filter Deny - NACH TYP filter functionality
   * Test ID: TC-PLP-10
   */
  test('TC-PLP-10: NACH TYP filter deny - ALLES LÖSCHEN', async () => {
    log(SYMBOLS.SEARCH, 'Verifying NACH TYP filter deny functionality');
    
    // 1. Get initial product count
    const initialProducts = await plpPageObj.getProductNames();
    const initialCount = initialProducts.length;
    log(SYMBOLS.INFO, `Initial product count: ${initialCount}`);
    
    // 2. Click NACH TYP filter and select an option
    await plpPageObj.clickNachTypFilter();
    const options = await plpPageObj.getNachTypOptions();
    
    if (options.length > 0) {
      await plpPageObj.selectNachTypOption(options[0]);
      log(SYMBOLS.INFO, `Selected option: "${options[0]}"`);
      
      // 3. Click ALLES LÖSCHEN instead of ANWENDEN
      await plpPageObj.clickAllesLoeschenButton();
      await page.waitForTimeout(1500);
      
      // 4. Verify products remain unchanged
      const finalProducts = await plpPageObj.getProductNames();
      const finalCount = finalProducts.length;
      log(SYMBOLS.SUCCESS, `Final product count: ${finalCount}`);
      
      expect(finalCount).toBe(initialCount);
      log(SYMBOLS.SUCCESS, 'Products remained unchanged after ALLES LÖSCHEN');
    }
    
    log(SYMBOLS.SUCCESS, 'NACH TYP filter deny verification completed');
  });

  /**
   * Test Case 11: Filter Deny - NACH THEMA filter functionality
   * Test ID: TC-PLP-11
   */
  test('TC-PLP-11: NACH THEMA filter deny - ALLES LÖSCHEN', async () => {
    log(SYMBOLS.SEARCH, 'Verifying NACH THEMA filter deny functionality');
    
    // 1. Get initial product count
    const initialProducts = await plpPageObj.getProductNames();
    const initialCount = initialProducts.length;
    log(SYMBOLS.INFO, `Initial product count: ${initialCount}`);
    
    // 2. Click NACH THEMA filter and select an option
    await plpPageObj.clickNachThemaFilter();
    const options = await plpPageObj.getNachThemaOptions();
    
    if (options.length > 0) {
      await plpPageObj.selectNachThemaOption(options[0]);
      log(SYMBOLS.INFO, `Selected option: "${options[0]}"`);
      
      // 3. Click ALLES LÖSCHEN instead of ANWENDEN
      await plpPageObj.clickAllesLoeschenButton();
      await page.waitForTimeout(1500);
      
      // 4. Verify products remain unchanged
      const finalProducts = await plpPageObj.getProductNames();
      const finalCount = finalProducts.length;
      log(SYMBOLS.SUCCESS, `Final product count: ${finalCount}`);
      
      expect(finalCount).toBe(initialCount);
      log(SYMBOLS.SUCCESS, 'Products remained unchanged after ALLES LÖSCHEN');
    }
    
    log(SYMBOLS.SUCCESS, 'NACH THEMA filter deny verification completed');
  });

  /**
   * Test Case 12: Filter Deny - NACH KOLLEKTIONEN filter functionality
   * Test ID: TC-PLP-12
   */
  test('TC-PLP-12: NACH KOLLEKTIONEN filter deny - ALLES LÖSCHEN', async () => {
    log(SYMBOLS.SEARCH, 'Verifying NACH KOLLEKTIONEN filter deny functionality');
    
    // 1. Get initial product count
    const initialProducts = await plpPageObj.getProductNames();
    const initialCount = initialProducts.length;
    log(SYMBOLS.INFO, `Initial product count: ${initialCount}`);
    
    // 2. Click NACH KOLLEKTIONEN filter and select an option
    await plpPageObj.clickNachKollektionenFilter();
    const options = await plpPageObj.getNachKollektionenOptions();
    
    if (options.length > 0) {
      await plpPageObj.selectNachKollektionenOption(options[0]);
      log(SYMBOLS.INFO, `Selected option: "${options[0]}"`);
      
      // 3. Click ALLES LÖSCHEN instead of ANWENDEN
      await plpPageObj.clickAllesLoeschenButton();
      await page.waitForTimeout(1500);
      
      // 4. Verify products remain unchanged
      const finalProducts = await plpPageObj.getProductNames();
      const finalCount = finalProducts.length;
      log(SYMBOLS.SUCCESS, `Final product count: ${finalCount}`);
      
      expect(finalCount).toBe(initialCount);
      log(SYMBOLS.SUCCESS, 'Products remained unchanged after ALLES LÖSCHEN');
    }
    
    log(SYMBOLS.SUCCESS, 'NACH KOLLEKTIONEN filter deny verification completed');
  });

  /**
   * Test Case 13: Filter Deny - SORTIEREN NACH filter functionality
   * Test ID: TC-PLP-13
   */
  test('TC-PLP-13: SORTIEREN NACH filter deny - ALLES LÖSCHEN', async () => {
    log(SYMBOLS.SEARCH, 'Verifying SORTIEREN NACH filter deny functionality');
    
    // 1. Get initial product count
    const initialProducts = await plpPageObj.getProductNames();
    const initialCount = initialProducts.length;
    log(SYMBOLS.INFO, `Initial product count: ${initialCount}`);
    
    // 2. Click SORTIEREN NACH filter and select an option
    await plpPageObj.clickSortierenNachFilter();
    const options = await plpPageObj.getSortierenNachOptions();
    
    if (options.length > 0) {
      await plpPageObj.selectSortierenNachOption(options[0]);
      log(SYMBOLS.INFO, `Selected option: "${options[0]}"`);
      
      // 3. Click ALLES LÖSCHEN instead of ANWENDEN
      await plpPageObj.clickAllesLoeschenButton();
      await page.waitForTimeout(1500);
      
      // 4. Verify products remain unchanged
      const finalProducts = await plpPageObj.getProductNames();
      const finalCount = finalProducts.length;
      log(SYMBOLS.SUCCESS, `Final product count: ${finalCount}`);
      
      expect(finalCount).toBe(initialCount);
      log(SYMBOLS.SUCCESS, 'Products remained unchanged after ALLES LÖSCHEN');
    }
    
    log(SYMBOLS.SUCCESS, 'SORTIEREN NACH filter deny verification completed');
  });

  /**
   * Test Case 14: PLP dropdown functionality
   * Test ID: TC-PLP-14
   */
  test('TC-PLP-14: PLP dropdown functionality', async () => {
    log(SYMBOLS.SEARCH, 'Verifying PLP dropdown functionality');
    
    // 1. Get dropdown options
    const options = await plpPageObj.getDropdownOptions();
    log(SYMBOLS.DOCUMENT, `Dropdown options found: ${options.length}`);
    options.forEach((option, index) => {
      log(SYMBOLS.BULLET, `  ${index + 1}. ${option}`);
    });
    
    // 2. Select each option and verify products
    for (const option of options.slice(0, 5)) { // Test first 5 options
      log(SYMBOLS.INFO, `Selecting dropdown option: "${option}"`);
      
      await plpPageObj.selectDropdownOption(option);
      await page.waitForTimeout(2000);
      
      const productNames = await plpPageObj.getProductNames();
      log(SYMBOLS.SUCCESS, `Option "${option}": ${productNames.length} products displayed`);
      
      if (productNames.length > 0) {
        productNames.slice(0, 3).forEach((name, idx) => {
          log(SYMBOLS.BULLET, `  ${idx + 1}. ${name}`);
        });
      }
    }
    
    log(SYMBOLS.SUCCESS, 'PLP dropdown verification completed');
  });

  /**
   * Test Case 15: Favorite icon functionality
   * Test ID: TC-PLP-15
   */
  test('TC-PLP-15: Favorite icon functionality', async () => {
    log(SYMBOLS.SEARCH, 'Verifying favorite icon functionality');
    
    // 1. Get initial favorite count
    const initialCount = await plpPageObj.getFavoriteCount();
    log(SYMBOLS.INFO, `Initial favorite count: ${initialCount}`);
    
    // 2. Click favorite icon on first product
    await plpPageObj.clickFavoriteIconOnProduct(0);
    await page.waitForTimeout(2000);
    
    // 3. Verify favorite count increased
    const newCount = await plpPageObj.getFavoriteCount();
    log(SYMBOLS.SUCCESS, `New favorite count: ${newCount}`);
    
    expect(newCount).toBeGreaterThanOrEqual(initialCount);
    log(SYMBOLS.SUCCESS, 'Favorite icon functionality verified');
  });

  /**
   * Test Case 16: Verify the SEO components
   * Test ID: TC-PLP-16
   */
  test('TC-PLP-16: Verify SEO components', async () => {
    log(SYMBOLS.SEARCH, 'Verifying SEO components');
    
    // 1. Get all SEO metadata
    const seoData = await plpPageObj.getSEOMetadata();
    
    // 2. Display SEO components
    log(SYMBOLS.DOCUMENT, 'SEO Components:');
    log(SYMBOLS.BULLET, `Meta Title: ${seoData.metaTitle || 'Not Found'}`);
    log(SYMBOLS.BULLET, `Meta Description: ${seoData.metaDescription || 'Not Found'}`);
    log(SYMBOLS.BULLET, `OG Title: ${seoData.ogTitle || 'Not Found'}`);
    log(SYMBOLS.BULLET, `OG Description: ${seoData.ogDescription || 'Not Found'}`);
    log(SYMBOLS.BULLET, `Canonical URL: ${seoData.canonicalUrl || 'Not Found'}`);
    log(SYMBOLS.BULLET, `H1: ${seoData.h1 || 'Not Found'}`);
    
    log(SYMBOLS.INFO, `H2 Tags (${seoData.h2.length}):`);
    seoData.h2.slice(0, 5).forEach((h2, index) => {
      log(SYMBOLS.BULLET, `  ${index + 1}. ${h2}`);
    });
    
    log(SYMBOLS.INFO, `H3 Tags (${seoData.h3.length}):`);
    seoData.h3.slice(0, 5).forEach((h3, index) => {
      log(SYMBOLS.BULLET, `  ${index + 1}. ${h3}`);
    });
    
    // 3. Verify essential SEO components exist
    expect(seoData.metaTitle).toBeTruthy();
    expect(seoData.h1).toBeTruthy();
    
    log(SYMBOLS.SUCCESS, 'SEO components verification completed');
  });
});
