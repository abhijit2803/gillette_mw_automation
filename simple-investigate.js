const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('Starting Playwright...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  let report = '=== GILLETTE PLP INVESTIGATION REPORT ===\n\n';
  
  try {
    report += 'Navigating to https://www.gillette.de/de-de/produkte...\n\n';
    await page.goto('https://www.gillette.de/de-de/produkte', {
      waitUntil: 'networkidle',
      timeout: 90000
    });
    
    report += 'Page loaded. Waiting for content...\n\n';
    await page.waitForTimeout(5000);
    
    // Accept cookies
    try {
      await page.click('#onetrust-accept-btn-handler', { timeout: 3000 });
      report += 'Cookies accepted.\n\n';
      await page.waitForTimeout(2000);
    } catch (e) {
      report += 'No cookie banner.\n\n';
    }
    
    // Find fav-button
    report += '=== CHECKING FOR FAV-BUTTON ===\n';
    const favCount = await page.locator('button[aria-label="fav-button"]').count();
    report += `Buttons with aria-label="fav-button": ${favCount}\n\n`;
    
    if (favCount > 0) {
      const firstFav = await page.locator('button[aria-label="fav-button"]').first();
      const favHTML = await firstFav.evaluate(el => el.outerHTML);
      report += `First fav-button HTML:\n${favHTML}\n\n`;
      
      // Get parent
      const parent = await firstFav.evaluate(el => el.parentElement?.outerHTML || '';
      report += `Parent element HTML:\n${parent.substring(0, 1000)}...\n\n`;
    }
    
    // Find product links
    report += '=== CHECKING FOR PRODUCT LINKS ===\n';
    const productLinks = await page.locator('a[href*="/produkte/"]').count();
    report += `Links containing "/produkte/": ${productLinks}\n\n`;
    
    if (productLinks > 0) {
      const firstLink = await page.locator('a[href*="/produkte/"]').first();
      const linkHTML = await firstLink.evaluate(el => el.outerHTML);
      report += `First product link HTML:\n${linkHTML.substring(0, 800)}...\n\n`;
    }
    
    // Find MEHR ERFAHREN buttons
    report += '=== CHECKING FOR MEHR ERFAHREN BUTTONS ===\n';
    const mehrCount = await page.locator('text=MEHR ERFAHREN').count();
    report += `"MEHR ERFAHREN" buttons found: ${mehrCount}\n\n`;
    
    if (mehrCount > 0) {
      const mehrBtn = await page.locator('text=MEHR ERFAHREN').first();
      const mehrHTML = await mehrBtn.evaluate(el => {
        let current = el;
        while (current && current.tagName !== 'A' && current.tagName !== 'BUTTON') {
          current = current.parentElement;
        }
        return current ? current.outerHTML : el.outerHTML;
      });
      report += `First "MEHR ERFAHREN" button HTML:\n${mehrHTML.substring(0, 600)}...\n\n`;
    }
    
    // Find JETZT KAUFEN buttons
    report += '=== CHECKING FOR JETZT KAUFEN BUTTONS ===\n';
    const jetztCount = await page.locator('text=JETZT KAUFEN').count();
    report += `"JETZT KAUFEN" buttons found: ${jetztCount}\n\n`;
    
    if (jetztCount > 0) {
      const jetztBtn = await page.locator('text=JETZT KAUFEN').first();
      const jetztHTML = await jetztBtn.evaluate(el => {
        let current = el;
        while (current && current.tagName !== 'A' && current.tagName !== 'BUTTON') {
          current = current.parentElement;
        }
        return current ? current.outerHTML : el.outerHTML;
      });
      report += `First "JETZT KAUFEN" button HTML:\n${jetztHTML.substring(0, 600)}...\n\n`;
    }
    
    // Get page body to analyze structure
    report += '=== ANALYZING PAGE BODY STRUCTURE ===\n';
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    report += `Body HTML length: ${bodyHTML.length} characters\n`;
    report += `Body HTML snippet (first 2000 chars):\n${bodyHTML.substring(0, 2000)}...\n\n`;
    
    // Screenshot
    await page.screenshot({ path: 'c:\\Users\\61081244\\Gillette Germany\\plp-screenshot.png', fullPage: true });
    report += 'Screenshot saved to plp-screenshot.png\n\n';
    
    report += '=== INVESTIGATION COMPLETE ===\n';
    
  } catch (error) {
    report += `\n\nERROR: ${error.message}\n${error.stack}\n`;
  } finally {
    fs.writeFileSync('c:\\Users\\61081244\\Gillette Germany\\plp-report.txt', report);
    console.log('Report saved to plp-report.txt' );
    await browser.close();
    console.log('Done!');
  }
})();
