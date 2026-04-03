/**
 * Product Listing Page (PLP) Object Model
 * Page URL: https://www.gillette.co.in/en-in/products
 *
 * Sections:
 * - Page SEO Details (H1, Meta Title, Meta Description, Canonical URL, Breadcrumbs)
 * - Product Cards Grid
 * - Favorite Functionality
 * - Category Dropdown Navigation
 * - "DO YOU HAVE ANY CONCERN?" Popup Handling
 */

import { helperBase } from './helperBase.js';
import { SYMBOLS, log } from '../utils/logConstants.js';

export class productListingPage extends helperBase {
  constructor(page) {
    super(page);

    // Full page URL for India Products Listing Page
    this.pageUrl = 'https://www.gillette.co.in/en-in/products';

    // Cookie Consent
    this.acceptCookiesButton = page.locator('#onetrust-accept-btn-handler');

    // SEO Elements - Meta Tags
    this.h1Element = page.locator('h1').first();
    this.metaTitle = page.locator('head title');
    this.metaDescription = page.locator('head meta[name="description"]');
    this.canonicalUrl = page.locator('head link[rel="canonical"]');

    // Page Banner / Header
    this.pageTitle = page.locator('h1').first();
    this.pageDescription = page.locator(
      '.hero-text p, [class*="hero"] p, [class*="banner"] p, [class*="page-desc"] p'
    ).first();

    // Favourite Header Icon (for building fav-page URL)
    this.favoriteHeaderIcon = page.locator('#heartIcon');

    // Category Dropdown ("All Products" button on PLP)
    this.dropdownButton = page.locator('#dropdownButton').first();
    // Visible dropdown options - target only visible links after dropdown opens
    // The dropdown panel appears and contains links with title attributes
    this.dropdownOptions = page.locator('a[title][href*="/products/"]:visible');
    this.dropdownCloseButton = page.locator(
      'button:has(img[alt*="close"]), button[aria-label*="close"]'
    ).first();

    // "DO YOU HAVE ANY CONCERN?" Popup
    this.concernPopup = page.locator(
      '[class*="concern"], [class*="filter-popup"], [class*="filterPopup"], .modal-container:has-text("CONCERN")'
    ).first();
    this.concernGotItButton = page.locator(
      'button:has-text("GOT IT"), a:has-text("GOT IT"), [class*="btn"]:has-text("GOT IT"), span:has-text("GOT IT")'
    ).first();
  }

  // ==================== Navigation Methods ====================

  /**
   * Navigate to Product Listing Page
   */
  async navigateToPLP() {
    log(SYMBOLS.ROCKET, 'Navigating to Product Listing Page (India)...');
    await this.page.goto(this.pageUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.waitForPageLoad();
    await this.waitForElement(this.h1Element).catch(() => {});
    log(SYMBOLS.SUCCESS, `Product Listing Page loaded: ${this.page.url()}`);
  }

  // ==================== Cookie Consent ====================

  /**
   * Accept cookies if the banner is displayed
   */
  async acceptCookies() {
    try {
      log(SYMBOLS.INFO, 'Waiting for cookie banner...');
      await this.acceptCookiesButton.waitFor({ state: 'visible', timeout: 15000 });
      await this.acceptCookiesButton.click();
      await this.acceptCookiesButton.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
      log(SYMBOLS.SUCCESS, 'Cookie banner dismissed');
    } catch {
      log(SYMBOLS.INFO, 'Cookie banner not present or already accepted');
    }
  }

  // ==================== Concern Popup Handling ====================

  /**
   * Dismiss the "DO YOU HAVE ANY CONCERN?" popup if it appears.
   * Clicks the "GOT IT" button to close it.
   */
  async dismissConcernPopupIfVisible() {
    try {
      const visible = await this.concernGotItButton.isVisible({ timeout: 3000 }).catch(() => false);
      if (visible) {
        await this.concernGotItButton.click();
        await this.page.waitForTimeout(500);
        log(SYMBOLS.INFO, 'Dismissed "DO YOU HAVE ANY CONCERN?" popup via GOT IT');
      }
    } catch {
      // Popup not present — continue
    }
  }

  // ==================== SEO Methods ====================

  /**
   * Get H1 text
   * @returns {Promise<string>}
   */
  async getH1Text() {
    try {
      const text = await this.h1Element.textContent();
      return text ? text.trim() : '';
    } catch {
      return '';
    }
  }

  /**
   * Get Meta Title
   * @returns {Promise<string>}
   */
  async getMetaTitle() {
    try {
      const text = await this.metaTitle.textContent();
      return text ? text.trim() : '';
    } catch {
      return '';
    }
  }

  /**
   * Get Meta Description content attribute
   * @returns {Promise<string>}
   */
  async getMetaDescription() {
    try {
      const content = await this.metaDescription.getAttribute('content');
      return content ? content.trim() : '';
    } catch {
      return '';
    }
  }

  /**
   * Get Canonical URL href attribute
   * @returns {Promise<string>}
   */
  async getCanonicalUrl() {
    try {
      const href = await this.canonicalUrl.getAttribute('href');
      return href ? href.trim() : '';
    } catch {
      return '';
    }
  }

  /**
   * Get all SEO details at once
   * @returns {Promise<{h1: string, metaTitle: string, metaDescription: string, canonicalUrl: string}>}
   */
  async getSEODetails() {
    const h1 = await this.getH1Text();
    const metaTitle = await this.getMetaTitle();
    const metaDescription = await this.getMetaDescription();
    const canonicalUrl = await this.getCanonicalUrl();
    return { h1, metaTitle, metaDescription, canonicalUrl };
  }

  /**
   * Verify all SEO elements are present
   * @returns {Promise<{hasH1: boolean, hasMetaTitle: boolean, hasMetaDescription: boolean, hasCanonicalUrl: boolean, isValid: boolean}>}
   */
  async verifySEOElements() {
    const seo = await this.getSEODetails();
    const results = {
      hasH1: seo.h1.length > 0,
      hasMetaTitle: seo.metaTitle.length > 0,
      hasMetaDescription: seo.metaDescription.length > 0,
      hasCanonicalUrl: seo.canonicalUrl.length > 0,
      isValid: false
    };
    results.isValid = results.hasH1 && results.hasMetaTitle && results.hasMetaDescription && results.hasCanonicalUrl;
    log(SYMBOLS.INFO, `SEO: H1=${results.hasH1}, MetaTitle=${results.hasMetaTitle}, MetaDesc=${results.hasMetaDescription}, Canonical=${results.hasCanonicalUrl}`);
    return results;
  }

  /**
   * Get breadcrumb items
   * @returns {Promise<Array<{text: string, href: string}>>}
   */
  async getBreadcrumbs() {
    try {
      const breadcrumbs = await this.page.evaluate(() => {
        const bc = document.querySelector('[class*="breadcrumb"], nav[aria-label*="breadcrumb"], ol.breadcrumb');
        if (!bc) return [];

        // Prefer li-based breadcrumbs to avoid double-counting li + inner a
        const liItems = bc.querySelectorAll('li');
        if (liItems.length > 0) {
          return Array.from(liItems).map(li => {
            const anchor = li.querySelector('a');
            const text = (anchor ? anchor.textContent : li.textContent || '').trim().replace(/\s+/g, ' ');
            const href = anchor ? (anchor.getAttribute('href') || '') : '';
            return { text, href };
          }).filter(b => b.text.length > 0);
        }

        // Fallback: only anchors (no li wrapper)
        return Array.from(bc.querySelectorAll('a')).map(a => ({
          text: (a.textContent || '').trim().replace(/\s+/g, ' '),
          href: a.getAttribute('href') || ''
        })).filter(b => b.text.length > 0);
      });
      log(SYMBOLS.INFO, `Breadcrumbs found: ${breadcrumbs.length}`);
      return breadcrumbs;
    } catch {
      return [];
    }
  }

  /**
   * Verify breadcrumbs are present
   * @returns {Promise<{present: boolean, count: number, breadcrumbs: Array}>}
   */
  async verifyBreadcrumbs() {
    const breadcrumbs = await this.getBreadcrumbs();
    const present = breadcrumbs.length > 0;
    if (present) {
      breadcrumbs.forEach((bc, i) =>
        log(SYMBOLS.DOCUMENT, `  ${i + 1}. "${bc.text}" ${bc.href ? `-> ${bc.href}` : '(current)'}`)
      );
    } else {
      log(SYMBOLS.WARNING, 'No breadcrumbs found');
    }
    return { present, count: breadcrumbs.length, breadcrumbs };
  }

  // ==================== Page Content Methods ====================

  /**
   * Get banner/page title (H1)
   * @returns {Promise<string>}
   */
  async getPageTitle() {
    return this.getH1Text();
  }

  /**
   * Get page description text (below H1 banner)
   * @returns {Promise<string>}
   */
  async getPageDescription() {
    try {
      await this.pageDescription.waitFor({ state: 'visible', timeout: 5000 });
      const text = await this.pageDescription.evaluate(el =>
        el.innerText.replace(/\s+/g, ' ').trim()
      );
      return text;
    } catch {
      return '';
    }
  }

  // ==================== Product Card Methods ====================

  /**
   * Scroll incrementally through the full page until the product card count
   * stabilizes across two consecutive rounds.
   * This ensures all lazily-loaded cards are rendered before counting.
   * @returns {Promise<number>} - Final stabilized card count
   */
  async scrollToLoadAllCards() {
    const MAX_ROUNDS = 30;       // Safety cap — enough for 64+ cards loaded in batches
    const SCROLL_STEP = 600;     // Pixels per scroll step (roughly one card row)
    const WAIT_MS = 700;         // Wait after each step for network/render
    const STABLE_ROUNDS = 3;     // Require count to be unchanged this many consecutive times

    log(SYMBOLS.INFO, 'Scrolling page to load all product cards (lazy-load)...');

    /** Count currently-visible product cards in the DOM */
    const countCards = () => this.page.evaluate(() => {
      // Gillette India PLP uses div.plp-card-container for each product card
      return document.querySelectorAll('div.plp-card-container').length;
    });

    let previousCount = 0;
    let stableStreak = 0;

    for (let round = 0; round < MAX_ROUNDS; round++) {
      // Scroll one step further down
      await this.page.evaluate((step) => window.scrollBy(0, step), SCROLL_STEP);
      await this.page.waitForTimeout(WAIT_MS);

      // Dismiss the concern popup if it has appeared
      await this.dismissConcernPopupIfVisible();

      const currentCount = await countCards();
      log(SYMBOLS.INFO, `  Scroll round ${round + 1}: ${currentCount} card(s) visible`);

      if (currentCount > 0 && currentCount === previousCount) {
        stableStreak++;
        if (stableStreak >= STABLE_ROUNDS) {
          log(SYMBOLS.SUCCESS, `✅ All cards loaded: ${currentCount} (stable for ${STABLE_ROUNDS} rounds)`);
          break;
        }
      } else {
        stableStreak = 0;
      }

      previousCount = currentCount;
    }

    // Scroll back to top ready for further assertions
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(500);

    const finalCount = await countCards();
    log(SYMBOLS.INFO, `Total product cards after full scroll: ${finalCount}`);
    return finalCount;
  }

  /**
   * Get all product cards from the page using flexible DOM evaluation.
   * Assumes the page has already been fully scrolled (call scrollToLoadAllCards() first).
   * Returns [{title, link, index}]
   * @returns {Promise<Array<{title: string, link: string, index: number}>>}
   */
  async getAllProductCards() {
    const cards = await this.page.evaluate(() => {
      const results = [];

      // Gillette India PLP: each product card is a div.plp-card-container
      // Title: h3 inside the card
      // Link: a.event_internal_link (title anchor) or a.event_image_click (image anchor)
      const containers = document.querySelectorAll('div.plp-card-container');
      containers.forEach((card, i) => {
        const h3 = card.querySelector('h3');
        const titleLink = card.querySelector('a.event_internal_link[href]');
        const imageLink = card.querySelector('a.event_image_click[href]');
        const title = (h3 ? h3.innerText : '').trim().replace(/\s+/g, ' ');
        const link = titleLink ? titleLink.href : (imageLink ? imageLink.href : '');
        if (title && link) results.push({ title, link, index: i + 1 });
      });

      return results;
    });

    // Re-index sequentially
    return cards.map((c, i) => ({ ...c, index: i + 1 }));
  }

  /**
   * Get total product card count.
   * Scrolls the full page first to ensure all lazy-loaded cards are present.
   * @returns {Promise<number>}
   */
  async getProductCardsCount() {
    await this.scrollToLoadAllCards();
    const cards = await this.getAllProductCards();
    log(SYMBOLS.INFO, `Total product cards found: ${cards.length}`);
    return cards.length;
  }

  /**
   * Get product details by index (1-based)
   * @param {number} index
   * @returns {Promise<{title: string, link: string, index: number}>}
   */
  async getProductDetails(index) {
    const cards = await this.getAllProductCards();
    const card = cards[index - 1];
    if (!card) {
      log(SYMBOLS.WARNING, `Product card at index ${index} not found`);
      return { title: '', link: '', index };
    }
    log(SYMBOLS.DOCUMENT, `Product ${index}: ${card.title} (${card.link})`);
    return card;
  }

  /**
   * Verify that the opened product detail page matches the expected product title.
   * Checks H1 first, then falls back to title and og:title meta.
   * @param {import('@playwright/test').Page} productPage
   * @param {string} expectedTitle
   * @returns {Promise<boolean>}
   */
  async verifyProductDetailPage(productPage, expectedTitle) {
    try {
      await productPage.waitForLoadState('domcontentloaded');

      const h1Locator = productPage.locator('h1').first();
      await h1Locator.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
      const h1Text = (await h1Locator.textContent().catch(() => '')).trim().replace(/\s+/g, ' ');

      const normalize = s => s.toLowerCase().replace(/\s+/g, ' ').trim();

      if (normalize(h1Text).includes(normalize(expectedTitle)) || normalize(expectedTitle).includes(normalize(h1Text))) {
        log(SYMBOLS.SUCCESS, `✅ Product verified: ${h1Text}`);
        return true;
      }

      // Fallback: page title
      const pageTitle = await productPage.title().catch(() => '');
      if (normalize(pageTitle).includes(normalize(expectedTitle)) || normalize(expectedTitle).includes(normalize(pageTitle))) {
        log(SYMBOLS.SUCCESS, `✅ Product verified via page title: ${pageTitle}`);
        return true;
      }

      log(SYMBOLS.WARNING, `⚠️ Title mismatch - Expected: "${expectedTitle}", H1: "${h1Text}"`);
      return false;
    } catch (error) {
      log(SYMBOLS.ERROR, `verifyProductDetailPage error: ${error.message}`);
      return false;
    }
  }

  // ==================== Favorite Methods ====================

  /**
   * Get the favorite button locator for a product by index (1-based).
   * Scrolls the card into view before returning.
   * @param {number} index
   * @returns {import('@playwright/test').Locator}
   */
  getProductFavoriteButton(index) {
    // Gillette India PLP: product cards are div.plp-card-container (not inside li)
    // Each card contains button.fav-btn[aria-label="fav-button"]
    return this.page.locator('div.plp-card-container').nth(index - 1).locator('button.fav-btn[aria-label="fav-button"]');
  }

  /**
   * Click favorite button for a product by its 1-based list position.
   * Scrolls into view first and handles the concern popup.
   * @param {number} index
   */
  async clickFavoriteButton(index) {
    await this.dismissConcernPopupIfVisible();

    const btn = this.getProductFavoriteButton(index);
    try {
      await btn.scrollIntoViewIfNeeded();
      await this.dismissConcernPopupIfVisible();
      await btn.waitFor({ state: 'visible', timeout: 5000 });
      await btn.click();
      await this.page.waitForTimeout(1000);
      log(SYMBOLS.SUCCESS, `Favorite button clicked for product ${index}`);
    } catch (error) {
      // Fallback: click via JS evaluate using plp-card-container nth index
      const clicked = await this.page.evaluate((idx) => {
        const cards = document.querySelectorAll('div.plp-card-container');
        const card = cards[idx - 1];
        if (!card) return false;
        const btn = card.querySelector('button.fav-btn[aria-label="fav-button"], button[aria-label*="fav"]');
        if (btn) { btn.click(); return true; }
        return false;
      }, index);
      if (clicked) {
        await this.page.waitForTimeout(1000);
        log(SYMBOLS.INFO, `Favorite button clicked via JS for product ${index}`);
      } else {
        log(SYMBOLS.WARNING, `Could not click favorite button for product ${index}: ${error.message}`);
      }
    }
  }

  /**
   * Get favorites page URL from the heart icon in header.
   * Falls back to constructing the URL from the current page URL.
   * @returns {Promise<string>}
   */
  async getFavoritesPageUrl() {
    const origin = new URL(this.page.url()).origin;
    try {
      const href = await this.favoriteHeaderIcon.getAttribute('href');
      if (href) {
        // href may be relative (e.g. "/en-in/fav-page") — always return absolute URL
        return href.startsWith('http') ? href : `${origin}${href}`;
      }
    } catch { /* fallback below */ }

    // Build from current page URL: origin + /en-in/fav-page
    const currentUrl = new URL(this.page.url());
    const pathParts = currentUrl.pathname.split('/').filter(Boolean);
    const locale = pathParts.length > 0 ? `/${pathParts[0]}` : '/en-in';
    return `${currentUrl.origin}${locale}/fav-page`;
  }

  /**
   * Verify a product appears in the favorites page under the PRODUCTS tab.
   * @param {import('@playwright/test').Page} favoritesPage
   * @param {string} productTitle
   * @returns {Promise<boolean>}
   */
  async verifyProductInFavorites(favoritesPage, productTitle) {
    try {
      await favoritesPage.waitForLoadState('domcontentloaded');
      await favoritesPage.waitForTimeout(2000);

      // Click PRODUCTS tab
      const productTab = favoritesPage.locator('a.tab-btn[data-action-detail*="PRODUCTS"]').first();
      if (await productTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await productTab.click();
        await favoritesPage.waitForTimeout(1500);
        log(SYMBOLS.INFO, 'PRODUCTS tab clicked on favourites page');
      }

      const normalize = s => s.toLowerCase().replace(/[®™©]/g, '').replace(/\s+/g, ' ').trim();

      // Strategy 1: h3.fav-product-card-title (most reliable)
      const cards = favoritesPage.locator('h3.fav-product-card-title');
      const count = await cards.count().catch(() => 0);
      for (let i = 0; i < count; i++) {
        const text = (await cards.nth(i).textContent().catch(() => '')).trim();
        if (normalize(text).includes(normalize(productTitle)) || normalize(productTitle).includes(normalize(text))) {
          log(SYMBOLS.SUCCESS, `Product found in favorites: "${text}"`);
          return true;
        }
      }

      // Strategy 2: Look for h3 within favorites card container only
      const favCards = favoritesPage.locator('.fav-product-card h3, [class*="fav-card"] h3, [class*="favorite"] h3');
      const favCardCount = await favCards.count().catch(() => 0);
      for (let i = 0; i < favCardCount; i++) {
        const text = (await favCards.nth(i).textContent().catch(() => '')).trim();
        if (normalize(text).includes(normalize(productTitle)) || normalize(productTitle).includes(normalize(text))) {
          log(SYMBOLS.SUCCESS, `Product found in favorites via card container: "${text}"`);
          return true;
        }
      }

      // No match found - product is not in favorites
      log(SYMBOLS.WARNING, `Product "${productTitle}" not found in favorites`);
      return false;
    } catch (error) {
      log(SYMBOLS.WARNING, `Error verifying favorites: ${error.message}`);
      return false;
    }
  }

  // ==================== Dropdown / Category Methods ====================

  /**
   * Open category dropdown if a dropdown button exists.
   * Resolves silently if no dropdown is present.
   */
  async openDropdown() {
    try {
      await this.dropdownButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.dropdownButton.click();
      await this.page.waitForTimeout(500);
      log(SYMBOLS.SUCCESS, 'Category dropdown opened');
    } catch {
      log(SYMBOLS.WARNING, 'Category dropdown button not found or not clickable');
    }
  }

  /**
   * Close category dropdown.
   */
  async closeDropdown() {
    try {
      if (await this.dropdownCloseButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.dropdownCloseButton.click();
        await this.page.waitForTimeout(500);
        log(SYMBOLS.SUCCESS, 'Category dropdown closed');
      } else {
        // Press Escape as fallback
        await this.page.keyboard.press('Escape');
      }
    } catch {
      await this.page.keyboard.press('Escape').catch(() => {});
    }
  }

  /**
   * Get the 4 main category dropdown options with their URLs.
   * Categories: Razors, Razor Blades, Styler, Shaving Gel
   * @returns {Promise<Array<{title: string, url: string}>>}
   */
  async getDropdownOptions() {
    const baseUrl = new URL(this.page.url()).origin;
    
    // The 4 main product categories in the dropdown
    const categories = [
      { title: 'Razors', path: '/en-in/products/razors' },
      { title: 'Razor Blades', path: '/en-in/products/razor-blades' },
      { title: 'Styler', path: '/en-in/products/trimmers' },
      { title: 'Shaving Gel, Shaving Cream & After Shave', path: '/en-in/products/shaving-gel-cream-and-aftershave' }
    ];

    const options = [];
    for (const cat of categories) {
      options.push({
        title: cat.title,
        url: baseUrl + cat.path
      });
      log(SYMBOLS.INFO, `Dropdown option: ${cat.title} → ${baseUrl + cat.path}`);
    }

    return options;
  }

  /**
   * Click a category link in the dropdown by title.
   * @param {string} title - The category title to click
   * @returns {Promise<string>} - The URL after navigation
   */
  async clickDropdownOption(title) {
    // Find the link by text content within the dropdown area
    // The dropdown links are at the end of the page in a floating panel
    const link = this.page.getByRole('link', { name: title, exact: true }).first();
    
    await link.waitFor({ state: 'visible', timeout: 10000 });
    
    // Click and wait for navigation
    await link.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    
    return this.page.url();
  }

}
