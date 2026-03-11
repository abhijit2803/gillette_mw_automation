/**
 * Investigation script to find correct brand logo selectors
 */

import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://www.gillette.de/de-de');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  
  // Accept cookies
  const cookieBtn = page.locator('#onetrust-accept-btn-handler').first();
  if (await cookieBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cookieBtn.click();
    await page.waitForTimeout(1000);
  }
  
  console.log('\n===== INVESTIGATING HEADER STRUCTURE =====\n');
  
  // Find all links in header/banner with images
  const headerLinks = await page.locator('header a, banner a').all();
  
  console.log(`Found ${headerLinks.length} links in header/banner\n`);
  
  for (let i = 0; i < Math.min(headerLinks.length, 20); i++) {
    const link = headerLinks[i];
    const href = await link.getAttribute('href').catch(() => '');
    const text = await link.textContent().catch(() => '');
    const title = await link.getAttribute('title').catch(() => '');
    const isVisible = await link.isVisible().catch(() => false);
    
    const img = link.locator('img').first();
    const hasImg = await img.count() > 0;
    const imgAlt = hasImg ? await img.getAttribute('alt').catch(() => '') : '';
    const imgSrc = hasImg ? await img.getAttribute('src').catch(() => '') : '';
    
    if (isVisible && hasImg && imgAlt) {
      console.log(`Link ${i + 1}:`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  Href: ${href}`);
      console.log(`  Text: ${text.trim()}`);
      console.log(`  Title: ${title}`);
      console.log(`  Image Alt: ${imgAlt}`);
      console.log(`  Image Src: ${imgSrc.substring(0, 80)}...`);
      console.log('');
    }
  }
  
  // Look for logo container/box
  console.log('\n===== LOOKING FOR LOGO CONTAINER =====\n');
  const containers = await page.locator('.logo-box, [class*="logo"], [class*="brand"]').all();
  
  for (let i = 0; i < Math.min(containers.length, 10); i++) {
    const container = containers[i];
    const className = await container.getAttribute('class').catch(() => '');
    const isVisible = await container.isVisible().catch(() => false);
    
    if (isVisible) {
      console.log(`Container ${i + 1}:`);
      console.log(`  Class: ${className}`);
      console.log(`  Visible: ${isVisible}`);
      
      // Count images inside
      const images = await container.locator('img').all();
      console.log(`  Images inside: ${images.length}`);
      
      for (const img of images) {
        const alt = await img.getAttribute('alt').catch(() => '');
        console.log(`    - ${alt}`);
      }
      console.log('');
    }
  }
  
  console.log('\n===== DONE =====\n');
  
  await page.waitForTimeout(5000);
  await browser.close();
})();
