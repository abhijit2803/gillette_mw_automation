/**
 * Debug script to investigate the Categorized PLP structure
 */

import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--start-maximized']
  });
  
  const context = await browser.newContext({
    viewport: null
  });
  
  const page = await context.newPage();
  
  console.log('\n🔍 Navigating to Categorized PLP...');
  await page.goto('https://www.gillette.de/de-de/produkte/rasierer', { 
    waitUntil: 'domcontentloaded' 
  });
  
  await page.waitForTimeout(2000);
  
  // Accept cookies
  console.log('\n🍪 Accepting cookies...');
  try {
    const cookieButton = page.locator('#onetrust-accept-btn-handler');
    if (await cookieButton.isVisible({ timeout: 2000 })) {
      await cookieButton.click();
      await page.waitForTimeout(1000);
    }
  } catch (e) {
    console.log('Cookie banner not found');
  }
  
  // 1. Product Cards Investigation
  console.log('\n📦 === PRODUCT CARDS INVESTIGATION ===');
  
  // Try different product card selectors
  const cardSelectors = [
    '.product-card',
    '[data-testid="product-card"]',
    '.grid-tile',
    '.product-item',
    'article',
    '[class*="product"]',
    '[data-component="product"]'
  ];
  
  for (const selector of cardSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      console.log(`✅ Found ${count} elements with selector: ${selector}`);
      
      // Get first card's HTML
      const firstCard = page.locator(selector).first();
      const html = await firstCard.innerHTML().catch(() => 'Could not get HTML');
      console.log(`   First card HTML (truncated): ${html.substring(0, 200)}...`);
    }
  }
  
  // 2. Product Title/Link Investigation
  console.log('\n📝 === PRODUCT TITLES/LINKS ===');
  const titleSelectors = [
    'a[href*="/produkte/"]',
    '.product-title',
    '.product-name',
    'h2 a',
    'h3 a',
    '[data-testid="product-title"]'
  ];
  
  for (const selector of titleSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      console.log(`✅ Found ${count} elements with selector: ${selector}`);
      const texts = await page.locator(selector).allTextContents();
      console.log(`   Sample texts: ${texts.slice(0, 3).map(t => t.trim()).join(' | ')}`);
    }
  }
  
  // 3. Buy Now Button Investigation
  console.log('\n🛒 === BUY NOW BUTTONS ===');
  const buyButtonSelectors = [
    'button:has-text("JETZT KAUFEN")',
    'a:has-text("JETZT KAUFEN")',
    'button:has-text("KAUFEN")',
    'a:has-text("KAUFEN")',
    '[data-testid="buy-button"]',
    '.buy-now',
    '.add-to-cart'
  ];
  
  for (const selector of buyButtonSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      console.log(`✅ Found ${count} elements with selector: ${selector}`);
      const texts = await page.locator(selector).allTextContents();
      console.log(`   Button texts: ${texts.slice(0, 3).map(t => t.trim()).join(' | ')}`);
    }
  }
  
  // Click first buy button and check for popup
  console.log('\n🔍 Clicking first BUY button...');
  const buyButton = page.locator('button:has-text("JETZT KAUFEN"), a:has-text("JETZT KAUFEN")').first();
  if (await buyButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await buyButton.click();
    await page.waitForTimeout(2000);
    
    // Check for popups/modals
    console.log('\n🔍 === CHECKING FOR RETAILER POPUP ===');
    const popupSelectors = [
      '[role="dialog"]',
      '.modal',
      '.popup',
      '[class*="Modal"]',
      '[data-testid="modal"]',
      '[class*="dialog"]'
    ];
    
    for (const selector of popupSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        const visible = await page.locator(selector).first().isVisible().catch(() => false);
        if (visible) {
          console.log(`✅ Found visible popup with selector: ${selector}`);
          const html = await page.locator(selector).first().innerHTML().catch(() => 'Could not get HTML');
          console.log(`   Popup HTML (truncated): ${html.substring(0, 300)}...`);
          
          // Check for retailer links
          const links = await page.locator(`${selector} a[href]`).all();
          console.log(`   Found ${links.length} links in popup`);
          for (let i = 0; i < Math.min(3, links.length); i++) {
            const href = await links[i].getAttribute('href');
            const text = await links[i].textContent();
            console.log(`   Link ${i + 1}: ${text?.trim()} -> ${href}`);
          }
        }
      }
    }
  }
  
  // 4. FAQ Section Investigation
  console.log('\n❓ === FAQ SECTION INVESTIGATION ===');
  
  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  
  const faqSelectors = [
    'section:has-text("FAQ")',
    '[data-component="faq"]',
    '.faq-section',
    '.accordion',
    '[class*="faq"]',
    '[class*="FAQ"]'
  ];
  
  for (const selector of faqSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      const visible = await page.locator(selector).first().isVisible().catch(() => false);
      console.log(`${visible ? '✅' : '⚠️'} Found ${count} elements with selector: ${selector} (Visible: ${visible})`);
      
      if (visible) {
        const html = await page.locator(selector).first().innerHTML().catch(() => 'Could not get HTML');
        console.log(`   HTML (truncated): ${html.substring(0, 300)}...`);
      }
    }
  }
  
  // Check for accordion/expandable items
  console.log('\n🔍 === CHECKING FOR FAQ ACCORDION ITEMS ===');
  const accordionSelectors = [
    'button[aria-expanded]',
    '.accordion-button',
    '[data-testid="accordion-button"]',
    'button:has-text("+")',
    'button:has-text("−")',
    '[class*="accordion"]'
  ];
  
  for (const selector of accordionSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      console.log(`✅ Found ${count} elements with selector: ${selector}`);
      const texts = await page.locator(selector).allTextContents();
      console.log(`   Sample texts: ${texts.slice(0, 3).map(t => t.trim()).join(' | ')}`);
    }
  }
  
  // 5. Product Story/Description Investigation
  console.log('\n📖 === PRODUCT STORY/DESCRIPTION INVESTIGATION ===');
  
  const storySelectors = [
    'section:has-text("Warum")',
    'section:has-text("Qualität")',
    '[data-component="product-story"]',
    '.product-description',
    '.content-section',
    'section h2',
    '[class*="story"]'
  ];
  
  for (const selector of storySelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      const visible = await page.locator(selector).first().isVisible().catch(() => false);
      console.log(`${visible ? '✅' : '⚠️'} Found ${count} elements with selector: ${selector} (Visible: ${visible})`);
      
      if (visible) {
        const text = await page.locator(selector).first().textContent().catch(() => '');
        console.log(`   Text (truncated): ${text.trim().substring(0, 100)}...`);
      }
    }
  }
  
  // 6. All H2 headings (for understanding page structure)
  console.log('\n📑 === ALL H2 HEADINGS ===');
  const h2s = await page.locator('h2').allTextContents();
  h2s.forEach((h2, index) => {
    console.log(`   ${index + 1}. ${h2.trim()}`);
  });
  
  console.log('\n✅ Investigation complete. Press Enter to close...');
  
  // Keep browser open for manual inspection
  await new Promise(resolve => {
    process.stdin.once('data', () => {
      resolve();
    });
  });
  
  await browser.close();
})();
