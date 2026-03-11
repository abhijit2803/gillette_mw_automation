import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    await page.goto('https://www.gillette.de/de-de', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);

    // Accept cookies
    const cookieBanner = page.locator('button:has-text("Alle Cookies akzeptieren"), button:has-text("Akzeptieren"), #onetrust-accept-btn-handler').first();
    if (await cookieBanner.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cookieBanner.click();
      await page.waitForTimeout(2000);
    }

    // Find the section
    const section = page.locator('#product-category, .wrapper-product-category').first();
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Highlight section
    await section.evaluate(el => {
      el.style.outline = '10px solid red';
      el.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    });

    console.log('\n=== PHASE 1: Find ALL swiper slides ===');
    const allSlides = await section.locator('.swiper-slide, .product-card, [class*="card"], a[href*="produkte"]:has(img)').all();
    console.log(`Total slides/cards found: ${allSlides.length}`);

    for (let i = 0; i < allSlides.length; i++) {
      const slide = allSlides[i];
      const link = slide.locator('a[href]:has(img)').first();
      
      const linkCount = await link.count();
      if (linkCount > 0) {
        const href = await link.getAttribute('href').catch(() => '');
        const imgAlt = await link.locator('img').first().getAttribute('alt').catch(() => '');
        const isVisible = await slide.isVisible().catch(() => false);
        
        console.log(`Slide ${i + 1}: ${isVisible ? 'VISIBLE' : 'HIDDEN'}`);
        console.log(`  Name: ${imgAlt}`);
        console.log(`  Href: ${href}`);
      } else {
        // Check if it's already an anchor tag
        const tagName = await slide.evaluate(el => el.tagName);
        if (tagName === 'A') {
          const href = await slide.getAttribute('href').catch(() => '');
          const imgAlt = await slide.locator('img').first().getAttribute('alt').catch(() => '');
          const isVisible = await slide.isVisible().catch(() => false);
          
          console.log(`Card ${i + 1}: ${isVisible ? 'VISIBLE' : 'HIDDEN'}`);
          console.log(`  Name: ${imgAlt}`);
          console.log(`  Href: ${href}`);
        }
      }
    }

    console.log('\n=== PHASE 2: Navigate carousel and collect unique cards ===');
    const uniqueCards = new Map();
    let clickCount = 0;
    const maxClicks = 10; // Navigate up to 10 times

    // Get initial cards - try multiple selectors
    let visibleCards = await section.locator('a[href]:has(img)').all();
    console.log(`\nInitially visible cards: ${visibleCards.length}`);
    
    for (const card of visibleCards) {
      const href = await card.getAttribute('href').catch(() => '');
      const imgAlt = await card.locator('img').first().getAttribute('alt').catch(() => '');
      
      if (href && !uniqueCards.has(href)) {
        uniqueCards.set(href, imgAlt);
        console.log(`  ✓ Card ${uniqueCards.size}: ${imgAlt} -> ${href}`);
      }
    }

    // Click next arrow multiple times
    const nextArrow = section.locator('button[class*="next"], button[class*="arrow-right"], .swiper-button-next').first();
    
    while (clickCount < maxClicks) {
      const arrowVisible = await nextArrow.isVisible({ timeout: 2000 }).catch(() => false);
      const arrowDisabled = await nextArrow.getAttribute('disabled').catch(() => null);
      
      if (!arrowVisible || arrowDisabled !== null) {
        console.log(`\nNext arrow not available after ${clickCount} clicks (disabled or hidden)`);
        break;
      }

      console.log(`\n--- Clicking Next arrow (click ${clickCount + 1}) ---`);
      await nextArrow.click();
      await page.waitForTimeout(2000);
      clickCount++;

      // Check for new cards
      visibleCards = await section.locator('a[href]:has(img)').all();
      let foundNew = false;

      for (const card of visibleCards) {
        const href = await card.getAttribute('href').catch(() => '');
        const imgAlt = await card.locator('img').first().getAttribute('alt').catch(() => '');
        
        if (href && !uniqueCards.has(href)) {
          uniqueCards.set(href, imgAlt);
          console.log(`  ✓ NEW Card ${uniqueCards.size}: ${imgAlt} -> ${href}`);
          foundNew = true;
        }
      }

      if (!foundNew) {
        console.log(`  No new cards found, still ${uniqueCards.size} total`);
      }
    }

    console.log('\n=== FINAL RESULTS ===');
    console.log(`Total unique product cards found: ${uniqueCards.size}`);
    let index = 1;
    for (const [href, name] of uniqueCards.entries()) {
      console.log(`${index}. ${name} -> ${href}`);
      index++;
    }

    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
