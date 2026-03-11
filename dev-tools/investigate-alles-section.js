/**
 * Investigation script to identify cards in "Alles, was du brauchst" section
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
    
    console.log('\n🔍 Finding "Alles, was du brauchst" section...');
    
    // Find the section
    const section = page.locator('section:has-text("Alles, was du brauchst"), [data-section="essentials"], div:has-text("Alles, was du brauchst")').first();
    
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Highlight the section
    await section.evaluate(el => {
      el.style.outline = '8px solid red';
      el.style.outlineOffset = '8px';
      el.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    });
    
    console.log('✅ Section highlighted in RED\n');
    
    // Get section HTML structure
    const sectionHTML = await section.evaluate(el => {
      return {
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        textContent: el.textContent.substring(0, 200)
      };
    });
    console.log('📦 Section details:', sectionHTML);
    
    // Try different card selectors within the section
    console.log('\n🔍 Searching for cards within the section...\n');
    
    const selectors = [
      'a[href]',
      'a[data-action-detail]',
      'a.event_image_click',
      '.product-card',
      '.packshot',
      'article',
      '.card',
      'div[class*="card"]',
      'div[class*="item"]',
      'a img',
    ];
    
    for (const selector of selectors) {
      const elements = await section.locator(selector).all();
      if (elements.length > 0) {
        console.log(`✅ "${selector}" - Found ${elements.length} elements:`);
        for (let i = 0; i < Math.min(elements.length, 5); i++) {
          const el = elements[i];
          const href = await el.getAttribute('href').catch(() => '');
          const dataDetail = await el.getAttribute('data-action-detail').catch(() => '');
          const className = await el.getAttribute('class').catch(() => '');
          const text = await el.textContent().catch(() => '');
          const imgAlt = await el.locator('img').first().getAttribute('alt').catch(() => '');
          
          console.log(`  [${i + 1}]`, {
            href: href || 'N/A',
            dataDetail: dataDetail || 'N/A',
            class: className || 'N/A',
            imgAlt: imgAlt || 'N/A',
            text: text?.trim().substring(0, 50) || 'N/A'
          });
        }
        console.log('');
      }
    }
    
    // Check if there are nested sections
    console.log('\n🔍 Checking for nested containers within section...\n');
    const containers = await section.locator('div, section, article').all();
    console.log(`Found ${containers.length} nested containers`);
    
    // Get all links in the section with their images
    console.log('\n🔍 All links with images in the section:\n');
    const links = await section.locator('a').all();
    console.log(`Total links in section: ${links.length}`);
    
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const href = await link.getAttribute('href').catch(() => '');
      const hasImage = await link.locator('img').count() > 0;
      const imgSrc = await link.locator('img').first().getAttribute('src').catch(() => '');
      const imgAlt = await link.locator('img').first().getAttribute('alt').catch(() => '');
      
      if (hasImage) {
        console.log(`Link ${i + 1}:`, {
          href,
          imgAlt,
          imgSrc: imgSrc?.substring(0, 60) || 'N/A'
        });
        
        // Highlight this link
        await link.evaluate((el, idx) => {
          el.style.outline = '3px solid blue';
          el.style.outlineOffset = '2px';
        }, i);
      }
    }
    
    console.log('\n✅ All links with images are highlighted in BLUE');
    console.log('⏸️  Waiting 30 seconds for inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
