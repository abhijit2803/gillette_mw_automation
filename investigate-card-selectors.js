import { chromium } from 'playwright';

async function investigateCardSelectors() {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 2000
  });
  
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🌐 Navigating to Gillette Germany homepage...');
    await page.goto('https://www.gillette.de/de-de', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    // Accept cookies
    try {
      const cookieButton = page.locator('button:has-text("Alle Cookies akzeptieren"), button:has-text("Alle akzeptieren"), #onetrust-accept-btn-handler');
      const visible = await cookieButton.isVisible({ timeout: 5000 }).catch(() => false);
      if (visible) {
        await cookieButton.first().click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {
      // Cookies already accepted
    }
    
    console.log('\n========== SECTION 1: "Alles, was du brauchst" (Expected: 3 cards) ==========');
    // Better section finding - look for heading first
    const heading1 = page.locator('h2, h3, h4, div').filter({ hasText: 'Alles, was du brauchst' }).first();
    await heading1.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Get parent container
    const section1 = heading1.locator('xpath=ancestor::section | xpath=ancestor::div[contains(@class, "wrapper") or contains(@class, "container")]').first();
    
    // Try various selectors
    const selectors1 = [
      '.product-card',
      '.packshot',
      'article.item',
      '.card',
      'article',
      '.item',
      'a img',
      '.product',
      'a[href*="/produkte/"]',
      'div[class*="card"]',
      'div[class*="product"]',
      'a.event_image_click img',
      'a[data-action-detail]',
      '.home-productcarousel-cards > *',
      '.home-productcarousel-cards a',
      '.swiper-slide',
      '.carousel-item'
    ];
    
    for (const selector of selectors1) {
      const elements = await section1.locator(selector).all();
      console.log(`${selector}: ${elements.length} elements`);
      if (elements.length > 0 && elements.length <= 10) {
        // Show details for promising candidates
        for (let i = 0; i < Math.min(elements.length, 5); i++) {
          const href = await elements[i].getAttribute('href').catch(() => null);
          const text = await elements[i].textContent().catch(() => '');
          const classes = await elements[i].getAttribute('class').catch(() => '');
          console.log(`  [${i}] href: ${href} | text: ${text.substring(0, 50)} | classes: ${classes}`);
        }
      }
    }
    
    // Get section HTML to analyze structure
    console.log('\n📝 Section HTML structure:');
    const sectionHTML1 = await section1.innerHTML();
    // Extract first 2000 chars for analysis
    console.log(sectionHTML1.substring(0, 2000));
    
    console.log('\n========== SECTION 2: "Unsere Produkte" (Expected: 6 cards) ==========');
    const heading2 = page.locator('h2, h3, h4, div').filter({ hasText: 'Unsere Produkte' }).first();
    await heading2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    const section2 = heading2.locator('xpath=ancestor::section | xpath=ancestor::div[contains(@class, "wrapper") or contains(@class, "container")]').first();
    
    for (const selector of selectors1) {
      const elements = await section2.locator(selector).all();
      console.log(`${selector}: ${elements.length} elements`);
      if (elements.length > 0 && elements.length <= 10) {
        for (let i = 0; i < Math.min(elements.length, 5); i++) {
          const href = await elements[i].getAttribute('href').catch(() => null);
          const text = await elements[i].textContent().catch(() => '');
          const classes = await elements[i].getAttribute('class').catch(() => '');
          console.log(`  [${i}] href: ${href} | text: ${text.substring(0, 50)} | classes: ${classes}`);
        }
      }
    }
    
    console.log('\n📝 Section HTML structure:');
    const sectionHTML2 = await section2.innerHTML();
    console.log(sectionHTML2.substring(0, 2000));
    
    console.log('\n========== SECTION 3: "Erfahre etwas Neues" (Expected: 4 cards) ==========');
    const heading3 = page.locator('h2, h3, h4, div').filter({ hasText: 'Erfahre etwas Neues' }).first();
    await heading3.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    const section3 = heading3.locator('xpath=ancestor::section | xpath=ancestor::div[contains(@class, "wrapper") or contains(@class, "container")]').first();
    
    for (const selector of selectors1) {
      const elements = await section3.locator(selector).all();
      console.log(`${selector}: ${elements.length} elements`);
      if (elements.length > 0 && elements.length <= 10) {
        for (let i = 0; i < Math.min(elements.length, 5); i++) {
          const href = await elements[i].getAttribute('href').catch(() => null);
          const text = await elements[i].textContent().catch(() => '');
          const classes = await elements[i].getAttribute('class').catch(() => '');
          console.log(`  [${i}] href: ${href} | text: ${text.substring(0, 50)} | classes: ${classes}`);
        }
      }
    }
    
    console.log('\n📝 Section HTML structure:');
    const sectionHTML3 = await section3.innerHTML();
    console.log(sectionHTML3.substring(0, 2000));
    
    console.log('\n✅ Investigation complete. Press Enter to close browser...');
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

investigateCardSelectors();
