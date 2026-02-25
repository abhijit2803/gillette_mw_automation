/**
 * PLP (Product Listing Page) Page Object
 * Contains all selectors and methods for the Gillette Germany Product Listing Page
 */

export class plpPage {
  constructor(page) {
    this.page = page;
    this.baseUrl = 'https://www.gillette.de/de-de/produkte';

    // Page Header
    this.pageHeader = page.locator('h1');
    
    // Category Tabs
    this.categoryTabs = page.locator('.category-tabs, .plp-tabs, [role="tablist"]');
    this.categoryTab = (tabName) => page.locator(`button[role="tab"]:has-text("${tabName}"), a[role="tab"]:has-text("${tabName}"), .tab:has-text("${tabName}")`);
    
    // Product Cards - Main PLP shows category cards, not individual products
    // Use a more flexible selector that works for both product cards and category cards
    this.productCards = page.locator('a[href*="/produkte/"]:has(img)').locator('..');
    this.productTitle = page.locator('a[href*="/produkte/"]').filter({ hasNot: page.locator('img') });
    this.productRating = page.locator('.product-rating, .star-rating, [data-testid="rating"]');
    this.mehrErfahrenButton = page.locator('a:has-text("MEHR ERFAHREN"), button:has-text("MEHR ERFAHREN"), .learn-more-btn');
    this.jetztKaufenButton = page.locator('a:has-text("JETZT KAUFEN"), button:has-text("JETZT KAUFEN"), .buy-now-btn');
    
    // Retailer Popup
    this.retailerPopup = page.locator('.retailer-popup, [role="dialog"]:has-text("Wählen Sie einen Händler"), .modal:has-text("Händler")');
    this.retailerPopupTitle = page.locator('.retailer-popup h2, .modal-title:has-text("Wählen Sie einen Händler")');
    this.retailerLinks = page.locator('.retailer-popup a, .retailer-link, [data-testid="retailer-link"]');
    this.closePopupButton = page.locator('.retailer-popup button[aria-label*="Close"], .modal-close, button:has-text("×")');
    
    // Filters
    this.filterSection = page.locator('.filter-section, .plp-filters, [data-testid="filters"]');
    
    // NACH TYP Filter
    this.nachTypFilter = page.locator('button:has-text("NACH TYP"), .filter-button:has-text("NACH TYP"), [data-filter="type"]');
    this.nachTypOptions = page.locator('[data-filter="type"] input[type="checkbox"], [data-filter="type"] .filter-option');
    
    // NACH THEMA Filter
    this.nachThemaFilter = page.locator('button:has-text("NACH THEMA"), .filter-button:has-text("NACH THEMA"), [data-filter="theme"]');
    this.nachThemaOptions = page.locator('[data-filter="theme"] input[type="checkbox"], [data-filter="theme"] .filter-option');
    
    // NACH KOLLEKTIONEN Filter
    this.nachKollektionenFilter = page.locator('button:has-text("NACH KOLLEKTIONEN"), .filter-button:has-text("NACH KOLLEKTIONEN"), [data-filter="collections"]');
    this.nachKollektionenOptions = page.locator('[data-filter="collections"] input[type="checkbox"], [data-filter="collections"] .filter-option');
    
    // SORTIEREN NACH Filter
    this.sortierenNachFilter = page.locator('button:has-text("SORTIEREN NACH"), .filter-button:has-text("SORTIEREN NACH"), [data-filter="sort"]');
    this.sortierenNachOptions = page.locator('[data-filter="sort"] input[type="radio"], [data-filter="sort"] .filter-option');
    
    // Filter Buttons
    this.anwendenButton = page.locator('button:has-text("ANWENDEN"), .apply-filter-btn, [data-action="apply"]');
    this.allesLoeschenButton = page.locator('button:has-text("ALLES LÖSCHEN"), .clear-filter-btn, [data-action="clear"]');
    
    // PLP Dropdown
    this.plpDropdown = page.locator('select.plp-dropdown, .category-dropdown, [data-testid="plp-dropdown"]');
    this.plpDropdownOptions = page.locator('select.plp-dropdown option, .category-dropdown option');
    
    // Favorite Icon
    this.favoriteIcon = page.locator('.favorite-icon, button[aria-label*="Favorit"], .wishlist-icon');
    this.favoriteIcons = page.locator('.product-card .favorite-icon, .product-card button[aria-label*="Favorit"]');
    this.headerFavoriteCount = page.locator('.favorite-count, .wishlist-count, [data-testid="favorite-count"]');
    
    // SEO Elements
    this.metaTitleTag = page.locator('head title');
    this.metaDescriptionTag = page.locator('meta[name="description"]');
    this.ogTitleTag = page.locator('meta[property="og:title"]');
    this.ogDescriptionTag = page.locator('meta[property="og:description"]');
    this.canonicalUrlTag = page.locator('link[rel="canonical"]');
    this.h1Tag = page.locator('h1');
    this.h2Tags = page.locator('h2');
    this.h3Tags = page.locator('h3');
    
    // Cookie Banner
    this.cookiePopup = page.locator('#onetrust-consent-sdk, .cookie-popup, [role="dialog"][aria-label*="Cookie"]');
    this.cookieAcceptButton = page.locator('#onetrust-accept-btn-handler, button:has-text("Alle akzeptieren"), button:has-text("Accept")');
    
    // Links
    this.pageLinks = page.locator('a[href]');
  }

  // Navigation Methods
  async navigate() {
    try {
      await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } catch (error) {
      // Handle navigation interruption - wait and try once more
      if (error.message.includes('interrupted')) {
        await this.page.waitForTimeout(1000);
        await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      } else {
        throw error;
      }
    }
    await this.page.waitForTimeout(2000); // Allow dynamic content to load
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000); // Allow dynamic content to load
  }

  async acceptCookies() {
    try {
      const cookieButton = this.cookieAcceptButton;
      if (await cookieButton.isVisible({ timeout: 5000 })) {
        await cookieButton.click();
        await this.page.waitForTimeout(1000);
      }
    } catch (e) {
      console.log('Cookie banner not found or already accepted');
    }
  }

  // Page Verification Methods
  async verifyPageLoads() {
    await this.waitForPageLoad();
    const headerVisible = await this.pageHeader.isVisible({ timeout: 10000 }).catch(() => false);
    return headerVisible;
  }

  async getPageHeaderText() {
    return await this.pageHeader.textContent();
  }

  // Product Card Methods
  async getProductCards() {
    return await this.productCards.all();
  }

  async getProductCount() {
    const products = await this.getProductCards();
    return products.length;
  }

  async getProductNames() {
    const titles = await this.productTitle.allTextContents();
    return titles.map(t => t.trim()).filter(t => t);
  }

  async verifyProductHasRating(productIndex = 0) {
    const ratings = await this.productRating.all();
    if (ratings.length > productIndex) {
      return await ratings[productIndex].isVisible();
    }
    return false;
  }

  async verifyProductHasMehrErfahrenButton(productIndex = 0) {
    const buttons = await this.mehrErfahrenButton.all();
    if (buttons.length > productIndex) {
      return await buttons[productIndex].isVisible();
    }
    return false;
  }

  async verifyProductHasJetztKaufenButton(productIndex = 0) {
    const buttons = await this.jetztKaufenButton.all();
    if (buttons.length > productIndex) {
      return await buttons[productIndex].isVisible();
    }
    return false;
  }

  // Category Tab Methods
  async getCategoryTabs() {
    const tabs = await this.page.locator('button[role="tab"], a[role="tab"], .tab-item').allTextContents();
    return tabs.map(t => t.trim()).filter(t => t);
  }

  async clickCategoryTab(tabName) {
    await this.categoryTab(tabName).first().click();
    await this.waitForPageLoad();
  }

  // Link Verification Methods
  async getAllLinks() {
    const links = await this.pageLinks.all();
    const linkData = [];
    for (const link of links) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      if (href && text) {
        linkData.push({ text: text.trim(), href });
      }
    }
    return linkData;
  }

  async verifyLinkNavigates(linkSelector) {
    const href = await linkSelector.getAttribute('href');
    await linkSelector.click();
    await this.waitForPageLoad();
    return this.page.url();
  }

  // Product Button Methods
  async clickMehrErfahrenButton(productIndex = 0) {
    const buttons = await this.mehrErfahrenButton.all();
    if (buttons.length > productIndex) {
      // Use JavaScript click to bypass overlay issues
      await buttons[productIndex].evaluate(el => el.click());
      await this.waitForPageLoad();
      return this.page.url();
    }
    return null;
  }

  async clickJetztKaufenButton(productIndex = 0) {
    const buttons = await this.jetztKaufenButton.all();
    if (buttons.length > productIndex) {
      // Use JavaScript click to bypass overlay issues
      await buttons[productIndex].evaluate(el => el.click());
      await this.page.waitForTimeout(1500);
    }
  }

  // Retailer Popup Methods
  async isRetailerPopupVisible() {
    return await this.retailerPopup.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async getRetailerLinks() {
    const links = await this.retailerLinks.all();
    const retailerData = [];
    for (const link of links) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      if (href && text) {
        retailerData.push({ name: text.trim(), url: href });
      }
    }
    return retailerData;
  }

  async closeRetailerPopup() {
    if (await this.isRetailerPopupVisible()) {
      await this.closePopupButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  // Filter Methods - NACH TYP
  async clickNachTypFilter() {
    await this.nachTypFilter.click();
    await this.page.waitForTimeout(500);
  }

  async getNachTypOptions() {
    const options = await this.page.locator('[data-filter="type"] label, .filter-option label').allTextContents();
    return options.map(o => o.trim()).filter(o => o);
  }

  async selectNachTypOption(optionName) {
    const option = this.page.locator(`label:has-text("${optionName}") input, input[value="${optionName}"]`).first();
    await option.check();
  }

  // Filter Methods - NACH THEMA
  async clickNachThemaFilter() {
    await this.nachThemaFilter.click();
    await this.page.waitForTimeout(500);
  }

  async getNachThemaOptions() {
    const options = await this.page.locator('[data-filter="theme"] label, .filter-option label').allTextContents();
    return options.map(o => o.trim()).filter(o => o);
  }

  async selectNachThemaOption(optionName) {
    const option = this.page.locator(`label:has-text("${optionName}") input, input[value="${optionName}"]`).first();
    await option.check();
  }

  // Filter Methods - NACH KOLLEKTIONEN
  async clickNachKollektionenFilter() {
    await this.nachKollektionenFilter.click();
    await this.page.waitForTimeout(500);
  }

  async getNachKollektionenOptions() {
    const options = await this.page.locator('[data-filter="collections"] label, .filter-option label').allTextContents();
    return options.map(o => o.trim()).filter(o => o);
  }

  async selectNachKollektionenOption(optionName) {
    const option = this.page.locator(`label:has-text("${optionName}") input, input[value="${optionName}"]`).first();
    await option.check();
  }

  // Filter Methods - SORTIEREN NACH
  async clickSortierenNachFilter() {
    await this.sortierenNachFilter.click();
    await this.page.waitForTimeout(500);
  }

  async getSortierenNachOptions() {
    const options = await this.page.locator('[data-filter="sort"] label, .sort-option label').allTextContents();
    return options.map(o => o.trim()).filter(o => o);
  }

  async selectSortierenNachOption(optionName) {
    const option = this.page.locator(`label:has-text("${optionName}") input, input[value="${optionName}"]`).first();
    await option.check();
  }

  // Filter Action Methods
  async clickAnwendenButton() {
    await this.anwendenButton.click();
    await this.waitForPageLoad();
  }

  async clickAllesLoeschenButton() {
    await this.allesLoeschenButton.click();
    await this.page.waitForTimeout(500);
  }

  // Dropdown Methods
  async getDropdownOptions() {
    const options = await this.plpDropdownOptions.allTextContents();
    return options.map(o => o.trim()).filter(o => o);
  }

  async selectDropdownOption(optionValue) {
    await this.plpDropdown.selectOption(optionValue);
    await this.waitForPageLoad();
  }

  // Favorite Methods
  async clickFavoriteIconOnProduct(productIndex = 0) {
    const icons = await this.favoriteIcons.all();
    if (icons.length > productIndex) {
      await icons[productIndex].click();
      await this.page.waitForTimeout(1000);
    }
  }

  async getFavoriteCount() {
    const countText = await this.headerFavoriteCount.textContent().catch(() => '0');
    return parseInt(countText.trim()) || 0;
  }

  // SEO Methods
  async getSEOMetadata() {
    const seoData = {};
    
    // Meta Title
    seoData.metaTitle = await this.page.title();
    
    // Meta Description
    const metaDesc = await this.metaDescriptionTag.getAttribute('content').catch(() => null);
    seoData.metaDescription = metaDesc;
    
    // OG Title
    const ogTitle = await this.ogTitleTag.getAttribute('content').catch(() => null);
    seoData.ogTitle = ogTitle;
    
    // OG Description
    const ogDesc = await this.ogDescriptionTag.getAttribute('content').catch(() => null);
    seoData.ogDescription = ogDesc;
    
    // Canonical URL
    const canonical = await this.canonicalUrlTag.getAttribute('href').catch(() => null);
    seoData.canonicalUrl = canonical;
    
    // H1
    const h1 = await this.h1Tag.first().textContent().catch(() => null);
    seoData.h1 = h1?.trim();
    
    // H2
    const h2Elements = await this.h2Tags.allTextContents();
    seoData.h2 = h2Elements.map(h => h.trim()).filter(h => h);
    
    // H3
    const h3Elements = await this.h3Tags.allTextContents();
    seoData.h3 = h3Elements.map(h => h.trim()).filter(h => h);
    
    return seoData;
  }

  // Utility Methods
  async getCurrentUrl() {
    return this.page.url();
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `./test-results/screenshots/${name}.png`, fullPage: true });
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(500);
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(500);
  }
}

export default plpPage;
