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
      el.style.outline = '5px solid blue';
    });

    console.log('\n=== NAVIGATING TO FIND KING C. GILLETTE ===\n');

    const nextArrow = section.locator('button[class*="next"], button[class*="arrow-right"], .swiper-button-next').first();
    
    for (let i = 0; i < 5; i++) {
      console.log(`\nCarousel position ${i}:`);
      
      // Check for King C. Gillette
      const kingCLink = section.locator('a[href*="kingcgillette"]').first();
      const kingCExists = await kingCLink.count() > 0;
      
      if (kingCExists) {
        const isVisible = await kingCLink.isVisible().catch(() => false);
        const hasImage = await kingCLink.locator('img').count() > 0;
        
        console.log(`  ✅ FOUND King C. Gillette link`);
        console.log(`  Link visible: ${isVisible ? 'YES' : 'NO'}`);
        console.log(`  Has image: ${hasImage ? 'YES' : 'NO'}`);
        
        if (hasImage) {
          const img = kingCLink.locator('img').first();
          const imgSrc = await img.getAttribute('src').catch(() => '');
          const imgAlt = await img.getAttribute('alt').catch(() => '');
          const imgVisible = await img.isVisible().catch(() => false);
          const imgLoaded = await img.evaluate(el => el.complete && el.naturalHeight > 0).catch(() => false);
          
          console.log(`  Image alt: "${imgAlt}"`);
          console.log(`  Image visible: ${imgVisible ? 'YES' : 'NO'}`);
          console.log(`  Image loaded: ${imgLoaded ? 'YES' : 'NO'}`);
          console.log(`  Image src: ${imgSrc}`);
          
          // Scroll King C. card into view and highlight it
          await kingCLink.scrollIntoViewIfNeeded();
          await page.waitForTimeout(1000);
          
          await kingCLink.evaluate(el => {
            el.style.outline = '5px solid red';
            el.style.outlineOffset = '5px';
            el.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
          });
          
          await page.waitForTimeout(2000);
          
          // Take screenshot
          await page.screenshot({ 
            path: 'test-results/king-c-gillette-card-found.png',
            fullPage: false 
          });
          console.log(`\n📸 Screenshot saved: test-results/king-c-gillette-card-found.png`);
          
          // Take screenshot of just the card
          await kingCLink.screenshot({
            path: 'test-results/king-c-gillette-card-closeup.png'
          });
          console.log(`📸 Card closeup saved: test-results/king-c-gillette-card-closeup.png`);
          
          console.log(`\n✅ King C. Gillette FOUND and VISIBLE at carousel position ${i}`);
          
          await page.waitForTimeout(5000);
          return;
        }
      } else {
        console.log(`  Not found yet...`);
      }
      
      // Click next arrow
      const arrowVisible = await nextArrow.isVisible({ timeout: 2000 }).catch(() => false);
      if (!arrowVisible) {
        console.log(`  Carousel ended`);
        break;
      }
      
      console.log(`  Clicking NEXT arrow...`);
      await nextArrow.click();
      await page.waitForTimeout(2000);
    }

    console.log('\n❌ King C. Gillette was not found in the carousel');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
