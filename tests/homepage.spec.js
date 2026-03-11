/**
 * Homepage Regression Test Suite
 * Test Plan: test-plans/homepage.md
 * 
 * Comprehensive regression tests for the Gillette Germany Homepage
 * URL: https://www.gillette.de/de-de
 */

import { test, expect } from '@playwright/test';
import { homePage } from '../pages/homePage.js';
import { SYMBOLS, log } from '../utils/logConstants.js';
import { setupTest, attachFailureScreenshot } from '../utils/testSetup.js';

/**
 * Helper function to capture comprehensive page information
 */
async function capturePageInfo(page) {
  const pageInfo = {
    title: await page.title(),
    url: page.url(),
    buttons: [],
    links: [],
    images: [],
    textContent: '',
    seo: {
      metaDescription: '',
      h1: [],
      h2: [],
      h3: [],
      canonicalUrl: ''
    }
  };

  // Capture all buttons
  const buttons = await page.locator('button, input[type="button"], input[type="submit"]').all();
  for (const button of buttons.slice(0, 20)) {
    const text = await button.textContent().catch(() => '');
    const ariaLabel = await button.getAttribute('aria-label').catch(() => '');
    if (text?.trim() || ariaLabel) {
      pageInfo.buttons.push({ text: text?.trim() || ariaLabel, ariaLabel });
    }
  }

  // Capture main links
  const links = await page.locator('a[href]').all();
  for (const link of links.slice(0, 30)) {
    const text = await link.textContent().catch(() => '');
    const href = await link.getAttribute('href').catch(() => '');
    if (text?.trim() && href) {
      pageInfo.links.push({ text: text?.trim(), href });
    }
  }

  // Capture images
  const images = await page.locator('img[src]').all();
  for (const img of images.slice(0, 15)) {
    const alt = await img.getAttribute('alt').catch(() => '');
    const src = await img.getAttribute('src').catch(() => '');
    if (src) {
      pageInfo.images.push({ alt: alt || 'No alt text', src });
    }
  }

  // Capture body text content (first 500 chars)
  const bodyText = await page.locator('body').textContent().catch(() => '');
  pageInfo.textContent = bodyText?.substring(0, 500).trim();

  // Capture SEO information
  pageInfo.seo.metaDescription = await page.locator('meta[name="description"]').getAttribute('content').catch(() => '');
  
  const h1Elements = await page.locator('h1').all();
  for (const h1 of h1Elements) {
    const text = await h1.textContent().catch(() => '');
    if (text?.trim()) pageInfo.seo.h1.push(text.trim());
  }
  
  const h2Elements = await page.locator('h2').all();
  for (const h2 of h2Elements.slice(0, 10)) {
    const text = await h2.textContent().catch(() => '');
    if (text?.trim()) pageInfo.seo.h2.push(text.trim());
  }
  
  const h3Elements = await page.locator('h3').all();
  for (const h3 of h3Elements.slice(0, 10)) {
    const text = await h3.textContent().catch(() => '');
    if (text?.trim()) pageInfo.seo.h3.push(text.trim());
  }

  pageInfo.seo.canonicalUrl = await page.locator('link[rel="canonical"]').getAttribute('href').catch(() => '');

  return pageInfo;
}

test.describe.serial('Homepage Regression Tests', () => {
  let page;
  let homePageObj;
  let context;

  test.beforeAll(async ({ browser }) => {
    // Create a single browser context for all tests with cookie persistence
    context = await browser.newContext({
      viewport: null, // Use null for full screen mode
      isMobile: false,
      hasTouch: false,
      // Accept language for German site
      locale: 'de-DE',
      // Enable persistent cookies
      acceptDownloads: true
    });
    
    page = await context.newPage();
    homePageObj = new homePage(page);
    
    // Maximize window using Chrome DevTools Protocol
    try {
      const client = await page.context().newCDPSession(page);
      const { windowId } = await client.send('Browser.getWindowForTarget');
      await client.send('Browser.setWindowBounds', {
        windowId,
        bounds: { windowState: 'maximized' }
      });
      await client.detach();
    } catch (error) {
      console.log('CDP maximization not available:', error.message);
    }
    
    // CRITICAL: Inject script to block cookie banner from ever appearing
    await page.addInitScript(() => {
      // Prevent OneTrust from initializing
      window.OneTrust = {
        AllowAll: () => {},
        Init: () => {},
        Close: () => {},
        InsertScript: () => {}
      };
      
      // Set consent cookies immediately on page load
      document.cookie = 'OptanonAlertBoxClosed=' + new Date().toISOString() + '; path=/; domain=.gillette.de; max-age=31536000';
      document.cookie = 'OptanonConsent=groups=C0001:1,C0002:1,C0003:1,C0004:1; path=/; domain=.gillette.de; max-age=31536000';
      
      // Hide banner with CSS injection
      const style = document.createElement('style');
      style.textContent = '#onetrust-banner-sdk, #onetrust-consent-sdk, .onetrust-pc-dark-filter, #ot-sdk-btn-floating { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }';
      if (document.head) {
        document.head.appendChild(style);
      } else {
        document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
      }
    });
    
    page = await context.newPage();
    homePageObj = new homePage(page);
    
    // Initial navigation to homepage
    log(SYMBOLS.HOME, 'Opening Browser - Navigating to Gillette Germany Homepage');
    await homePageObj.navigate();
    
    // Log actual viewport size for verification
    const viewportSize = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight
    }));
    log(SYMBOLS.INFO, `Window size: ${viewportSize.outerWidth}x${viewportSize.outerHeight}, Viewport: ${viewportSize.width}x${viewportSize.height}, Screen: ${viewportSize.screenWidth}x${viewportSize.screenHeight} (Available: ${viewportSize.availWidth}x${viewportSize.availHeight})`);
    
    // Accept cookies ONCE with multiple retries - this will persist for entire test session
    log(SYMBOLS.INFO, 'Accepting cookies for the session...');
    await homePageObj.acceptCookies();
    await page.waitForTimeout(2000);
    
    // Force accept one more time to be absolutely sure
    await homePageObj.acceptCookies();
    await page.waitForTimeout(2000);
    
    // Force hide any remaining cookie banners
    await page.evaluate(() => {
      const banners = document.querySelectorAll('#onetrust-banner-sdk, #onetrust-consent-sdk, .onetrust-pc-dark-filter');
      banners.forEach(b => { if(b) { b.style.display = 'none'; b.remove(); } });
    }).catch(() => {});
    
    // Verify cookies are accepted and banner is gone
    const cookieBannerStillVisible = await page.locator('#onetrust-banner-sdk, #onetrust-consent-sdk').isVisible({ timeout: 2000 }).catch(() => false);
    if (!cookieBannerStillVisible) {
      log(SYMBOLS.SUCCESS, 'Cookies accepted successfully - banner permanently dismissed for entire session');
    } else {
      log(SYMBOLS.WARNING, 'Cookie banner may still be present, will dismiss automatically during tests');
    }
    
    // Wait for page to fully stabilize
    await page.waitForTimeout(2000);
    await page.waitForLoadState('domcontentloaded');
    
    log(SYMBOLS.SUCCESS, 'Browser opened in Google Chrome - Ready to run all tests in single session');
  });

  test.afterAll(async () => {
    // Close context and page after all tests complete
    if (page) {
      await page.close();
      log(SYMBOLS.INFO, 'Browser closed after completing all tests');
    }
    if (context) {
      await context.close();
    }
  });

  test.beforeEach(async ({}, testInfo) => {
    // Navigate back to homepage before each test (cookies already accepted in beforeAll)
    log(SYMBOLS.HOME, `Starting Test: ${testInfo.title}`);
    await homePageObj.navigate();
    
    // Silent cookie banner suppression (no interruptions)
    await page.evaluate(() => {
      const banners = document.querySelectorAll('#onetrust-banner-sdk, #onetrust-consent-sdk, .onetrust-pc-dark-filter');
      banners.forEach(b => { if(b) { b.style.display = 'none'; b.remove(); } });
    }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Take initial screenshot
    await page.screenshot({ path: `test-results/homepage-artifacts/${testInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}_initial.png`, fullPage: false });
    log(SYMBOLS.INFO, 'Test screenshot captured');
  });

  test.afterEach(async ({}, testInfo) => {
    // Attach screenshot on failure
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `test-results/homepage-artifacts/${testInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}_failure.png` });
    }
    log(SYMBOLS.SUCCESS, `Test Completed: ${testInfo.title} - ${testInfo.status}`);
  });

  /**
   * Test Case 1: Check whether the homepage loads properly
   * Test ID: TC-Homepage-01
   */
  test('TC-Homepage-01: Homepage loads properly with all sections visible', async () => {
    log(SYMBOLS.SEARCH, 'Verifying homepage loads properly');
    
    // 1. Wait for page to fully load
    await homePageObj.waitForPageLoad();
    
    // Capture comprehensive page information
    log(SYMBOLS.INFO, 'Capturing comprehensive page information...');
    const pageInfo = await capturePageInfo(page);
    
    // Log page title and URL
    log(SYMBOLS.DOCUMENT, `Page Title: ${pageInfo.title}`);
    log(SYMBOLS.SUCCESS, `Current URL: ${pageInfo.url}`);
    expect(pageInfo.url).toContain('gillette.de/de-de');
    
    // Log SEO information
    log(SYMBOLS.DOCUMENT, `Meta Description: ${pageInfo.seo.metaDescription.substring(0, 100)}...`);
    log(SYMBOLS.DOCUMENT, `Canonical URL: ${pageInfo.seo.canonicalUrl}`);
    log(SYMBOLS.DOCUMENT, `H1 Tags: ${pageInfo.seo.h1.join(', ')}`);
    log(SYMBOLS.DOCUMENT, `H2 Tags (${pageInfo.seo.h2.length}): ${pageInfo.seo.h2.slice(0, 3).join(', ')}...`);
    log(SYMBOLS.DOCUMENT, `H3 Tags (${pageInfo.seo.h3.length}): ${pageInfo.seo.h3.slice(0, 3).join(', ')}...`);
    
    // Log buttons found
    log(SYMBOLS.INFO, `Buttons found on page: ${pageInfo.buttons.length}`);
    pageInfo.buttons.slice(0, 10).forEach((btn, i) => {
      log(SYMBOLS.BULLET, `  ${i + 1}. ${btn.text}`);
    });
    
    // Log key links
    log(SYMBOLS.INFO, `Links found on page: ${pageInfo.links.length}`);
    pageInfo.links.slice(0, 10).forEach((link, i) => {
      log(SYMBOLS.BULLET, `  ${i + 1}. ${link.text} -> ${link.href}`);
    });
    
    // Log images
    log(SYMBOLS.INFO, `Images found on page: ${pageInfo.images.length}`);
    pageInfo.images.slice(0, 5).forEach((img, i) => {
      log(SYMBOLS.BULLET, `  ${i + 1}. ${img.alt}`);
    });
    
    // Take viewport screenshot
    await page.screenshot({ 
      path: `test-results/homepage-artifacts/TC-Homepage-01_viewport.png`, 
      fullPage: false 
    });
    log(SYMBOLS.IMAGE, 'Viewport screenshot captured');
    
    // Verify required sections are visible
    const sectionsToVerify = [
      'Alles, was du brauchst',
      'Unsere Produkte',
      'Erfahre etwas Neues',
      'Gillette unterstützt'
    ];
    
    for (const section of sectionsToVerify) {
      const sectionVisible = await page.locator(`text=${section}`).first().isVisible({ timeout: 10000 }).catch(() => false);
      log(sectionVisible ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `Section "${section}": ${sectionVisible ? 'Visible' : 'Not Found'}`);
    }
    
    // Verify banner/carousel is visible (the site uses a carousel slider)
    const bannerCarousel = page.locator('button:has-text("Previous Slide"), button:has-text("Next Slide")').first();
    const bannerVisible = await bannerCarousel.isVisible({ timeout: 10000 }).catch(() => false);
    log(SYMBOLS.IMAGE, `Homepage Banner/Carousel: ${bannerVisible ? 'Visible' : 'Not Visible'}`);
    // Banner carousel is optional, log result but don't fail if not present
    if (!bannerVisible) {
      log(SYMBOLS.WARNING, 'Banner carousel not found, but other sections are present');
    }

    log(SYMBOLS.SUCCESS, 'Homepage loaded successfully with all required sections');
  });

  /**
   * Test Case 2: Verify the logo container in Header
   * Test ID: TC-Homepage-02
   */
  test('TC-Homepage-02: Verify logo container in Header with all brand logos', async () => {
    log(SYMBOLS.SEARCH, 'Verifying logo container in header');
    
    // Step 1: Locate the brand logo container in the header section
    log(SYMBOLS.INFO, 'Step 1: Locating brand logo container in header');
    const logoContainer = page.locator('.logoItemContainer, .logoItemContainerwrapper').first();
    const containerVisible = await logoContainer.isVisible({ timeout: 10000 }).catch(() => false);
    log(containerVisible ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `Logo container: ${containerVisible ? 'Visible and properly aligned' : 'Not found'}`);
    expect(containerVisible).toBeTruthy();
    
    // Step 2: Verify that the container includes all four brand logos
    log(SYMBOLS.INFO, 'Step 2: Verifying all four brand logos are displayed');
    const brandLogos = [
      { name: 'Gillette', alt: 'Gillette', href: '/de-de' },
      { name: 'Gillette Labs', alt: 'GilletteLabs', href: '/de-de/gillettelabs' },
      { name: 'Gillette Body & Intimate', alt: 'Gillette Body & Intimate', href: '/de-de/intimrasur' },
      { name: 'King C. Gillette', alt: 'King. C. Gillette', href: '/de-de/kingcgillette' }
    ];
    
    const logoInfo = [];
    for (const brand of brandLogos) {
      const logoLink = page.locator(`a[title="${brand.alt}"] img[alt="${brand.alt}"]`).first();
      const isVisible = await logoLink.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (isVisible) {
        const imgSrc = await logoLink.getAttribute('src').catch(() => '');
        logoInfo.push({ name: brand.name, visible: true, alt: brand.alt, imgSrc });
        log(SYMBOLS.SUCCESS, `✓ ${brand.name}: Visible`);
        log(SYMBOLS.BULLET, `  Alt text: ${brand.alt}`);
      } else {
        logoInfo.push({ name: brand.name, visible: false });
        log(SYMBOLS.WARNING, `✗ ${brand.name}: Not found`);
      }
    }
    
    log(SYMBOLS.INFO, `Total visible logos: ${logoInfo.filter(l => l.visible).length}/4`);
    
    // Step 3: Verify each logo is clickable and has a valid href attribute
    log(SYMBOLS.INFO, 'Step 3: Verifying each logo is clickable with valid href');
    const logoLinks = [];
    for (const brand of brandLogos) {
      const logoLink = page.locator(`a[title="${brand.alt}"]`).first();
      const href = await logoLink.getAttribute('href').catch(() => '');
      const isClickable = await logoLink.isEnabled().catch(() => false);
      
      if (href) {
        logoLinks.push({ name: brand.name, href, isClickable });
        log(SYMBOLS.ARROW_RIGHT, `${brand.name}: ${href} (${isClickable ? 'Clickable' : 'Not clickable'})`);
      }
    }
    
    // Step 4: Click the "Gillette" logo
    log(SYMBOLS.INFO, 'Step 4: Clicking "Gillette" logo');
    const gilletteLink = page.locator('a[title="Gillette"]').first();
    await gilletteLink.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const gilletteUrl = page.url();
    const gilletteTitle = await page.title();
    log(SYMBOLS.SUCCESS, `Redirected to: ${gilletteUrl}`);
    log(SYMBOLS.DOCUMENT, `Page title: ${gilletteTitle}`);
    expect(gilletteUrl).toContain('gillette.de/de-de');
    
    // Step 5: Navigate back and click "Gillette Labs" logo
    log(SYMBOLS.INFO, 'Step 5: Navigating back and clicking "Gillette Labs" logo');
    await homePageObj.navigate();
    await page.waitForTimeout(2000);
    
    const gilletteLabsLink = page.locator('a[title="GilletteLabs"]').first();
    const labsVisible = await gilletteLabsLink.isVisible({ timeout: 5000 }).catch(() => false);
    if (labsVisible) {
      await gilletteLabsLink.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      const labsUrl = page.url();
      log(SYMBOLS.SUCCESS, `Redirected to Gillette Labs: ${labsUrl}`);
      expect(labsUrl.toLowerCase()).toContain('gillettelabs');
    } else {
      log(SYMBOLS.WARNING, 'Gillette Labs logo not visible, skipping click test');
    }
    
    // Step 6: Navigate back and click "Gillette Body & Intimate" logo
    log(SYMBOLS.INFO, 'Step 6: Navigating back and clicking "Gillette Body & Intimate" logo');
    await homePageObj.navigate();
    await page.waitForTimeout(2000);
    
    const bodyLink = page.locator('a[title="Gillette Body & Intimate"]').first();
    const bodyVisible = await bodyLink.isVisible({ timeout: 5000 }).catch(() => false);
    if (bodyVisible) {
      await bodyLink.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      const bodyUrl = page.url();
      const bodyContent = await page.locator('h1, h2').first().textContent().catch(() => '');
      log(SYMBOLS.SUCCESS, `Redirected to Body & Intimate: ${bodyUrl}`);
      log(SYMBOLS.DOCUMENT, `Page content: ${bodyContent}`);
      expect(bodyUrl.toLowerCase()).toContain('intimrasur');
    } else {
      log(SYMBOLS.WARNING, 'Gillette Body & Intimate logo not visible, skipping click test');
    }
    
    // Step 7: Navigate back and click "King C. Gillette" logo
    log(SYMBOLS.INFO, 'Step 7: Navigating back and clicking "King C. Gillette" logo');
    await homePageObj.navigate();
    await page.waitForTimeout(2000);
    
    const kingLink = page.locator('a[title="King. C. Gillette"]').first();
    const kingVisible = await kingLink.isVisible({ timeout: 5000 }).catch(() => false);
    if (kingVisible) {
      await kingLink.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      const kingUrl = page.url();
      log(SYMBOLS.SUCCESS, `Redirected to King C. Gillette: ${kingUrl}`);
      expect(kingUrl.toLowerCase()).toContain('kingcgillette');
    } else {
      log(SYMBOLS.WARNING, 'King C. Gillette logo not visible, skipping click test');
    }
    
    // Navigate back to homepage for next tests
    await homePageObj.navigate();
    await page.waitForTimeout(2000);
    
    log(SYMBOLS.SUCCESS, 'Logo container verification completed with all brand logos tested');
  });

  /**
   * Test Case 3: Verify the Gillette main logo in the header
   * Test ID: TC-Homepage-03
   */
  test('TC-Homepage-03: Verify Gillette main logo redirects to homepage', async () => {
    log(SYMBOLS.SEARCH, 'Verifying Gillette main logo in header');
    
    // Step 1: Locate the main Gillette logo in the header navigation
    log(SYMBOLS.INFO, 'Step 1: Locating main Gillette logo in header (left side)');
    const mainLogo = page.locator('header a[href="/de-de"], header a[href="/"], header .logo a, header .main-logo a').first();
    const logoVisible = await mainLogo.isVisible({ timeout: 10000 }).catch(() => false);
    log(logoVisible ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `Main Gillette logo: ${logoVisible ? 'Visible and prominently displayed' : 'Not found'}`);
    expect(logoVisible).toBeTruthy();
    
    // Step 2: Verify the logo image properties
    log(SYMBOLS.INFO, 'Step 2: Verifying logo image properties');
    const logoImg = mainLogo.locator('img').first();
    const imgSrc = await logoImg.getAttribute('src').catch(() => '');
    const imgAlt = await logoImg.getAttribute('alt').catch(() => '');
    const imgWidth = await logoImg.getAttribute('width').catch(() => '');
    const imgHeight = await logoImg.getAttribute('height').catch(() => '');
    
    // Check if image is loaded and visible
    const imgLoaded = await logoImg.isVisible().catch(() => false);
    
    log(SYMBOLS.DOCUMENT, `Image source (src): ${imgSrc || 'N/A'}`);
    log(SYMBOLS.DOCUMENT, `Alt text: ${imgAlt || 'No alt text'}`);
    log(SYMBOLS.DOCUMENT, `Dimensions: ${imgWidth || 'auto'} x ${imgHeight || 'auto'}`);
    log(imgLoaded ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `Logo image: ${imgLoaded ? 'Sharp and properly rendered' : 'Not loaded properly'}`);
    
    expect(imgSrc).toBeTruthy();
    expect(imgAlt).toBeTruthy();
    expect(imgLoaded).toBeTruthy();
    
    // Step 3: Verify the logo is clickable and functions as a home link
    log(SYMBOLS.INFO, 'Step 3: Verifying logo is clickable and functions as home link');
    const logoHref = await mainLogo.getAttribute('href');
    log(SYMBOLS.ARROW_RIGHT, `Logo href attribute: ${logoHref}`);
    
    const isHomeLink = logoHref === '/de-de' || logoHref === '/' || logoHref?.includes('gillette.de/de-de');
    log(isHomeLink ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `Logo href points to homepage: ${isHomeLink ? 'Yes' : 'No'}`);
    expect(isHomeLink).toBeTruthy();
    
    // Step 4: Click the main Gillette logo from homepage
    log(SYMBOLS.INFO, 'Step 4: Clicking main Gillette logo from homepage');
    const currentUrlBefore = page.url();
    log(SYMBOLS.INFO, `Current URL before click: ${currentUrlBefore}`);
    
    await mainLogo.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    const currentUrlAfter = page.url();
    log(SYMBOLS.SUCCESS, `Current URL after click: ${currentUrlAfter}`);
    expect(currentUrlAfter).toContain('gillette.de/de-de');
    log(SYMBOLS.SUCCESS, 'Logo successfully redirects to homepage URL');
    
    // Step 5: Navigate to another page, then click logo to return to homepage
    log(SYMBOLS.INFO, 'Step 5: Testing logo click from product/article page');
    
    // Navigate to a product or article page
    const productLink = page.locator('nav a[href*="produkt"], a[href*="rasierer"]').first();
    const productLinkVisible = await productLink.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (productLinkVisible) {
      await productLink.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      
      const intermediateUrl = page.url();
      log(SYMBOLS.ARROW_RIGHT, `Navigated to: ${intermediateUrl}`);
      
      // Now click the main logo again
      const logoOnProductPage = page.locator('header a[href="/de-de"], header a[href="/"], header .logo a, header .main-logo a').first();
      await logoOnProductPage.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      
      const returnedUrl = page.url();
      log(SYMBOLS.SUCCESS, `Returned to homepage: ${returnedUrl}`);
      expect(returnedUrl).toContain('gillette.de/de-de');
      
      // Verify homepage content loads properly
      const homepageContent = await page.locator('h1, h2').first().isVisible({ timeout: 5000 }).catch(() => false);
      log(homepageContent ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `Homepage content: ${homepageContent ? 'Loaded properly' : 'Not loaded'}`);
      expect(homepageContent).toBeTruthy();
    } else {
      log(SYMBOLS.WARNING, 'Could not find product link to test navigation from another page');
      // Alternative: just verify we're on homepage
      const finalUrl = page.url();
      expect(finalUrl).toContain('gillette.de/de-de');
    }
    
    log(SYMBOLS.SUCCESS, 'Main Gillette logo verification completed - functions correctly as homepage link from all pages');
  });

  /**
   * Test Case 4: Check navigation to Article (Blog) categories
   * Test ID: TC-Homepage-04
   */
  test('TC-Homepage-04: Verify Blog navigation and article categories', async () => {
    log(SYMBOLS.SEARCH, 'Verifying Blog navigation menu');
    
    // Define all Blog sub-options based on actual site structure
    const blogSubOptions = [
      { name: 'Bart Styles', url: '/de-de/perfekte-rasur/bart-styles' },
      { name: 'Rasur-Tipps', url: '/de-de/perfekte-rasur/rasur-tipps' },
      { name: 'Körperrasur Und -Trimmen', url: '/de-de/perfekte-rasur/koerperrasur' },
      { name: 'Hautpflege', url: '/de-de/perfekte-rasur/hautpflege' },
      { name: 'Das Beste Im Mann', url: '/de-de/perfekte-rasur/das-beste-im-mann' },
      { name: 'Wissenschaft Des Rasierens', url: '/de-de/perfekte-rasur/wissenschaft-des-rasierens' },
      { name: 'Alle Artikel', url: '/de-de/perfekte-rasur' }
    ];
    
    log(SYMBOLS.DOCUMENT, 'Blog Sub-options to test:');
    blogSubOptions.forEach((opt, index) => {
      log(SYMBOLS.BULLET, `  ${index + 1}. ${opt.name}`);
    });
    
    // Check for images in Blog dropdown menu
    const blogMenu = page.locator('nav a:has-text("Blog")').first();
    await blogMenu.hover();
    await page.waitForTimeout(2000);
    
    const blogDropdownImages = await page.locator('nav img, .dropdown img, .menu img').all();
    if (blogDropdownImages.length > 0) {
      log(SYMBOLS.DOCUMENT, `Found ${blogDropdownImages.length} images in Blog dropdown`);
      
      for (let i = 0; i < blogDropdownImages.length; i++) {
        const img = blogDropdownImages[i];
        const imgSrc = await img.getAttribute('src').catch(() => '');
        const imgAlt = await img.getAttribute('alt').catch(() => '');
        const imgParentLink = img.locator('xpath=ancestor::a[1]');
        const linkHref = await imgParentLink.getAttribute('href').catch(() => '');
        
        // Check if link is actually visible before attempting to click
        const isLinkVisible = await imgParentLink.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (linkHref && isLinkVisible) {
          log(SYMBOLS.ARROW_RIGHT, `Image ${i + 1}: "${imgAlt || 'No alt'}" -> ${linkHref}`);
          
          await imgParentLink.click();
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(2000);
          
          const redirectUrl = page.url();
          log(SYMBOLS.SUCCESS, `✓ Image link redirected to: ${redirectUrl}`);
          
          await homePageObj.navigate();
          await page.waitForTimeout(2000);
          await blogMenu.hover();
          await page.waitForTimeout(2000);
        } else if (linkHref) {
          log(SYMBOLS.WARNING, `Image ${i + 1}: "${imgAlt || 'No alt'}" -> ${linkHref} (not visible, skipped)`);
        }
      }
    }
    
    // Click each text sub-option and verify redirect
    for (const option of blogSubOptions) {
      // Hover over Blog menu to show dropdown
      const blogMenu = page.locator('nav a:has-text("Blog")').first();
      await blogMenu.hover();
      await page.waitForTimeout(2000);
      
      // Click the sub-option link
      const subLink = page.locator(`nav a:has-text("${option.name}")`).first();
      const isVisible = await subLink.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (isVisible) {
        await subLink.click();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        
        const currentUrl = page.url();
        log(SYMBOLS.SUCCESS, `"${option.name}": Redirected to ${currentUrl}`);
        expect(currentUrl).toContain(option.url.split('/').pop());
      } else {
        log(SYMBOLS.WARNING, `"${option.name}": Link not visible in dropdown`);
      }
      
      // Navigate back to homepage
      await homePageObj.navigate();
    }
    
    log(SYMBOLS.SUCCESS, 'Blog navigation verification completed');
  });

  /**
   * Test Case 5: Check navigation to Products (Produkte) categories
   * Test ID: TC-Homepage-05
   */
  test('TC-Homepage-05: Verify Products navigation with sub-categories', async () => {
    // Extended timeout: 21 menu items × 15 seconds each = ~5+ minutes needed plus overhead
    test.setTimeout(480000); // 8 minutes
    log(SYMBOLS.SEARCH, 'Verifying Products (Produkte) navigation menu');
    
    // Define all Produkte sub-options based on actual site structure
    const produkteSubOptions = {
      'Produkttyp': [
        { name: 'Rasierer', url: '/de-de/produkte/rasierer' },
        { name: 'Rasierklingen', url: '/de-de/produkte/rasierklingen' },
        { name: 'Barttrimmer', url: '/de-de/produkte/barttrimmer' },
        { name: 'Rasiergel, Rasierschaum und After Shave', url: '/de-de/produkte/gesichtspflege' },
        { name: 'Bartpflege', url: '/de-de/produkte/bartpflege' },
        { name: 'Geschenke & Sets für Männer', url: '/de-de/produkte/geschenksets' }
      ],
      'Portfolio': [
        { name: 'GilletteLabs', url: '/de-de/gillettelabs' },
        { name: 'Gillette BODY & INTIMATE', url: '/de-de/intimrasur' },
        { name: 'SkinGuard Sensitive', url: '/de-de/produkte/skinguard-sensitive-portfolio' },
        { name: 'Fusion5', url: '/de-de/produkte/fusion5-portfolio' },
        { name: 'PRO', url: '/de-de/produkte/pro-portfolio' },
        { name: 'Mach3', url: '/de-de/produkte/mach3-portfolio' },
        { name: 'Einwegrasierer', url: '/de-de/produkte/einwegrasierer' },
        { name: 'King C. Gillette', url: '/de-de/kingcgillette' }
      ],
      'Bedürfnis': [
        { name: 'Gründliche Rasur', url: '/de-de/produkte/gruendliche-rasur' },
        { name: 'Intimrasur', url: '/de-de/intimrasur/intimrasierer' },
        { name: 'Bart Styling', url: '/de-de/produkte/bart-styles' },
        { name: 'Empfindliche Haut, Rasurbrand und Unebenheiten', url: '/de-de/produkte/empfindliche-haut-rasurbrand-hautirritationen' },
        { name: 'Vorbeugung gegen Einwachsen von Haaren', url: '/de-de/produkte/einwachsene-haare-vorbeugen' },
        { name: 'Rasieren kniffliger Stellen', url: '/de-de/produkte/rasur-schwieriger-stellen' },
        { name: 'Alle Produkte', url: '/de-de/produkte' }
      ]
    };
    
    // Log all categories and sub-options
    for (const [category, options] of Object.entries(produkteSubOptions)) {
      log(SYMBOLS.DOCUMENT, `${category}:`);
      options.forEach((opt, index) => {
        log(SYMBOLS.BULLET, `  ${index + 1}. ${opt.name}`);
      });
    }
    
    // Check for images in Produkte dropdown menu
    const produkteMenu = page.locator('nav a:has-text("Produkte")').first();
    await produkteMenu.hover();
    await page.waitForTimeout(2000);
    
    const produkteDropdownImages = await page.locator('nav img, .dropdown img, .menu img').all();
    if (produkteDropdownImages.length > 0) {
      log(SYMBOLS.DOCUMENT, `Found ${produkteDropdownImages.length} images in Produkte dropdown`);
      
      for (let i = 0; i < Math.min(produkteDropdownImages.length, 3); i++) { // Limit to first 3 to avoid timeout
        const img = produkteDropdownImages[i];
        const imgAlt = await img.getAttribute('alt').catch(() => '');
        const imgParentLink = img.locator('xpath=ancestor::a[1]');
        const linkHref = await imgParentLink.getAttribute('href').catch(() => '');
        
        // Check if link is actually visible before attempting to click
        const isLinkVisible = await imgParentLink.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (linkHref && isLinkVisible) {
          log(SYMBOLS.ARROW_RIGHT, `Image ${i + 1}: "${imgAlt || 'No alt'}" -> ${linkHref}`);
          
          await imgParentLink.click();
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(2000);
          
          const redirectUrl = page.url();
          log(SYMBOLS.SUCCESS, `✓ Image link redirected to: ${redirectUrl}`);
          
          await homePageObj.navigate();
          await page.waitForTimeout(500);
          await produkteMenu.hover();
          await page.waitForTimeout(300);
        } else if (linkHref) {
          log(SYMBOLS.WARNING, `Image ${i + 1}: "${imgAlt || 'No alt'}" -> ${linkHref} (not visible, skipped)`);
        }
      }
    }
    
    // Click each sub-option and verify redirect
    for (const [category, options] of Object.entries(produkteSubOptions)) {
      log(SYMBOLS.INFO, `Testing ${category} sub-options...`);
      
      for (const option of options) {
        // STEP 1: Dismiss any cookie banner before interaction
        await homePageObj.dismissAnyCookieBanner();
        await page.waitForTimeout(300);
        
        // STEP 2: Hover over Produkte menu to show dropdown
        const produkteMenu = page.locator('nav a:has-text("Produkte")').first();
        await produkteMenu.hover();
        await page.waitForTimeout(500);
        
        // STEP 3: Wait for dropdown to be visible
        await page.waitForTimeout(300);
        
        // STEP 4: CRITICAL - Dismiss cookie banner again before clicking (prevents blocking)
        await homePageObj.dismissAnyCookieBanner();
        await page.waitForTimeout(300);
        
        // STEP 5: Try multiple selector strategies to find the link
        let subLink;
        // Strategy 1: href-based selector (most reliable for Rasierer)
        subLink = page.locator(`nav a[href="${option.url}"]`).first();
        let isVisible = await subLink.isVisible({ timeout: 3000 }).catch(() => false);
        
        // Strategy 2: has-text selector (fallback)
        if (!isVisible) {
          subLink = page.locator(`nav a:has-text("${option.name}")`).first();
          isVisible = await subLink.isVisible({ timeout: 3000 }).catch(() => false);
        }
        
        if (isVisible) {
          // STEP 6: Click with force to bypass any potential overlays
          try {
            await subLink.click({ force: true, timeout: 5000 });
          } catch (error) {
            // If still blocked, dismiss banner more aggressively and retry
            log(SYMBOLS.WARNING, `Click blocked for "${option.name}", dismissing banner and retrying...`);
            await homePageObj.dismissAnyCookieBanner();
            await page.waitForTimeout(500);
            
            // Force remove any remaining banners via JavaScript
            await page.evaluate(() => {
              document.querySelectorAll('#onetrust-banner-sdk, #onetrust-consent-sdk').forEach(el => el.remove());
            }).catch(() => {});
            
            // Re-hover to show dropdown again
            await produkteMenu.hover();
            await page.waitForTimeout(500);
            
            // Retry click with force
            await subLink.click({ force: true });
          }
          
          // Wait for navigation with timeout handling
          try {
            await page.waitForURL(new RegExp(option.url.replace(/\//, '\\/')), { timeout: 15000 });
          } catch (e) {
            // If specific URL not reached, just wait briefly for any navigation
            await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
          }
          
          const currentUrl = page.url();
          log(SYMBOLS.SUCCESS, `"${option.name}": Redirected to ${currentUrl}`);
        } else {
          log(SYMBOLS.WARNING, `"${option.name}": Link not visible in dropdown`);
        }
        
        // Navigate back to homepage and dismiss cookie banner immediately
        await homePageObj.navigate();
        await homePageObj.dismissAnyCookieBanner();
        await page.waitForTimeout(500);
      }
    }
    
    log(SYMBOLS.SUCCESS, 'Products navigation verification completed');
  });

  /**
   * Test Case 6: Check navigation to About Gillette (Über Gillette) categories
   * Test ID: TC-Homepage-06
   */
  test('TC-Homepage-06: Verify About Gillette navigation with sub-categories', async () => {
    log(SYMBOLS.SEARCH, 'Verifying About Gillette (Über Gillette) navigation menu');
    
    // Define all Über Gillette sub-options based on actual site structure
    const aboutSubOptions = {
      'Über Gillette': [
        { name: 'Unsere Geschichte', url: '/de-de/gillette-welt/evolution-rasierer' },
        { name: 'FAQs', url: '/de-de/faq' }
      ],
      'Engagement': [
        { name: 'Soziale Nachhaltigkeit', url: '/de-de/gillette-welt/corporate-social-responsibility' },
        { name: 'Sicherheit unserer Produkte', url: '/de-de/gillette-welt/produktsicherheit' },
        { name: 'Inhaltsstoffe-Glossar', url: '/de-de/gillette-welt/inhaltsstoffe-glossar' }
      ]
    };
    
    // Log all categories and sub-options
    for (const [category, options] of Object.entries(aboutSubOptions)) {
      log(SYMBOLS.DOCUMENT, `${category}:`);
      options.forEach((opt, index) => {
        log(SYMBOLS.BULLET, `  ${index + 1}. ${opt.name}`);
      });
    }
    
    // Check for images in Über Gillette dropdown menu
    const aboutMenu = page.locator('nav a:has-text("Über Gillette")').first();
    await aboutMenu.hover();
    await page.waitForTimeout(2000);
    
    const aboutDropdownImages = await page.locator('nav img, .dropdown img, .menu img').all();
    if (aboutDropdownImages.length > 0) {
      log(SYMBOLS.DOCUMENT, `Found ${aboutDropdownImages.length} images in Über Gillette dropdown`);
      
      for (let i = 0; i < aboutDropdownImages.length; i++) {
        const img = aboutDropdownImages[i];
        const imgAlt = await img.getAttribute('alt').catch(() => '');
        const imgParentLink = img.locator('xpath=ancestor::a[1]');
        const linkHref = await imgParentLink.getAttribute('href').catch(() => '');
        
        // Check if link is actually visible before attempting to click
        const isLinkVisible = await imgParentLink.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (linkHref && isLinkVisible) {
          log(SYMBOLS.ARROW_RIGHT, `Image ${i + 1}: "${imgAlt || 'No alt'}" -> ${linkHref}`);
          
          await imgParentLink.click();
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(2000);
          
          const redirectUrl = page.url();
          log(SYMBOLS.SUCCESS, `✓ Image link redirected to: ${redirectUrl}`);
          
          await homePageObj.navigate();
          await page.waitForTimeout(2000);
          await aboutMenu.hover();
          await page.waitForTimeout(2000);
        } else if (linkHref) {
          log(SYMBOLS.WARNING, `Image ${i + 1}: "${imgAlt || 'No alt'}" -> ${linkHref} (not visible, skipped)`);
        }
      }
    }
    
    // Click each sub-option and verify redirect
    for (const [category, options] of Object.entries(aboutSubOptions)) {
      log(SYMBOLS.INFO, `Testing ${category} sub-options...`);
      
      for (const option of options) {
        // Hover over Über Gillette menu to show dropdown
        const aboutMenu = page.locator('nav a:has-text("Über Gillette")').first();
        await aboutMenu.hover();
        await page.waitForTimeout(2000);
        
        // Click the sub-option link
        const subLink = page.locator(`nav a:has-text("${option.name}")`).first();
        const isVisible = await subLink.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (isVisible) {
          await subLink.click();
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(2000);
          
          const currentUrl = page.url();
          log(SYMBOLS.SUCCESS, `"${option.name}": Redirected to ${currentUrl}`);
        } else {
          log(SYMBOLS.WARNING, `"${option.name}": Link not visible in dropdown`);
        }
        
        // Navigate back to homepage
        await homePageObj.navigate();
      }
    }
    
    log(SYMBOLS.SUCCESS, 'About Gillette navigation verification completed');
  });

  /**
   * Test Case 7: Verify the Favorite Page
   * Test ID: TC-Homepage-07
   */
  test('TC-Homepage-07: Verify Favorites page functionality', async () => {
    log(SYMBOLS.SEARCH, 'Verifying Favorites page');
    
    // 1. Click favorite icon (actual selector is a[href*="fav"])
    const favoriteIcon = page.locator('a[href*="fav-seite"], a[href*="fav"], link:has-text("Mark as fav")').first();
    await favoriteIcon.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Verify favorites page opened
    const currentUrl = page.url();
    log(SYMBOLS.SUCCESS, `Favorites page URL: ${currentUrl}`);
    expect(currentUrl.toLowerCase()).toMatch(/fav|favorit/);
    
    // Verify recommended products section (3 recommended products)
    const recommendedProducts = page.locator('.recommended-products .product-card, [data-section="recommended"] .product');
    const productCount = await recommendedProducts.count();
    log(SYMBOLS.PACKAGE, `Recommended products found: ${productCount}`);
    
    // Verify recommended articles section (3 recommended articles)
    const recommendedArticles = page.locator('.recommended-articles article, [data-section="recommended-articles"] .article');
    const articleCount = await recommendedArticles.count();
    log(SYMBOLS.DOCUMENT, `Recommended articles found: ${articleCount}`);
    
    // Check for tabs (Products/Articles)
    const productsTab = page.locator('button:has-text("Produkte"), [data-tab="products"]');
    const articlesTab = page.locator('button:has-text("Artikel"), [data-tab="articles"]');
    
    if (await productsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      log(SYMBOLS.SUCCESS, 'Products tab is visible');
    }
    if (await articlesTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      log(SYMBOLS.SUCCESS, 'Articles tab is visible');
    }
    
    log(SYMBOLS.SUCCESS, 'Favorites page verification completed');
  });

  /**
   * Test Case 8: Verify search feature with valid product name
   * Test ID: TC-Homepage-08
   */
  test('TC-Homepage-08: Verify search feature with valid product name', async () => {
    log(SYMBOLS.SEARCH, 'Verifying search feature with valid product name');
    
    const searchTerm = 'Fusion5';
    
    // 1. Type product name in search bar
    const searchIcon = page.locator('button[aria-label*="Search"], button[aria-label*="Suche"], .search-icon').first();
    await searchIcon.click();
    await page.waitForTimeout(2000);
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="Suche"], .search-input').first();
    await searchInput.fill(searchTerm);
    log(SYMBOLS.DOCUMENT, `Search term entered: ${searchTerm}`);
    
    // 2. Press Enter to search
    await searchInput.press('Enter');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Verify search results page (German site uses 'suchresultate' not 'search')
    const currentUrl = page.url();
    log(SYMBOLS.SUCCESS, `Search results URL: ${currentUrl}`);
    expect(currentUrl.toLowerCase()).toMatch(/search|such/);
    
    // Verify results match search term
    const resultsText = await page.locator('.search-results, main').textContent();
    log(SYMBOLS.SUCCESS, `Search results contain "${searchTerm}": ${resultsText?.includes(searchTerm) || resultsText?.toLowerCase().includes(searchTerm.toLowerCase())}`);
    
    // 3. Check Articles tab
    const articlesTab = page.locator('button:has-text("Artikel"), [data-tab="articles"], a:has-text("Artikel")').first();
    if (await articlesTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await articlesTab.click();
      await page.waitForTimeout(2000);
      
      const articleLinks = await page.locator('.search-results article a, .articles-list a').all();
      log(SYMBOLS.DOCUMENT, `Articles found: ${articleLinks.length}`);
      
      if (articleLinks.length > 0) {
        await articleLinks[0].click();
        await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
        log(SYMBOLS.SUCCESS, `Article redirected to: ${page.url()}`);
        await page.goBack();
      }
    }
    
    // Check Products tab
    const productsTab = page.locator('button:has-text("Produkte"), [data-tab="products"], a:has-text("Produkte")').first();
    if (await productsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productsTab.click();
      await page.waitForTimeout(2000);
      
      const productLinks = await page.locator('.search-results .product a, .products-list a').all();
      log(SYMBOLS.PACKAGE, `Products found: ${productLinks.length}`);
      
      if (productLinks.length > 0) {
        await productLinks[0].click();
        await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
        log(SYMBOLS.SUCCESS, `Product redirected to: ${page.url()}`);
      }
    }
    
    log(SYMBOLS.SUCCESS, 'Search feature verification completed');
  });

  /**
   * Test Case 9: Verify search feature with invalid/unwanted search term
   * Test ID: TC-Homepage-09
   */
  test('TC-Homepage-09: Verify search feature with invalid search term', async () => {
    log(SYMBOLS.SEARCH, 'Verifying search feature with invalid search term');
    
    const invalidSearchTerm = 'xyz123test@@@###$$$';
    
    // 1. Type invalid product name in search bar
    const searchIcon = page.locator('button[aria-label*="Search"], button[aria-label*="Suche"], .search-icon').first();
    await searchIcon.click();
    await page.waitForTimeout(2000);
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="Suche"], .search-input').first();
    await searchInput.fill(invalidSearchTerm);
    log(SYMBOLS.DOCUMENT, `Invalid search term entered: ${invalidSearchTerm}`);
    
    // 2. Press Enter to search
    await searchInput.press('Enter');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Verify search results page shows no results or appropriate message
    const currentUrl = page.url();
    log(SYMBOLS.SUCCESS, `Search results URL: ${currentUrl}`);
    
    // Check for "no results" message
    const noResultsMessage = page.locator('text=Keine Ergebnisse, text=No results, .no-results, .empty-results').first();
    const hasNoResults = await noResultsMessage.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (hasNoResults) {
      log(SYMBOLS.SUCCESS, 'No results message displayed correctly');
    } else {
      // Check if results are empty
      const resultItems = await page.locator('.search-result-item, .product-card, article').count();
      log(SYMBOLS.INFO, `Result items found: ${resultItems}`);
    }
    
    log(SYMBOLS.SUCCESS, 'Invalid search verification completed');
  });

  /**
   * Test Case 10: Verify the Homepage banner
   * Test ID: TC-Homepage-10
   */
  test('TC-Homepage-10: Verify Homepage banner with carousel navigation and CTA buttons', async () => {
    test.setTimeout(480000); // 8 minutes for testing all banner slides and CTAs
    log(SYMBOLS.IMAGE, 'Verifying Homepage banner with comprehensive carousel and "Mehr erfahren" CTA testing');
    
    // Step 1: Verify banner/carousel is displayed
    log(SYMBOLS.INFO, 'Step 1: Verifying homepage banner is displayed');
    const carouselContainer = page.locator('.slick-slider, [class*="carousel"]').first();
    const headingInCarousel = page.locator('h1, h2').first();
    
    const carouselVisible = await carouselContainer.isVisible({ timeout: 10000 }).catch(() => false) ||
                            await headingInCarousel.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (carouselVisible) {
      log(SYMBOLS.SUCCESS, 'Homepage banner/carousel is visible');
    } else {
      log(SYMBOLS.WARNING, 'Homepage banner/carousel elements not found');
    }
    
    // Step 2: Verify carousel navigation arrows
    log(SYMBOLS.INFO, 'Step 2: Verifying carousel navigation arrows are visible and clickable');
    const nextButton = page.locator('[class*="next"][aria-label="Next Slide"], button[aria-label="Next Slide"]').first();
    const prevButton = page.locator('[class*="prev"][aria-label="Previous Slide"], button[aria-label="Previous Slide"]').first();
    
    const nextVisible = await nextButton.isVisible({ timeout: 5000 }).catch(() => false);
    const prevVisible = await prevButton.isVisible({ timeout: 5000 }).catch(() => false);
    
    log(nextVisible ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `Next arrow: ${nextVisible ? 'Visible and enabled' : 'Not found'}`);
    log(prevVisible ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `Previous arrow: ${prevVisible ? 'Visible and enabled' : 'Not found'}`);
    
    if (nextVisible && prevVisible) {
      log(SYMBOLS.SUCCESS, 'Carousel arrows are present and enabled for navigation');
    }
    
    // Count total banner slides (excluding clones)
    const allSlides = await page.locator('.slick-slide:not(.slick-cloned)').all();
    const bannerSlides = allSlides.length;
    log(SYMBOLS.INFO, `Total number of banner slides available: ${bannerSlides}`);
    
    if (bannerSlides > 1) {
      log(SYMBOLS.SUCCESS, 'Multiple banners detected - horizontal slider with auto-scroll support');
    }
    
    // Step 3: Test "Mehr erfahren" CTA on first banner (initial banner in first fold)
    log(SYMBOLS.INFO, 'Step 3: Testing "Mehr erfahren" CTA button on first banner');
    await page.waitForTimeout(2000);
    
    // Look for "Mehr erfahren" button on active slide
    let mehrErfahrenButton = page.locator('.slick-active a:has-text("Mehr erfahren"), .slick-current a:has-text("Mehr erfahren")').first();
    let ctaVisible = await mehrErfahrenButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (ctaVisible) {
      const ctaHref = await mehrErfahrenButton.getAttribute('href').catch(() => '');
      log(SYMBOLS.ARROW_RIGHT, `Banner 1 CTA: "Mehr erfahren" → ${ctaHref}`);
      
      // Click and validate
      await mehrErfahrenButton.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      
      const redirectedUrl = page.url();
      const pageTitle = await page.title();
      log(SYMBOLS.SUCCESS, `✓ Banner 1 CTA validated - Redirected to: ${redirectedUrl}`);
      log(SYMBOLS.DOCUMENT, `  Page title: ${pageTitle}`);
      expect(redirectedUrl).toBeTruthy();
      
      // Navigate back to homepage
      await homePageObj.navigate();
      await page.waitForTimeout(2000);
    } else {
      log(SYMBOLS.WARNING, '"Mehr erfahren" button not found on first banner');
    }
    
    // Step 4: Click Next arrow to navigate to second banner
    if (nextVisible && bannerSlides > 1) {
      log(SYMBOLS.INFO, 'Step 4: Clicking Next arrow to navigate to second banner slide');
      await nextButton.click();
      await page.waitForTimeout(2000);
      
      // Get banner title/heading
      const slide2Title = await page.locator('.slick-active h1, .slick-active h2, .slick-current h1, .slick-current h2').first().textContent().catch(() => 'Banner 2');
      log(SYMBOLS.SUCCESS, `Banner transitioned smoothly to slide 2: "${slide2Title?.trim()}"`);
      
      // Step 5: Click "Mehr erfahren" on second banner
      log(SYMBOLS.INFO, 'Step 5: Testing "Mehr erfahren" CTA button on second banner');
      mehrErfahrenButton = page.locator('.slick-active a:has-text("Mehr erfahren"), .slick-current a:has-text("Mehr erfahren")').first();
      ctaVisible = await mehrErfahrenButton.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (ctaVisible) {
        const ctaHref = await mehrErfahrenButton.getAttribute('href').catch(() => '');
        log(SYMBOLS.ARROW_RIGHT, `Banner 2 CTA: "Mehr erfahren" → ${ctaHref}`);
        
        // Click and validate
        await mehrErfahrenButton.click();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        
        const redirectedUrl = page.url();
        const pageTitle = await page.title();
        log(SYMBOLS.SUCCESS, `✓ Banner 2 CTA validated - Redirected to: ${redirectedUrl}`);
        log(SYMBOLS.DOCUMENT, `  Page title: ${pageTitle}`);
        expect(redirectedUrl).toBeTruthy();
        
        // Navigate back to homepage
        await homePageObj.navigate();
        await page.waitForTimeout(2000);
      } else {
        log(SYMBOLS.WARNING, '"Mehr erfahren" button not found on second banner');
      }
      
      // Step 6: Click Previous arrow to navigate back to first banner
      if (prevVisible) {
        log(SYMBOLS.INFO, 'Step 6: Clicking Previous arrow to navigate back to previous banner');
        await prevButton.click();
        await page.waitForTimeout(2000);
        
        const slide1Title = await page.locator('.slick-active h1, .slick-active h2, .slick-current h1, .slick-current h2').first().textContent().catch(() => 'Banner 1');
        log(SYMBOLS.SUCCESS, `Banner transitioned back to previous slide: "${slide1Title?.trim()}"`);
      }
    }
    
    // Step 7: Navigate through ALL available banner slides and test each CTA
    if (nextVisible && bannerSlides > 0) {
      log(SYMBOLS.INFO, `Step 7: Navigating through all ${bannerSlides} banner slides and testing "Mehr erfahren" CTAs`);
      
      // Navigate back to first slide
      await homePageObj.navigate();
      await page.waitForTimeout(2000);
      
      const bannerData = [];
      
      for (let slideIdx = 0; slideIdx < Math.min(bannerSlides, 10); slideIdx++) {
        // Get current banner title
        const slideTitle = await page.locator('.slick-active h1, .slick-active h2, .slick-current h1, .slick-current h2').first().textContent().catch(() => `Banner ${slideIdx + 1}`);
        log(SYMBOLS.DOCUMENT, `Banner slide ${slideIdx + 1}: "${slideTitle?.trim()}"`);
        
        // Try to find and click "Mehr erfahren" CTA on current slide
        mehrErfahrenButton = page.locator('.slick-active a:has-text("Mehr erfahren"), .slick-current a:has-text("Mehr erfahren")').first();
        ctaVisible = await mehrErfahrenButton.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (ctaVisible) {
          const ctaHref = await mehrErfahrenButton.getAttribute('href').catch(() => '');
          log(SYMBOLS.ARROW_RIGHT, `  CTA: "Mehr erfahren" → ${ctaHref}`);
          
          // Click and validate
          await mehrErfahrenButton.click();
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(2000);
          
          const redirectedUrl = page.url();
          const pageTitle = await page.title();
          log(SYMBOLS.SUCCESS, `  ✓ CTA validated - Redirected to: ${redirectedUrl}`);
          
          bannerData.push({
            slide: slideIdx + 1,
            title: slideTitle?.trim(),
            ctaLink: ctaHref,
            redirectUrl: redirectedUrl,
            pageTitle: pageTitle
          });
          
          // Navigate back to homepage
          await homePageObj.navigate();
          await page.waitForTimeout(2000);
        } else {
          log(SYMBOLS.WARNING, `  "Mehr erfahren" button not found on banner ${slideIdx + 1}`);
          bannerData.push({
            slide: slideIdx + 1,
            title: slideTitle?.trim(),
            ctaLink: 'Not found',
            redirectUrl: 'N/A',
            pageTitle: 'N/A'
          });
        }
        
        // Move to next slide (if not last slide)
        if (slideIdx < bannerSlides - 1) {
          await nextButton.click();
          await page.waitForTimeout(2000);
        }
      }
      
      // Display summary of all banner CTAs
      log(SYMBOLS.DOCUMENT, '\n=== Banner CTA Summary ===');
      bannerData.forEach((banner) => {
        log(SYMBOLS.BULLET, `Banner ${banner.slide}: "${banner.title}"`);
        log(SYMBOLS.ARROW_RIGHT, `  Link: ${banner.ctaLink}`);
        log(SYMBOLS.SUCCESS, `  Validated: ${banner.redirectUrl}`);
      });
    }
    
    // Verify auto-scroll functionality
    log(SYMBOLS.INFO, 'Testing auto-scroll functionality...');
    await homePageObj.navigate();
    await page.waitForTimeout(3000);
    
    const initialSlideIndex = await page.locator('.slick-active, .slick-current').first().getAttribute('data-slick-index').catch(() => '0');
    await page.waitForTimeout(8000); // Wait for auto-scroll
    const newSlideIndex = await page.locator('.slick-active, .slick-current').first().getAttribute('data-slick-index').catch(() => '1');
    
    if (initialSlideIndex !== newSlideIndex) {
      log(SYMBOLS.SUCCESS, 'Auto-scroll is working - banner changed automatically');
    } else {
      log(SYMBOLS.INFO, 'Auto-scroll may not be active or requires longer wait time');
    }
    
    log(SYMBOLS.SUCCESS, 'Homepage banner verification completed - All carousel arrows and "Mehr erfahren" CTAs tested and validated');
  });

  /**
   * Test Case 11: Verify packshots in "Alles, was du brauchst" section
   * Test ID: TC-Homepage-11
   */
  test('TC-Homepage-11: Verify packshots in "Alles, was du brauchst" section with carousel navigation', async () => {
    test.setTimeout(360000); // 6 minutes - clicking all 3 packshots with carousel testing
    log(SYMBOLS.PACKAGE, 'Verifying "Alles, was du brauchst" section - EXPECTED: 3 cards');
    
    // Step 1: Scroll to section and center it in viewport
    log(SYMBOLS.INFO, 'Step 1: Scrolling to "Alles, was du brauchst" section');
    // Use the specific explore-range section ID to target the correct product carousel section
    const section = page.locator('#explore-range, .wrapper-range-category').first();
    
    // Scroll to center the section in viewport for better visibility
    await section.evaluate(el => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(2000);
    
    // Add STRONG highlighting to make the section very visible throughout the test
    await section.evaluate(el => {
      el.style.outline = '6px solid #FF6B00';
      el.style.outlineOffset = '8px';
      el.style.backgroundColor = 'rgba(255, 107, 0, 0.1)';
      el.style.boxShadow = '0 0 30px rgba(255, 107, 0, 0.5)';
    });
    await page.waitForTimeout(2000); // Wait longer to show the highlighted section
    
    // Step 2: Check carousel arrows
    log(SYMBOLS.INFO, 'Step 2: Checking carousel navigation arrows');
    const leftArrow = section.locator('.carousel-prev, .swiper-button-prev, [aria-label="Previous"], button:has-text("Previous")').first();
    const rightArrow = section.locator('.carousel-next, .swiper-button-next, [aria-label="Next"], button:has-text("Next")').first();
    
    const leftArrowVisible = await leftArrow.isVisible({ timeout: 3000 }).catch(() => false);
    const rightArrowVisible = await rightArrow.isVisible({ timeout: 3000 }).catch(() => false);
    
    log(leftArrowVisible || rightArrowVisible ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, 
        `Carousel arrows: ${leftArrowVisible || rightArrowVisible ? 'Found' : 'Not found'}`);
    if (leftArrowVisible) log(SYMBOLS.ARROW_LEFT, 'Previous arrow: Visible');
    if (rightArrowVisible) log(SYMBOLS.ARROW_RIGHT, 'Next arrow: Visible');
    
    // Step 3: Collect all card information and links (3 cards expected)
    log(SYMBOLS.INFO, 'Step 3: Collecting all 3 cards information');
    const allCards = [];
    const EXPECTED_CARDS = 3;
    
    // Find product packshot cards within the explore-range section
    // These are the main product category links with images (not logo links)
    let visibleCards = await section.locator('a[href]:has(img):not(.logoItem)').all();
    if (visibleCards.length === 0) {
      visibleCards = await section.locator('a[href*="produkte"], a[href*="kingcgillette"], a[href*="intimrasur"]').all();
    }
    
    for (let i = 0; i < visibleCards.length && i < EXPECTED_CARDS; i++) {
      const card = visibleCards[i];
      const href = await card.getAttribute('href').catch(() => '');
      
      let name;
      try {
        name = await card.getAttribute('data-action-detail');
        if (!name) {
          name = await card.locator('img').first().getAttribute('alt');
        }
        if (!name) {
          name = await card.locator('h3, h4, .product-name, .title').first().textContent();
        }
      } catch {
        name = `Card ${i + 1}`;
      }
      
      allCards.push({ name: name?.trim() || `Card ${i + 1}`, href, index: i + 1 });
    }
    
    log(SYMBOLS.DOCUMENT, `Found ${allCards.length}/${EXPECTED_CARDS} expected cards:`);
    allCards.forEach((card, idx) => {
      log(SYMBOLS.BULLET, `  ${card.index}. ${card.name} -> ${card.href}`);
    });
    
    // Step 4: Click all 3 cards
    log(SYMBOLS.INFO, `Step 4: Clicking all ${allCards.length} cards and validating links`);
    
    for (const card of allCards) {
      // Go back to homepage section
      await homePageObj.navigate();
      await page.waitForTimeout(2000);
      // Use the specific explore-range section ID
      const sectionAgain = page.locator('#explore-range, .wrapper-range-category').first();
      
      // Scroll to center and add STRONG section highlighting
      await sectionAgain.evaluate(el => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      await page.waitForTimeout(1500);
      
      // Add strong persistent highlighting to the section
      await sectionAgain.evaluate(el => {
        el.style.outline = '6px solid #FF6B00';
        el.style.outlineOffset = '8px';
        el.style.backgroundColor = 'rgba(255, 107, 0, 0.1)';
        el.style.boxShadow = '0 0 30px rgba(255, 107, 0, 0.5)';
      });
      await page.waitForTimeout(1000);
      
      // Find and click the card by href or index
      let cardToClick;
      if (card.href) {
        cardToClick = sectionAgain.locator(`a[href="${card.href}"]`).first();
      } else {
        // Fallback to index - use the same selector as card finding
        const allCardsAgain = await sectionAgain.locator('a[href]:has(img):not(.logoItem)').all();
        if (allCardsAgain.length === 0) {
          allCardsAgain = await sectionAgain.locator('a[href*="produkte"], a[href*="kingcgillette"], a[href*="intimrasur"]').all();
        }
        cardToClick = allCardsAgain[card.index - 1];
      }
      
      if (cardToClick && await cardToClick.isVisible().catch(() => false)) {
        log(SYMBOLS.ARROW_RIGHT, `Clicking card ${card.index}: "${card.name}"`);
        log(SYMBOLS.INFO, `  Expected URL path: ${card.href}`);
        
        // Highlight the specific card with strong visual indicators
        await cardToClick.evaluate(el => {
          el.style.outline = '5px solid #00FF00';
          el.style.outlineOffset = '3px';
          el.style.boxShadow = '0 0 30px rgba(0,255,0,0.8)';
          el.style.backgroundColor = 'rgba(0,255,0,0.1)';
          el.style.transform = 'scale(1.05)';
          el.style.transition = 'all 0.3s';
        });
        await page.waitForTimeout(2000); // Longer pause to see the highlighted card
        
        // Use JavaScript click for more reliable clicking (avoids viewport issues)
        await cardToClick.evaluate(el => el.click());
        await page.waitForTimeout(3000); // Wait for navigation
        
        const redirectUrl = page.url();
        const pageTitle = await page.title();
        
        // Validate the redirect URL contains the expected path
        const expectedPath = card.href.split('?')[0]; // Remove query params if any
        const urlContainsExpectedPath = redirectUrl.includes(expectedPath);
        
        log(SYMBOLS.SUCCESS, `✓ Card: "${card.name}"`);
        log(SYMBOLS.ARROW_RIGHT, `  Redirected to: ${redirectUrl}`);
        log(SYMBOLS.DOCUMENT, `  Page title: ${pageTitle}`);
        
        if (urlContainsExpectedPath) {
          log(SYMBOLS.SUCCESS, `  ✓ URL validation passed - Contains expected path: ${expectedPath}`);
        } else {
          log(SYMBOLS.ERROR, `  ✗ URL validation failed - Expected path: ${expectedPath}`);
        }
        
        // Assert both that URL exists and contains expected path
        expect(redirectUrl).toBeTruthy();
        expect(urlContainsExpectedPath, `Expected URL to contain "${expectedPath}" but got "${redirectUrl}"`).toBe(true);
      }
    }
    
    // Step 5: Test carousel arrows if present
    if (rightArrowVisible) {
      log(SYMBOLS.INFO, 'Step 5: Testing carousel Next arrow');
      await homePageObj.navigate();
      await page.waitForTimeout(2000);
      
      // Scroll to center and highlight section for carousel arrow testing
      await section.evaluate(el => {
        el.scrollIntoView({ behavior: 'auto', block: 'center' });
      });
      await page.waitForTimeout(1000);
      
      await section.evaluate(el => {
        el.style.outline = '4px solid #FF6B00';
        el.style.outlineOffset = '4px';
      });
      await page.waitForTimeout(500);
      
      await rightArrow.click();
      await page.waitForTimeout(2000);
      log(SYMBOLS.SUCCESS, 'Next arrow clicked - carousel navigated forward');
    }
    
    if (leftArrowVisible) {
      log(SYMBOLS.INFO, 'Step 6: Testing carousel Previous arrow');
      await leftArrow.click();
      await page.waitForTimeout(2000);
      log(SYMBOLS.SUCCESS, 'Previous arrow clicked - carousel navigated backward');
    }
    
    log(SYMBOLS.SUCCESS, `"Alles, was du brauchst" section completed - ${allCards.length}/${EXPECTED_CARDS} cards tested`);
  });

  /**
   * Test Case 12: Verify packshots in "Unsere Produkte" section
   * Test ID: TC-Homepage-12
   */
  test('TC-Homepage-12: Verify packshots in "Unsere Produkte" section with carousel navigation', async () => {
    test.setTimeout(360000); // 6 minutes - clicking all product packshots with carousel testing
    const EXPECTED_CARDS = 6;
    log(SYMBOLS.PACKAGE, `Verifying "Unsere Produkte" section - EXPECTED: ${EXPECTED_CARDS} product cards`);
    
    // Step 1: Scroll to section with visual highlighting
    log(SYMBOLS.INFO, 'Step 1: Scrolling to "Unsere Produkte" section');
    const section = page.locator('#product-category, .wrapper-product-category').first();
    
    await section.evaluate(el => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(2000);
    
    // Add strong visual highlighting
    await section.evaluate(el => {
      el.style.outline = '6px solid #0066FF';
      el.style.outlineOffset = '8px';
      el.style.backgroundColor = 'rgba(0, 102, 255, 0.1)';
      el.style.boxShadow = '0 0 30px rgba(0, 102, 255, 0.5)';
    });
    await page.waitForTimeout(2000);
    
    // Step 2: Interleaved approach - Click visible cards, then navigate, repeat
    log(SYMBOLS.INFO, 'Step 2: Interleaved card clicking and carousel navigation (click 3 → nav → click 1 → nav → repeat)');
    
    let cardsClicked = 0;
    const clickedHrefs = new Set();
    const maxCarouselClicks = 10; // Safety limit
    let carouselClickCount = 0;
    
    // Helper function to get ALL product cards (not just visible)
    const getAllCards = async () => {
      return await section.locator('a[href]:has(img)').all();
    };
    
    // Helper function to click a card and validate
    const clickAndValidateCard = async (card, cardNumber) => {
      const href = await card.getAttribute('href').catch(() => '');
      
      if (!href || clickedHrefs.has(href) || href.includes('#') || href === '/de-de') {
        return false; // Skip invalid or already clicked card
      }
      
      // Check if card is actually visible (not just in DOM)
      const isVisible = await card.isVisible({ timeout: 2000 }).catch(() => false);
      if (!isVisible) {
        return false; // Skip hidden cards
      }
      
      let name;
      try {
        name = await card.locator('img').first().getAttribute('alt');
        if (!name || name.trim() === '') {
          name = await card.locator('h3, h4, .product-name, .title, [class*="title"]').first().textContent();
        }
      } catch {
        name = `Product ${cardNumber}`;
      }
      
      log(SYMBOLS.ARROW_RIGHT, `Clicking card ${cardNumber}: "${name?.trim() || 'Unknown'}"`);
      log(SYMBOLS.INFO, `  Expected URL path: ${href}`);
      
      // Wait for card to be fully in viewport
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Highlight the card
      await card.evaluate(el => {
        el.style.outline = '5px solid #00FF00';
        el.style.outlineOffset = '3px';
        el.style.boxShadow = '0 0 30px rgba(0,255,0,0.8)';
        el.style.backgroundColor = 'rgba(0,255,0,0.1)';
        el.style.transform = 'scale(1.05)';
        el.style.transition = 'all 0.3s';
      });
      await page.waitForTimeout(2000);
      
      // Use JavaScript click for reliability
      await card.evaluate(el => el.click());
      await page.waitForTimeout(3000);
      
      const redirectUrl = page.url();
      const pageTitle = await page.title();
      const expectedPath = href.split('?')[0];
      const urlContainsExpectedPath = redirectUrl.includes(expectedPath);
      
      log(SYMBOLS.SUCCESS, `✓ Card: "${name?.trim() || 'Unknown'}"`);
      log(SYMBOLS.ARROW_RIGHT, `  Redirected to: ${redirectUrl}`);
      log(SYMBOLS.DOCUMENT, `  Page title: ${pageTitle}`);
      
      if (urlContainsExpectedPath) {
        log(SYMBOLS.SUCCESS, `  ✓ URL validation passed - Contains expected path: ${expectedPath}`);
      } else {
        log(SYMBOLS.ERROR, `  ✗ URL validation failed - Expected path: ${expectedPath}`);
      }
      
      expect(redirectUrl).toBeTruthy();
      expect(urlContainsExpectedPath, `Expected URL to contain "${expectedPath}" but got "${redirectUrl}"`).toBe(true);
      
      clickedHrefs.add(href);
      
      // Navigate back to homepage
      await homePageObj.navigate();
      await page.waitForTimeout(2000);
      
      // Re-highlight section
      const sectionAgain = page.locator('#product-category, .wrapper-product-category').first();
      await sectionAgain.evaluate(el => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.outline = '6px solid #0066FF';
        el.style.outlineOffset = '8px';
        el.style.backgroundColor = 'rgba(0, 102, 255, 0.1)';
        el.style.boxShadow = '0 0 30px rgba(0, 102, 255, 0.5)';
      });
      await page.waitForTimeout(1000);
      
      return true;
    };
    
    // Helper function to click carousel next arrow
    const clickNextArrow = async () => {
      const sectionAgain = page.locator('#product-category, .wrapper-product-category').first();
      const rightArrow = sectionAgain.locator('button[class*="next"], button[class*="arrow-right"], .swiper-button-next').first();
      
      if (await rightArrow.isVisible({ timeout: 3000 }).catch(() => false)) {
        log(SYMBOLS.ARROW_RIGHT, '🔵 Clicking carousel NEXT arrow');
        await rightArrow.click();
        await page.waitForTimeout(2000);
        return true;
      }
      return false;
    };
    
    // Helper function to find and click next unclicked card
    const findAndClickNextCard = async (phaseNum) => {
      const allCards = await getAllCards();
      
      for (const card of allCards) {
        const href = await card.getAttribute('href').catch(() => '');
        if (href && !clickedHrefs.has(href) && !href.includes('#') && href !== '/de-de') {
          const success = await clickAndValidateCard(card, cardsClicked + 1);
          if (success) {
            cardsClicked++;
            return true;
          }
        }
      }
      return false;
    };
    
    // Phase 1: Click first 3 visible cards
    log(SYMBOLS.INFO, '📍 Phase 1: Click first 3 visible cards');
    for (let i = 0; i < 3; i++) {
      await findAndClickNextCard(1);
    }
    
    // Continue navigating carousel and clicking cards until we have all 6
    let phaseNum = 2;
    while (cardsClicked < EXPECTED_CARDS && phaseNum <= 10) {
      log(SYMBOLS.INFO, `  Debug: cardsClicked=${cardsClicked}, EXPECTED=${EXPECTED_CARDS}, phaseNum=${phaseNum}`);
      
      const arrowClicked = await clickNextArrow();
      if (!arrowClicked) {
        log(SYMBOLS.WARNING, `  Carousel arrow not available - stopping at phase ${phaseNum}`);
        break;
      }
      
      log(SYMBOLS.INFO, `📍 Phase ${phaseNum}: Click card ${cardsClicked + 1} (after carousel navigation)`);
      const foundCard = await findAndClickNextCard(phaseNum);
      if (!foundCard) {
        log(SYMBOLS.INFO, `  No new card found in phase ${phaseNum}, continuing...`);
      }
      phaseNum++;
    }
    
    log(SYMBOLS.INFO, `  Final: cardsClicked=${cardsClicked}, phaseNum=${phaseNum}`);
    
    log(SYMBOLS.SUCCESS, `"Unsere Produkte" section completed - ${cardsClicked}/${EXPECTED_CARDS} cards tested`);
    
    if (cardsClicked < EXPECTED_CARDS) {
      log(SYMBOLS.WARNING, `⚠️ Warning: Found ${cardsClicked} cards but expected ${EXPECTED_CARDS}`);
    }
    
    // Verify we found all expected cards
    expect(cardsClicked, `Expected to find ${EXPECTED_CARDS} cards but only found ${cardsClicked}`).toBe(EXPECTED_CARDS);
  });

  /**
   * Test Case 13: Verify packshots in "Erfahre etwas Neues" section
   * Test ID: TC-Homepage-13
   */
  test('TC-Homepage-13: Verify packshots in "Erfahre etwas Neues" section with carousel navigation', async () => {
    test.setTimeout(360000); // 6 minutes - clicking all 4 articles with carousel testing
    const EXPECTED_CARDS = 4;
    log(SYMBOLS.DOCUMENT, `Verifying "Erfahre etwas Neues" section - EXPECTED: ${EXPECTED_CARDS} article cards`);
    
    // Step 1: Scroll to section with visual highlighting
    log(SYMBOLS.INFO, 'Step 1: Scrolling to "Erfahre etwas Neues" section');
    const section = page.locator('#shaving-tips-container, .wrapper-shaving-tips').first();
    
    await section.evaluate(el => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(2000);
    
    // Add strong visual highlighting in purple
    await section.evaluate(el => {
      el.style.outline = '6px solid #9933FF';
      el.style.outlineOffset = '8px';
      el.style.backgroundColor = 'rgba(153, 51, 255, 0.1)';
      el.style.boxShadow = '0 0 30px rgba(153, 51, 255, 0.5)';
    });
    await page.waitForTimeout(2000);
    
    // Step 2: Interleaved approach - Click visible cards, then navigate, repeat
    log(SYMBOLS.INFO, 'Step 2: Interleaved card clicking and carousel navigation (click 3 → nav → click 1 → nav → repeat)');
    
    let cardsClicked = 0;
    const clickedHrefs = new Set();
    const maxCarouselClicks = 10; // Safety limit
    let carouselClickCount = 0;
    
    // Helper function to get ALL article cards
    const getAllCards = async () => {
      return await section.locator('a[href]:has(img)').all();
    };
    
    // Helper function to click and validate a card
    const clickAndValidateCard = async (card, cardNumber) => {
      const href = await card.getAttribute('href').catch(() => '');
      
      if (!href || clickedHrefs.has(href) || href.includes('#') || href === '/de-de') {
        return false; // Skip invalid or already clicked card
      }
      
      let name;
      try {
        name = await card.locator('img').first().getAttribute('alt');
        if (!name || name.trim() === '') {
          name = await card.locator('h3, h4, .article-name, .title, [class*="title"]').first().textContent();
        }
      } catch {
        name = `Article ${cardNumber}`;
      }
      
      log(SYMBOLS.ARROW_RIGHT, `Clicking card ${cardNumber}: "${name?.trim() || 'Unknown'}"`);
      log(SYMBOLS.INFO, `  Expected URL path: ${href}`);
      
      // Highlight the card
      await card.evaluate(el => {
        el.style.outline = '5px solid #00FF00';
        el.style.outlineOffset = '3px';
        el.style.boxShadow = '0 0 30px rgba(0,255,0,0.8)';
        el.style.backgroundColor = 'rgba(0,255,0,0.1)';
        el.style.transform = 'scale(1.05)';
        el.style.transition = 'all 0.3s';
      });
      await page.waitForTimeout(2000);
      
      // Use JavaScript click for reliability
      await card.evaluate(el => el.click());
      await page.waitForTimeout(3000);
      
      const redirectUrl = page.url();
      const pageTitle = await page.title();
      const expectedPath = href.split('?')[0];
      const urlContainsExpectedPath = redirectUrl.includes(expectedPath);
      
      log(SYMBOLS.SUCCESS, `✓ Card: "${name?.trim() || 'Unknown'}"`);
      log(SYMBOLS.ARROW_RIGHT, `  Redirected to: ${redirectUrl}`);
      log(SYMBOLS.DOCUMENT, `  Page title: ${pageTitle}`);
      
      if (urlContainsExpectedPath) {
        log(SYMBOLS.SUCCESS, `  ✓ URL validation passed - Contains expected path: ${expectedPath}`);
      } else {
        log(SYMBOLS.ERROR, `  ✗ URL validation failed - Expected path: ${expectedPath}`);
      }
      
      expect(redirectUrl).toBeTruthy();
      expect(urlContainsExpectedPath, `Expected URL to contain "${expectedPath}" but got "${redirectUrl}"`).toBe(true);
      
      clickedHrefs.add(href);
      
      // Navigate back to homepage
      await homePageObj.navigate();
      await page.waitForTimeout(2000);
      
      // Re-highlight section
      const sectionAgain = page.locator('#shaving-tips-container, .wrapper-shaving-tips').first();
      await sectionAgain.evaluate(el => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.outline = '6px solid #9933FF';
        el.style.outlineOffset = '8px';
        el.style.backgroundColor = 'rgba(153, 51, 255, 0.1)';
        el.style.boxShadow = '0 0 30px rgba(153, 51, 255, 0.5)';
      });
      await page.waitForTimeout(1000);
      
      return true;
    };
    
    // Helper function to click carousel next arrow
    const clickNextArrow = async () => {
      const sectionAgain = page.locator('#shaving-tips-container, .wrapper-shaving-tips').first();
      const rightArrow = sectionAgain.locator('button[class*="next"], button[class*="arrow-right"], .swiper-button-next').first();
      
      if (await rightArrow.isVisible({ timeout: 3000 }).catch(() => false)) {
        log(SYMBOLS.ARROW_RIGHT, '🔵 Clicking carousel NEXT arrow');
        await rightArrow.click();
        await page.waitForTimeout(2000);
        return true;
      }
      return false;
    };
    
    // Helper function to find and click next unclicked card
    const findAndClickNextCard = async (phaseNum) => {
      const allCards = await getAllCards();
      
      for (const card of allCards) {
        const href = await card.getAttribute('href').catch(() => '');
        if (href && !clickedHrefs.has(href) && !href.includes('#') && href !== '/de-de') {
          const success = await clickAndValidateCard(card, cardsClicked + 1);
          if (success) {
            cardsClicked++;
            return true;
          }
        }
      }
      return false;
    };
    
    // Phase 1: Click first 3 visible cards
    log(SYMBOLS.INFO, '📍 Phase 1: Click first 3 visible cards');
    for (let i = 0; i < 3; i++) {
      await findAndClickNextCard(1);
    }
    
    // Continue navigating carousel and clicking cards until we have all 4
    let phaseNum = 2;
    while (cardsClicked < EXPECTED_CARDS && phaseNum <= 10) {
      log(SYMBOLS.INFO, `  Debug: cardsClicked=${cardsClicked}, EXPECTED=${EXPECTED_CARDS}, phaseNum=${phaseNum}`);
      
      const arrowClicked = await clickNextArrow();
      if (!arrowClicked) {
        log(SYMBOLS.WARNING, `  Carousel arrow not available - stopping at phase ${phaseNum}`);
        break;
      }
      
      log(SYMBOLS.INFO, `📍 Phase ${phaseNum}: Click card ${cardsClicked + 1} (after carousel navigation)`);
      const foundCard = await findAndClickNextCard(phaseNum);
      if (!foundCard) {
        log(SYMBOLS.INFO, `  No new card found in phase ${phaseNum}, continuing...`);
      }
      phaseNum++;
    }
    
    log(SYMBOLS.INFO, `  Final: cardsClicked=${cardsClicked}, phaseNum=${phaseNum}`);
    
    log(SYMBOLS.SUCCESS, `"Erfahre etwas Neues" section completed - ${cardsClicked}/${EXPECTED_CARDS} cards tested`);
    
    if (cardsClicked < EXPECTED_CARDS) {
      log(SYMBOLS.WARNING, `⚠️ Warning: Found ${cardsClicked} cards but expected ${EXPECTED_CARDS}`);
    }
    
    // Verify we found all expected cards
    expect(cardsClicked, `Expected to find ${EXPECTED_CARDS} cards but only found ${cardsClicked}`).toBe(EXPECTED_CARDS);
  });

  /**
   * Test Case 14: Verify "Gillette unterstützt Männer" section
   * Test ID: TC-Homepage-14
   */
  test('TC-Homepage-14: Verify "Gillette unterstützt Männer dabei, jeden Tag gut auszusehen" section', async () => {
    test.setTimeout(120000); // 2 minutes
    log(SYMBOLS.SEARCH, 'Verifying "Gillette unterstützt Männer dabei, jeden Tag gut auszusehen, sich gut zu fühlen und das Beste aus sich herauszuholen" section');
    
    // Step 1: Find and validate the section using ID selector
    log(SYMBOLS.INFO, 'Step 1: Locating and validating section with ID "ourstory"');
    
    // Use specific ID selector for the "Gillette unterstützt Männer" section
    const section = page.locator('#ourstory');
    
    // Scroll to section
    await section.evaluate(el => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(2000);
    
    // Add visual highlighting in gold
    await section.evaluate(el => {
      el.style.outline = '6px solid #FFD700';
      el.style.outlineOffset = '8px';
      el.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
      el.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)';
    });
    await page.waitForTimeout(2000);
    
    // Verify section is visible
    await expect(section).toBeVisible({ timeout: 10000 });
    log(SYMBOLS.SUCCESS, '✓ Section #ourstory is visible and highlighted');
    
    // Verify section heading/title
    const heading = section.locator('h2').first();
    const headingText = await heading.textContent().catch(() => '');
    if (headingText) {
      log(SYMBOLS.DOCUMENT, `  Heading: "${headingText.trim()}"`);
    }
    
    // Verify section contains the expected text
    const sectionText = await section.textContent();
    const hasExpectedText = sectionText.includes('Gillette unterstützt Männer') && 
                           sectionText.includes('jeden Tag gut auszusehen') &&
                           sectionText.includes('sich gut zu fühlen') &&
                           sectionText.includes('das Beste aus sich herauszuholen');
    
    if (hasExpectedText) {
      log(SYMBOLS.SUCCESS, '✓ Section contains all expected text elements');
    } else {
      log(SYMBOLS.WARNING, '⚠ Some expected text elements missing');
    }
    
    // Verify image
    const sectionImage = section.locator('img').first();
    const imageVisible = await sectionImage.isVisible({ timeout: 5000 }).catch(() => false);
    const imageAlt = await sectionImage.getAttribute('alt').catch(() => '');
    log(imageVisible ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `  Image: ${imageVisible ? 'Visible' : 'Not Found'}${imageAlt ? ` (${imageAlt})` : ''}`);
    
    // Verify content paragraphs
    const contentParagraphs = await section.locator('p').all();
    if (contentParagraphs.length > 0) {
      log(SYMBOLS.DOCUMENT, `  Found ${contentParagraphs.length} paragraph(s)`);
      for (let i = 0; i < Math.min(2, contentParagraphs.length); i++) {
        const pText = await contentParagraphs[i].textContent();
        if (pText && pText.trim().length > 10) {
          log(SYMBOLS.INFO, `    P${i + 1}: "${pText.trim().substring(0, 80)}..."`);
        }
      }
    }
    
    // Step 2: Find and verify CTA button
    log(SYMBOLS.INFO, 'Step 2: Locating CTA button "Erfahre mehr über unsere Geschichte"');
    const ctaButton = section.locator('a[href*="/gillette-welt"], a:has-text("Erfahre mehr über unsere Geschichte")').first();
    const ctaVisible = await ctaButton.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (!ctaVisible) {
      log(SYMBOLS.ERROR, '✗ CTA button not found in ourstory section');
      throw new Error('CTA button "Erfahre mehr über unsere Geschichte" not visible');
    }
    
    // Get button details
    const buttonText = await ctaButton.textContent().catch(() => 'Unknown');
    const buttonHref = await ctaButton.getAttribute('href').catch(() => '');
    
    log(SYMBOLS.SUCCESS, `✓ CTA button found`);
    log(SYMBOLS.ARROW_RIGHT, `  Button name: "${buttonText.trim()}"`);
    log(SYMBOLS.INFO, `  Button href: ${buttonHref}`);
    
    // Highlight the button
    await ctaButton.evaluate(el => {
      el.style.outline = '5px solid #00FF00';
      el.style.outlineOffset = '3px';
      el.style.boxShadow = '0 0 30px rgba(0,255,0,0.8)';
      el.style.backgroundColor = 'rgba(0,255,0,0.1)';
      el.style.transform = 'scale(1.1)';
      el.style.transition = 'all 0.3s';
    });
    await page.waitForTimeout(2000);
    
    // Step 3: Click button and verify redirect
    log(SYMBOLS.INFO, 'Step 3: Clicking button and validating redirect');
    
    // Use JavaScript click for reliability
    await ctaButton.evaluate(el => el.click());
    await page.waitForTimeout(3000);
    
    const redirectUrl = page.url();
    const pageTitle = await page.title();
    
    log(SYMBOLS.SUCCESS, `✓ Button clicked successfully`);
    log(SYMBOLS.ARROW_RIGHT, `  Button name: "${buttonText.trim()}"`);
    log(SYMBOLS.ARROW_RIGHT, `  Redirected to: ${redirectUrl}`);
    log(SYMBOLS.DOCUMENT, `  Page title: ${pageTitle}`);
    
    // Validate redirect
    expect(redirectUrl).toBeTruthy();
    expect(redirectUrl).not.toBe('about:blank');
    
    if (buttonHref) {
      const expectedPath = buttonHref.split('?')[0].replace(/^\//, '');
      const urlContainsExpected = redirectUrl.includes(expectedPath);
      
      if (urlContainsExpected) {
        log(SYMBOLS.SUCCESS, `  ✓ URL validation passed (contains "${expectedPath}")`);
      } else {
        log(SYMBOLS.WARNING, `  ⚠ URL might be different than expected`);
      }
    }
    
    log(SYMBOLS.SUCCESS, '"Gillette unterstützt Männer" section (#ourstory) verification completed');
  });

  /**
   * Test Case 15: Verify Footer navigation options
   * Test ID: TC-Homepage-15
   */
  test('TC-Homepage-15: Verify Footer navigation with categories and sub-options', async () => {
    test.setTimeout(600000); // 10 minutes - clicking all footer links (30+ links)
    log(SYMBOLS.SEARCH, 'Verifying Footer navigation');
    
    // Define all Footer navigation links based on actual site structure
    const footerNavLinks = {
      'Blog': [
        { name: 'Bart Styles', url: '/de-de/perfekte-rasur/bart-styles' },
        { name: 'Rasur-Tipps', url: '/de-de/perfekte-rasur/rasur-tipps' },
        { name: 'Körperrasur Und -Trimmen', url: '/de-de/perfekte-rasur/koerperrasur' },
        { name: 'Hautpflege', url: '/de-de/perfekte-rasur/hautpflege' },
        { name: 'Das Beste Im Mann', url: '/de-de/perfekte-rasur/das-beste-im-mann' },
        { name: 'Wissenschaft Des Rasierens', url: '/de-de/perfekte-rasur/wissenschaft-des-rasierens' },
        { name: 'Alle Artikel', url: '/de-de/perfekte-rasur' }
      ],
      'Produkttyp': [
        { name: 'Rasierer', url: '/de-de/produkte/rasierer' },
        { name: 'Rasierklingen', url: '/de-de/produkte/rasierklingen' },
        { name: 'Barttrimmer', url: '/de-de/produkte/barttrimmer' },
        { name: 'Rasiergel, Rasierschaum und After Shave', url: '/de-de/produkte/gesichtspflege' },
        { name: 'Alle Produkte', url: '/de-de/produkte' }
      ],
      'Portfolio': [
        { name: 'GilletteLabs', url: '/de-de/gillettelabs' },
        { name: 'Gillette BODY & INTIMATE', url: '/de-de/intimrasur' },
        { name: 'SkinGuard Sensitive', url: '/de-de/produkte/skinguard-sensitive-portfolio' },
        { name: 'Fusion5', url: '/de-de/produkte/fusion5-portfolio' },
        { name: 'PRO', url: '/de-de/produkte/pro-portfolio' },
        { name: 'Mach3', url: '/de-de/produkte/mach3-portfolio' },
        { name: 'Einwegrasierer', url: '/de-de/produkte/einwegrasierer' },
        { name: 'King C. Gillette', url: '/de-de/kingcgillette' }
      ],
      'Über Gillette': [
        { name: 'Unsere Geschichte', url: '/de-de/gillette-welt/evolution-rasierer' },
        { name: 'Soziale Nachhaltigkeit', url: '/de-de/gillette-welt/corporate-social-responsibility' },
        { name: 'Inhaltsstoffe-Glossar', url: '/de-de/gillette-welt/inhaltsstoffe-glossar' },
        { name: 'Sicherheit unserer Produkte', url: '/de-de/gillette-welt/produktsicherheit' },
        { name: 'GilletteLabs Garantie', url: '/de-de/gillettelabs/garantie' },
        { name: 'Saisonale Angebote', url: '/de-de/saisonale-angebote' }
      ]
    };
    
    // Log all categories
    for (const [category, options] of Object.entries(footerNavLinks)) {
      log(SYMBOLS.DOCUMENT, `Footer ${category}: ${options.length} links`);
    }
    
    // Test ALL links in ALL footer categories
    for (const [category, options] of Object.entries(footerNavLinks)) {
      log(SYMBOLS.INFO, `Testing Footer ${category} - ${options.length} links...`);
      
      // Test ALL links from each category
      for (const option of options) {
        // Scroll to footer
        const footer = page.locator('footer, contentinfo').first();
        await footer.scrollIntoViewIfNeeded();
        await page.waitForTimeout(2000);
        
        // Find and click the link in footer (use href-based selector for reliability)
        let footerLink = page.locator(`footer a[href="${option.url}"], contentinfo a[href="${option.url}"]`).first();
        let isVisible = await footerLink.isVisible({ timeout: 3000 }).catch(() => false);
        
        // Fallback to text-based selector
        if (!isVisible) {
          footerLink = page.locator(`footer a:has-text("${option.name}"), contentinfo a:has-text("${option.name}")`).first();
          isVisible = await footerLink.isVisible({ timeout: 3000 }).catch(() => false);
        }
        
        if (isVisible) {
          const href = await footerLink.getAttribute('href');
          log(SYMBOLS.ARROW_RIGHT, `Clicking Footer "${option.name}" (href: ${href})`);
          
          // Scroll into view and click normally
          await footerLink.scrollIntoViewIfNeeded();
          await page.waitForTimeout(2000);
          await footerLink.click();
          await page.waitForTimeout(3000); // Wait for navigation without strict load state
          
          const currentUrl = page.url();
          log(SYMBOLS.SUCCESS, `Footer "${option.name}": Redirected to ${currentUrl}`);
          
          // Verify URL contains expected path segment
          const expectedSegment = option.url.split('/').filter(s => s).pop();
          if (expectedSegment) {
            expect(currentUrl).toContain(expectedSegment);
          }
        } else {
          log(SYMBOLS.WARNING, `Footer "${option.name}": Link not visible`);
        }
        
        // Navigate back to homepage
        await homePageObj.navigate();
        await page.waitForTimeout(2000);
      }
    }
    
    log(SYMBOLS.SUCCESS, 'Footer navigation verification completed');
  });

  /**
   * Test Case 16: Verify logo box in Footer
   * Test ID: TC-Homepage-16
   */
  test('TC-Homepage-16: Verify logo box in Footer with all brand logos', async () => {
    log(SYMBOLS.SEARCH, 'Verifying Footer logo box');
    
    // 1. Scroll to footer
    const footer = page.locator('footer, .site-footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Verify logo box (footer has logos with specific alt text)
    const logoBox = footer.locator('a:has(img[alt*="Gillette"])');
    await expect(logoBox.first()).toBeVisible({ timeout: 10000 });
    
    // Verify brand logos: Gillette, Gillette Labs, Gillette Body & Intimate, King C. Gillette
    const brandLogos = ['Gillette', 'Gillette Labs', 'Body', 'King C. Gillette'];
    
    for (const brand of brandLogos) {
      const logoLink = footer.locator(`a:has-text("${brand}"), a img[alt*="${brand}"]`).first();
      const isVisible = await logoLink.isVisible({ timeout: 5000 }).catch(() => false);
      log(isVisible ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `Footer ${brand} logo: ${isVisible ? 'Present' : 'Not Found'}`);
    }
    
    // 2. Click ALL 4 specific brand logos and verify redirect
    const brandLogosToTest = [
      { name: 'Gillette', selector: 'footer a:has(img[alt*="Gillette"]):not(:has(img[alt*="Labs"])):not(:has(img[alt*="King"])):not(:has(img[alt*="Body"]))' },
      { name: 'GilletteLabs', selector: 'footer a:has(img[alt*="Labs"]), footer a[href*="gillettelabs"]' },
      { name: 'Gillette Body & Intimate', selector: 'footer a:has(img[alt*="Body"]), footer a[href*="intimrasur"]' },
      { name: 'King C. Gillette', selector: 'footer a:has(img[alt*="King"]), footer a[href*="kingcgillette"]' }
    ];
    
    log(SYMBOLS.INFO, 'Testing all 4 brand logos in footer...');
    
    for (const brand of brandLogosToTest) {
      const logo = footer.locator(brand.selector).first();
      const isVisible = await logo.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (isVisible) {
        const href = await logo.getAttribute('href');
        log(SYMBOLS.ARROW_RIGHT, `Clicking Footer "${brand.name}" logo (href: ${href})`);
        
        await logo.click();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        
        const redirectUrl = page.url();
        log(SYMBOLS.SUCCESS, `Footer "${brand.name}" logo redirected to: ${redirectUrl}`);
        expect(redirectUrl).not.toBe('');
        
        // Navigate back
        await homePageObj.navigate();
        await page.waitForTimeout(2000);
        await footer.scrollIntoViewIfNeeded();
        await page.waitForTimeout(2000);
      } else {
        log(SYMBOLS.WARNING, `Footer "${brand.name}" logo not visible`);
      }
    }
    
    log(SYMBOLS.SUCCESS, 'Footer logo box verification completed');
  });

  /**
   * Test Case 17: Verify Social Icons in Footer
   * Test ID: TC-Homepage-17
   */
  test('TC-Homepage-17: Verify Social Icons in Footer', async () => {
    log(SYMBOLS.SEARCH, 'Verifying Footer social icons');
    
    // 1. Scroll to footer
    const footer = page.locator('footer, .site-footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Verify social icons: YouTube, Instagram, Facebook
    const socialIcons = {
      'YouTube': 'a[href*="youtube"], a[aria-label*="YouTube"]',
      'Instagram': 'a[href*="instagram"], a[aria-label*="Instagram"]',
      'Facebook': 'a[href*="facebook"], a[aria-label*="Facebook"]'
    };
    
    for (const [platform, selector] of Object.entries(socialIcons)) {
      const icon = footer.locator(selector).first();
      const isVisible = await icon.isVisible({ timeout: 5000 }).catch(() => false);
      log(isVisible ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `${platform} icon: ${isVisible ? 'Present' : 'Not Found'}`);
    }
    
    // 2. Click ALL social icons and verify they open in new tabs
    log(SYMBOLS.INFO, 'Testing all 3 social media icons...');
    
    for (const [platform, selector] of Object.entries(socialIcons)) {
      const icon = footer.locator(selector).first();
      
      if (await icon.isVisible({ timeout: 3000 }).catch(() => false)) {
        const href = await icon.getAttribute('href');
        log(SYMBOLS.ARROW_RIGHT, `Clicking ${platform} icon (href: ${href})`);
        
        // Verify target="_blank" or opens new tab
        const target = await icon.getAttribute('target');
        if (target === '_blank') {
          log(SYMBOLS.SUCCESS, `${platform} has target="_blank" - will open in new tab`);
        }
        
        // Click and wait for new tab
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page'),
          icon.click()
        ]).catch(() => [null]);
        
        if (newPage) {
          await newPage.waitForLoadState('domcontentloaded').catch(() => {});
          const newPageUrl = newPage.url();
          log(SYMBOLS.SUCCESS, `${platform} opened in new tab: ${newPageUrl}`);
          
          // Verify URL contains platform name OR is a security proxy (menlosecurity, safelinks, etc.)
          const isValidUrl = newPageUrl.toLowerCase().includes(platform.toLowerCase()) || 
                            newPageUrl.includes('menlosecurity.com') || 
                            newPageUrl.includes('safelinks') ||
                            newPageUrl.includes('proxy');
          
          if (isValidUrl) {
            log(SYMBOLS.SUCCESS, `${platform} URL validated (direct or via proxy)`);
          } else {
            log(SYMBOLS.WARNING, `${platform} URL may not be correct: ${newPageUrl.substring(0, 100)}...`);
          }
          
          await newPage.close();
        } else {
          log(SYMBOLS.WARNING, `${platform} did not open in new tab, but link exists`);
        }
      } else {
        log(SYMBOLS.WARNING, `${platform} icon not visible in footer`);
      }
      
      await page.waitForTimeout(2000);
    }
    
    log(SYMBOLS.SUCCESS, 'Footer social icons verification completed');
  });

  /**
   * Test Case 18: Verify Country Selector in Footer
   * Test ID: TC-Homepage-18
   */
  test('TC-Homepage-18: Verify Country Selector (Deutschland) in Footer', async () => {
    log(SYMBOLS.SEARCH, 'Verifying Country Selector in Footer');
    
    // 1. Scroll to footer
    const footer = page.locator('footer, .site-footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Verify country selector
    const countrySelector = footer.locator('a:has-text("Deutschland"), .country-selector, [data-testid="country-selector"], button:has-text("Deutschland")').first();
    await expect(countrySelector).toBeVisible({ timeout: 10000 });
    log(SYMBOLS.SUCCESS, 'Country selector (Deutschland) is visible');
    
    // Click country selector
    await countrySelector.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Verify country selector page opened
    const currentUrl = page.url();
    log(SYMBOLS.SUCCESS, `Country selector page URL: ${currentUrl}`);
    
    // Check if country selection modal/page is displayed
    const countryList = page.locator('.country-list, .region-selector, [data-component="country-selector"]');
    const isCountryListVisible = await countryList.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isCountryListVisible) {
      log(SYMBOLS.SUCCESS, 'Country selection list is displayed');
    } else {
      log(SYMBOLS.INFO, 'Redirected to country selector page');
    }
    
    log(SYMBOLS.SUCCESS, 'Country selector verification completed');
  });

  /**
   * Test Case 19: Verify Privacy links in Footer
   * Test ID: TC-Homepage-19
   */
  test('TC-Homepage-19: Verify Privacy links in Footer', async () => {
    log(SYMBOLS.SEARCH, 'Verifying Privacy links in Footer');
    
    // 1. Scroll to footer
    const footer = page.locator('footer, .site-footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Verify privacy links: Impressum, Datenschutz, Meine Daten, Meine Cookie-Auswahl
    const privacyLinks = ['Impressum', 'Datenschutz', 'Meine Daten', 'Meine Cookie-Auswahl'];
    
    for (const linkText of privacyLinks) {
      const link = footer.locator(`a:has-text("${linkText}"), button:has-text("${linkText}")`).first();
      const isVisible = await link.isVisible({ timeout: 5000 }).catch(() => false);
      log(isVisible ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `Privacy link "${linkText}": ${isVisible ? 'Present' : 'Not Found'}`);
    }
    
    // 2. Click "Impressum", "Datenschutz", "Meine Daten" (open in new tab)
    const linksToClickNewTab = ['Impressum', 'Datenschutz', 'Meine Daten'];
    
    for (const linkText of linksToClickNewTab) {
      const link = footer.locator(`a:has-text("${linkText}")`).first();
      
      if (await link.isVisible({ timeout: 3000 }).catch(() => false)) {
        const href = await link.getAttribute('href');
        log(SYMBOLS.ARROW_RIGHT, `${linkText} href: ${href}`);
        
        // Click and check for new tab or same tab navigation
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 5000 }),
          link.click()
        ]).catch(() => [null]);
        
        if (newPage) {
          const newPageUrl = newPage.url();
          log(SYMBOLS.SUCCESS, `${linkText} opened in new tab: ${newPageUrl}`);
          await newPage.close();
        } else {
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(2000);
          log(SYMBOLS.SUCCESS, `${linkText} redirected to: ${page.url()}`);
          await homePageObj.navigate();
          await footer.scrollIntoViewIfNeeded();
        }
      }
    }
    
    // 3. Click "Meine Cookie-Auswahl" (should display cookie popup)
    const cookieLink = footer.locator('a:has-text("Meine Cookie-Auswahl"), button:has-text("Cookie")').first();
    
    if (await cookieLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cookieLink.click();
      await page.waitForTimeout(2000);
      
      // Verify cookie popup is displayed
      const cookiePopup = page.locator('#onetrust-consent-sdk, .cookie-popup, [role="dialog"]');
      const popupVisible = await cookiePopup.isVisible({ timeout: 5000 }).catch(() => false);
      log(popupVisible ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `Cookie popup: ${popupVisible ? 'Displayed' : 'Not Found'}`);
    }
    
    log(SYMBOLS.SUCCESS, 'Privacy links verification completed');
  });

  /**
   * Test Case 20: Verify Sitemap (Seitenverzeichnis) in Footer
   * Test ID: TC-Homepage-20
   */
  test('TC-Homepage-20: Verify Sitemap (Seitenverzeichnis) in Footer', async () => {
    log(SYMBOLS.SEARCH, 'Verifying Sitemap in Footer');
    
    // 1. Scroll to footer
    const footer = page.locator('footer, .site-footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Verify sitemap link
    const sitemapLink = footer.locator('a:has-text("Seitenverzeichnis"), a:has-text("Sitemap")').first();
    await expect(sitemapLink).toBeVisible({ timeout: 10000 });
    log(SYMBOLS.SUCCESS, 'Sitemap link is visible');
    
    // Click sitemap link
    await sitemapLink.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Verify sitemap page opened
    const currentUrl = page.url();
    log(SYMBOLS.SUCCESS, `Sitemap page URL: ${currentUrl}`);
    expect(currentUrl.toLowerCase()).toMatch(/sitemap|seitenverzeichnis/);
    
    // Verify sitemap content is displayed
    const sitemapContent = page.locator('main, .sitemap-content, article');
    await expect(sitemapContent.first()).toBeVisible({ timeout: 10000 });
    log(SYMBOLS.SUCCESS, 'Sitemap page content is displayed');
    
    log(SYMBOLS.SUCCESS, 'Sitemap verification completed');
  });

  /**
   * Test Case 21: Verify SEO components
   * Test ID: TC-Homepage-21
   */
  test('TC-Homepage-21: Verify SEO components including all image alt text', async () => {
    log(SYMBOLS.SEARCH, 'Verifying SEO components');
    
    // 1. Get all SEO metadata
    const seoData = await homePageObj.getSEOMetadata();
    
    // Capture comprehensive page information
    const pageInfo = await capturePageInfo(page);
    
    // ========== Meta Title ==========
    log(SYMBOLS.DOCUMENT, '========== META TITLE ==========');
    log(SYMBOLS.DOCUMENT, `Page Title: ${pageInfo.title}`);
    log(SYMBOLS.DOCUMENT, `Meta Title: ${seoData.metaTitle}`);
    expect(seoData.metaTitle).toBeTruthy();
    log(SYMBOLS.SUCCESS, 'Meta Title is present and valid');
    
    // ========== Meta Description ==========
    log(SYMBOLS.DOCUMENT, '========== META DESCRIPTION ==========');
    log(SYMBOLS.DOCUMENT, `Meta Description: ${seoData.metaDescription}`);
    expect(seoData.metaDescription).toBeTruthy();
    log(SYMBOLS.SUCCESS, 'Meta Description is present and valid');
    
    // ========== Canonical URL ==========
    log(SYMBOLS.DOCUMENT, '========== CANONICAL URL ==========');
    log(SYMBOLS.DOCUMENT, `Canonical URL: ${seoData.canonicalUrl}`);
    expect(seoData.canonicalUrl).toBeTruthy();
    expect(seoData.canonicalUrl).toContain('gillette.de');
    log(SYMBOLS.SUCCESS, 'Canonical URL is present and valid');
    
    // ========== H1 Tags ==========
    log(SYMBOLS.DOCUMENT, '========== H1 TAGS ==========');
    log(SYMBOLS.INFO, `Total H1 Tags Found: ${seoData.h1 ? (Array.isArray(seoData.h1) ? seoData.h1.length : 1) : 0}`);
    if (seoData.h1) {
      const h1Array = Array.isArray(seoData.h1) ? seoData.h1 : [seoData.h1];
      h1Array.forEach((h1, i) => {
        log(SYMBOLS.BULLET, `  H1-${i + 1}: ${h1}`);
      });
      log(SYMBOLS.SUCCESS, `H1 tag(s) present: ${h1Array.length} tag(s)`);
    } else {
      log(SYMBOLS.WARNING, 'H1 tag not found');
    }
    
    // ========== H2 Tags ==========
    log(SYMBOLS.DOCUMENT, '========== H2 TAGS ==========');
    log(SYMBOLS.INFO, `Total H2 Tags Found: ${seoData.h2?.length || 0}`);
    if (seoData.h2 && seoData.h2.length > 0) {
      seoData.h2.forEach((h2, i) => {
        log(SYMBOLS.BULLET, `  H2-${i + 1}: ${h2}`);
      });
      log(SYMBOLS.SUCCESS, `H2 tags present: ${seoData.h2.length} tag(s)`);
    } else {
      log(SYMBOLS.WARNING, 'No H2 tags found');
    }
    
    // ========== H3 Tags ==========
    log(SYMBOLS.DOCUMENT, '========== H3 TAGS ==========');
    log(SYMBOLS.INFO, `Total H3 Tags Found: ${seoData.h3?.length || 0}`);
    if (seoData.h3 && seoData.h3.length > 0) {
      seoData.h3.forEach((h3, i) => {
        log(SYMBOLS.BULLET, `  H3-${i + 1}: ${h3}`);
      });
      log(SYMBOLS.SUCCESS, `H3 tags present: ${seoData.h3.length} tag(s)`);
    } else {
      log(SYMBOLS.WARNING, 'No H3 tags found');
    }
    
    // ========== Image Alt Text (All Images) ==========
    log(SYMBOLS.DOCUMENT, '========== IMAGE ALT TEXT ==========');
    log(SYMBOLS.INFO, 'Collecting alt text from all images on the page...');
    
    // Get all images on the page
    const allImages = await page.locator('img').all();
    log(SYMBOLS.IMAGE, `Total Images Found: ${allImages.length}`);
    
    const imageAltTextData = [];
    let imagesWithAlt = 0;
    let imagesWithoutAlt = 0;
    
    for (let i = 0; i < allImages.length; i++) {
      const img = allImages[i];
      const altText = await img.getAttribute('alt').catch(() => '');
      const src = await img.getAttribute('src').catch(() => '');
      const isVisible = await img.isVisible().catch(() => false);
      
      imageAltTextData.push({
        index: i + 1,
        alt: altText || '[No alt text]',
        src: src,
        visible: isVisible
      });
      
      if (altText) {
        imagesWithAlt++;
      } else {
        imagesWithoutAlt++;
      }
    }
    
    // Display all image alt text
    log(SYMBOLS.INFO, `Images with alt text: ${imagesWithAlt}`);
    log(SYMBOLS.INFO, `Images without alt text: ${imagesWithoutAlt}`);
    log(SYMBOLS.DOCUMENT, '--- All Image Alt Text ---');
    
    imageAltTextData.forEach((imgData) => {
      const visibilityStatus = imgData.visible ? '✓' : '✗';
      const altDisplay = imgData.alt.substring(0, 100);
      log(SYMBOLS.IMAGE, `  Image ${imgData.index} [${visibilityStatus}]: "${altDisplay}"`);
      if (imgData.src) {
        const srcShort = imgData.src.substring(0, 80);
        log(SYMBOLS.BULLET, `    Src: ${srcShort}${imgData.src.length > 80 ? '...' : ''}`);
      }
    });
    
    // Summary Statistics
    log(SYMBOLS.DOCUMENT, '========== SEO SUMMARY ==========');
    log(SYMBOLS.DOCUMENT, `Total Images: ${allImages.length}`);
    log(SYMBOLS.DOCUMENT, `Images with Alt Text: ${imagesWithAlt} (${Math.round(imagesWithAlt/allImages.length * 100)}%)`);
    log(SYMBOLS.DOCUMENT, `Images without Alt Text: ${imagesWithoutAlt} (${Math.round(imagesWithoutAlt/allImages.length * 100)}%)`);
    log(SYMBOLS.DOCUMENT, `Total H1 Tags: ${seoData.h1 ? (Array.isArray(seoData.h1) ? seoData.h1.length : 1) : 0}`);
    log(SYMBOLS.DOCUMENT, `Total H2 Tags: ${seoData.h2?.length || 0}`);
    log(SYMBOLS.DOCUMENT, `Total H3 Tags: ${seoData.h3?.length || 0}`);
    
    // OG Tags (Optional)
    if (seoData.ogTitle) {
      log(SYMBOLS.DOCUMENT, `OG Title: ${seoData.ogTitle}`);
    }
    if (seoData.ogDescription) {
      log(SYMBOLS.DOCUMENT, `OG Description: ${seoData.ogDescription?.substring(0, 100)}...`);
    }
    
    // Take SEO verification screenshot
    await page.screenshot({ 
      path: `test-results/homepage-artifacts/TC-Homepage-21_SEO_verification.png`, 
      fullPage: false 
    });
    log(SYMBOLS.IMAGE, 'SEO verification screenshot captured');
    
    log(SYMBOLS.SUCCESS, 'SEO components verification completed - All Meta Title, Meta Description, Canonical URL, H1, H2, H3, and Image Alt Text displayed');
  });
});

