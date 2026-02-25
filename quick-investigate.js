/**
 * Quick investigation script
 */

import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  
  console.log('Navigating...');
  await page.goto('https://www.gillette.de/de-de/produkte/rasierer', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  // Accept cookies
  try {
    const cookieButton = page.locator('#onetrust-accept-btn-handler');
    if (await cookieButton.isVisible({ timeout: 2000 })) {
      await cookieButton.click();
      await page.waitForTimeout(1000);
    }
  } catch (e) {}
  
  console.log('\n=== PRODUCT CARDS ===');
  const productCards = await page.locator('[data-component="ProductCard"]').count();
  console.log(`ProductCard components: ${productCards}`);
  
  if (productCards > 0) {
    const firstCard = page.locator('[data-component="ProductCard"]').first();
    const cardHTML = await firstCard.innerHTML();
    console.log('First card HTML:', cardHTML.substring(0, 500));
  }
  
  console.log('\n=== BUY BUTTONS ===');
  const buyButtons = await page.locator('a:has-text("JETZT KAUFEN")').count();
  console.log(`Buy buttons found: ${buyButtons}`);
  
  if (buyButtons > 0) {
    console.log('Clicking first buy button...');
    await page.locator('a:has-text("JETZT KAUFEN")').first().click();
    await page.waitForTimeout(2000);
    
    // Check for dialog/modal
    const dialogs = await page.locator('[role="dialog"]').count();
    console.log(`Dialogs visible: ${dialogs}`);
    
    if (dialogs > 0) {
      const dialogHTML = await page.locator('[role="dialog"]').first().innerHTML();
      console.log('Dialog HTML:', dialogHTML.substring(0, 500));
      
      const dialogLinks = await page.locator('[role="dialog"] a[href*="http"]').count();
      console.log(`Retailer links in dialog: ${dialogLinks}`);
    }
  }
  
  console.log('\n=== FAQ SECTION ===');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  
  const faqSections = await page.locator('section:has-text("FAQ")').count();
  console.log(`FAQ sections: ${faqSections}`);
  
  const accordionButtons = await page.locator('button[aria-expanded]').count();
  console.log(`Accordion buttons: ${accordionButtons}`);
  
  if (accordionButtons > 0) {
    const firstButton = page.locator('button[aria-expanded]').first();
    const buttonText = await firstButton.textContent();
    const ariaExpanded = await firstButton.getAttribute('aria-expanded');
    console.log(`First accordion: "${buttonText?.trim()}" | aria-expanded="${ariaExpanded}"`);
  }
  
  console.log('\n=== H2 HEADINGS ===');
  const h2s = await page.locator('h2').allTextContents();
  h2s.forEach((h2, i) => console.log(`${i + 1}. ${h2.trim()}`));
  
  console.log('\n=== PRODUCT STORY SECTIONS ===');
  const sections = await page.locator('section h2').count();
  console.log(`Total sections with h2: ${sections}`);
  
  await browser.close();
  console.log('\n✅ Investigation complete');
})();
