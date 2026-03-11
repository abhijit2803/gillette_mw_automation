import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  try {
    console.log('🏠 Navigating to Gillette Germany homepage...');
    await page.goto('https://www.gillette.de/de-de', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);

    // Accept cookies
    const cookieButton = page.locator('button:has-text("Alle Cookies akzeptieren"), button:has-text("Alle akzeptieren"), button#onetrust-accept-btn-handler').first();
    if (await cookieButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cookieButton.click();
      await page.waitForTimeout(2000);
    }

    console.log('\n🔍 Investigating homepage banner structure...\n');
    
    // Check for carousel/swiper elements
    console.log('=== Carousel Container ===');
    const swiperContainer = await page.locator('.swiper, [class*="swiper"], [class*="carousel"], [class*="slider"]').first();
    const swiperExists = await swiperContainer.isVisible({ timeout: 3000 }).catch(() => false);
    console.log(`Swiper/Carousel container exists: ${swiperExists}`);
    
    if (swiperExists) {
      const swiperClass = await swiperContainer.getAttribute('class');
      console.log(`Container class: ${swiperClass}`);
    }
    
    // Check for slides
    console.log('\n=== Banner Slides ===');
    const slides = await page.locator('.swiper-slide, [class*="slide"]').all();
    console.log(`Total slides found: ${slides.length}`);
    
    for (let i = 0; i < Math.min(slides.length, 3); i++) {
      const slideClass = await slides[i].getAttribute('class').catch(() => '');
      const slideVisible = await slides[i].isVisible().catch(() => false);
      console.log(`Slide ${i + 1}: class="${slideClass}", visible=${slideVisible}`);
    }
    
    // Check for navigation arrows (multiple possible selectors)
    console.log('\n=== Navigation Arrows ===');
    const arrowSelectors = [
      'button:has-text("Next Slide")',
      'button:has-text("Previous Slide")',
      '.swiper-button-next',
      '.swiper-button-prev',
      '[class*="next"]',
      '[class*="prev"]',
      'button[aria-label*="next"]',
      'button[aria-label*="previous"]'
    ];
    
    for (const selector of arrowSelectors) {
      const element = page.locator(selector).first();
      const exists = await element.isVisible({ timeout: 1000 }).catch(() => false);
      if (exists) {
        const ariaLabel = await element.getAttribute('aria-label').catch(() => '');
        console.log(`✓ Found: ${selector} (aria-label: "${ariaLabel}")`);
      }
    }
    
    // Check for "Mehr erfahren" buttons
    console.log('\n=== "Mehr erfahren" CTA Buttons ===');
    const ctaSelectors = [
      'a:has-text("Mehr erfahren")',
      'button:has-text("Mehr erfahren")',
      '.swiper-slide-active a:has-text("Mehr erfahren")',
      '[href*="erfahren"]'
    ];
    
    for (const selector of ctaSelectors) {
      const elements = await page.locator(selector).all();
      console.log(`${selector}: Found ${elements.length} matches`);
      
      for (let i = 0; i < Math.min(elements.length, 3); i++) {
        const text = await elements[i].textContent().catch(() => '');
        const href = await elements[i].getAttribute('href').catch(() => '');
        const isVisible = await elements[i].isVisible().catch(() => false);
        console.log(`  [${i + 1}] "${text.trim()}" → ${href} (visible: ${isVisible})`);
      }
    }
    
    // Check active slide
    console.log('\n=== Active Slide Content ===');
    const activeSlide = page.locator('.swiper-slide-active, [class*="active"]').first();
    const activeExists = await activeSlide.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (activeExists) {
      const heading = await activeSlide.locator('h1, h2').first().textContent().catch(() => 'No heading');
      console.log(`Active slide heading: "${heading.trim()}"`);
      
      const allLinks = await activeSlide.locator('a').all();
      console.log(`Links in active slide: ${allLinks.length}`);
      
      for (let i = 0; i < allLinks.length; i++) {
        const text = await allLinks[i].textContent().catch(() => '');
        const href = await allLinks[i].getAttribute('href').catch(() => '');
        const isVisible = await allLinks[i].isVisible().catch(() => false);
        console.log(`  Link ${i + 1}: "${text.trim()}" → ${href} (visible: ${isVisible})`);
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/banner-structure-investigation.png', fullPage: false });
    console.log('\n📸 Screenshot saved: test-results/banner-structure-investigation.png');
    
    console.log('\n✅ Investigation complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
