import { chromium } from 'playwright';

async function simpleInvestigation() {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 1000
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
    
    // Look for "Alles, was du brauchst" section
    console.log('\n========== Finding "Alles, was du brauchst" section ==========');
    const section1Text = await page.locator('text=Alles, was du brauchst').first();
    await section1Text.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Try to find cards near this text
    console.log('\n Testing .home-productcarousel-cards');
    const carouselCards1 = await section1Text.locator('xpath=ancestor-or-self::*//div[contains(@class, "home-productcarousel-cards")]').first();
    console.log('Found carousel-cards container');
    
    // Look for clickable links inside
    const links1 = await carouselCards1.locator('a[data-action-detail]').all();
    console.log(`Found ${links1.length} links with data-action-detail`);
    for (let i = 0; i < links1.length; i++) {
      const href = await links1[i].getAttribute('href');
      const detail = await links1[i].getAttribute('data-action-detail');
      console.log(`  [${i}] ${detail} -> ${href}`);
    }
    
    // Try other patterns
    const links1b = await carouselCards1.locator('a[href]').all();
    console.log(`\nFound ${links1b.length} total links`);
    
    const links1c = await carouselCards1.locator('a.event_image_click').all();
    console.log(`Found ${links1c.length} links with event_image_click class`);
    for (let i = 0; i < Math.min(links1c.length, 5); i++) {
      const href = await links1c[i].getAttribute('href');
      const detail = await links1c[i].getAttribute('data-action-detail');
      console.log(`  [${i}] ${detail} -> ${href}`);
    }
    
    // Look for "Unsere Produkte" section
    console.log('\n========== Finding "Unsere Produkte" section ==========');
    const section2Text = await page.locator('text=Unsere Produkte').first();
    await section2Text.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Find product items in this section
    const section2Container = await section2Text.locator('xpath=ancestor-or-self::*//div[contains(@class, "wrapper-product-category") or contains(@class, "productsDivContainer")]').first();
    console.log('Found products container');
    
    // Look for clickable product items
    const productLinks = await section2Container.locator('a[data-action-detail]').all();
    console.log(`Found ${productLinks.length} product links with data-action-detail`);
    for (let i = 0; i < Math.min(productLinks.length, 8); i++) {
      const href = await productLinks[i].getAttribute('href');
      const detail = await productLinks[i].getAttribute('data-action-detail');
      console.log(`  [${i}] ${detail} -> ${href}`);
    }
    
    // Look for "Erfahre etwas Neues" section
    console.log('\n========== Finding "Erfahre etwas Neues" section ==========');
    const section3Text = await page.locator('text=Erfahre etwas Neues').first();
    await section3Text.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Find articles
    const section3Container = await section3Text.locator('xpath=ancestor-or-self::*//div[contains(@class, "wrapper") or contains(@class, "editorial-wrapper")]').first();
    console.log('Found articles container');
    
    const articleLinks = await section3Container.locator('a[data-action-detail]').all();
    console.log(`Found ${articleLinks.length} article links with data-action-detail`);
    for (let i = 0; i < Math.min(articleLinks.length, 6); i++) {
      const href = await articleLinks[i].getAttribute('href');
      const detail = await articleLinks[i].getAttribute('data-action-detail');
      const text = await articleLinks[i].textContent();
      console.log(`  [${i}] ${detail} -> ${href}`);
      console.log(`       Text: ${text.substring(0, 50)}`);
    }
    
    console.log('\n✅ Investigation complete.');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

simpleInvestigation();
