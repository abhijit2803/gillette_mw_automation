/**
 * Detailed investigation of "Unsere Produkte" section
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
    
    console.log('\n🔍 Finding "Unsere Produkte" section (#product-category)...\n');
    
    const section = page.locator('#product-category').first();
    
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Highlight the section with BLUE border
    await section.evaluate(el => {
      el.style.outline = '8px solid blue';
      el.style.outlineOffset = '8px';
      el.style.backgroundColor = 'rgba(0, 0, 255, 0.1)';
    });
    
    console.log('✅ Section highlighted in BLUE\n');
    
    // Check for carousel arrows
    console.log('🔍 Checking for carousel arrows...\n');
    const leftArrow = section.locator('.swiper-button-prev, button[aria-label*="Previous"], button[aria-label*="prev"], .carousel-prev').first();
    const rightArrow = section.locator('.swiper-button-next, button[aria-label*="Next"], button[aria-label*="next"], .carousel-next').first();
    
    const leftVisible = await leftArrow.isVisible({ timeout: 3000 }).catch(() => false);
    const rightVisible = await rightArrow.isVisible({ timeout: 3000 }).catch(() => false);
    
    console.log(`Left arrow visible: ${leftVisible}`);
    console.log(`Right arrow visible: ${rightVisible}\n`);
    
    if (leftVisible || rightVisible) {
      console.log('✅ Carousel arrows found!\n');
    }
    
    // Find ALL product cards - try multiple approaches
    console.log('🔍 Finding ALL product cards in section...\n');
    
    // Method 1: All links with images (excluding logos)
    let allCards = await section.locator('a[href]:has(img)').all();
    console.log(`Method 1 - All links with images: ${allCards.length} cards`);
    
    for (let i = 0; i < allCards.length; i++) {
      const card = allCards[i];
      const href = await card.getAttribute('href');
      const imgAlt = await card.locator('img').first().getAttribute('alt').catch(() => '');
      const text = await card.textContent();
      
      console.log(`  Card ${i + 1}:`, {
        href,
        imgAlt,
        text: text?.trim().substring(0, 60)
      });
      
      // Highlight each card
      await card.evaluate((el, idx) => {
        el.style.outline = '3px solid cyan';
        el.style.outlineOffset = '2px';
      }, i);
    }
    
    console.log('\n🔍 Checking carousel container...\n');
    
    // Check if there's a swiper container
    const swiperContainer = section.locator('.swiper-wrapper, .carousel-container, [class*="slider"]').first();
    if (await swiperContainer.isVisible().catch(() => false)) {
      console.log('✅ Found swiper/carousel container\n');
      
      const slidesInContainer = await swiperContainer.locator('.swiper-slide, .carousel-item, [class*="slide"]').all();
      console.log(`Slides in container: ${slidesInContainer.length}`);
      
      for (let i = 0; i < slidesInContainer.length; i++) {
        const slide = slidesInContainer[i];
        const linksInSlide = await slide.locator('a[href]').count();
        console.log(`  Slide ${i + 1}: ${linksInSlide} links`);
      }
    }
    
    console.log('\n🔍 Counting ALL visible cards including those in carousel...\n');
    
    // Check if we need to click carousel arrows to see all cards
    if (rightVisible) {
      console.log('Clicking right arrow to see more cards...\n');
      await rightArrow.click();
      await page.waitForTimeout(2000);
      
      const moreCards = await section.locator('a[href]:has(img)').all();
      console.log(`After clicking right arrow: ${moreCards.length} cards visible`);
      
      for (let i = 0; i < moreCards.length; i++) {
        const card = moreCards[i];
        const href = await card.getAttribute('href');
        const imgAlt = await card.locator('img').first().getAttribute('alt').catch(() => '');
        
        console.log(`  Card ${i + 1}:`, { href, imgAlt });
      }
    }
    
    console.log('\n⏸️  Waiting 30 seconds for visual inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
