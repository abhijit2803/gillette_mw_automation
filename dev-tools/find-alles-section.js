/**
 * Find the actual "Alles, was du brauchst" section
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
    
    console.log('\n🔍 Searching for "Alles, was du brauchst" text on page...\n');
    
    // Find all elements containing this text
    const elements = await page.locator('*:has-text("Alles, was du brauchst")').all();
    console.log(`Found ${elements.length} elements with "Alles, was du brauchst"`);
    
    for (let i = 0; i < Math.min(elements.length, 10); i++) {
      const el = elements[i];
      const tagName = await el.evaluate(e => e.tagName);
      const className = await el.evaluate(e => e.className);
      const id = await el.evaluate(e => e.id);
      const childCount = await el.locator('*').count();
      
      console.log(`\n[${i + 1}] ${tagName}`, { class: className, id, childCount });
      
      // If this looks like a section-level element
      if (['SECTION', 'DIV', 'ARTICLE'].includes(tagName) && childCount < 50) {
        console.log('  📦 This might be the section! Checking for cards...');
        
        const linksInside = await el.locator('a[href]').count();
        const imagesInside = await el.locator('img').count();
        
        console.log(`  - Links inside: ${linksInside}`);
        console.log(`  - Images inside: ${imagesInside}`);
        
        if (linksInside > 0 && linksInside < 20) {
          console.log('  ✅ Likely candidate!');
          
          // Highlight it
          await el.evaluate((e, idx) => {
            e.style.outline = `${6 + idx * 2}px solid ${idx === 0 ? 'red' : 'orange'}`;
            e.style.outlineOffset = '8px';
            e.style.backgroundColor = `rgba(255, ${100 - idx * 20}, 0, 0.1)`;
          }, i);
          
          await el.scrollIntoViewIfNeeded();
          await page.waitForTimeout(1000);
          
          // Get all links
          const links = await el.locator('a[href]').all();
          console.log(`\n  Cards in this section:`);
          for (let j = 0; j < links.length; j++) {
            const link = links[j];
            const href = await link.getAttribute('href');
            const imgAlt = await link.locator('img').first().getAttribute('alt').catch(() => 'No image');
            const text = await link.textContent();
            console.log(`    ${j + 1}. ${imgAlt} -> ${href}`);
            console.log(`       Text: ${text?.trim().substring(0, 50)}`);
          }
        }
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
