import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    locale: 'de-DE'
  });
  const page = await context.newPage();
  
  console.log('Navigating to homepage...');
  await page.goto('https://www.gillette.de/de-de', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Accept cookies
  const acceptButton = page.locator('button:has-text("Alle akzeptieren"), button:has-text("Akzeptieren")').first();
  if (await acceptButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await acceptButton.click();
    await page.waitForTimeout(2000);
  }
  
  console.log('\n========== PRODUKTE MENU STRUCTURE ==========\n');
  
  // Hover over Produkte menu
  const produkteMenu = page.locator('nav a:has-text("Produkte")').first();
  await produkteMenu.hover();
  await page.waitForTimeout(3000);
  
  // Get all dropdown sections
  const dropdownContainer = page.locator('nav .dropdown, nav .menu-dropdown, [class*="dropdown"], [class*="submenu"]');
  
  // Try to find all category headers (Produkttyp, Portfolio, Bedürfnis)
  const headers = await page.locator('nav h2, nav h3, nav h4, nav .dropdown-header, nav [class*="header"], nav [class*="category"]').all();
  
  console.log(`Found ${headers.length} potential category headers\n`);
  
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    const headerText = await header.textContent().catch(() => '');
    if (headerText && headerText.trim() && (
      headerText.includes('Produkttyp') || 
      headerText.includes('Portfolio') || 
      headerText.includes('Bedürfnis') ||
      headerText.includes('PRODUKTTYP') ||
      headerText.includes('PORTFOLIO') ||
      headerText.includes('BEDÜRFNIS')
    )) {
      console.log(`\n--- Category: ${headerText.trim()} ---`);
      
      // Find all links following this header
      const nextLinks = await page.locator(`nav a`).all();
      for (const link of nextLinks) {
        const linkText = await link.textContent().catch(() => '');
        const linkHref = await link.getAttribute('href').catch(() => '');
        const isVisible = await link.isVisible().catch(() => false);
        
        if (linkText && linkText.trim() && isVisible && linkHref && linkHref.includes('/de-de/')) {
          console.log(`  ✓ ${linkText.trim()}`);
          console.log(`    URL: ${linkHref}`);
        }
      }
    }
  }
  
  // Also try to get ALL visible links in the dropdown
  console.log('\n\n========== ALL VISIBLE LINKS IN PRODUKTE DROPDOWN ==========\n');
  const allLinks = await page.locator('nav a[href*="/de-de/"]').all();
  
  for (const link of allLinks) {
    const isVisible = await link.isVisible().catch(() => false);
    if (isVisible) {
      const text = await link.textContent().catch(() => '');
      const href = await link.getAttribute('href').catch(() => '');
      if (text && text.trim() && !text.includes('Blog') && !text.includes('Über Gillette') && !text.includes('Produkte')) {
        console.log(`"${text.trim()}" -> ${href}`);
      }
    }
  }
  
  console.log('\n\nPress Ctrl+C to exit...');
  await page.waitForTimeout(30000); // Wait to inspect visually
  
  await browser.close();
})();
