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

    console.log('\n🔍 Investigating "Alles, was du brauchst" section...\n');
    
    // Find the section
    const section = page.locator('section:has-text("Alles, was du brauchst"), [data-section="essentials"], div:has-text("Alles, was du brauchst")').first();
    const sectionVisible = await section.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (sectionVisible) {
      console.log('✅ Section found and visible');
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      
      // Check for carousel arrows
      console.log('\n=== Carousel Arrows ===');
      const arrowSelectors = [
        { selector: '[class*="next"]', label: 'Next arrow' },
        { selector: '[class*="prev"]', label: 'Previous arrow' },
        { selector: 'button[aria-label*="Next"]', label: 'Next (aria-label)' },
        { selector: 'button[aria-label*="Previous"]', label: 'Previous (aria-label)' }
      ];
      
      for (const arrow of arrowSelectors) {
        const element = section.locator(arrow.selector).first();
        const visible = await element.isVisible({ timeout: 1000 }).catch(() => false);
        if (visible) {
          console.log(`✓ ${arrow.label}: Found`);
        }
      }
      
      // Find all possible cards/packshots
      console.log('\n=== Cards/Packshots ===');
      const cardSelectors = [
        'a[data-action-detail]',
        'a.event_image_click',
        '.product-card',
        '.packshot',
        'article.item',
        '.card',
        'a[href]'
      ];
      
      for (const selector of cardSelectors) {
        const cards = await section.locator(selector).all();
        if (cards.length > 0) {
          console.log(`\n${selector}: Found ${cards.length} cards`);
          
          for (let i = 0; i < Math.min(cards.length, 10); i++) {
            const href = await cards[i].getAttribute('href').catch(() => '');
            const dataAction = await cards[i].getAttribute('data-action-detail').catch(() => '');
            const imgAlt = await cards[i].locator('img').first().getAttribute('alt').catch(() => '');
            const text = await cards[i].textContent().catch(() => '');
            const isVisible = await cards[i].isVisible().catch(() => false);
            const isClickable = await cards[i].isEnabled().catch(() => false);
            
            console.log(`  [${i + 1}] href="${href}"`);
            console.log(`      data-action-detail="${dataAction}"`);
            console.log(`      img alt="${imgAlt}"`);
            console.log(`      text="${text.trim().substring(0, 50)}"`);
            console.log(`      visible=${isVisible}, clickable=${isClickable}`);
          }
        }
      }
      
      // Take screenshot
      await page.screenshot({ path: 'test-results/alles-was-du-brauchst-investigation.png', fullPage: true });
      console.log('\n📸 Screenshot saved: test-results/alles-was-du-brauchst-investigation.png');
      
    } else {
      console.log('❌ Section not found');
    }
    
    console.log('\n✅ Investigation complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
