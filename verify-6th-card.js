import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  
  console.log('🌐 Navigating to Gillette Germany homepage...');
  await page.goto('https://www.gillette.de/de-de', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Accept cookies
  console.log('🍪 Accepting cookies...');
  const cookieButton = page.locator('#onetrust-accept-btn-handler, button:has-text("Alle akzeptieren"), button:has-text("Akzeptieren")').first();
  if (await cookieButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await cookieButton.click();
    await page.waitForTimeout(2000);
  }
  
  // Find the product category section
  console.log('\n📦 Locating "Unsere Produkte" (#product-category) section...');
  const section = page.locator('#product-category, .wrapper-product-category').first();
  
  await section.evaluate(el => {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.style.outline = '6px solid #0066FF';
    el.style.backgroundColor = 'rgba(0, 102, 255, 0.1)';
  });
  await page.waitForTimeout(2000);
  
  const clickedHrefs = new Set();
  
  // Function to get all visible product cards
  const getVisibleProducts = async () => {
    const cards = await section.locator('.swiper-slide a[href]:has(img), a[href*="produkte"]:has(img), a[href*="gillettelabs"]:has(img)').all();
    const products = [];
    
    for (const card of cards) {
      const href = await card.getAttribute('href').catch(() => '');
      if (href && !href.includes('#') && href !== '/de-de') {
        const name = await card.locator('img').first().getAttribute('alt').catch(() => '') || 
                     await card.locator('h3, h4').first().textContent().catch(() => 'Unknown');
        products.push({ name: name.trim(), href, clicked: clickedHrefs.has(href) });
      }
    }
    return products;
  };
  
  // Initial scan
  console.log('\n📍 Initial carousel position:');
  let products = await getVisibleProducts();
  products.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} -> ${p.href}`);
  });
  
  const rightArrow = section.locator('button[class*="next"], button[class*="arrow-right"], .swiper-button-next').first();
  
  // Click through carousel multiple times
  for (let i = 1; i <= 6; i++) {
    if (await rightArrow.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log(`\n🔵 Click ${i}: Clicking carousel NEXT arrow...`);
      await rightArrow.click();
      await page.waitForTimeout(2000);
      
      products = await getVisibleProducts();
      console.log(`📍 After click ${i}:`);
      products.forEach((p, idx) => {
        const newCard = !clickedHrefs.has(p.href);
        if (newCard) clickedHrefs.add(p.href);
        console.log(`  ${idx + 1}. ${p.name} -> ${p.href} ${newCard ? '🆕 NEW' : '(seen)'}`);
      });
      
      console.log(`📊 Total unique products found: ${clickedHrefs.size}`);
    } else {
      console.log('❌ Next arrow not visible');
      break;
    }
  }
  
  console.log(`\n✅ Final count: ${clickedHrefs.size} unique product cards found`);
  console.log('\n📋 All unique products:');
  Array.from(clickedHrefs).forEach((href, i) => {
    console.log(`  ${i + 1}. ${href}`);
  });
  
  console.log('\n⏸️  Press Ctrl+C to close browser');
  await page.waitForTimeout(30000);
  
  await browser.close();
})();
