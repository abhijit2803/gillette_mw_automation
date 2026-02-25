# Article Listing Page (ALP) Tests - Quick Start

## 🚀 Quick Start Guide

This document provides quick commands and setup for running the Article Listing Page tests.

## Prerequisites

✅ Node.js installed  
✅ Playwright installed (`npm install`)  
✅ Framework dependencies installed

## Running Tests

### Run All ALP Tests
```bash
npx playwright test tests/allArticlesALP.spec.js
```

### Run Specific Test Case
```bash
# TC1: Page verification
npx playwright test tests/allArticlesALP.spec.js -g "TC1"

# TC2: Article cards count
npx playwright test tests/allArticlesALP.spec.js -g "TC2"

# TC3: Article navigation
npx playwright test tests/allArticlesALP.spec.js -g "TC3"

# TC4: Add to favorites
npx playwright test tests/allArticlesALP.spec.js -g "TC4"

# TC5: Remove from favorites
npx playwright test tests/allArticlesALP.spec.js -g "TC5"

# TC6: Dropdown navigation
npx playwright test tests/allArticlesALP.spec.js -g "TC6"
```

### Interactive Mode
```bash
# UI Mode for debugging and step-through
npx playwright test tests/allArticlesALP.spec.js --ui

# Debug Mode with inspector
npx playwright test tests/allArticlesALP.spec.js --debug
```

### Browser Selection
```bash
# Chrome
npx playwright test tests/allArticlesALP.spec.js --project=chromium

# Firefox
npx playwright test tests/allArticlesALP.spec.js --project=firefox

# WebKit (Safari)
npx playwright test tests/allArticlesALP.spec.js --project=webkit
```

### Advanced Options
```bash
# Run with headed browser (visible)
npx playwright test tests/allArticlesALP.spec.js --headed

# Run with trace
npx playwright test tests/allArticlesALP.spec.js --trace on

# Run with specific reporter
npx playwright test tests/allArticlesALP.spec.js --reporter=html
```

## 📁 Framework Files

### Created/Modified Files

| File | Path | Description |
|------|------|-------------|
| **Page Object** | `pages/articleListingPage.js` | ALP page methods and locators |
| **Test Spec** | `tests/allArticlesALP.spec.js` | All 6 test cases |
| **Documentation** | `test-cases/allArticlesALP_documentation.md` | Detailed test documentation |
| **Page Manager** | `utils/pageManager.js` | Updated with ALP page registration |
| **Environment Config** | `test-data/environmentConfig.json` | Added gillette-stage environment |

## 🎯 Test Coverage

### Test Cases Summary

| Test | Description | Status |
|------|-------------|--------|
| **TC1** | Page Load & Content | ✅ Ready |
| **TC2** | Article Cards Display | ✅ Ready |
| **TC3** | Article Navigation | ✅ Ready |
| **TC4** | Add to Favorites | ✅ Ready |
| **TC5** | Remove from Favorites | ✅ Ready |
| **TC6** | Dropdown Navigation | ✅ Ready |

## 📊 Test Reports

After running tests, reports are available at:
- HTML Report: `test-results/reports/{timestamp}/index.html`
- Screenshots: `test-results/screenshots/`
- Artifacts: `test-results/prod-artifacts/{timestamp}/`

### View Report
```bash
# Open latest HTML report
npx playwright show-report
```

## 🔧 Framework Usage Example

```javascript
import { pageManager } from '../utils/pageManager.js';

// Initialize page manager
const pm = new pageManager(page);

// Navigate to ALP
await pm.onArticleListingPage().navigateToALP();

// Get article count
const count = await pm.onArticleListingPage().getArticleCardsCount();

// Get article details
const article = await pm.onArticleListingPage().getArticleDetails(1);

// Click favorite
await pm.onArticleListingPage().clickFavoriteIcon(1);

// Open dropdown
await pm.onArticleListingPage().openDropdown();
```

## 🌍 Environment Configuration

The test uses the **gillette-stage** environment:

```json
{
  "baseUrl": "https://stage.gillette.eu/en-eu",
  "apiUrl": "https://api-stage.gillette.eu",
  "requiresAuth": false
}
```

## 🐛 Debugging Tips

### Common Issues

**Issue:** Tests timing out  
**Solution:** Increase timeout in playwright.config.js or use `page.waitForTimeout()`

**Issue:** Element not found  
**Solution:** Check if page structure has changed, update locators in `pages/articleListingPage.js`

**Issue:** Navigation fails  
**Solution:** Verify environment URL in `test-data/environmentConfig.json`

### Debug Commands
```bash
# Run with verbose logging
DEBUG=pw:api npx playwright test tests/allArticlesALP.spec.js

# Run single test with inspector
npx playwright test tests/allArticlesALP.spec.js -g "TC1" --debug

# Generate trace for failed tests
npx playwright test tests/allArticlesALP.spec.js --trace on
```

## 📝 Conversion from Selenium

This test was converted from the original Selenium Java script. Key changes:

| Selenium | Playwright |
|----------|-----------|
| `WebDriver driver` | `page` object |
| `driver.get(url)` | `page.goto(url)` |
| `driver.findElement()` | `page.locator()` |
| `driver.findElements()` | `page.locator().all()` |
| `Thread.sleep()` | `page.waitForTimeout()` |
| Window switching | `context.newPage()` |
| JavaScript execution | `evaluate()` |

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Test Documentation](test-cases/allArticlesALP_documentation.md)
- [Framework README](README.md)

## ✨ Next Steps

1. Run the tests to verify everything works:
   ```bash
   npx playwright test tests/allArticlesALP.spec.js
   ```

2. View the HTML report:
   ```bash
   npx playwright show-report
   ```

3. Customize test limits (currently limited to first 3 articles and 2 dropdown options for efficiency)

4. Add more test cases as needed using the same pattern

---

**Created:** Based on Selenium script conversion  
**Framework:** Playwright with Page Object Model  
**Environment:** Gillette Stage (https://stage.gillette.eu/en-eu)
