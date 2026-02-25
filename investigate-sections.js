/**
 * Investigation script to find "Unsere Produkte" and "Erfahre etwas Neues" sections
 */

import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Navigating to Gillette homepage...');
    await page.goto('https://www.gillette.de/de-de', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    // Accept cookies
    const cookieButton = page.locator('button:has-text("Alle Cookies akzeptieren"), button:has-text("Akzeptieren"), #onetrust-accept-btn-handler').first();
    if (await cookieButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cookieButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for "Unsere Produkte" section
    console.log('\n🔍 Searching for "Unsere Produkte" section...\n');
    const unseProdukte = await page.locator('*:has-text("Unsere Produkte")').all();
    console.log(`Found ${unseProdukte.length} elements with "Unsere Produkte"`);
    
    for (let i = 0; i < Math.min(unseProdukte.length, 10); i++) {
      const el = unseProdukte[i];
      const tagName = await el.evaluate(e => e.tagName);
      const className = await el.evaluate(e => e.className);
      const id = await el.evaluate(e => e.id);
      const childCount = await el.locator('*').count();
      
      console.log(`[${i + 1}] ${tagName}`, { class: className, id, childCount });
      
      if (['SECTION', 'DIV', 'ARTICLE'].includes(tagName) && childCount > 5 && childCount < 100) {
        console.log('  📦 This might be the section!');
        
        const linksInside = await el.locator('a[href]').count();
        const imagesInside = await el.locator('img').count();
        const carouselButtons = await el.locator('button[class*="arrow"], button[class*="carousel"], button[class*="swiper"], button[class*="prev"], button[class*="next"]').count();
        
        console.log(`  - Links: ${linksInside}, Images: ${imagesInside}, Carousel buttons: ${carouselButtons}`);
        
        if (linksInside > 0 || carouselButtons > 0) {
          console.log('  ✅ Likely candidate!');
          
          // Highlight it in BLUE
          await el.evaluate((e, idx) => {
            e.style.outline = `${8}px solid blue`;
            e.style.outlineOffset = '10px';
            e.style.backgroundColor = `rgba(0, 0, 255, 0.1)`;
          }, i);
          
          await el.scrollIntoViewIfNeeded();
          await page.waitForTimeout(2000);
          
          // Check for carousel arrows
          const nextArrow = el.locator('button:has-text("Next"), button[class*="next"], button[class*="arrow-right"], .swiper-button-next');
          const prevArrow = el.locator('button:has-text("Prev"), button[class*="prev"], button[class*="arrow-left"], .swiper-button-prev');
          
          const nextCount = await nextArrow.count();
          const prevCount = await prevArrow.count();
          
          console.log(`  - Next arrows found: ${nextCount}, Prev arrows found: ${prevCount}`);
          
          // Get links with images
          const links = await el.locator('a[href]:has(img)').all();
          console.log(`\n  📦 Found ${links.length} links with images:`);
          for (let j = 0; j < Math.min(links.length, 8); j++) {
            const link = links[j];
            const href = await link.getAttribute('href');
            const imgAlt = await link.locator('img').first().getAttribute('alt').catch(() => 'No alt');
            console.log(`    ${j + 1}. ${imgAlt} -> ${href}`);
          }
        }
      }
    }
    
    // Look for "Erfahre etwas Neues" section
    console.log('\n\n🔍 Searching for "Erfahre etwas Neues" section...\n');
    const erfahreNeues = await page.locator('*:has-text("Erfahre etwas Neues")').all();
    console.log(`Found ${erfahreNeues.length} elements with "Erfahre etwas Neues"`);
    
    for (let i = 0; i < Math.min(erfahreNeues.length, 10); i++) {
      const el = erfahreNeues[i];
      const tagName = await el.evaluate(e => e.tagName);
      const className = await el.evaluate(e => e.className);
      const id = await el.evaluate(e => e.id);
      const childCount = await el.locator('*').count();
      
      console.log(`[${i + 1}] ${tagName}`, { class: className, id, childCount });
      
      if (['SECTION', 'DIV', 'ARTICLE'].includes(tagName) && childCount > 5 && childCount < 100) {
        console.log('  📦 This might be the section!');
        
        const linksInside = await el.locator('a[href]').count();
        const imagesInside = await el.locator('img').count();
        const carouselButtons = await el.locator('button[class*="arrow"], button[class*="carousel"], button[class*="swiper"], button[class*="prev"], button[class*="next"]').count();
        
        console.log(`  - Links: ${linksInside}, Images: ${imagesInside}, Carousel buttons: ${carouselButtons}`);
        
        if (linksInside > 0 || carouselButtons > 0) {
          console.log('  ✅ Likely candidate!');
          
          // Highlight it in PURPLE
          await el.evaluate((e, idx) => {
            e.style.outline = `${8}px solid purple`;
            e.style.outlineOffset = '10px';
            e.style.backgroundColor = `rgba(153, 51, 255, 0.1)`;
          }, i);
          
          await el.scrollIntoViewIfNeeded();
          await page.waitForTimeout(2000);
          
          // Check for carousel arrows
          const nextArrow = el.locator('button:has-text("Next"), button[class*="next"], button[class*="arrow-right"], .swiper-button-next');
          const prevArrow = el.locator('button:has-text("Prev"), button[class*="prev"], button[class*="arrow-left"], .swiper-button-prev');
          
          const nextCount = await nextArrow.count();
          const prevCount = await prevArrow.count();
          
          console.log(`  - Next arrows found: ${nextCount}, Prev arrows found: ${prevCount}`);
          
          // Get links with images
          const links = await el.locator('a[href]:has(img)').all();
          console.log(`\n  📦 Found ${links.length} links with images:`);
          for (let j = 0; j < Math.min(links.length, 8); j++) {
            const link = links[j];
            const href = await link.getAttribute('href');
            const text = await link.textContent().catch(() => '');
            const imgAlt = await link.locator('img').first().getAttribute('alt').catch(() => 'No alt');
            console.log(`    ${j + 1}. ${imgAlt} -> ${href}`);
            console.log(`       Text: ${text?.trim().substring(0, 60)}`);
          }
        }
      }
    }
    
    console.log('\n⏸️  Waiting 30 seconds for visual inspection...');
    console.log('BLUE = "Unsere Produkte", PURPLE = "Erfahre etwas Neues"');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
