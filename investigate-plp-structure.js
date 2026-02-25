const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let output = '';
  const log = (msg) => {
    console.log(msg);
    output += msg + '\n';
  };

  try {
    log('Navigating to https://www.gillette.de/de-de/produkte...');
    await page.goto('https://www.gillette.de/de-de/produkte', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });

    log('\n=== PAGE LOADED ===\n');

    // Wait for dynamic content
    await page.waitForTimeout(5000);

    // Check for cookie banner and close it if present
    try {
      const cookieBanner = page.locator('#onetrust-accept-btn-handler');
      if (await cookieBanner.isVisible({ timeout: 2000 })) {
        await cookieBanner.click();
        log('Cookie banner accepted\n');
        await page.waitForTimeout(2000);
      }
    } catch (e) {
      log('No cookie banner found or already accepted\n');
    }

    // Look for product-like elements
    log('=== SEARCHING FOR PRODUCT ELEMENTS ===\n');

    const possibleSelectors = [
      '.product-card',
      '.product-item',
      '[data-product]',
      '.card',
      'article',
      '.tile',
      '.category-card',
      '[class*="Product"]',
      '[class*="Card"]',
      'a[href*="/produkte/"]'
    ];

    let foundSelector = null;
    for (const selector of possibleSelectors) {
      try {
        const count = await page.locator(selector).count();
        if (count > 0) {
          log(`✓ Found ${count} elements matching: ${selector}`);
          
          if (!foundSelector && count >= 5) {
            foundSelector = selector;
            const firstElement = page.locator(selector).first();
            const outerHTML = await firstElement.evaluate(el => el.outerHTML);
            log(`\n=== First element HTML structure ===`);
            log(outerHTML.substring(0, 800));
            log(`\n... (truncated) ...\n`);
          }
        }
      } catch (e) {
        // Continue
      }
    }

    // Check for favorite button
    log('\n=== CHECKING FOR FAVORITE BUTTON ===\n');
    const favButtonByAriaLabel = page.locator('[aria-label="fav-button"]');
    const favButtonCount = await favButtonByAriaLabel.count();
    log(`Favorite buttons with aria-label="fav-button": ${favButtonCount}`);

    if (favButtonCount > 0) {
      const firstFavButton = favButtonByAriaLabel.first();
      const favHTML = await firstFavButton.evaluate(el => el.outerHTML);
      log(`First favorite button HTML:\n${favHTML}\n`);
    }

    // Check for "MEHR ERFAHREN" button
    log('\n=== CHECKING FOR "MEHR ERFAHREN" BUTTON ===\n');
    const mehrErfahrenButtons = page.locator('text=MEHR ERFAHREN');
    const mehrCount = await mehrErfahrenButtons.count();
    log(`"MEHR ERFAHREN" buttons found: ${mehrCount}`);

    if (mehrCount > 0) {
      for (let i = 0; i < Math.min(2, mehrCount); i++) {
        const button = mehrErfahrenButtons.nth(i);
        const buttonHTML = await button.evaluate(el => {
          // Get the button and its container
          let current = el;
          let depth = 0;
          while (current && depth < 5) {
            if (current.tagName === 'A' || current.tagName === 'BUTTON') break;
            current = current.parentElement;
            depth++;
          }
          return current ? current.outerHTML : el.outerHTML;
        });
        log(`\nMEHR ERFAHREN button ${i + 1} HTML:\n${buttonHTML.substring(0, 500)}...\n`);
      }
    }

    // Check for "JETZT KAUFEN" button
    log('\n=== CHECKING FOR "JETZT KAUFEN" BUTTON ===\n');
    const jetztKaufenButtons = page.locator('text=JETZT KAUFEN');
    const jetztCount = await jetztKaufenButtons.count();
    log(`"JETZT KAUFEN" buttons found: ${jetztCount}`);

    if (jetztCount > 0) {
      for (let i = 0; i < Math.min(2, jetztCount); i++) {
        const button = jetztKaufenButtons.nth(i);
        const buttonHTML = await button.evaluate(el => {
          let current = el;
          let depth = 0;
          while (current && depth < 5) {
            if (current.tagName === 'A' || current.tagName === 'BUTTON') break;
            current = current.parentElement;
            depth++;
          }
          return current ? current.outerHTML : el.outerHTML;
        });
        log(`\nJETZT KAUFEN button ${i + 1} HTML:\n${buttonHTML.substring(0, 500)}...\n`);
      }
    }

    // Get page structure analysis
    log('\n=== ANALYZING PAGE STRUCTURE ===\n');
    
    // Look for product containers
    const productLinks = page.locator('a[href*="/produkte/"]');
    const productLinkCount = await productLinks.count();
    log(`Product links found: ${productLinkCount}`);
    
    if (productLinkCount > 0) {
      const firstProductLink = productLinks.first();
      const linkHTML = await firstProductLink.evaluate(el => el.outerHTML);
      log(`\nFirst product link HTML:\n${linkHTML.substring(0, 800)}...\n`);
    }

    // Screenshot
    await page.screenshot({ path: 'plp-investigation.png', fullPage: true });
    log('\n=== Screenshot saved as plp-investigation.png ===\n');

    // Save detailed report
    fs.writeFileSync('plp-investigation-report.txt', output);
    log('\n=== Detailed report saved as plp-investigation-report.txt ===\n');

  } catch (error) {
    log(`Error during investigation: ${error.message}`);
    log(error.stack);
  } finally {
    await browser.close();
    log('\n=== INVESTIGATION COMPLETE ===');
  }
})();
