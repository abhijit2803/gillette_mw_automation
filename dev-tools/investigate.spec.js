const { test } = require('@playwright/test');
const fs = require('fs');

test('Investigate PLP Page Structure', async ({page}) => {
  let report = '=== GILLETTE PLP INVESTIGATION REPORT ===\n\n';
  
  console.log('Navigating to page...');
  await page.goto('https://www.gillette.de/de-de/produkte', {
    waitUntil: 'networkidle',
    timeout: 90000
  });
  
  report += 'Page URL: https://www.gillette.de/de-de/produkte\n\n';
  
  // Wait for content
  await page.waitForTimeout(5000);
  
  // Accept cookies
  try {
    await page.click('#onetrust-accept-btn-handler', {timeout: 3000});
    console.log('Cookies accepted');
    report += 'Cookies accepted.\n\n';
    await page.waitForTimeout(2000);
  } catch (e) {
    console.log('No cookie banner');
    report += 'No cookie banner.\n\n';
  }
  
  // Check for fav-button with aria-label
  console.log('Checking for fav-button...');
  report += '=== FAV-BUTTON ARIA-LABEL CHECK ===\n';
  const favButtons = page.locator('button[aria-label="fav-button"]');
  const favCount = await favButtons.count();
  report += `Count: ${favCount}\n`;
  
  if (favCount > 0) {
    const firstHTML = await favButtons.first().evaluate(el => el.outerHTML);
    report += `First button HTML:\n${firstHTML}\n\n`;
    
    const parentHTML = await favButtons.first().evaluate(el => el.parentElement?.outerHTML?.substring(0, 1500));
    report += `Parent element HTML:\n${parentHTML}...\n\n`;
  } else {
    report += 'NO FAV-BUTTONS FOUND!\n\n';
  }
  
  // Look for any aria-label with "fav"
  console.log('Checking for any fav-related aria-labels...');
  report += '=== OTHER FAV-RELATED ELEMENTS ===\n';
  const anyFav = page.locator('[aria-label*="av"]');
  const anyFavCount = await anyFav.count();
  report += `Elements with aria-label containing "av": ${anyFavCount}\n`;
  
  if (anyFavCount > 0 && anyFavCount < 20) {
    for (let i = 0; i < Math.min(5, anyFavCount); i++) {
      const label = await anyFav.nth(i).getAttribute('aria-label');
      const html = await anyFav.nth(i).evaluate(el => el.outerHTML.substring(0, 300));
      report += `  ${i+1}. aria-label="${label}"\n     HTML: ${html}...\n`;
    }
  }
  report += '\n';
  
  // Find product-related elements
  console.log('Looking for product elements...');
  report += '=== PRODUCT ELEMENTS ===\n';
  
  const productLinks = page.locator('a[href*="/produkte/"]');
  const linkCount = await productLinks.count();
  report += `Links containing "/produkte/": ${linkCount}\n`;
  
  if (linkCount > 0 && linkCount < 50) {
    for (let i = 0; i < Math.min(3, linkCount); i++) {
      const href = await productLinks.nth(i).getAttribute('href');
      const html = await productLinks.nth(i).evaluate(el => el.outerHTML.substring(0, 1000));
      report += `\nProduct link ${i+1}:\nHREF: ${href}\nHTML: ${html}...\n`;
    }
  }
  report += '\n';
  
  // MEHR ERFAHREN buttons
  console.log('Looking for MEHR ERFAHREN buttons...');
  report += '=== MEHR ERFAHREN BUTTONS ===\n';
  const mehrButtons = page.locator('text=MEHR ERFAHREN');
  const mehrCount = await mehrButtons.count();
  report  += `Count: ${mehrCount}\n`;
  
  if (mehrCount > 0) {
    for (let i = 0; i < Math.min(2, mehrCount); i++) {
      const html = await mehrButtons.nth(i).evaluate(el => {
        let current = el;
        while (current && current.tagName !== 'A' && current.tagName !== 'BUTTON') {
          current = current.parentElement;
        }
        return current ? current.outerHTML.substring(0, 800) : el.outerHTML;
      });
      report += `\nButton ${i+1} HTML:\n${html}...\n`;
    }
  }
  report += '\n';
  
  // JETZT KAUFEN buttons
  console.log('Looking for JETZT KAUFEN buttons...');
  report += '=== JETZT KAUFEN BUTTONS ===\n';
  const jetztButtons = page.locator('text=JETZT KAUFEN');
  const jetztCount = await jetztButtons.count();
  report += `Count: ${jetztCount}\n`;
  
  if (jetztCount > 0) {
    for (let i = 0; i < Math.min(2, jetztCount); i++) {
      const html = await jetztButtons.nth(i).evaluate(el => {
        let current = el;
        while (current && current.tagName !== 'A' && current.tagName !== 'BUTTON') {
          current = current.parentElement;
        }
        return current ? current.outerHTML.substring(0, 800) : el.outerHTML;
      });
      report += `\nButton ${i+1} HTML:\n${html}...\n`;
    }
  }
  report += '\n';
  
  // Page structure analysis
  console.log('Analyzing page structure...');
  report += '=== PAGE STRUCTURE ANALYSIS ===\n';
  const bodySnippet = await page.evaluate(() => {
    return document.body.innerHTML.substring(0, 3000);
  });
  report += `Body HTML (first 3000 chars):\n${bodySnippet}...\n\n`;
  
  // Screenshot
  await page.screenshot({path: 'plp-investigation-test.png', fullPage: true});
  report += 'Screenshot saved: plp-investigation-test.png\n';
  
  // Save report
  fs.writeFileSync('plp-investigation-report.txt', report);
  console.log('Report saved to plp-investigation-report.txt');
  
  console.log('\n' + '='.repeat(60));
  console.log('INVESTIGATION COMPLETE - Check plp-investigation-report.txt');
  console.log('='.repeat(60));
});
