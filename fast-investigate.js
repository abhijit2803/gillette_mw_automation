/**
 * Fast investigation script - no hanging
 */

import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  
  await page.goto('https://www.gillette.de/de-de/produkte/rasierer', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2000);
  
  // Accept cookies
  try {
    await page.locator('#onetrust-accept-btn-handler').click({ timeout: 2000 });
    await page.waitForTimeout(500);
  } catch (e) {}
  
  // PRODUCT CARDS - try different selectors
  console.log('\n=== FINDING PRODUCT CARDS ===');
  const selectors = [
    '[data-component="ProductCard"]',
    '.product-card',
    '.grid-tile',
    'article',
    'button[aria-label="fav-button"]'
  ];
  
  for (const sel of selectors) {
    const count = await page.locator(sel).count();
    if (count > 0) console.log(`✅ ${sel}: ${count} found`);
  }
  
  // Get parent of favorite button (likely the product card)
  const favButton = page.locator('button[aria-label="fav-button"]').first();
  if (await favButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    const parent = favButton.locator('..');
    const parentTag = await parent.evaluate(el => el.tagName);
    const parentClass = await parent.getAttribute('class');
    console.log(`Favorite button parent: <${parentTag}> class="${parentClass}"`);
  }
  
  // BUY BUTTONS
  console.log('\n=== BUY BUTTONS ===');
  const buyCount = await page.locator('a:has-text("JETZT KAUFEN")').count();
  console.log(`Buy buttons: ${buyCount}`);
  
  if (buyCount > 0) {
    const firstBuyButton = page.locator('a:has-text("JETZT KAUFEN")').first();
    const href = await firstBuyButton.getAttribute('href');
    const classes = await firstBuyButton.getAttribute('class');
    console.log(`First buy button href: ${href}`);
    console.log(`First buy button classes: ${classes}`);
  }
  
  // MORE INFO BUTTONS
  console.log('\n=== MORE INFO BUTTONS ===');
  const moreInfoCount = await page.locator('a:has-text("MEHR ERFAHREN")').count();
  console.log(`More info buttons: ${moreInfoCount}`);
  
  if (moreInfoCount > 0) {
    const firstMoreInfo = page.locator('a:has-text("MEHR ERFAHREN")').first();
    const href = await firstMoreInfo.getAttribute('href');
    console.log(`First more info href: ${href}`);
  }
  
  // PRODUCT TITLES/LINKS
  console.log('\n=== PRODUCT LINKS ===');
  const productLinks = await page.locator('a[href*="/produkte/rasierer/"]').count();
  console.log(`Product links: ${productLinks}`);
  
  const productTitles = await page.locator('a[href*="/produkte/rasierer/"]')
    .filter({ hasNot: page.locator('img') })
    .allTextContents();
  console.log(`Product titles found: ${productTitles.length}`);
  if (productTitles.length > 0) {
    console.log(`Sample: ${productTitles.slice(0, 3).map(t => t.trim()).join(' | ')}`);
  }
  
  // FAQ - scroll to bottom first
  console.log('\n=== FAQ SECTION ===');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  
  const faqHeading = await page.locator('h2:has-text("FAQ")').isVisible({ timeout: 3000 }).catch(() => false);
  console.log(`FAQ heading visible: ${faqHeading}`);
  
  const accordions = await page.locator('button[aria-expanded]').count();
  console.log(`Accordion buttons: ${accordions}`);
  
  if (accordions > 0) {
    // Get details of first few accordions
    const firstFew = await page.locator('button[aria-expanded]').all();
    for (let i = 0; i < Math.min(3, firstFew.length); i++) {
      const text = await firstFew[i].textContent();
      const expanded = await firstFew[i].getAttribute('aria-expanded');
      const classes = await firstFew[i].getAttribute('class');
      console.log(`  Accordion ${i + 1}: "${text?.trim().substring(0, 50)}" | expanded=${expanded} | class="${classes}"`);
    }
  }
  
  // H2 HEADINGS
  console.log('\n=== PAGE SECTIONS (H2) ===');
  const h2s = await page.locator('h2').allTextContents();
  h2s.forEach((h2, i) => {
    if (h2.trim()) console.log(`  ${i + 1}. ${h2.trim()}`);
  });
  
  // PRODUCT STORY SECTIONS
  console.log('\n=== CONTENT SECTIONS ===');
  const sections = await page.locator('section').count();
  console.log(`Total <section> elements: ${sections}`);
  
  // Check for specific content sections
  const storySection = await page.locator('section:has-text("Warum Gillette")').isVisible({ timeout: 2000 }).catch(() => false);
  console.log(`"Warum Gillette" section visible: ${storySection}`);
  
  const qualitySection = await page.locator('section:has-text("Qualität")').isVisible({ timeout: 2000 }).catch(() => false);
  console.log(`"Qualität" section visible: ${qualitySection}`);
  
  await browser.close();
  console.log('\n✅ Done');
})();
