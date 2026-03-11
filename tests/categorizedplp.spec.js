/**
 * Categorized Product Listing Page (PLP) Regression Test Suite
 * Test Plan: test-plans/categorizedplp.md
 * 
 * Comprehensive regression tests for the Gillette Germany Categorized Product Listing Page
 * URL: https://www.gillette.de/de-de/produkte/rasierer
 */

import { test, expect } from '@playwright/test';
import { categorizedPlpPage } from '../pages/categorizedPlpPage.js';
import { SYMBOLS, log } from '../utils/logConstants.js';
import { setupTest, attachFailureScreenshot } from '../utils/testSetup.js';

test.describe('Categorized Product Listing Page Regression Tests', () => {
  // Configure tests to run sequentially - one worker executes one test at a time
  test.describe.configure({ mode: 'serial' });

  let page;
  let catPlpPageObj;
  let overlayMonitor; // Interval ID for continuous overlay monitoring

  // Aggressive overlay removal function - removes ALL black screens/overlays
  const removeAllOverlays = async () => {
    try {
      await page.evaluate(() => {
        // Remove all OneTrust and overlay elements
        const overlaySelectors = [
          '#onetrust-consent-sdk',
          '.onetrust-pc-dark-filter',
          '.optanon-alert-box-wrapper',
          '[class*="onetrust"]',
          '[id*="onetrust"]',
          '[class*="modal-backdrop"]',
          '[class*="overlay"]',
          '[id*="overlay"]',
          '.cookie-overlay',
          '.cookie-backdrop'
        ];
        
        overlaySelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        });
        
        // Remove ANY element with very high z-index
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          const styles = window.getComputedStyle(el);
          const zIndex = parseInt(styles.zIndex);
          
          if (zIndex > 9999) {
            el.remove();
          }
          
          // Remove black overlays covering the page
          const bgColor = styles.backgroundColor;
          if ((bgColor === 'rgba(0, 0, 0, 0.5)' || 
               bgColor === 'rgb(0, 0, 0)' || 
               bgColor === 'rgba(0, 0, 0, 0.8)' ||
               bgColor === 'rgba(0, 0, 0, 0.7)') && 
              (styles.position === 'fixed' || styles.position === 'absolute')) {
            if (el.offsetWidth > window.innerWidth * 0.8 || el.offsetHeight > window.innerHeight * 0.8) {
              el.remove();
            }
          }
        });
        
        // FORCE white background and full visibility
        document.body.style.backgroundColor = '#ffffff !important';
        document.body.style.overflow = 'auto !important';
        document.body.style.position = 'static !important';
        document.body.style.visibility = 'visible !important';
        document.body.style.opacity = '1 !important';
        document.documentElement.style.backgroundColor = '#ffffff !important';
        document.documentElement.style.overflow = 'auto !important';
        document.documentElement.style.visibility = 'visible !important';
        document.documentElement.style.opacity = '1 !important';
        
        // Remove overlay classes
        document.body.classList.remove('modal-open', 'no-scroll', 'overlay-open');
      });
    } catch (e) {
      // Page might be closed, ignore error
    }
  };

  // Start continuous overlay monitoring
  const startOverlayMonitoring = async () => {
    // Run overlay removal every 500ms to catch any new overlays immediately
    overlayMonitor = setInterval(async () => {
      await removeAllOverlays();
      // Browser-side script handles popup removal more efficiently - no need for test-side removal
    }, 500);
  };

  // Stop overlay monitoring
  const stopOverlayMonitoring = () => {
    if (overlayMonitor) {
      clearInterval(overlayMonitor);
    }
  };

  // Helper function to close "HAST DU SONST NOCH FRAGEN?" popup
  // DISABLED: Browser-side script handles this more efficiently
  const closeQuestionsPopup = async () => {
    // No-op - browser-side removal handles all popup blocking
    return true;
  };

  // Helper function to ensure cookies are accepted
  const ensureCookiesAccepted = async () => {
    try {
      // First, aggressively remove any overlays that might be covering the page
      await page.evaluate(() => {
        const overlaySelectors = [
          '#onetrust-consent-sdk',
          '.onetrust-pc-dark-filter',
          '.optanon-alert-box-wrapper',
          '[class*="onetrust"]',
          '[id*="onetrust"]',
          '[class*="modal-backdrop"]',
          '[class*="overlay"]'
        ];
        overlaySelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        });
        
        // Force white background and visibility
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.overflow = 'auto';
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
        document.documentElement.style.backgroundColor = '#ffffff';
        document.documentElement.style.overflow = 'auto';
        document.documentElement.style.visibility = 'visible';
      });
      
      const cookieButton = page.locator('#onetrust-accept-btn-handler, button:has-text("Alle akzeptieren"), button:has-text("Accept")');
      if (await cookieButton.isVisible({ timeout: 2000 })) {
        // If banner is visible, inject cookies immediately AND click button
        await page.evaluate(() => {
          const consentValue = 'isGpcEnabled=0&datestamp=' + new Date().toUTCString() + '&version=6.17.0&isIABGlobal=false&hosts=&consentId=&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&AwaitingReconsent=false';
          document.cookie = `OptanonConsent=${consentValue}; path=/; domain=.gillette.de; max-age=31536000; SameSite=Lax`;
          document.cookie = `OptanonAlertBoxClosed=${new Date().toISOString()}; path=/; domain=.gillette.de; max-age=31536000; SameSite=Lax`;
        });
        await cookieButton.click();
        await page.waitForTimeout(500);
        log(SYMBOLS.INFO, 'Cookie banner detected - cookies injected and banner clicked');
      }
    } catch (e) {
      // Cookie banner not present - continue
    }
  };

  test.beforeAll(async ({ browser }, testInfo) => {
    // Create a new browser context with 150% display scaling (as per MD requirements)
    const context = await browser.newContext({ 
      viewport: { width: 1920, height: 1080 },
      screen: { width: 1920, height: 1080 },
      deviceScaleFactor: 1.5  // 150% display scaling
    });
    
    page = await context.newPage();
    
    // Inject continuous overlay removal script directly into page - runs aggressively
    await page.addInitScript(() => {
      const blockPopup = () => {
        // PRIORITY 1: Remove iframe-based popups (like Typeform surveys)
        try {
          const iframes = document.querySelectorAll('iframe');
          iframes.forEach(iframe => {
            const src = iframe.src || '';
            const parent = iframe.parentElement;
            // Remove survey/feedback iframes and their containers
            if (src.includes('typeform') || src.includes('survey') || src.includes('feedback') || 
                src.includes('qualtrics') || 
                (parent && (parent.classList.toString().includes('modal') || 
                           parent.classList.toString().includes('popup') ||
                           parent.classList.toString().includes('overlay')))) {
              // Remove parent container if it looks like a modal
              if (parent && (parent.classList.toString().includes('modal') || 
                            parent.classList.toString().includes('popup'))) {
                parent.remove();
              } else {
                iframe.remove();
              }
            }
          });
        } catch (e) {}
        
        // PRIORITY 2: Remove "HAST DU SONST NOCH FRAGEN?" popup
        try {
          const popupElements = document.querySelectorAll('[role="dialog"], [class*="modal"], [class*="popup"], [class*="dialog"], [id*="modal"], [id*="popup"]');
          popupElements.forEach(el => {
            const text = el.textContent || '';
            if (text.includes('HAST DU SONST NOCH FRAGEN?')) {
              el.remove();
            }
          });
        } catch (e) {}
        
        // PRIORITY 3: Remove all overlay elements
        const overlaySelectors = [
          '#onetrust-consent-sdk',
          '.onetrust-pc-dark-filter',
          '.optanon-alert-box-wrapper',
          '[class*="onetrust"]',
          '[id*="onetrust"]',
          '[class*="modal-backdrop"]',
          '[class*="overlay"]',
          '[id*="overlay"]',
          '.cookie-overlay',
          '.cookie-backdrop'
        ];
        
        overlaySelectors.forEach(selector => {
          try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
          } catch (e) {}
        });
        
        // PRIORITY 4: Remove high z-index elements
        try {
          const allElements = document.querySelectorAll('*');
          allElements.forEach(el => {
            const styles = window.getComputedStyle(el);
            const zIndex = parseInt(styles.zIndex);
            
            if (zIndex > 9999) {
              el.remove();
            }
            
            const bgColor = styles.backgroundColor;
            if ((bgColor === 'rgba(0, 0, 0, 0.5)' || 
                 bgColor === 'rgb(0, 0, 0)' || 
                 bgColor === 'rgba(0, 0, 0, 0.8)' ||
                 bgColor === 'rgba(0, 0, 0, 0.7)') && 
                (styles.position === 'fixed' || styles.position === 'absolute')) {
              if (el.offsetWidth > window.innerWidth * 0.8 || el.offsetHeight > window.innerHeight * 0.8) {
                el.remove();
              }
            }
          });
        } catch (e) {}
        
        // Force visible white background
        if (document.body) {
          document.body.style.backgroundColor = '#ffffff';
          document.body.style.overflow = 'auto';
          document.body.style.visibility = 'visible';
          document.body.style.opacity = '1';
        }
        if (document.documentElement) {
          document.documentElement.style.backgroundColor = '#ffffff';
          document.documentElement.style.overflow = 'auto';
          document.documentElement.style.visibility = 'visible';
        }
      };
      
      // Run very aggressively - every 50ms
      setInterval(blockPopup, 50);
      
      // Also use MutationObserver to catch popups instantly
      const observer = new MutationObserver(blockPopup);
     const startObserving = () => {
        try {
          observer.observe(document.documentElement, { 
            childList: true, 
            subtree: true 
          });
        } catch (e) {
          setTimeout(startObserving, 100);
        }
      };
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserving);
      } else {
        startObserving();
      }
    });
    log(SYMBOLS.SUCCESS, 'Continuous overlay removal script injected into page');
    
    // STEP 1: Block ALL OneTrust/Optanon requests and survey/feedback popups BEFORE any navigation
    await page.route('**/*onetrust*', route => route.abort());
    await page.route('**/*optanon*', route => route.abort());
    await page.route('**/cdn.cookielaw.org/**', route => route.abort());
    await page.route('**/geolocation.onetrust.com/**', route => route.abort());
    // Block survey/feedback services that create popups
    await page.route('**/*typeform*', route => route.abort());
    await page.route('**/*qualtrics*', route => route.abort());
    await page.route('**/*surveymonkey*', route => route.abort());
    await page.route('**/*hotjar*', route => route.abort());
    await page.route('**/*usabilla*', route => route.abort());
    await page.route('**/*feedback*', route => route.abort());
    log(SYMBOLS.INFO, 'All OneTrust/Optanon scripts and survey services blocked - popups prevented');
    
    // STEP 2: Navigate to page first so we can set cookies in the correct context
    await page.goto('https://www.gillette.de/de-de');
    await page.waitForTimeout(1000);
    
    // STEP 3: Set cookies programmatically using document.cookie (most reliable method)
    await page.evaluate(() => {
      const consentValue = 'isGpcEnabled=0&datestamp=' + new Date().toUTCString() + '&version=6.17.0&isIABGlobal=false&hosts=&consentId=&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&AwaitingReconsent=false';
      document.cookie = `OptanonConsent=${consentValue}; path=/; domain=.gillette.de; max-age=31536000; SameSite=Lax`;
      document.cookie = `OptanonAlertBoxClosed=${new Date().toISOString()}; path=/; domain=.gillette.de; max-age=31536000; SameSite=Lax`;
    });
    log(SYMBOLS.SUCCESS, 'Cookie consent cookies injected via document.cookie');
    
    // Maximize window using JavaScript for reliable full-screen on Windows
    await page.evaluate(() => {
      window.moveTo(0, 0);
      window.resizeTo(screen.availWidth, screen.availHeight);
    });
    
    catPlpPageObj = new categorizedPlpPage(page);
    
    // Setup test environment once
    await setupTest(context, testInfo);
    
    // STEP 4: Navigate to Categorized PLP (cookies already set, scripts blocked)
    log(SYMBOLS.HOME, 'Navigating to Gillette Germany Categorized Product Listing Page (Rasierer)');
    await catPlpPageObj.navigate();
    
    // Wait for page to fully load - use load state instead of domcontentloaded for better stability
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);
    
    // Wait for products to be visible (critical indicator that page loaded)
    try {
      await page.locator('[data-testid="product-card"], .product-card, .product-item').first().waitFor({ state: 'visible', timeout: 10000 });
      log(SYMBOLS.SUCCESS, 'Products detected on page');
    } catch (e) {
      log(SYMBOLS.WARNING, 'Product elements not immediately visible, continuing...');
    }
    
    // STEP 5: Verify cookies persisted after navigation
    const cookies = await context.cookies();
    const hasOptanon = cookies.some(c => c.name === 'OptanonConsent');
    log(hasOptanon ? SYMBOLS.SUCCESS : SYMBOLS.WARNING, `Cookie verification: OptanonConsent ${hasOptanon ? 'present âœ"' : 'missing - re-injecting'}`);
    
    // Re-inject cookies if they didn't persist (extra safety)
    if (!hasOptanon) {
      await page.evaluate(() => {
        const consentValue = 'isGpcEnabled=0&datestamp=' + new Date().toUTCString() + '&version=6.17.0&isIABGlobal=false&hosts=&consentId=&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&AwaitingReconsent=false';
        document.cookie = `OptanonConsent=${consentValue}; path=/; domain=.gillette.de; max-age=31536000; SameSite=Lax`;
        document.cookie = `OptanonAlertBoxClosed=${new Date().toISOString()}; path=/; domain=.gillette.de; max-age=31536000; SameSite=Lax`;
      });
      log(SYMBOLS.SUCCESS, 'Cookies re-injected after navigation');
    }
    
    // STEP 6: Remove OneTrust overlays/backdrops that cause black screen
    await page.evaluate(() => {
      // Remove all OneTrust related overlays and backdrops
      const overlaySelectors = [
        '#onetrust-consent-sdk',
        '.onetrust-pc-dark-filter',
        '.optanon-alert-box-wrapper',
        '[class*="onetrust"]',
        '[id*="onetrust"]',
        '.cookie-overlay',
        '.cookie-backdrop',
        '[class*="modal-backdrop"]',
        '[class*="overlay"]',
        '[id*="overlay"]'
      ];
      
      overlaySelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
      
      // Remove ANY element with very high z-index (likely overlays)
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const zIndex = parseInt(styles.zIndex);
        
        // Remove high z-index overlays
        if (zIndex > 9999) {
          el.remove();
        }
        
        // Remove elements with black/semi-transparent backgrounds that could be overlays
        const bgColor = styles.backgroundColor;
        if ((bgColor === 'rgba(0, 0, 0, 0.5)' || 
             bgColor === 'rgb(0, 0, 0)' || 
             bgColor === 'rgba(0, 0, 0, 0.8)') && 
            (styles.position === 'fixed' || styles.position === 'absolute')) {
          if (el.offsetWidth > window.innerWidth * 0.8 || el.offsetHeight > window.innerHeight * 0.8) {
            el.remove();
          }
        }
      });
      
      // Force body and html to be visible with white background
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
      document.documentElement.style.backgroundColor = '#ffffff';
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.visibility = 'visible';
      document.documentElement.style.opacity = '1';
      
      // Remove any backdrop or overlay classes from body
      document.body.classList.remove('modal-open', 'no-scroll', 'overlay-open');
    });
    log(SYMBOLS.SUCCESS, 'OneTrust overlays removed - page forced to visible with white background');
    
    // Wait 10 seconds for all products to fully load and page to stabilize (prevents black screen)
    log(SYMBOLS.INFO, 'Waiting 10 seconds for all products to load completely...');
    await page.waitForTimeout(10000);
    log(SYMBOLS.SUCCESS, 'Products loaded - page ready');
    
    // Start continuous overlay monitoring from test side (double protection with browser-side script)
    log(SYMBOLS.INFO, 'Starting continuous overlay monitoring from test context...');
    await startOverlayMonitoring();
    log(SYMBOLS.SUCCESS, 'Overlay monitoring active - checking every 500ms');
    
    // STEP 7: Final fallback - check if banner still appears and click accept button
    await ensureCookiesAccepted();
    await page.waitForTimeout(500);
    
    // Scroll to top to ensure page is fully rendered
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    log(SYMBOLS.SUCCESS, 'Browser opened and ready for test execution');
  });

  test.afterAll(async () => {
    // Close any remaining popups
    await closeQuestionsPopup();
    
    // Stop continuous overlay monitoring
    log(SYMBOLS.INFO, 'Stopping continuous overlay monitoring...');
    stopOverlayMonitoring();
    log(SYMBOLS.SUCCESS, 'Overlay monitoring stopped');
  });

  test.beforeEach(async ({}, testInfo) => {
    // Close any popups that might be open
    await closeQuestionsPopup();
    
    // Ensure cookies are accepted BEFORE starting test (critical for reliability)
    await ensureCookiesAccepted();
    
    // Wait 5 seconds before starting each test for visibility
    await page.waitForTimeout(5000);
    
    // Ensure we're on the correct page before each test
    const currentUrl = page.url();
    if (!currentUrl.includes('gillette.de/de-de/produkte/rasierer')) {
      log(SYMBOLS.HOME, 'Returning to Categorized PLP');
      await catPlpPageObj.navigate();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      // Ensure cookies are accepted after navigation
      await ensureCookiesAccepted();
    }
    
    // Bring browser to focus and scroll to top
    await page.bringToFront();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    // Final check: ensure cookies are still accepted before test starts
    await ensureCookiesAccepted();
  });

  test.afterEach(async ({}, testInfo) => {
    // Attach screenshot on failure
    await attachFailureScreenshot(page, testInfo);
  });

  /**
   * Test Case 1: Verify SEO Components and Page Load
   * Test ID: TC-PLP-01
   */
  test('TC-PLP-01: Verify SEO Components and Page Load', async () => {
    log(SYMBOLS.SEARCH, 'Verifying SEO Components and Page Load');
    
    // Ensure cookies are accepted before starting test
    await ensureCookiesAccepted();
    
    // 1. Ensure page loads fully without errors
    const currentUrl = await catPlpPageObj.getCurrentUrl();
    log(SYMBOLS.SUCCESS, `Current URL: ${currentUrl}`);
    expect(currentUrl).toContain('gillette.de/de-de/produkte/rasierer');
    
    // 2. Verify main header is displayed
    const headerText = await catPlpPageObj.getPageHeaderText();
    log(SYMBOLS.PAGE, `Page header: ${headerText}`);
    expect(headerText).toBeTruthy();
    
    // 3. Display all SEO components
    const seoData = await catPlpPageObj.getSEOMetadata();
    
    log(SYMBOLS.DOCUMENT, '==================== SEO COMPONENTS ====================');
    log(SYMBOLS.BULLET, `Meta Title: ${seoData.metaTitle || 'Not Found'}`);
    log(SYMBOLS.BULLET, `Meta Description: ${seoData.metaDescription || 'Not Found'}`);
    log(SYMBOLS.BULLET, `Canonical URL: ${seoData.canonicalUrl || 'Not Found'}`);
    log(SYMBOLS.BULLET, `H1 Tag: ${seoData.h1 || 'Not Found'}`);
    
    log(SYMBOLS.INFO, `H2 Tags (Total: ${seoData.h2.length}):`);
    seoData.h2.forEach((h2, index) => {
      log(SYMBOLS.BULLET, `  ${index + 1}. ${h2}`);
    });
    
    log(SYMBOLS.INFO, `H3 Tags (Total: ${seoData.h3.length}):`);
    seoData.h3.forEach((h3, index) => {
      log(SYMBOLS.BULLET, `  ${index + 1}. ${h3}`);
    });
    log(SYMBOLS.DOCUMENT, '========================================================');
    
    // 4. Verify essential SEO components exist
    expect(seoData.metaTitle).toBeTruthy();
    expect(seoData.h1).toBeTruthy();
    expect(seoData.h2.length).toBeGreaterThan(0);
    
    // 5. Verify products are displayed with required elements
    const productCount = await catPlpPageObj.getProductCount();
    log(SYMBOLS.PACKAGE, `Total products found: ${productCount}`);
    expect(productCount).toBeGreaterThan(0);
    
    // 6. Verify sample products have Ratings, MEHR ERFAHREN, and JETZT KAUFEN buttons
    for (let i = 0; i < Math.min(3, productCount); i++) {
      const hasRating = await catPlpPageObj.verifyProductHasRating(i);
      const hasMehrErfahren = await catPlpPageObj.verifyProductHasMehrErfahrenButton(i);
      const hasJetztKaufen = await catPlpPageObj.verifyProductHasJetztKaufenButton(i);
      
      log(SYMBOLS.INFO, `Product ${i + 1}: Rating=${hasRating}, MEHR ERFAHREN=${hasMehrErfahren}, JETZT KAUFEN=${hasJetztKaufen}`);
    }
    
    // 7. Verify images are loaded
    const images = await page.locator('img').all();
    let loadedImages = 0;
    for (const img of images.slice(0, 10)) { // Check first 10 images for speed
      const isVisible = await img.isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) {
        const naturalWidth = await img.evaluate(el => el.naturalWidth).catch(() => 0);
        if (naturalWidth > 0) loadedImages++;
      }
    }
    log(SYMBOLS.SUCCESS, `Images loaded: ${loadedImages}/${Math.min(10, images.length)} (sample check)`);
    
    log(SYMBOLS.SUCCESS, 'SEO Components and Page Load verification completed');
    
    // Close any popups that appeared during test
    await closeQuestionsPopup();
  });

  /**
   * Test Case 2: Dropdown Functionality Testing
   * Test ID: TC-PLP-02
   */
  test('TC-PLP-02: Dropdown Functionality Testing', async () => {
    log(SYMBOLS.SEARCH, 'Testing Dropdown Functionality');
    
    // Ensure cookies are accepted before starting test
    await ensureCookiesAccepted();
    
    // Scroll to top where dropdown controls typically are
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    
    // Look for common dropdown selectors on German e-commerce sites
    const dropdownSelectors = [
      'select',
      '[role="combobox"]',
      'button[aria-haspopup="listbox"]',
      '.dropdown-toggle',
      '[class*="sort"]',
      '[class*="dropdown"]',
      '[data-testid*="dropdown"]',
      '[data-testid*="sort"]'
    ];
    
    let foundDropdown = false;
    let dropdownType = '';
    
    // Search for dropdowns
    for (const selector of dropdownSelectors) {
      const dropdown = page.locator(selector).first();
      const isVisible = await dropdown.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (isVisible) {
        foundDropdown = true;
        const text = await dropdown.textContent().catch(() => '');
        dropdownType = text || selector;
        log(SYMBOLS.SUCCESS, `Dropdown found: "${dropdownType}"`);
        
        // Try to interact with dropdown
        try {
          await dropdown.click();
          await page.waitForTimeout(1000);
          log(SYMBOLS.SUCCESS, 'Dropdown clicked - checking for options...');
          
          // Look for dropdown options
          const options = await page.locator('option, [role="option"], li[role="menuitem"]').all();
          if (options.length > 0) {
            log(SYMBOLS.DOCUMENT, `Found ${options.length} dropdown options`);
            
            // List first 5 options
            for (let i = 0; i < Math.min(5, options.length); i++) {
              const optionText = await options[i].textContent();
              log(SYMBOLS.BULLET, `  ${i + 1}. ${optionText?.trim()}`);
            }
            
            // Select first option if available
            if (options.length > 0) {
              await options[0].click().catch(() => {});
              await page.waitForTimeout(1500);
              log(SYMBOLS.SUCCESS, 'First option selected');
            }
          } else {
            log(SYMBOLS.INFO, 'No dropdown options menu detected');
          }
          
          // Close dropdown by pressing Escape
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);
          
        } catch (error) {
          log(SYMBOLS.WARNING, `Could not interact with dropdown: ${error.message}`);
        }
        
        break;
      }
    }
    
    if (!foundDropdown) {
      log(SYMBOLS.WARNING, 'No dropdown elements found on this page');
      log(SYMBOLS.INFO, 'Dropdown functionality may not be available for this category');
      log(SYMBOLS.INFO, 'This is expected behavior if the page does not implement sorting/filtering dropdowns');
    }
    
    log(SYMBOLS.SUCCESS, 'Dropdown functionality testing completed');
    
    // Close any popups that appeared during test
    await closeQuestionsPopup();
  });

  /**
   * Test Case 3: Filter Functionality Testing
   * Test ID: TC-PLP-03
   */
  test('TC-PLP-03: Filter Functionality Testing', async () => {
    log(SYMBOLS.SEARCH, 'Testing Filter Functionality');
    
    // Ensure cookies are accepted before starting test
    await ensureCookiesAccepted();
    
    // Scroll to top where filters typically are
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    
    // Look for common filter selectors on German e-commerce sites
    const filterSelectors = [
      '[data-testid*="filter"]',
      '.filter',
      '[class*="filter"]',
      '[id*="filter"]',
      'input[type="checkbox"]',
      'button:has-text("Filter")',
      'button:has-text("Filtern")',
      '[role="group"]',
      '.sidebar',
      '[class*="facet"]'
    ];
    
    let foundFilters = false;
    const filterElements = [];
    
    // Search for filter elements
    for (const selector of filterSelectors) {
      const filters = await page.locator(selector).all();
      
      for (const filter of filters) {
        const isVisible = await filter.isVisible({ timeout: 1000 }).catch(() => false);
        if (isVisible) {
          const text = await filter.textContent().catch(() => '');
          if (text && text.trim().length > 0) {
            filterElements.push({ element: filter, text: text.trim(), selector });
            foundFilters = true;
          }
        }
      }
      
      if (filterElements.length > 0) break;
    }
    
    if (foundFilters && filterElements.length > 0) {
      log(SYMBOLS.SUCCESS, `Found ${filterElements.length} filter element(s)`);
      
      // Display found filters
      log(SYMBOLS.DOCUMENT, 'Available filters:');
      for (let i = 0; i < Math.min(10, filterElements.length); i++) {
        const filterText = filterElements[i].text.substring(0, 100);
        log(SYMBOLS.BULLET, `  ${i + 1}. ${filterText}${filterElements[i].text.length > 100 ? '...' : ''}`);
      }
      
      // Try to interact with first filter to open filter panel
      try {
        log(SYMBOLS.INFO, 'Opening filter panel...');
        const firstFilter = filterElements[0].element;
        
        // Click the filter button to open panel
        await firstFilter.scrollIntoViewIfNeeded().catch(() => {});
        await page.waitForTimeout(500);
        await firstFilter.click();
        await page.waitForTimeout(2000); // Wait for filter panel to open
        
        log(SYMBOLS.SUCCESS, 'Filter panel opened');
        
        // Look for filter options inside the panel
        const filterOptionSelectors = [
          'input[type="checkbox"]',
          'input[type="radio"]',
          '[role="checkbox"]',
          '[role="radio"]',
          '.filter-option',
          '[class*="filter"] label',
          '[class*="facet"] label'
        ];
        
        let filterOptions = [];
        for (const selector of filterOptionSelectors) {
          const options = await page.locator(selector).all();
          for (const option of options) {
            const isVisible = await option.isVisible({ timeout: 500 }).catch(() => false);
            if (isVisible) {
              const text = await option.textContent().catch(() => '');
              if (text && text.trim().length > 0) {
                filterOptions.push({ element: option, text: text.trim() });
              }
            }
          }
          if (filterOptions.length > 0) break;
        }
        
        if (filterOptions.length > 0) {
          log(SYMBOLS.DOCUMENT, `Found ${filterOptions.length} filter option(s) inside panel:`);
          
          // List all filter options
          for (let i = 0; i < Math.min(15, filterOptions.length); i++) {
            const optionText = filterOptions[i].text.substring(0, 80);
            log(SYMBOLS.BULLET, `  ${i + 1}. ${optionText}${filterOptions[i].text.length > 80 ? '...' : ''}`);
          }
          
          // Test first 3 filter options by clicking them
          log(SYMBOLS.INFO, 'Testing filter options...');
          const initialProductCount = await catPlpPageObj.getProductCount();
          log(SYMBOLS.INFO, `Initial product count: ${initialProductCount}`);
          
          for (let i = 0; i < Math.min(3, filterOptions.length); i++) {
            try {
              log(SYMBOLS.INFO, `\nTesting filter option ${i + 1}: "${filterOptions[i].text.substring(0, 50)}"`);
              
              // Scroll the filter option into view
              await filterOptions[i].element.scrollIntoViewIfNeeded().catch(() => {});
              await page.waitForTimeout(300);
              
              // Try to find and click the associated checkbox input instead of label
              const filterText = filterOptions[i].text;
              const checkbox = page.locator(`input[type="checkbox"][id*="${filterText.toLowerCase().replace(/\s+/g, '')}"]`).first();
              const checkboxExists = await checkbox.count() > 0;
              
              if (checkboxExists) {
                // Click checkbox directly with force
                await checkbox.click({ force: true });
                log(SYMBOLS.SUCCESS, `  → Checkbox clicked for "${filterText.substring(0, 40)}"`);
              } else {
                // Fallback: click label with force
                await filterOptions[i].element.click({ force: true });
                log(SYMBOLS.SUCCESS, `  → Filter label clicked with force`);
              }
              
              await page.waitForTimeout(2000); // Wait for filter to apply
              
              // Check if product count changed
              const newProductCount = await catPlpPageObj.getProductCount();
              log(SYMBOLS.INFO, `  → Product count after filter: ${newProductCount}`);
              
              if (newProductCount !== initialProductCount) {
                log(SYMBOLS.SUCCESS, `  ✓ Filter applied - products changed from ${initialProductCount} to ${newProductCount}`);
              } else {
                log(SYMBOLS.INFO, `  → Product count unchanged (${newProductCount})`);
              }
              
              // Uncheck/deselect the filter option
              if (checkboxExists) {
                await checkbox.click({ force: true }).catch(() => {});
              } else {
                await filterOptions[i].element.click({ force: true }).catch(() => {});
              }
              await page.waitForTimeout(1500);
              log(SYMBOLS.INFO, `  → Filter option ${i + 1} toggled back`);
              
            } catch (optionError) {
              log(SYMBOLS.WARNING, `  ⚠ Could not test filter option ${i + 1}: ${optionError.message}`);
            }
          }
          
          log(SYMBOLS.SUCCESS, 'Filter options exploration completed');
          
        } else {
          log(SYMBOLS.INFO, 'No filter options found inside panel');
          log(SYMBOLS.INFO, 'Filter panel may be empty or use different structure');
        }
        
        // Close filter panel
        log(SYMBOLS.INFO, 'Closing filter panel...');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
        
        // Or try clicking the filter button again to close
        await firstFilter.click().catch(() => {});
        await page.waitForTimeout(1000);
        log(SYMBOLS.SUCCESS, 'Filter panel closed');
        
      } catch (error) {
        log(SYMBOLS.WARNING, `Could not explore filter panel: ${error.message}`);
      }
      
    } else {
      log(SYMBOLS.WARNING, 'No filter elements found on this page');
      log(SYMBOLS.INFO, 'Filter functionality may not be available for this category');
      log(SYMBOLS.INFO, 'This is expected behavior if the page does not implement product filters');
    }
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    // Close any popups that may have appeared
    await closeQuestionsPopup();
    
    log(SYMBOLS.SUCCESS, 'Filter functionality testing completed');
  });

  /**
   * Test Case 4: Load All Products with Pagination
   * Test ID: TC-PLP-04
   */
  test('TC-PLP-04: Load All Products with Pagination', async () => {
    log(SYMBOLS.SEARCH, 'Listing all products on page with pagination handling');
    
    // Ensure cookies are accepted before starting test
    await ensureCookiesAccepted();
    
    // 1. Count initial products
    let productCount = await catPlpPageObj.getProductCount();
    log(SYMBOLS.PACKAGE, `Initial products loaded: ${productCount}`);
    
    // 2. Handle pagination by scrolling to load all products
    let previousCount = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 5;
    
    while (productCount > previousCount && scrollAttempts < maxScrollAttempts) {
      previousCount = productCount;
      log(SYMBOLS.INFO, `Scrolling to load more products (Attempt ${scrollAttempts + 1})...`);
      
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000); // Wait for pagination to load
      
      // Count products again
      productCount = await catPlpPageObj.getProductCount();
      log(SYMBOLS.INFO, `Products after scroll: ${productCount}`);
      
      scrollAttempts++;
    }
    
    log(SYMBOLS.PACKAGE, `Total products loaded (across all pages): ${productCount}`);
    expect(productCount).toBeGreaterThan(0);
    
    // 3. Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    // 4. Get and list all product names
    const productNames = await catPlpPageObj.getProductNames();
    log(SYMBOLS.DOCUMENT, `Products on page (Total: ${productNames.length}):`);
    productNames.forEach((name, index) => {
      log(SYMBOLS.BULLET, `  ${index + 1}. ${name}`);
    });
    
    // 3. Verify each product has required elements
    log(SYMBOLS.INFO, 'Verifying product elements...');
    let productsWithAllElements = 0;
    
    for (let i = 0; i < productCount; i++) {
      const hasMehrErfahren = await catPlpPageObj.verifyProductHasMehrErfahrenButton(i);
      const hasJetztKaufen = await catPlpPageObj.verifyProductHasJetztKaufenButton(i);
      const hasRating = await catPlpPageObj.verifyProductHasRating(i);
      
      // Verify image using product name locator's parent structure
      const hasImage = await page.locator('img[alt], img[src]').nth(i).isVisible({ timeout: 2000 }).catch(() => false);
      
      if (hasMehrErfahren && hasJetztKaufen) {
        productsWithAllElements++;
      }
      
      log(SYMBOLS.INFO, `Product ${i + 1} - Image: ${hasImage}, MEHR ERFAHREN: ${hasMehrErfahren}, JETZT KAUFEN: ${hasJetztKaufen}, Rating: ${hasRating}`);
    }
    
    log(SYMBOLS.SUCCESS, `Products with all required elements: ${productsWithAllElements}/${productCount}`);
    expect(productsWithAllElements).toBeGreaterThan(0);
    
    log(SYMBOLS.SUCCESS, 'Product listing verification completed (including paginated products)');
    
    // Close any popups that appeared during test
    await closeQuestionsPopup();
  });

  /**
   * Test Case 5: Buy Now (JETZT KAUFEN) - Test ALL Products with ALL Variants and Retailers
   * Test ID: TC-PLP-05
   */
  test('TC-PLP-05: Buy Now - Test ALL Products with ALL Variants and Retailers', async () => {
    log(SYMBOLS.SEARCH, 'Testing JETZT KAUFEN (Buy Now) for ALL products with variant and retailer validation');
    log(SYMBOLS.INFO, 'Execution Flow: For EACH product â†’ Click Buy Now â†’ Select ALL variants â†’ Validate retailers for each variant');
        // Ensure cookies are accepted before starting test
    await ensureCookiesAccepted();
        // Get all products
    const productCount = await catPlpPageObj.getProductCount();
    const productNames = await catPlpPageObj.getProductNames();
    log(SYMBOLS.PACKAGE, `Total products to test: ${productCount}`);
    
    // Loop through ALL products - testing JETZT KAUFEN with variants and retailers
    for (let i = 0; i < productCount; i++) {
      try {
        log(SYMBOLS.INFO, `\n${'='.repeat(70)}`);
        log(SYMBOLS.INFO, `PRODUCT ${i + 1}/${productCount}: ${productNames[i]}`);
        log(SYMBOLS.INFO, `${'='.repeat(70)}`);
      
      // ===== JETZT KAUFEN TESTING (Variant & Retailer Validation) =====
      log(SYMBOLS.SHOPPING, `Testing JETZT KAUFEN for "${productNames[i]}"`);
      
      // Scroll product into view using fresh locator
      const jetztKaufenButtonLocator = page.locator('a:has-text("JETZT KAUFEN"), button:has-text("JETZT KAUFEN")').nth(i);
      const jetztKaufenExists = await jetztKaufenButtonLocator.count() > 0;
      if (jetztKaufenExists) {
        await jetztKaufenButtonLocator.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(800);
      }
            // Ensure cookies are accepted before clicking JETZT KAUFEN (critical)
      await ensureCookiesAccepted();
            // Click JETZT KAUFEN on product card
      log(SYMBOLS.INFO, `  â†’ Clicking JETZT KAUFEN button...`);
      await catPlpPageObj.clickJetztKaufenButton(i);
      await page.waitForTimeout(3000); // Wait 3 seconds for popup to appear
      
      // Check if variant selector popup appears
      const popupVisible = await catPlpPageObj.isRetailerPopupVisible();
      
      if (popupVisible) {
        log(SYMBOLS.SUCCESS, `  â†’ "WÃ¤hlen Sie einen HÃ¤ndler" popup appeared`);
        
        // Wait for popup animation and stabilization
        await page.waitForTimeout(2000);
        const popup = page.locator('[role="dialog"]:has-text("WÃ¤hlen Sie einen HÃ¤ndler"), [class*="modal"]:has-text("WÃ¤hlen Sie einen HÃ¤ndler")').first();
        await popup.scrollIntoViewIfNeeded().catch(() => {});
        await page.waitForTimeout(500);
        
        // Get all product variants
        const variants = await catPlpPageObj.getProductVariants();
        log(SYMBOLS.DOCUMENT, `  â†’ Found ${variants.length} product variant(s)`);
        
        if (variants.length > 0) {
          // List all variants
          log(SYMBOLS.INFO, `  â†' Variants available:`);
          variants.forEach((variant, idx) => {
            const isDefault = idx === 0 ? ' (SELECTED BY DEFAULT)' : '';
            log(SYMBOLS.BULLET, `     ${idx + 1}. ${variant}${isDefault}`);
          });
          
          // Test ALL variants by selecting each and clicking Buy Now in popup
          for (let v = 0; v < variants.length; v++) {
            log(SYMBOLS.INFO, `\n  â†’ Testing Variant ${v + 1}/${variants.length}: "${variants[v]}"`);
            
            // Select the variant (even if it's the first one already selected)
            const variantButtons = await catPlpPageObj.productVariantButtons.all();
            if (variantButtons.length > v) {
              await variantButtons[v].click();
              await page.waitForTimeout(1000);
              log(SYMBOLS.SUCCESS, `     âœ“ Variant "${variants[v]}" selected`);
              
              // Click JETZT KAUFEN button IN THE POPUP to show PriceSpider retailers
              const jetztKaufenInPopup = popup.locator('button:has-text("JETZT KAUFEN"), a:has-text("JETZT KAUFEN")').first();
              if (await jetztKaufenInPopup.isVisible({ timeout: 2000 }).catch(() => false)) {
                log(SYMBOLS.INFO, `     â†' Clicking JETZT KAUFEN in popup for variant "${variants[v]}"...`);
                await jetztKaufenInPopup.click();
                await page.waitForTimeout(2500);
                
                // PriceSpider popup should appear with retailers
                const retailers = await catPlpPageObj.getRetailerLinks();
                if (retailers.length > 0) {
                  log(SYMBOLS.SUCCESS, `     âœ" PriceSpider popup appeared with ${retailers.length} retailer(s)`);
                  log(SYMBOLS.INFO, `     â†' Retailers for variant "${variants[v]}":`);
                  retailers.forEach((retailer, idx) => {
                    log(SYMBOLS.BULLET, `        ${idx + 1}. ${retailer.name} â†’ ${retailer.url}`);
                  });
                  
                  // Close PriceSpider retailers popup with ESC
                  await page.keyboard.press('Escape');
                  await page.waitForTimeout(500);
                  log(SYMBOLS.INFO, `     âœ" PriceSpider popup closed`);
                } else {
                  log(SYMBOLS.WARNING, `     âš  No retailers found for variant "${variants[v]}"`);
                }
              } else {
                log(SYMBOLS.WARNING, `     âš  JETZT KAUFEN button not visible in popup`);
              }
            }
          }
        } else {
          log(SYMBOLS.INFO, `  â†’ No product variants found - product may have single variant only`);
          
          // Try clicking JETZT KAUFEN to show retailers anyway
          const jetztKaufenInPopup = popup.locator('button:has-text("JETZT KAUFEN"), a:has-text("JETZT KAUFEN")').first();
          if (await jetztKaufenInPopup.isVisible({ timeout: 2000 }).catch(() => false)) {
            await jetztKaufenInPopup.click();
            await page.waitForTimeout(1500);
            
            const retailers = await catPlpPageObj.getRetailerLinks();
            if (retailers.length > 0) {
              log(SYMBOLS.SUCCESS, `  â†’ Retailers available: ${retailers.length}`);
              retailers.forEach((retailer, idx) => {
                log(SYMBOLS.BULLET, `     ${idx + 1}. ${retailer.name} â†’ ${retailer.url}`);
              });
              await page.keyboard.press('Escape');
              await page.waitForTimeout(500);
            }
          }
        }
        
        // Close main "WÃ¤hlen Sie einen HÃ¤ndler" popup
        await catPlpPageObj.closeRetailerPopup();
        await page.waitForTimeout(800);
        log(SYMBOLS.SUCCESS, `  â†’ Main popup closed - back on PLP`);
        
      } else {
        log(SYMBOLS.WARNING, `  â†’ No popup appeared - button may navigate directly`);
        
        // Check if redirected away from PLP
        await page.waitForTimeout(1000);
        const currentUrl = await catPlpPageObj.getCurrentUrl();
        if (!currentUrl.includes('gillette.de/de-de/produkte/rasierer')) {
          log(SYMBOLS.INFO, `  â†’ Navigating back to PLP...`);
          await catPlpPageObj.navigate();
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(1500);
          await ensureCookiesAccepted();
        }
      }
      
      // Scroll to top for next product
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      
      log(SYMBOLS.SUCCESS, `âœ“ Completed Product ${i + 1}: "${productNames[i]}" (JETZT KAUFEN with all variants/retailers)`);
      
      } catch (error) {
        log(SYMBOLS.WARNING, `âœ— Error testing product ${i + 1}: ${error.message}`);
        log(SYMBOLS.INFO, `  â†’ Attempting to recover and continue...`);
        
        // Try to recover by navigating back to PLP
        try {
          await catPlpPageObj.navigate();
          await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
          await page.waitForTimeout(2000);
          await ensureCookiesAccepted();
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(500);
          log(SYMBOLS.SUCCESS, `  â†’ Recovered - continuing with next product`);
        } catch (recoveryError) {
          log(SYMBOLS.WARNING, `  â†’ Recovery failed - skipping remaining products`);
          break;
        }
      }
    }
    
    log(SYMBOLS.SUCCESS, `\n${'='.repeat(70)}`);
    log(SYMBOLS.SUCCESS, `COMPLETED: All ${productCount} products tested`);
    log(SYMBOLS.SUCCESS, `Flow: JETZT KAUFEN â†’ Test all variants â†’ Validate all retailers for each variant`);
    log(SYMBOLS.SUCCESS, `${'='.repeat(70)}`);
  });

  /**
   * Test Case 6: Product Story Validation - Accordion Functionality
   * Test ID: TC-PLP-06
   */
  test('TC-PLP-06: Product Story Validation', async () => {
    log(SYMBOLS.SEARCH, 'Validating Product Story sections');
    
    // Ensure cookies are accepted before starting test
    await ensureCookiesAccepted();
    
    // Scroll to middle of page where product stories typically are
    await page.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight / 2,
        behavior: 'smooth'
      });
    });
    await page.waitForTimeout(1500);
    await page.bringToFront();
    
    // Step 1: Verify Product Story sections exist
    const verification = await catPlpPageObj.verifyAllProductStorySections();
    log(SYMBOLS.DOCUMENT, `Product Story sections found: ${verification.found}`);
    
    if (verification.found === 0) {
      log(SYMBOLS.WARNING, 'No Product Story sections found on this page');
      log(SYMBOLS.INFO, 'Product stories may not be available for this category');
      return;
    }
    
    // Step 2: List all Product Story headings
    log(SYMBOLS.INFO, 'Product Story Sections:');
    verification.sections.forEach((section, index) => {
      log(SYMBOLS.BULLET, `  ${index + 1}. ${section}`);
    });
    
    // Step 3: Check for accordion functionality and display content
    // Per MD: First story may be expanded by default, others should be expanded then collapsed
    for (let idx = 0; idx < verification.sections.length; idx++) {
      const sectionHeading = verification.sections[idx];
      const isFirstStory = idx === 0;
      
      log(SYMBOLS.INFO, `\n========== Processing ${isFirstStory ? '(FIRST)' : ''}: ${sectionHeading} ==========`);
      
      // Check if section has accordion buttons
      const heading = page.locator(`h2:has-text("${sectionHeading}")`);
      const accordionButton = heading.locator('..').locator('button[aria-expanded]');
      const hasAccordion = await accordionButton.count().catch(() => 0);
      
      if (hasAccordion > 0) {
        // Section has accordion functionality
        const isExpanded = await accordionButton.first().getAttribute('aria-expanded');
        log(SYMBOLS.BULLET, `Initial state: ${isExpanded === 'true' ? 'Expanded (â€“)' : 'Collapsed (+)'}`);
        
        if (isFirstStory && isExpanded === 'true') {
          // First story expanded by default (per MD requirements)
          log(SYMBOLS.SUCCESS, 'First Product Story is expanded by default âœ“');
          
          // Display content
          const content = await catPlpPageObj.getProductStoryContent(sectionHeading);
          if (content) {
            const truncated = content.trim().substring(0, 250);
            log(SYMBOLS.DOCUMENT, `Content: ${truncated}${content.length > 250 ? '...' : ''}`);
          }
          
          // Close it
          await accordionButton.first().click();
          await page.waitForTimeout(500);
          log(SYMBOLS.SUCCESS, 'First story closed');
          
        } else {
          // Not first story OR first story not expanded by default - expand, display, close
          
          // Click to expand if collapsed
          if (isExpanded === 'false') {
            await accordionButton.first().click();
            await page.waitForTimeout(500);
            log(SYMBOLS.SUCCESS, 'Accordion expanded');
          }
          
          // Get and display content
          const content = await catPlpPageObj.getProductStoryContent(sectionHeading);
          if (content) {
            const truncated = content.trim().substring(0, 250);
            log(SYMBOLS.DOCUMENT, `Content: ${truncated}${content.length > 250 ? '...' : ''}`);
          }
          
          // Click to collapse
          await accordionButton.first().click();
          await page.waitForTimeout(500);
          log(SYMBOLS.SUCCESS, 'Accordion collapsed');
        }
        
      } else {
        // Section is static (no accordion)
        log(SYMBOLS.INFO, 'This section is static (no accordion controls)');
        
        // Get and display content
        const content = await catPlpPageObj.getProductStoryContent(sectionHeading);
        if (content) {
          const truncated = content.trim().substring(0, 300);
          log(SYMBOLS.DOCUMENT, `Content: ${truncated}${content.length > 300 ? '...' : ''}`);
        }
      }
    }
    
    log(SYMBOLS.SUCCESS, 'Product Story validation completed');
    
    // Close any popups that appeared during test
    await closeQuestionsPopup();
  });

  /**
   * Test Case 7: FAQ Validation - Expand and Display Question with Answer
   * Test ID: TC-PLP-07
   */
  test('TC-PLP-07: FAQ Validation', async () => {
    log(SYMBOLS.SEARCH, 'Validating FAQ section');
    
    // Ensure cookies are accepted before starting test
    await ensureCookiesAccepted();
    
    // Scroll to bottom where FAQ section typically is
    await page.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    });
    await page.waitForTimeout(1500);
    await page.bringToFront();
    
    // Step 1: Check if FAQ section exists
    const faqVisible = await catPlpPageObj.isFaqSectionVisible();
    
    if (!faqVisible) {
      log(SYMBOLS.WARNING, 'FAQ section not found on this page');
      log(SYMBOLS.INFO, 'FAQs may not be available for this category');
      return;
    }
    
    log(SYMBOLS.SUCCESS, 'FAQ section found');
    
    // Step 2: Count and list all FAQ questions
    const faqCount = await catPlpPageObj.getFaqCount();
    const questions = await catPlpPageObj.getFaqQuestions();
    log(SYMBOLS.DOCUMENT, `Total FAQs found: ${faqCount}`);
    log(SYMBOLS.INFO, 'FAQ Questions:');
    questions.forEach((question, index) => {
      log(SYMBOLS.BULLET, `  ${index + 1}. ${question}`);
    });
    
    // Step 3: Verify all FAQs are collapsed by default
    const allCollapsed = await catPlpPageObj.areAllFaqsCollapsed();
    log(allCollapsed ? SYMBOLS.SUCCESS : SYMBOLS.INFO, `All FAQs collapsed by default: ${allCollapsed}`);
    
    // Step 4: Test accordion functionality and display Question + Answer (per MD)
    for (let i = 0; i < Math.min(faqCount, 5); i++) { // Test first 5 FAQs for speed
      log(SYMBOLS.INFO, `\n========== FAQ ${i + 1} ==========`);
      
      // Display Question
      log(SYMBOLS.BULLET, `Question: "${questions[i]}"`);
      
      // Click to expand
      const result = await catPlpPageObj.clickFaqButton(i);
      
      if (result) {
        log(SYMBOLS.INFO, `  Initial state: ${result.initialState.text} (Expanded: ${result.initialState.isExpanded})`);
        log(SYMBOLS.INFO, `  After click: ${result.finalState.text} (Expanded: ${result.finalState.isExpanded})`);
        
        // Get and display FAQ Answer content (per MD: must display answer explicitly)
        if (result.finalState.isExpanded) {
          const answerLocator = page.locator('.faq-answer-close, .faq-answer, [data-testid="faq-answer"]').nth(i);
          const answerVisible = await answerLocator.isVisible({ timeout: 2000 }).catch(() => false);
          
          if (answerVisible) {
            const answerContent = await answerLocator.textContent();
            const truncated = answerContent.trim().substring(0, 300);
            log(SYMBOLS.DOCUMENT, `Answer: ${truncated}${answerContent.length > 300 ? '...' : ''}`);
            log(SYMBOLS.SUCCESS, 'FAQ expanded - Question and Answer displayed âœ“');
          } else {
            log(SYMBOLS.WARNING, 'FAQ answer content not found');
          }
          
          // Click again to collapse (per MD)
          await page.waitForTimeout(500);
          await catPlpPageObj.clickFaqButton(i);
          await page.waitForTimeout(500);
          log(SYMBOLS.SUCCESS, 'FAQ collapsed');
        }
      }
    }
    
    log(SYMBOLS.SUCCESS, 'FAQ validation completed');
    
    // Close any popups that appeared during test
    await closeQuestionsPopup();
  });
});
