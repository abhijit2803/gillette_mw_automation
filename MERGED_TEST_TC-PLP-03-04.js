  /**
   * Test Cases 3 & 4: Comprehensive Product Testing - JETZT KAUFEN & MEHR ERFAHREN Loop
   * Per MD Requirements: TC-PLP-03 (JETZT KAUFEN) THEN TC-PLP-04 (MEHR ERFAHREN) for EACH product
   * Test IDs: TC-PLP-03, TC-PLP-04
   */
  test('TC-PLP-03-04: Comprehensive JETZT KAUFEN and MEHR ERFAHREN for All Products', async () => {
    log(SYMBOLS.SEARCH, 'Testing JETZT KAUFEN then MEHR ERFAHREN for ALL products (per MD flow)');
    
    // Get all products
    const productCount = await catPlpPageObj.getProductCount();
    const productNames = await catPlpPageObj.getProductNames();
    log(SYMBOLS.PACKAGE, `Total products to test: ${productCount}`);
    log(SYMBOLS.INFO, 'Flow: For EACH product → JETZT KAUFEN (all variants & retailers) → MEHR ERFAHREN (PDP) → Next product');
    
    // Loop through ALL products - executing BOTH JETZT KAUFEN and MEHR ERFAHREN per product
    for (let i = 0; i < productCount; i++) {
      log(SYMBOLS.INFO, `\n========================================`);
      log(SYMBOLS.INFO, `PRODUCT ${i + 1}/${productCount}: ${productNames[i]}`);
      log(SYMBOLS.INFO, `========================================`);
      
      // ===== TC-PLP-03: JETZT KAUFEN TESTING (Variant & Retailer Validation) =====
      log(SYMBOLS.SHOPPING, `[STEP 1] Testing JETZT KAUFEN for "${productNames[i]}"`);
      
      // Scroll product into view
      const jetztKaufenButtons = await page.locator('a:has-text("JETZT KAUFEN"), button:has-text("JETZT KAUFEN")').all();
      if (jetztKaufenButtons.length > i) {
        await jetztKaufenButtons[i].scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
      }
      
      // Click JETZT KAUFEN on product card
      log(SYMBOLS.INFO, `  → Clicking JETZT KAUFEN button`);
      await catPlpPageObj.clickJetztKaufenButton(i);
      await page.waitForTimeout(2000);
      
      // Check if variant popup appears
      const popupVisible = await catPlpPageObj.isRetailerPopumpVisible();
      
      if (popupVisible) {
        log(SYMBOLS.SUCCESS, `  → "Wählen Sie einen Händler" popup appeared`);
        
        // Wait for popup animation
        await page.waitForTimeout(1000);
        const popup = page.locator('[role="dialog"]:has-text("Wählen Sie einen Händler")').first();
        await popup.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        
        // Get all product variants
        const variants = await catPlpPageObj.getProductVariants();
        log(SYMBOLS.DOCUMENT, `  → Found ${variants.length} product variant(s)`);
        
        if (variants.length > 0) {
          // First variant is selected by default
          log(SYMBOLS.INFO, `  → First variant selected by default: "${variants[0]}"`);
          log(SYMBOLS.INFO, `  → Waiting 5 seconds (per MD requirements)...`);
          await page.waitForTimeout(5000);
          
          // Click JETZT KAUFEN again to open retailers popup
          log(SYMBOLS.INFO, `  → Clicking JETZT KAUFEN again for retailers popup`);
          const jetztKaufenInPopupButtons = popup.locator('button:has-text("JETZT KAUFEN"), a:has-text("JETZT KAUFEN")');
          const firstJKButton = jetztKaufenInPopupButtons.first();
          if (await firstJKButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await firstJKButton.click();
            await page.waitForTimeout(1500);
            
            // Get and list retailers
            const retailers = await catPlpPageObj.getRetailerLinks();
            if (retailers.length > 0) {
              log(SYMBOLS.SUCCESS, `  → Retailers popup appeared with ${retailers.length} retailer(s)`);
              retailers.forEach((retailer, idx) => {
                log(SYMBOLS.BULLET, `     ${idx + 1}. ${retailer.name} → ${retailer.url}`);
              });
              
              // Close retailers popup
              await page.keyboard.press('Escape');
              await page.waitForTimeout(500);
              log(SYMBOLS.INFO, `  → Retailers popup closed`);
            }
          }
          
          // Test additional variants (if any)
          if (variants.length > 1) {
            log(SYMBOLS.INFO, `  → Testing ${variants.length - 1} additional variant(s)...`);
            
            for (let v = 1; v < variants.length; v++) {
              log(SYMBOLS.BULLET, `     Testing Variant ${v + 1}: "${variants[v]}"`);
              
              // Select variant (implement based on actual page structure)
              const variantButtons = await catPlpPageObj.productVariantButtons.all();
              if (variantButtons.length > v) {
                await variantButtons[v].click();
                await page.waitForTimeout(1000);
                
                // Click JETZT KAUFEN for this variant
                const jkButton = popup.locator('button:has-text("JETZT KAUFEN"), a:has-text("JETZT KAUFEN")').first();
                if (await jkButton.isVisible({ timeout: 2000 }).catch(() => false)) {
                  await jkButton.click();
                  await page.waitForTimeout(1500);
                  
                  // Get retailers for this variant
                  const variantRetailers = await catPlpPageObj.getRetailerLinks();
                  log(SYMBOLS.SUCCESS, `       → ${variantRetailers.length} retailer(s) available`);
                  variantRetailers.slice(0, 3).forEach((r, idx) => {
                    log(SYMBOLS.LINK, `          ${idx + 1}. ${r.name}`);
                  });
                  
                  // Close retailers popup
                  await page.keyboard.press('Escape');
                  await page.waitForTimeout(500);
                }
              }
            }
          }
        }
        
        // Close main "Wählen Sie einen Händler" popup
        await catPlpPageObj.closeRetailerPopup();
        await page.waitForTimeout(800);
        log(SYMBOLS.SUCCESS, `  → Main popup closed - back on PLP`);
        
      } else {
        log(SYMBOLS.WARNING, `  → No popup appeared - button may navigate directly`);
        
        // Navigate back to PLP if redirected
        await page.waitForTimeout(1000);
        const currentUrl = await catPlpPageObj.getCurrentUrl();
        if (!currentUrl.includes('gillette.de/de-de/produkte/rasierer')) {
          await catPlpPageObj.navigate();
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(1500);
        }
      }
      
      // ===== TC-PLP-04: MEHR ERFAHREN TESTING (PDP Navigation) =====
      log(SYMBOLS.PAGE, `[STEP 2] Testing MEHR ERFAHREN for "${productNames[i]}"`);
      
      // Scroll product back into view
      const mehrErfahrenButtons = await page.locator('a:has-text("MEHR ERFAHREN"), button:has-text("MEHR ERFAHREN")').all();
      if (mehrErfahrenButtons.length > i) {
        await mehrErfahrenButtons[i].scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
      }
      
      // Click MEHR ERFAHREN button
      log(SYMBOLS.INFO, `  → Clicking MEHR ERFAHREN button`);
      const productUrl = await catPlpPageObj.clickMehrErfahrenButton(i);
      
      if (productUrl) {
        if (productUrl.includes('gillette.de/de-de/produkte/rasierer') && !productUrl.includes('gillette.de/de-de/produkte/rasierer/')) {
          log(SYMBOLS.WARNING, `  → Link redirected back to PLP - may be placeholder product`);
        } else {
          log(SYMBOLS.SUCCESS, `  → Navigated to Product Detail Page`);
          log(SYMBOLS.LINK, `  → PDP URL: ${productUrl}`);
        }
        
        // Navigate back to PLP
        log(SYMBOLS.INFO, `  → Navigating back to PLP...`);
        await catPlpPageObj.navigate();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1500);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
        log(SYMBOLS.HOME, `  → Returned to PLP`);
        
      } else {
        log(SYMBOLS.WARNING, `  → MEHR ERFAHREN button not found`);
      }
      
      // Scroll to top for next product
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      
      log(SYMBOLS.SUCCESS, `✓ Completed testing for Product ${i + 1}: "${productNames[i]}"`);
    }
    
    log(SYMBOLS.SUCCESS, `========================================`);
    log(SYMBOLS.SUCCESS, `COMPLETED: All ${productCount} products tested`);
    log(SYMBOLS.SUCCESS, `Flow: JETZT KAUFEN → MEHR ERFAHREN for each product`);
    log(SYMBOLS.SUCCESS, `========================================`);
  });
