/**
 * Article Listing Page (ALP) Object Model
 * Page URL: https://www.gillette.de/de-de/perfekte-rasur
 * 
 * Sections:
 * - Page SEO Details (H1, Meta Title, Meta Description, Canonical URL)
 * - Article Cards Grid
 * - Favorite Functionality
 * - Category Dropdown Navigation
 * 
 * Migrated from: ALP.md
 */

import { helperBase } from './helperBase.js';
import { expect } from '@playwright/test';
import { SYMBOLS, log } from '../utils/logConstants.js';

export class articleListingPage extends helperBase {
  constructor(page) {
    super(page);

    // Page URL (German site as per original test)
    this.pageUrl = '/de-de/perfekte-rasur';

    // Cookie Consent
    this.acceptCookiesButton = page.locator('#onetrust-accept-btn-handler');

    // Page Elements - Header Section
    this.pageTitle = page.locator('#wrap h1').first();
    this.pageDescription = page.locator('#wrap div.hero-text p, #wrap > div:nth-child(2) > div:nth-child(2) > div > p').first();
    
    // SEO Elements - Meta Tags
    this.h1Element = page.locator('h1').first();
    this.metaTitle = page.locator('head title');
    this.metaDescription = page.locator('head meta[name="description"]');
    this.canonicalUrl = page.locator('head link[rel="canonical"]');
    
    // Article Cards Grid
    this.articleCardsContainer = page.locator('#wrap > div:nth-child(3) > div:nth-child(3) > ul');
    this.articleCards = page.locator('#wrap > div:nth-child(3) > div:nth-child(3) > ul > li');
    
    // Favorite Icon in Header
    this.favoriteHeaderIcon = page.locator('#heartIcon');
    
    // Favorites Page Elements
    this.favoritesArticleMenu = page.locator('#wrap > div:nth-child(2) > div:nth-child(2) > div > a:first-child > span:first-child > span');
    
    // Category Dropdown
    this.dropdownButton = page.locator('#dropdownButton');
    this.dropdownOptions = page.locator('#react-portal > div:nth-child(2) > div:nth-child(2) > a');
    this.dropdownCloseButton = page.locator('#react-portal > div:nth-child(2) > div:nth-child(1) > button:nth-child(2)');
  }

  /**
   * Navigate to Article Listing Page
   */
  async navigateToALP() {
    log(SYMBOLS.ROCKET, 'Navigating to Article Listing Page...');
    await this.navigate(this.pageUrl);
    await this.waitForPageLoad();
    
    // Wait for main heading to be visible
    await this.waitForElement(this.pageTitle);
    log(SYMBOLS.SUCCESS, `Article Listing Page loaded: ${this.page.url()}`);
  }

  /**
   * Accept cookies if the banner is displayed
   * Waits for cookie banner to appear before clicking
   */
  async acceptCookies() {
    try {
      const cookieButton = this.acceptCookiesButton;
      
      // Wait for cookie banner to be visible
      log(SYMBOLS.INFO, 'Waiting for cookie banner to display...');
      await cookieButton.waitFor({ state: 'visible', timeout: 15000 });
      
      // Click accept cookies button
      await cookieButton.click();
      log(SYMBOLS.SUCCESS, 'Cookies accepted successfully');
      
      // Wait for cookie banner to disappear
      await cookieButton.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
      log(SYMBOLS.SUCCESS, 'Cookie banner dismissed');
    } catch (error) {
      log(SYMBOLS.INFO, 'Cookie banner not present or already accepted');
    }
  }

  /**
   * Get page title text
   * @returns {Promise<string>} Page title text
   */
  async getPageTitle() {
    const title = await this.pageTitle.textContent();
    const trimmedTitle = title ? title.trim() : '';
    log(SYMBOLS.PAGE, `Page Title: ${trimmedTitle}`);
    return trimmedTitle;
  }

  /**
   * Get page description with normalized whitespace
   * @returns {Promise<string>} Page description text
   */
  async getPageDescription() {
    try {
      await this.pageDescription.waitFor({ state: 'visible', timeout: 5000 });
      const description = await this.pageDescription.evaluate(el => 
        el.innerText.replace(/\s+/g, ' ').trim()
      );
      log(SYMBOLS.DOCUMENT, `Page Description: ${description}`);
      return description;
    } catch (error) {
      log(SYMBOLS.WARNING, 'Page description not found');
      return '';
    }
  }

  /**
   * Get H1 element text
   * @returns {Promise<string>} H1 text content
   */
  async getH1Text() {
    try {
      const h1Text = await this.h1Element.textContent();
      const trimmedH1 = h1Text ? h1Text.trim() : '';
      log(SYMBOLS.PAGE, `H1: ${trimmedH1}`);
      return trimmedH1;
    } catch (error) {
      log(SYMBOLS.WARNING, 'H1 element not found');
      return '';
    }
  }

  /**
   * Get Meta Title from head
   * @returns {Promise<string>} Meta title content
   */
  async getMetaTitle() {
    try {
      const title = await this.metaTitle.textContent();
      const trimmedTitle = title ? title.trim() : '';
      log(SYMBOLS.PAGE, `Meta Title: ${trimmedTitle}`);
      return trimmedTitle;
    } catch (error) {
      log(SYMBOLS.WARNING, 'Meta title not found');
      return '';
    }
  }

  /**
   * Get Meta Description from head
   * @returns {Promise<string>} Meta description content
   */
  async getMetaDescription() {
    try {
      const content = await this.metaDescription.getAttribute('content');
      const description = content ? content.trim() : '';
      log(SYMBOLS.DOCUMENT, `Meta Description: ${description}`);
      return description;
    } catch (error) {
      log(SYMBOLS.WARNING, 'Meta description not found');
      return '';
    }
  }

  /**
   * Get Canonical URL from head
   * @returns {Promise<string>} Canonical URL
   */
  async getCanonicalUrl() {
    try {
      const href = await this.canonicalUrl.getAttribute('href');
      const url = href ? href.trim() : '';
      log(SYMBOLS.LINK, `Canonical URL: ${url}`);
      return url;
    } catch (error) {
      log(SYMBOLS.WARNING, 'Canonical URL not found');
      return '';
    }
  }

  /**
   * Get all SEO details at once
   * @returns {Promise<{h1: string, metaTitle: string, metaDescription: string, canonicalUrl: string}>} SEO details object
   */
  async getSEODetails() {
    const h1 = await this.getH1Text();
    const metaTitle = await this.getMetaTitle();
    const metaDescription = await this.getMetaDescription();
    const canonicalUrl = await this.getCanonicalUrl();
    
    return {
      h1,
      metaTitle,
      metaDescription,
      canonicalUrl
    };
  }

  /**
   * Verify all SEO elements are present
   * @returns {Promise<{hasH1: boolean, hasMetaTitle: boolean, hasMetaDescription: boolean, hasCanonicalUrl: boolean, isValid: boolean}>} SEO validation results
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
    
    log(SYMBOLS.INFO, `SEO Validation: H1=${results.hasH1}, MetaTitle=${results.hasMetaTitle}, MetaDesc=${results.hasMetaDescription}, Canonical=${results.hasCanonicalUrl}`);
    
    return results;
  }

  /**
   * Get total count of article cards
   * @returns {Promise<number>} Number of article cards
   */
  async getArticleCardsCount() {
    await this.articleCardsContainer.waitFor({ state: 'visible', timeout: 10000 });
    const count = await this.articleCards.count();
    log(SYMBOLS.INFO, `Total Article Cards: ${count}`);
    return count;
  }

  /**
   * Get article card locator by index (1-based)
   * @param {number} index - Card index (1-based)
   * @returns {Object} Locator for the article card
   */
  getArticleCardLocator(index) {
    return this.page.locator(`#wrap > div:nth-child(3) > div:nth-child(3) > ul > li:nth-child(${index})`);
  }

  /**
   * Get article title locator by index (1-based)
   * @param {number} index - Card index (1-based)
   * @returns {import('@playwright/test').Locator} Locator for the article title link
   */
  getArticleTitleLocator(index) {
    return this.page.locator(`#wrap > div:nth-child(3) > div:nth-child(3) > ul > li:nth-child(${index}) > div > div > div > a`);
  }

  /**
   * Get favorite button locator by index (1-based)
   * @param {number} index - Card index (1-based)
   * @returns {Object} Locator for the favorite button
   */
  getFavoriteButtonLocator(index) {
    return this.page.locator(`#wrap > div:nth-child(3) > div:nth-child(3) > ul > li:nth-child(${index}) > div > div > div > button`);
  }

  /**
   * Get article details by index
   * @param {number} index - Card index (1-based)
   * @returns {Promise<{title: string, link: string}>} Article details
   */
  async getArticleDetails(index) {
    const titleLocator = this.getArticleTitleLocator(index);
    
    await titleLocator.scrollIntoViewIfNeeded();
    
    const titleText = await titleLocator.evaluate(el => 
      el.innerText.replace(/\s+/g, ' ').trim()
    );
    const link = await titleLocator.getAttribute('href');
    
    log(SYMBOLS.DOCUMENT, `Article ${index}: ${titleText}`);
    
    return {
      title: titleText,
      link: link || ''
    };
  }

  /**
   * Verify article on detail page matches expected title
   * @param {Object} articlePage - Article detail page
   * @param {string} expectedTitle - Expected article title
   * @returns {Promise<boolean>} True if titles match
   */
  async verifyArticleDetailPage(articlePage, expectedTitle) {
    const articleTitle = articlePage.locator('h1').first();
    await articleTitle.waitFor({ state: 'visible', timeout: 10000 });
    
    const actualTitle = await articleTitle.evaluate(el => 
      el.innerText.replace(/\s+/g, ' ').trim()
    );
    
    const matches = actualTitle.toLowerCase() === expectedTitle.toLowerCase();
    
    if (matches) {
      log(SYMBOLS.SUCCESS, `✅ Article verified: ${expectedTitle}`);
    } else {
      log(SYMBOLS.ERROR, `❌ Article mismatch - Expected: ${expectedTitle}, Got: ${actualTitle}`);
    }
    
    return matches;
  }

  /**
   * Click favorite button for an article
   * @param {number} index - Card index (1-based)
   */
  async clickFavoriteButton(index) {
    const favoriteButton = this.getFavoriteButtonLocator(index);
    await favoriteButton.scrollIntoViewIfNeeded();
    await favoriteButton.click();
    log(SYMBOLS.SUCCESS, `Favorite button clicked for article ${index}`);
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get favorites page URL from header icon
   * @returns {Promise<string>} Favorites page URL
   */
  async getFavoritesPageUrl() {
    const href = await this.favoriteHeaderIcon.getAttribute('href');
    return href || '';
  }

  /**
   * Verify if article is in favorites list
   * @param {Object} favoritesPage - Favorites page
   * @param {string} articleName - Article name to verify
   * @returns {Promise<boolean>} True if article is in favorites
   */
  async verifyArticleInFavorites(favoritesPage, articleName) {
    try {
      // Wait for favorites page to load
      await favoritesPage.waitForTimeout(2000);
      
      // Try multiple selectors for ARTIKEL tab in favorites page
      const articlesMenuSelectors = [
        '#wrap > div:nth-child(2) > div:nth-child(2) > div > a:first-child > span:first-child > span',
        '#wrap > div:nth-child(2) > div:nth-child(2) > div > a:nth-child(1) > span:first-child > span',
        '#wrap > div:nth-child(2) > div:nth-child(2) > div > a:first-child',
        '#wrap > div:nth-child(2) > div:nth-child(2) > div > a:nth-child(1)',
        'a:has-text("ARTIKEL")',
        'a:has-text("Artikel")',
        'a:has-text("Articles")',
        'span:has-text("ARTIKEL")',
        'span:has-text("Artikel")',
        '[href*="artikel"]',
        '[class*="tab"]:has-text("Artikel")',
        '[class*="tab"]:has-text("ARTIKEL")',
        '[role="tab"]:has-text("Artikel")',
        '[role="tab"]:has-text("ARTIKEL")',
        'button:has-text("ARTIKEL")',
        'button:has-text("Artikel")'
      ];
      
      let menuClicked = false;
      for (const selector of articlesMenuSelectors) {
        try {
          const menu = favoritesPage.locator(selector).first();
          if (await menu.isVisible({ timeout: 2000 }).catch(() => false)) {
            await menu.click();
            await favoritesPage.waitForTimeout(1000);
            log(SYMBOLS.SUCCESS, `ARTIKEL tab clicked via: ${selector}`);
            menuClicked = true;
            break;
          }
        } catch {
          // Try next selector
        }
      }
      
      if (!menuClicked) {
        log(SYMBOLS.INFO, 'ARTIKEL tab not found, checking current favorites view');
      }
      
      // Check if article exists in favorites list using multiple selectors
      const articleSelectors = [
        `#wrap h3:has-text("${articleName}")`,
        `h3:has-text("${articleName}")`,
        `[class*="article"] h3:has-text("${articleName}")`,
        `[class*="favorite"] :has-text("${articleName}")`,
        `a:has-text("${articleName}")`
      ];
      
      for (const selector of articleSelectors) {
        try {
          const article = favoritesPage.locator(selector).first();
          if (await article.isVisible({ timeout: 3000 }).catch(() => false)) {
            log(SYMBOLS.SUCCESS, `Article found in favorites via: ${selector}`);
            return true;
          }
        } catch {
          // Try next selector
        }
      }
      
      return false;
    } catch (error) {
      log(SYMBOLS.WARNING, `Error checking favorites: ${error.message}`);
      return false;
    }
  }

  /**
   * Open category dropdown
   */
  async openDropdown() {
    await this.dropdownButton.click();
    await this.page.waitForTimeout(500);
    log(SYMBOLS.SUCCESS, 'Category dropdown opened');
  }

  /**
   * Close category dropdown
   */
  async closeDropdown() {
    try {
      const closeBtn = this.dropdownCloseButton;
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await this.page.waitForTimeout(500);
        log(SYMBOLS.SUCCESS, 'Category dropdown closed');
      }
    } catch (error) {
      log(SYMBOLS.WARNING, 'Could not close dropdown');
    }
  }

  /**
   * Get dropdown options count (excluding current page)
   * @returns {Promise<number>} Number of dropdown options
   */
  async getDropdownOptionsCount() {
    const count = await this.dropdownOptions.count();
    log(SYMBOLS.INFO, `Dropdown options count: ${count}`);
    return count;
  }

  /**
   * Get all dropdown option details
   * @param {string} currentALP - Current ALP title to exclude
   * @returns {Promise<Array<{title: string, url: string}>>} Array of option details
   */
  async getDropdownOptions(currentALP = 'Alle Artikel') {
    const options = [];
    const count = await this.dropdownOptions.count();
    
    for (let i = 0; i < count; i++) {
      const option = this.dropdownOptions.nth(i);
      const title = await option.getAttribute('title');
      const url = await option.getAttribute('href');
      
      if (title && title !== currentALP) {
        options.push({ title, url: url || '' });
        log(SYMBOLS.INFO, `Dropdown option: ${title}`);
      }
    }
    
    return options;
  }

  /**
   * Get dropdown option by title
   * @param {string} title - Option title
   * @returns {Object} Locator for the dropdown option
   */
  getDropdownOptionByTitle(title) {
    return this.page.locator(`#react-portal > div:nth-child(2) > div:nth-child(2) > a[title="${title}"]`);
  }

  /**
   * Navigate to a category from dropdown
   * @param {string} title - Category title
   * @returns {Promise<string>} URL of the category
   */
  async navigateToCategory(title) {
    const option = this.getDropdownOptionByTitle(title);
    const url = await option.getAttribute('href');
    log(SYMBOLS.ARROW_RIGHT, `Navigating to category: ${title}`);
    return url || '';
  }

  // ==================== Breadcrumb Methods ====================

  /**
   * Get breadcrumb items from the page
   * @returns {Promise<Array<{text: string, href: string, isActive: boolean}>>} Array of breadcrumb items
   */
  async getBreadcrumbs() {
    try {
      const breadcrumbs = await this.page.evaluate(() => {
        const breadcrumbElement = document.querySelector('[class*="breadcrumb"]');
        if (!breadcrumbElement) return [];
        
        const items = [];
        const links = breadcrumbElement.querySelectorAll('a');
        
        for (const link of links) {
          let text = link.textContent.trim();
          const href = link.getAttribute('href') || '';
          const title = link.getAttribute('title') || '';
          const ariaLabel = link.getAttribute('aria-label') || '';
          const isActive = !href || href === '' || href === '#';
          
          // Use title or aria-label if text is empty (for icon links like Home)
          if (!text || text.length === 0) {
            text = title || ariaLabel || 'Home';
          }
          
          // Include all breadcrumb links
          items.push({ text, href, isActive });
        }
        
        return items;
      });
      
      if (breadcrumbs.length > 0) {
        log(SYMBOLS.SUCCESS, `Found ${breadcrumbs.length} breadcrumb items`);
      } else {
        log(SYMBOLS.WARNING, 'No breadcrumb items found');
      }
      
      return breadcrumbs;
    } catch (error) {
      log(SYMBOLS.WARNING, `Error getting breadcrumbs: ${error.message}`);
      return [];
    }
  }

  /**
   * Verify breadcrumbs are present and valid
   * @returns {Promise<{present: boolean, count: number, breadcrumbs: Array}>} Breadcrumb validation results
   */
  async verifyBreadcrumbs() {
    const breadcrumbs = await this.getBreadcrumbs();
    const present = breadcrumbs.length > 0;
    
    if (present) {
      log(SYMBOLS.INFO, `Breadcrumbs verified: ${breadcrumbs.length} items found`);
      breadcrumbs.forEach((bc, index) => {
        log(SYMBOLS.DOCUMENT, `  ${index + 1}. "${bc.text}" ${bc.href ? `-> ${bc.href}` : '(current page)'}`);
      });
    } else {
      log(SYMBOLS.WARNING, 'No breadcrumbs found on page');
    }
    
    return {
      present,
      count: breadcrumbs.length,
      breadcrumbs
    };
  }

  // ==================== Image Validation Methods ====================
  
  /**
   * Get all listing page content images with their alt tags (excludes navigation, popups, SVGs, social icons)
   * @returns {Promise<Array>} Array of image objects with filename, alt, and hasAlt properties
   */
  async getAllListingImagesWithAlt() {
    try {
      log(SYMBOLS.INFO, 'Retrieving listing page content images and their alt tags...');
      
      const images = await this.page.evaluate(() => {
        // Get main content area
        const mainContainer = document.querySelector('main');
        if (!mainContainer) {
          return [];
        }
        
        const allImages = Array.from(mainContainer.querySelectorAll('img'));
        
        // Filter out unwanted images
        const listingImages = allImages.filter(img => {
          // Exclude SVG images
          if (img.src && (img.src.includes('.svg') || img.src.includes('svg+xml'))) return false;
          
          // Exclude header, nav, footer
          if (img.closest('header, nav, [class*="header"], [class*="footer"]')) return false;
          
          // Exclude pricespider/buy now popup
          if (img.closest('[class*="pricespider"], [id*="pricespider"], [class*="buy-now"], [class*="buynow"]')) return false;
          
          // Exclude social share icons
          if (img.closest('[id*="imgBtn"], [class*="social"], [class*="share"]')) return false;
          
          // Exclude very small images (likely icons)
          if ((img.width < 10 && img.height < 10) || (img.naturalWidth < 10 && img.naturalHeight < 10)) return false;
          
          return true;
        });
        
        return listingImages.map((img, index) => {
          const url = new URL(img.src);
          const pathname = url.pathname;
          const fullFilename = pathname.split('/').pop() || 'unknown';
          // Remove query parameters from filename
          const filename = fullFilename.split('?')[0];
          
          const alt = img.alt || img.getAttribute('alt') || '';
          const hasAlt = alt.trim().length > 0;
          
          return {
            index: index + 1,
            filename: filename,
            src: img.src,
            alt: alt,
            hasAlt: hasAlt,
            altStatus: hasAlt ? 'Present' : 'Missing',
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height
          };
        });
      });
      
      log(SYMBOLS.SUCCESS, `✅ Found ${images.length} listing page content images`);
      return images;
      
    } catch (error) {
      log(SYMBOLS.ERROR, `Failed to retrieve listing images: ${error.message}`);
      return [];
    }
  }
  
  /**
   * Verify all listing page images have proper alt tags
   * @returns {Promise<Object>} Validation results with counts and details
   */
  async verifyListingImagesAltTags() {
    try {
      log(SYMBOLS.INFO, 'Verifying listing page images and alt tags...');
      
      const images = await this.getAllListingImagesWithAlt();
      const totalImages = images.length;
      const imagesWithAlt = images.filter(img => img.hasAlt);
      const imagesWithoutAlt = images.filter(img => !img.hasAlt);
      
      log(SYMBOLS.INFO, `📊 Listing Page Image Statistics:`);
      log(SYMBOLS.INFO, `   Total Listing Images: ${totalImages}`);
      log(SYMBOLS.INFO, `   With Alt Tags: ${imagesWithAlt.length}`);
      log(SYMBOLS.INFO, `   Without Alt Tags: ${imagesWithoutAlt.length}`);
      log(SYMBOLS.INFO, '');
      
      // Log all images with their alt tag status
      if (totalImages > 0) {
        log(SYMBOLS.INFO, `📋 Complete Image List:`);
        images.forEach(img => {
          const status = img.hasAlt ? '✅' : '❌';
          const statusText = img.hasAlt ? 'PRESENT' : 'MISSING';
          if (img.hasAlt) {
            const altPreview = img.alt.length > 50 ? img.alt.substring(0, 50) + '...' : img.alt;
            log(SYMBOLS.SUCCESS, `   ${status} Image ${img.index}: "${img.filename}"`);
            log(SYMBOLS.SUCCESS, `      Alt Tag: "${altPreview}" [${statusText}]`);
          } else {
            log(SYMBOLS.WARNING, `   ${status} Image ${img.index}: "${img.filename}"`);
            log(SYMBOLS.WARNING, `      Alt Tag: [${statusText}]`);
          }
        });
      }
      
      log(SYMBOLS.INFO, '');
      
      // Summary
      if (imagesWithoutAlt.length === 0) {
        log(SYMBOLS.SUCCESS, `✅ All ${totalImages} listing page images have alt tags!`);
      } else {
        log(SYMBOLS.WARNING, `⚠️  ${imagesWithoutAlt.length} out of ${totalImages} images are missing alt tags`);
      }
      
      const allHaveAlt = imagesWithoutAlt.length === 0;
      
      return {
        success: allHaveAlt,
        totalImages: totalImages,
        imagesWithAlt: imagesWithAlt.length,
        imagesWithoutAlt: imagesWithoutAlt.length,
        images: images,
        imagesWithAltDetails: imagesWithAlt,
        missingAltImages: imagesWithoutAlt
      };
      
    } catch (error) {
      log(SYMBOLS.ERROR, `Image validation failed: ${error.message}`);
      return {
        success: false,
        totalImages: 0,
        imagesWithAlt: 0,
        imagesWithoutAlt: 0,
        images: [],
        imagesWithAltDetails: [],
        missingAltImages: []
      };
    }
  }
}
