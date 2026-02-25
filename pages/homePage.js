/**
 * HomePage Page Object
 * Contains all selectors and methods for the Gillette Germany Homepage
 */

export class homePage {
  constructor(page) {
    this.page = page;
    this.baseUrl = 'https://www.gillette.de/de-de';

    // Header Selectors
    this.logoContainer = page.locator('[data-testid="logo-container"], .header-logo-container, .logo-box');
    this.gilletteLogo = page.locator('a[href="/de-de"] img[alt*="Gillette"], .main-logo, header a[href="/de-de"]').first();
    this.gilletteLabsLogo = page.locator('a[href*="gillette-labs"] img, a[href*="labs"]');
    this.gilletteBodyIntimateLogo = page.locator('a[href*="body"] img, a[href*="intimate"] img');
    this.kingCGilletteLogo = page.locator('a[href*="king-c"] img');

    // Navigation Menu Selectors
    this.blogMenu = page.locator('nav a:has-text("Blog"), [data-nav="blog"], li:has-text("Blog")');
    this.produkteMenu = page.locator('nav a:has-text("Produkte"), [data-nav="products"], li:has-text("Produkte")');
    this.ueberGilletteMenu = page.locator('nav a:has-text("Über Gillette"), [data-nav="about"]');

    // Product Sub-categories
    this.produktTypSubmenu = page.locator('text=Produkttyp');
    this.portfolioSubmenu = page.locator('text=Portfolio');
    this.beduerfnisSubmenu = page.locator('text=Bedürfnis');

    // About Gillette Sub-categories
    this.ueberGilletteSubmenu = page.locator('.submenu:has-text("Über Gillette"), [data-submenu="about"]');
    this.engagementSubmenu = page.locator('text=Engagement');

    // Header Icons
    this.favoriteIcon = page.locator('[data-testid="favorite-icon"], .favorite-icon, a[href*="favorites"], button[aria-label*="Favorit"]');
    this.searchIcon = page.locator('[data-testid="search-icon"], .search-icon, button[aria-label*="Search"], button[aria-label*="Suche"]');
    this.searchInput = page.locator('input[type="search"], input[placeholder*="Suche"], input[placeholder*="search"], .search-input');
    this.searchButton = page.locator('button[type="submit"][aria-label*="search"], .search-submit, button:has-text("Suchen")');

    // Homepage Banner Selectors
    this.homepageBanner = page.locator('.hero-banner, .homepage-banner, [data-component="hero"], .carousel-banner, .swiper-slide').first();
    this.bannerCTA = page.locator('.hero-banner a, .banner-cta, .hero-cta, [data-component="hero"] a').first();
    this.bannerSlider = page.locator('.swiper-pagination, .carousel-indicators, .banner-dots');
    this.bannerNavArrows = page.locator('.swiper-button-next, .swiper-button-prev, .carousel-arrow');

    // Section Selectors
    this.allesWasDuBrauchstSection = page.locator('section:has-text("Alles, was du brauchst"), [data-section="essentials"]');
    this.unsereProduktSection = page.locator('section:has-text("Unsere Produkte"), [data-section="products"]');
    this.erfahreEtwasNeuesSection = page.locator('section:has-text("Erfahre etwas Neues"), [data-section="articles"]');
    this.gilletteSupportsSection = page.locator('section:has-text("Gillette unterstützt Männer"), [data-section="support"]');

    // Packshot Selectors (for carousel sections)
    this.packshotItems = page.locator('.product-card, .packshot, [data-component="product-card"]');
    this.carouselArrowLeft = page.locator('.carousel-prev, .swiper-button-prev, [aria-label="Previous"]');
    this.carouselArrowRight = page.locator('.carousel-next, .swiper-button-next, [aria-label="Next"]');

    // Footer Selectors
    this.footer = page.locator('footer, .site-footer');
    this.footerBlogCategory = page.locator('footer a:has-text("Blog"), footer [data-category="blog"]');
    this.footerProduktTypCategory = page.locator('footer a:has-text("Produkttyp"), footer [data-category="produkttyp"]');
    this.footerUeberGilletteCategory = page.locator('footer a:has-text("Über Gillette"), footer [data-category="about"]');

    // Footer Logo Box
    this.footerLogoBox = page.locator('footer .logo-box, .footer-logos');

    // Social Icons
    this.youtubeIcon = page.locator('footer a[href*="youtube"], a[aria-label*="YouTube"]');
    this.instagramIcon = page.locator('footer a[href*="instagram"], a[aria-label*="Instagram"]');
    this.facebookIcon = page.locator('footer a[href*="facebook"], a[aria-label*="Facebook"]');

    // Country Selector
    this.countrySelector = page.locator('footer a:has-text("Deutschland"), .country-selector, [data-testid="country-selector"]');

    // Privacy Links
    this.impressumLink = page.locator('footer a:has-text("Impressum")');
    this.datenschutzLink = page.locator('footer a:has-text("Datenschutz")');
    this.meineDatenLink = page.locator('footer a:has-text("Meine Daten")');
    this.cookieAuswahlLink = page.locator('footer a:has-text("Meine Cookie-Auswahl"), footer button:has-text("Cookie")');

    // Sitemap
    this.sitemapLink = page.locator('footer a:has-text("Seitenverzeichnis"), footer a:has-text("Sitemap")');

    // Cookie Banner
    this.cookiePopup = page.locator('#onetrust-consent-sdk, .cookie-popup, [role="dialog"][aria-label*="Cookie"]');
    this.cookieAcceptButton = page.locator('#onetrust-accept-btn-handler, button:has-text("Akzeptieren"), button:has-text("Alle akzeptieren"), button:has-text("Accept")');
    this.cookieRejectButton = page.locator('#onetrust-reject-all-handler, button:has-text("Ablehnen")');

    // Search Results
    this.searchResultsPage = page.locator('.search-results, [data-component="search-results"]');
    this.searchResultsArticlesTab = page.locator('button:has-text("Artikel"), [data-tab="articles"]');
    this.searchResultsProductsTab = page.locator('button:has-text("Produkte"), [data-tab="products"]');
    this.searchNoResults = page.locator('.no-results, text=Keine Ergebnisse');

    // Favorites Page
    this.favoritesPage = page.locator('.favorites-page, [data-page="favorites"]');
    this.recommendedProducts = page.locator('.recommended-products, [data-section="recommended-products"]');
    this.recommendedArticles = page.locator('.recommended-articles, [data-section="recommended-articles"]');
  }

  // Navigation Methods
  async navigate() {
    try {
      await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await this.page.waitForTimeout(500);
    } catch (error) {
      console.log('Navigation error, retrying...', error.message);
      await this.page.goto(this.baseUrl, { waitUntil: 'load', timeout: 60000 });
    }
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000); // Allow dynamic content to load
  }

  async acceptCookies() {
    try {
      // Wait a moment for banner to load
      await this.page.waitForTimeout(1000);
      
      const cookieBanner = this.page.locator('#onetrust-banner-sdk, #onetrust-consent-sdk');
      const cookieButton = this.cookieAcceptButton;
      
      // Check if banner is visible
      const bannerVisible = await cookieBanner.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (bannerVisible) {
        // Strategy 1: Click accept button normally
        const buttonVisible = await cookieButton.isVisible({ timeout: 2000 }).catch(() => false);
        if (buttonVisible) {
          await cookieButton.click({ timeout: 5000 }).catch(() => {});
          await this.page.waitForTimeout(1000);
        }
        
        // Strategy 2: Force click if still visible
        if (await cookieBanner.isVisible({ timeout: 2000 }).catch(() => false)) {
          await cookieButton.click({ force: true, timeout: 5000 }).catch(() => {});
          await this.page.waitForTimeout(1000);
        }
        
        // Strategy 3: Accept via JavaScript (most reliable)
        await this.page.evaluate(() => {
          // Accept all cookies via OneTrust API
          if (window.OneTrust && window.OneTrust.AllowAll) {
            window.OneTrust.AllowAll();
          }
          // Click accept button via DOM
          const acceptBtn = document.querySelector('#onetrust-accept-btn-handler');
          if (acceptBtn) acceptBtn.click();
          
          // Set OptanonConsent cookie directly
          document.cookie = 'OptanonAlertBoxClosed=' + new Date().toISOString() + '; path=/; max-age=31536000';
          document.cookie = 'OptanonConsent=groups=C0001:1,C0002:1,C0003:1,C0004:1; path=/; max-age=31536000';
        }).catch(() => {});
        
        await this.page.waitForTimeout(1000);
        
        // Strategy 4: Force hide banner if still present
        if (await cookieBanner.isVisible({ timeout: 2000 }).catch(() => false)) {
          await this.page.evaluate(() => {
            const banners = document.querySelectorAll('#onetrust-banner-sdk, #onetrust-consent-sdk, .onetrust-pc-dark-filter');
            banners.forEach(banner => {
              if (banner) {
                banner.style.display = 'none';
                banner.style.visibility = 'hidden';
                banner.remove();
              }
            });
          }).catch(() => {});
        }
        
        // Final wait for complete dismissal
        await this.page.waitForTimeout(1000);
      }
    } catch (e) {
      // Cookie banner not found or already accepted
      console.log('Cookie acceptance completed or not needed');
    }
  }
  
  async dismissAnyCookieBanner() {
    // Aggressive cookie banner dismissal - tries multiple methods
    try {
      // Always try to dismiss, even if not visible yet
      const cookieBanner = this.page.locator('#onetrust-banner-sdk, #onetrust-consent-sdk, .cookie-banner, [role="dialog"][aria-label*="Cookie"]');
      
      // Method 1: Click Akzeptieren button with force (German site)
      const acceptBtn = this.page.locator('#onetrust-accept-btn-handler, button:has-text("Akzeptieren"), button:has-text("Alle akzeptieren"), button:has-text("Accept All"), .onetrust-close-btn-handler');
      if (await acceptBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await acceptBtn.click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(300);
      }
      
      // Method 2: Force hide and remove with JavaScript (ALWAYS execute)
      await this.page.evaluate(() => {
        // Hide OneTrust banners
        const banners = document.querySelectorAll('#onetrust-banner-sdk, #onetrust-consent-sdk, .onetrust-pc-dark-filter, #onetrust-pc-sdk, #ot-sdk-btn-floating');
        banners.forEach(banner => {
          if (banner) {
            banner.style.display = 'none !important';
            banner.style.visibility = 'hidden !important';
            banner.style.opacity = '0 !important';
            banner.style.zIndex = '-9999 !important';
            banner.style.pointerEvents = 'none !important';
            banner.remove();
          }
        });
        
        // Accept cookies via API
        if (window.OneTrust && window.OneTrust.AllowAll) {
          window.OneTrust.AllowAll();
        }
        
        // Disable OneTrust from showing again
        if (window.OneTrust) {
          window.OneTrust.Close = () => {};
          window.OneTrust.Init = () => {};
        }
        
        // Set consent cookies directly
        document.cookie = 'OptanonAlertBoxClosed=' + new Date().toISOString() + '; path=/; domain=.gillette.de; max-age=31536000';
        document.cookie = 'OptanonConsent=groups=C0001:1,C0002:1,C0003:1,C0004:1; path=/; domain=.gillette.de; max-age=31536000';
        
        // Prevent banner from reappearing
        const style = document.createElement('style');
        style.textContent = '#onetrust-banner-sdk, #onetrust-consent-sdk, .onetrust-pc-dark-filter { display: none !important; visibility: hidden !important; }';
        document.head.appendChild(style);
      }).catch(() => {});
      
      await this.page.waitForTimeout(200);
    } catch (e) {
      // Silently handle any errors
    }
  }

  // Header Methods
  async verifyLogoContainer() {
    const logos = await this.page.locator('header .logo-box a, header nav a img, .brand-logos a').all();
    const logoNames = [];
    for (const logo of logos) {
      const alt = await logo.getAttribute('alt') || await logo.textContent();
      if (alt) logoNames.push(alt.trim());
    }
    return logoNames;
  }

  async clickGilletteLogo() {
    await this.gilletteLogo.click();
    await this.waitForPageLoad();
  }

  // Navigation Menu Methods
  async hoverOverBlogMenu() {
    await this.blogMenu.hover();
    await this.page.waitForTimeout(500);
  }

  async hoverOverProdukteMenu() {
    await this.produkteMenu.hover();
    await this.page.waitForTimeout(500);
  }

  async hoverOverUeberGilletteMenu() {
    await this.ueberGilletteMenu.hover();
    await this.page.waitForTimeout(500);
  }

  async getSubMenuOptions(menuLocator) {
    const submenu = this.page.locator('.submenu, .dropdown-menu, [role="menu"]');
    await submenu.waitFor({ state: 'visible', timeout: 5000 });
    const options = await submenu.locator('a, button').allTextContents();
    return options.filter(opt => opt.trim());
  }

  // Search Methods
  async search(searchTerm) {
    await this.searchIcon.click();
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press('Enter');
    await this.waitForPageLoad();
  }

  async clickSearchIcon() {
    await this.searchIcon.click();
  }

  // Favorites Methods
  async clickFavoriteIcon() {
    await this.favoriteIcon.click();
    await this.waitForPageLoad();
  }

  // Banner Methods
  async verifyBannerIsVisible() {
    return await this.homepageBanner.isVisible();
  }

  async clickBannerCTA() {
    await this.bannerCTA.click();
    await this.waitForPageLoad();
  }

  async verifyBannerAutoScroll() {
    const initialBanner = await this.homepageBanner.getAttribute('data-slide-index') || '0';
    await this.page.waitForTimeout(5000); // Wait for auto-scroll
    const newBanner = await this.homepageBanner.getAttribute('data-slide-index') || '0';
    return initialBanner !== newBanner;
  }

  // Section Methods
  async verifySectionVisible(sectionName) {
    const sections = {
      'Alles, was du brauchst': this.allesWasDuBrauchstSection,
      'Unsere Produkte': this.unsereProduktSection,
      'Erfahre etwas Neues': this.erfahreEtwasNeuesSection,
      'Gillette unterstützt': this.gilletteSupportsSection
    };
    const section = sections[sectionName];
    if (section) {
      return await section.isVisible();
    }
    return false;
  }

  async getPackshotsInSection(sectionLocator) {
    const packshots = await sectionLocator.locator('.product-card, .packshot, article').all();
    const names = [];
    for (const packshot of packshots) {
      const name = await packshot.locator('h3, h4, .product-name, .title').first().textContent();
      if (name) names.push(name.trim());
    }
    return names;
  }

  async clickCarouselArrow(direction) {
    if (direction === 'next') {
      await this.carouselArrowRight.click();
    } else {
      await this.carouselArrowLeft.click();
    }
    await this.page.waitForTimeout(500);
  }

  // Footer Methods
  async getFooterCategories() {
    const categories = await this.footer.locator('h3, h4, .footer-heading').allTextContents();
    return categories.filter(cat => cat.trim());
  }

  async getFooterSubOptions(categoryName) {
    const category = this.footer.locator(`section:has-text("${categoryName}"), div:has-text("${categoryName}")`).first();
    const links = await category.locator('a').allTextContents();
    return links.filter(link => link.trim());
  }

  async clickFooterLink(linkText) {
    await this.footer.locator(`a:has-text("${linkText}")`).first().click();
    await this.waitForPageLoad();
  }

  // Social Icons Methods
  async verifySocialIconsPresent() {
    const icons = {
      youtube: await this.youtubeIcon.isVisible(),
      instagram: await this.instagramIcon.isVisible(),
      facebook: await this.facebookIcon.isVisible()
    };
    return icons;
  }

  async clickSocialIcon(platform) {
    const icons = {
      youtube: this.youtubeIcon,
      instagram: this.instagramIcon,
      facebook: this.facebookIcon
    };
    await icons[platform].click();
  }

  // Country Selector Methods
  async clickCountrySelector() {
    await this.countrySelector.click();
    await this.waitForPageLoad();
  }

  // Privacy Links Methods
  async clickPrivacyLink(linkName) {
    const links = {
      'Impressum': this.impressumLink,
      'Datenschutz': this.datenschutzLink,
      'Meine Daten': this.meineDatenLink,
      'Meine Cookie-Auswahl': this.cookieAuswahlLink
    };
    await links[linkName].click();
  }

  // Sitemap Methods
  async clickSitemapLink() {
    await this.sitemapLink.click();
    await this.waitForPageLoad();
  }

  // SEO Methods
  async getSEOMetadata() {
    const seoData = {};
    
    // Meta Title
    seoData.metaTitle = await this.page.title();
    
    // Meta Description
    const metaDesc = await this.page.locator('meta[name="description"]').getAttribute('content');
    seoData.metaDescription = metaDesc;
    
    // OG Title
    const ogTitle = await this.page.locator('meta[property="og:title"]').getAttribute('content');
    seoData.ogTitle = ogTitle;
    
    // OG Description
    const ogDesc = await this.page.locator('meta[property="og:description"]').getAttribute('content');
    seoData.ogDescription = ogDesc;
    
    // Canonical URL
    const canonical = await this.page.locator('link[rel="canonical"]').getAttribute('href');
    seoData.canonicalUrl = canonical;
    
    // H1
    const h1 = await this.page.locator('h1').first().textContent();
    seoData.h1 = h1?.trim();
    
    // H2
    const h2Elements = await this.page.locator('h2').allTextContents();
    seoData.h2 = h2Elements.map(h => h.trim()).filter(h => h);
    
    // H3
    const h3Elements = await this.page.locator('h3').allTextContents();
    seoData.h3 = h3Elements.map(h => h.trim()).filter(h => h);
    
    return seoData;
  }

  // Utility Methods
  async getCurrentUrl() {
    return this.page.url();
  }

  async scrollToSection(sectionLocator) {
    await sectionLocator.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `./test-results/screenshots/${name}.png`, fullPage: true });
  }
}

export default homePage;
