import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://www.gillette.de/de-de', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Accept cookies
  try {
    const cookieButton = page.locator('button:has-text("Alle Cookies akzeptieren"), button:has-text("Akzeptieren")').first();
    await cookieButton.click({ timeout: 5000 });
    console.log('✅ Cookies accepted');
    await page.waitForTimeout(2000);
  } catch (e) {
    console.log('ℹ️  No cookie banner found');
  }
  
  console.log('\n🔍 Searching for section containing "Gillette unterstützt Männer"...\n');
  
  // Search for text variations
  const searchTexts = [
    'Gillette unterstützt Männer',
    'jeden Tag gut auszusehen',
    'sich gut zu fühlen',
    'das Beste aus sich herauszuholen'
  ];
  
  for (const searchText of searchTexts) {
    console.log(`\n📝 Searching for: "${searchText}"`);
    
    const elements = await page.locator(`*:has-text("${searchText}")`).all();
    console.log(`   Found ${elements.length} elements containing this text`);
    
    for (let i = 0; i < Math.min(5, elements.length); i++) {
      const el = elements[i];
      const tagName = await el.evaluate(e => e.tagName.toLowerCase());
      const className = await el.getAttribute('class') || 'no-class';
      const id = await el.getAttribute('id') || 'no-id';
      const text = await el.textContent();
      
      console.log(`\n   [${i + 1}] <${tagName}>`);
      console.log(`       ID: ${id}`);
      console.log(`       Class: ${className.substring(0, 80)}`);
      console.log(`       Text: ${text.trim().substring(0, 150)}...`);
    }
  }
  
  // Look for divs with specific attributes (not just sections)
  console.log('\n\n🔍 Checking all relevant <div> containers on page:\n');
  
  // Find divs that contain the target text
  const targetDivs = await page.locator('div:has-text("Gillette unterstützt Männer")').all();
  console.log(`Found ${targetDivs.length} divs containing "Gillette unterstützt Männer"\n`);
  
  for (let i = 0; i < Math.min(10, targetDivs.length); i++) {
    const div = targetDivs[i];
    const id = await div.getAttribute('id') || `no-id`;
    const className = await div.getAttribute('class') || 'no-class';
    const text = await div.textContent();
    const textLength = text.trim().length;
    
    // Only show divs with reasonable text length (not the whole page)
    if (textLength < 2000) {
      const textPreview = text.trim().substring(0, 200).replace(/\n/g, ' ');
      
      console.log(`\n[Div ${i + 1}] Text length: ${textLength} chars`);
      console.log(`  ID: ${id}`);
      console.log(`  Class: ${className.substring(0, 100)}`);
      console.log(`  Text: ${textPreview}...`);
      
      // Check if this contains the full expected text
      if (text.includes('jeden Tag gut auszusehen') && 
          text.includes('sich gut zu fühlen')) {
        console.log(`  ✅ ✅ THIS CONTAINS THE FULL TARGET TEXT!`);
        
        // Get more details
        const headings = await div.locator('h1, h2, h3, h4, h5, p:first-child').all();
        for (const h of headings.slice(0, 3)) {
          const hText = await h.textContent();
          const tagName = await h.evaluate(e => e.tagName);
          if (hText.trim().length > 0) {
            console.log(`    ${tagName}: "${hText.trim()}"`);
          }
        }
        
        const links = await div.locator('a').all();
        console.log(`    Links found: ${links.length}`);
        for (let j = 0; j < Math.min(5, links.length); j++) {
          const linkText = await links[j].textContent();
          const href = await links[j].getAttribute('href');
          console.log(`      [${j + 1}] "${linkText.trim()}" → ${href}`);
        }
      }
    }
  }
  
  console.log('\n\n📊 Summary: All sections are <div> elements, not <section> tags!');
  
  await page.waitForTimeout(5000);
  await browser.close();
})();
