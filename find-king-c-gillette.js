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

    console.log('\n=== SEARCHING FOR KING C. GILLETTE ===\n');

    // Search for King C. Gillette with multiple strategies
    console.log('Strategy 1: Search by text "KING C"');
    const kingCByText = await section.locator('a:has-text("KING C"), a:has-text("King C"), a:has-text("king c")').all();
    console.log(`  Found ${kingCByText.length} links with "KING C" text`);
    for (const link of kingCByText) {
      const href = await link.getAttribute('href').catch(() => '');
      const text = await link.textContent().catch(() => '');
      const isVisible = await link.isVisible().catch(() => false);
      console.log(`    Link: ${text.trim()} -> ${href} (${isVisible ? 'VISIBLE' : 'HIDDEN'})`);
    }

    console.log('\nStrategy 2: Search by href containing "king"');
    const kingCByHref = await section.locator('a[href*="king"], a[href*="King"], a[href*="KING"]').all();
    console.log(`  Found ${kingCByHref.length} links with "king" in href`);
    for (const link of kingCByHref) {
      const href = await link.getAttribute('href').catch(() => '');
      const text = await link.textContent().catch(() => '');
      const isVisible = await link.isVisible().catch(() => false);
      console.log(`    Link: ${text.trim()} -> ${href} (${isVisible ? 'VISIBLE' : 'HIDDEN'})`);
    }

    console.log('\nStrategy 3: Search by img alt containing "King"');
    const kingCByImg = await section.locator('img[alt*="King"], img[alt*="KING"], img[alt*="king"]').all();
    console.log(`  Found ${kingCByImg.length} images with "King" in alt`);
    for (const img of kingCByImg) {
      const alt = await img.getAttribute('alt').catch(() => '');
      const parent = img.locator('xpath=ancestor::a[1]');
      const href = await parent.getAttribute('href').catch(() => '');
      const isVisible = await img.isVisible().catch(() => false);
      console.log(`    Image: ${alt} -> ${href} (${isVisible ? 'VISIBLE' : 'HIDDEN'})`);
    }

    console.log('\n=== COLLECTING ALL CARDS AND NAVIGATING CAROUSEL ===\n');
    const uniqueCards = new Map();
    let clickCount = 0;

    // Get all cards initially
    let allLinks = await section.locator('a[href]:has(img)').all();
    console.log(`Initially found ${allLinks.length} links with images`);
    
    for (const link of allLinks) {
      const href = await link.getAttribute('href').catch(() => '');
      const imgAlt = await link.locator('img').first().getAttribute('alt').catch(() => '');
      const isVisible = await link.isVisible().catch(() => false);
      
      if (href && !uniqueCards.has(href)) {
        uniqueCards.set(href, { name: imgAlt, visible: isVisible });
        console.log(`  ${uniqueCards.size}. ${imgAlt} -> ${href} (${isVisible ? 'VISIBLE' : 'HIDDEN'})`);
      }
    }

    // Navigate carousel up to 10 times
    const nextArrow = section.locator('button[class*="next"], button[class*="arrow-right"], .swiper-button-next').first();
    
    for (let i = 0; i < 10; i++) {
      const arrowVisible = await nextArrow.isVisible({ timeout: 2000 }).catch(() => false);
      const arrowDisabled = await nextArrow.getAttribute('disabled').catch(() => null);
      
      if (!arrowVisible || arrowDisabled !== null) {
        console.log(`\nCarousel ended after ${i} clicks`);
        break;
      }

      console.log(`\n--- Clicking Next arrow (click ${i + 1}) ---`);
      await nextArrow.click();
      await page.waitForTimeout(2000);

      // Re-scan for new cards
      allLinks = await section.locator('a[href]:has(img)').all();
      let foundNew = false;

      for (const link of allLinks) {
        const href = await link.getAttribute('href').catch(() => '');
        const imgAlt = await link.locator('img').first().getAttribute('alt').catch(() => '');
        const isVisible = await link.isVisible().catch(() => false);
        
        if (href && !uniqueCards.has(href)) {
          uniqueCards.set(href, { name: imgAlt, visible: isVisible });
          console.log(`  ✅ NEW: ${uniqueCards.size}. ${imgAlt} -> ${href} (${isVisible ? 'VISIBLE' : 'HIDDEN'})`);
          foundNew = true;
        }
      }

      if (!foundNew) {
        console.log(`  No new cards (still ${uniqueCards.size} total)`);
      }
    }

    console.log('\n=== FINAL RESULTS ===');
    console.log(`Total unique cards: ${uniqueCards.size}\n`);
    let index = 1;
    for (const [href, data] of uniqueCards.entries()) {
      console.log(`${index}. ${data.name} -> ${href}`);
      index++;
    }

    // Check for King C specifically
    const hasKingC = Array.from(uniqueCards.keys()).some(href => 
      href.toLowerCase().includes('king') || 
      Array.from(uniqueCards.values()).some(v => v.name.toLowerCase().includes('king'))
    );
    
    if (hasKingC) {
      console.log('\n✅ KING C. GILLETTE FOUND!');
    } else {
      console.log('\n❌ KING C. GILLETTE NOT FOUND IN CAROUSEL');
    }

    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
