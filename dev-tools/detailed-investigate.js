/**
 * Detailed FAQ and Buy Button investigation
 */

import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();
  
  await page.goto('https://www.gillette.de/de-de/produkte/rasierer', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2000);
  
  try {
    await page.locator('#onetrust-accept-btn-handler').click({ timeout: 2000 });
    await page.waitForTimeout(500);
  } catch (e) {}
  
  // ===== BUY BUTTON INVESTIGATION =====
  console.log('\n=== CLICKING BUY BUTTON ===');
  const buyButton = page.locator('a:has-text("JETZT KAUFEN")').first();
  
  console.log('Buy button details:');
  console.log('  href:', await buyButton.getAttribute('href'));
  console.log('  data-* attributes:', await buyButton.evaluate(el => {
    const attrs = {};
    for (const attr of el.attributes) {
      if (attr.name.startsWith('data-')) {
        attrs[attr.name] = attr.value;
      }
    }
    return attrs;
  }));
  
  // Click and wait for any popup/modal
  await buyButton.click();
  console.log('Clicked! Waiting for popup...');
  await page.waitForTimeout(3000);
  
  // Check all dialogs/modals
  const allDialogs = await page.locator('[role="dialog"], .modal, [class*="Modal"], [class*="modal"]').all();
  console.log(`\nDialogs found: ${allDialogs.length}`);
  
  for (let i = 0; i < allDialogs.length; i++) {
    const visible = await allDialogs[i].isVisible().catch(() => false);
    if (visible) {
      console.log(`\n=== DIALOG ${i + 1} (VISIBLE) ===`);
      const html = await allDialogs[i].innerHTML();
      console.log('HTML:', html.substring(0, 600));
      
      // Get retailer links
      const retailerLinks = await allDialogs[i].locator('a[href*="http"]').all();
      console.log(`\nRetailer links: ${retailerLinks.length}`);
      for (let j = 0; j < Math.min(5, retailerLinks.length); j++) {
        const href = await retailerLinks[j].getAttribute('href');
        const text = await retailerLinks[j].textContent();
        const classes = await retailerLinks[j].getAttribute('class');
        console.log(`  ${j + 1}. "${text?.trim()}" -> ${href}`);
        console.log(`     Classes: ${classes}`);
      }
      
      // Check for close button
      const closeButtons = await allDialogs[i].locator('button, [role="button"]').all();
      console.log(`\nClose buttons in dialog: ${closeButtons.length}`);
      for (const btn of closeButtons) {
        const text = await btn.textContent();
        const ariaLabel = await btn.getAttribute('aria-label');
        console.log(`  - Text: "${text?.trim()}" | aria-label: "${ariaLabel}"`);
      }
    }
  }
  
  // Close any open dialog
  const closeBtn = page.locator('[role="dialog"] button').first();
  if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await closeBtn.click();
    await page.waitForTimeout(500);
  }
  
  // ===== FAQ INVESTIGATION =====
  console.log('\n\n=== FAQ INVESTIGATION ===');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  
  // Find FAQ section
  const faqH2 = page.locator('h2:has-text("FAQ")');
  if (await faqH2.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('FAQ section found!');
    
    // Get parent element
    const faqParent = faqH2.locator('..');
    const parentTag = await faqParent.evaluate(el => el.tagName);
    const parentClass = await faqParent.getAttribute('class');
    console.log(`FAQ parent: <${parentTag}> class="${parentClass}"`);
    
    // Find all elements after FAQ heading
    const faqContainer = page.locator('h2:has-text("FAQ")').locator('xpath=following-sibling::*[1]');
    if (await faqContainer.isVisible({ timeout: 2000 }).catch(() => false)) {
      const containerTag = await faqContainer.evaluate(el => el.tagName);
      const containerClass = await faqContainer.getAttribute('class');
      console.log(`FAQ container: <${containerTag}> class="${containerClass}"`);
      
      // Get HTML of FAQ area
      const faqHTML = await faqContainer.innerHTML();
      console.log('\nFAQ container HTML (500 chars):', faqHTML.substring(0, 500));
      
      // Find all clickable elements
      const clickables = await faqContainer.locator('button, [role="button"], [class*="accordion"]').all();
      console.log(`\nClickable FAQ elements: ${clickables.length}`);
      
      for (let i = 0; i < Math.min(3, clickables.length); i++) {
        const tag = await clickables[i].evaluate(el => el.tagName);
        const text = await clickables[i].textContent();
        const classes = await clickables[i].getAttribute('class');
        const ariaExpanded = await clickables[i].getAttribute('aria-expanded');
        console.log(`  ${i + 1}. <${tag}> "${text?.trim().substring(0, 40)}" | aria-expanded=${ariaExpanded}`);
        console.log(`     Classes: ${classes}`);
      }
    }
    
    // Try different FAQ item selectors
    console.log('\n=== TESTING FAQ SELECTORS ===');
    const faqSelectors = [
      'div[class*="accordion"]',
      'div[class*="faq"]',
      '[data-component*="accordion"]',
      '[data-component*="faq"]'
    ];
    
    for (const sel of faqSelectors) {
      const count = await page.locator(sel).count();
      if (count > 0) {
        console.log(`✅ ${sel}: ${count} found`);
      }
    }
  } else {
    console.log('FAQ section not found');
  }
  
  // ===== PRODUCT STORY SECTIONS =====
  console.log('\n\n=== PRODUCT STORY SECTIONS ===');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(1000);
  
  const storyHeadings = [
    'Warum Gillette-Rasierer verwenden?',
    'Gillette-Rasierer, garantierte Qualität',
    'Gillette Rasierprodukte zur Optimierung deiner Routine'
  ];
  
  for (const heading of storyHeadings) {
    const h2 = page.locator(`h2:has-text("${heading}")`);
    if (await h2.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log(`\n✅ Found: "${heading}"`);
      
      // Get next sibling (likely the content)
      const nextSibling = h2.locator('xpath=following-sibling::*[1]');
      if (await nextSibling.isVisible({ timeout: 1000 }).catch(() => false)) {
        const content = await nextSibling.textContent();
        console.log(`   Content: ${content?.trim().substring(0, 150)}...`);
      }
    }
  }
  
  console.log('\n✅ Investigation complete. Browser will close in 10 seconds...');
  await page.waitForTimeout(10000);
  
  await browser.close();
})();
