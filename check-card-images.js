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

    console.log('\n=== CHECKING ALL PRODUCT CARD IMAGES ===\n');

    const allCardsData = [];
    const uniqueHrefs = new Set();

    // Navigate carousel and collect all cards
    const nextArrow = section.locator('button[class*="next"], button[class*="arrow-right"], .swiper-button-next').first();
    
    for (let nav = 0; nav <= 5; nav++) {
      if (nav > 0) {
        const arrowVisible = await nextArrow.isVisible({ timeout: 2000 }).catch(() => false);
        if (!arrowVisible) break;
        
        console.log(`\n--- Carousel Navigation ${nav} ---`);
        await nextArrow.click();
        await page.waitForTimeout(2000);
      }

      const allLinks = await section.locator('a[href]:has(img)').all();
      
      for (const link of allLinks) {
        const href = await link.getAttribute('href').catch(() => '');
        
        if (href && !uniqueHrefs.has(href) && !href.includes('#') && href !== '/de-de') {
          uniqueHrefs.add(href);
          
          const img = link.locator('img').first();
          const imgAlt = await img.getAttribute('alt').catch(() => 'N/A');
          const imgSrc = await img.getAttribute('src').catch(() => 'N/A');
          const imgVisible = await img.isVisible().catch(() => false);
          const linkVisible = await link.isVisible().catch(() => false);
          
          // Check if image is actually loaded
          const imgLoaded = await img.evaluate((el) => {
            if (el.complete && el.naturalHeight > 0) {
              return true;
            }
            return false;
          }).catch(() => false);
          
          const cardNum = allCardsData.length + 1;
          allCardsData.push({
            num: cardNum,
            name: imgAlt,
            href: href,
            imgSrc: imgSrc,
            imgVisible: imgVisible,
            imgLoaded: imgLoaded,
            linkVisible: linkVisible,
            navPosition: nav
          });
          
          const status = imgLoaded ? '✅ LOADED' : imgVisible ? '⚠️ VISIBLE BUT NOT LOADED' : '❌ NOT VISIBLE';
          console.log(`Card ${cardNum}: ${imgAlt}`);
          console.log(`  Link: ${href}`);
          console.log(`  Image Status: ${status}`);
          console.log(`  Image Src: ${imgSrc.substring(0, 80)}${imgSrc.length > 80 ? '...' : ''}`);
          console.log(`  Link Visible: ${linkVisible ? 'YES' : 'NO'}`);
        }
      }
    }

    console.log('\n\n=== SUMMARY OF ALL 6 CARDS ===\n');
    for (const card of allCardsData) {
      const imgStatus = card.imgLoaded ? '✅' : card.imgVisible ? '⚠️' : '❌';
      console.log(`${card.num}. ${card.name}`);
      console.log(`   Image: ${imgStatus} ${card.imgLoaded ? 'LOADED' : card.imgVisible ? 'VISIBLE BUT NOT LOADED' : 'NOT VISIBLE/BROKEN'}`);
      console.log(`   Link: ${card.href}`);
      console.log(`   Found at: Carousel position ${card.navPosition}`);
      console.log('');
    }

    // Highlight King C. Gillette specifically
    console.log('=== KING C. GILLETTE CHECK ===\n');
    const kingCCard = allCardsData.find(c => c.href.includes('kingcgillette') || c.name.toLowerCase().includes('king'));
    if (kingCCard) {
      console.log(`✓ King C. Gillette found: Card #${kingCCard.num}`);
      console.log(`  Name: ${kingCCard.name}`);
      console.log(`  Image Loaded: ${kingCCard.imgLoaded ? '✅ YES' : '❌ NO'}`);
      console.log(`  Image Visible: ${kingCCard.imgVisible ? '✅ YES' : '❌ NO'}`);
      console.log(`  Image Source: ${kingCCard.imgSrc}`);
      console.log(`  Link Visible: ${kingCCard.linkVisible ? '✅ YES' : '❌ NO'}`);
      
      if (!kingCCard.imgLoaded || !kingCCard.imgVisible) {
        console.log('\n⚠️ WARNING: King C. Gillette image is NOT properly displayed!');
      } else {
        console.log('\n✅ King C. Gillette image is properly displayed');
      }
    } else {
      console.log('❌ King C. Gillette card NOT FOUND');
    }

    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
})();
