# Complete PLP Test Suite - Master Documentation

## Overview

This repository contains comprehensive Playwright test automation for **three distinct test suites**:

1. **Homepage Tests** - Homepage regression testing
2. **PLP Tests** - Product Listing Page (all products)
3. **Categorized PLP Tests** - Product Listing Page (specific category with PCP and FAQ)

## Project Structure

```
Gillette Germany/
├── pages/
│   ├── homePage.js              # Homepage Page Object
│   ├── plpPage.js               # PLP Page Object
│   └── categorizedPlpPage.js    # Categorized PLP Page Object (with PCP & FAQ)
├── tests/
│   ├── homepage.spec.js         # Homepage test specs
│   ├── plp.spec.js              # PLP test specs (16 tests)
│   ├── categorizedplp.spec.js   # Categorized PLP test specs (18 tests)
│   ├── PLP_README.md            # PLP documentation
│   └── CATEGORIZED_PLP_README.md# Categorized PLP documentation
├── test-plans/
│   ├── homepage.md              # Homepage test plan
│   ├── PLP.md                   # PLP test plan
│   └── categorizedplp.md        # Categorized PLP test plan
├── utils/
│   ├── helper.js                # Utility functions
│   ├── logConstants.js          # Logging symbols
│   └── testSetup.js             # Test setup helpers
├── playwright.config.js         # Playwright configuration
├── PLP_COMMANDS.md              # PLP quick commands
└── CATEGORIZED_PLP_COMMANDS.md  # Categorized PLP quick commands
```

## Test Suites Comparison

| Feature | Homepage | PLP | Categorized PLP |
|---------|----------|-----|-----------------|
| **URL** | /de-de | /produkte | /produkte/rasierer |
| **Test Count** | Multiple | 16 | 18 |
| **Page Load** | ✅ | ✅ | ✅ |
| **Navigation** | ✅ | ✅ | ✅ |
| **Category Tabs** | ❌ | ✅ | ✅ |
| **Product Filters** | ❌ | ✅ | ✅ |
| **Product Buttons** | ❌ | ✅ | ✅ |
| **Retailer Popup** | ❌ | ✅ | ✅ |
| **Dropdown** | ❌ | ✅ | ✅ |
| **Favorites** | ✅ | ✅ | ✅ |
| **PCP Feature** | ❌ | ❌ | ✅ |
| **FAQ Feature** | ❌ | ❌ | ✅ |
| **SEO Testing** | ❌ | ✅ | ✅ |
| **Project Name** | Homepage-Tests | PLP-Tests | Categorized-PLP-Tests |

## Quick Start

### Install Dependencies
```bash
npm install
npx playwright install
```

### Run All Tests
```bash
# Run all test suites
npx playwright test

# Run specific suite
npx playwright test --project="Homepage-Tests"
npx playwright test --project="PLP-Tests"
npx playwright test --project="Categorized-PLP-Tests"
```

### Run in Debug Mode
```bash
npx playwright test --project="PLP-Tests" --debug
npx playwright test --project="Categorized-PLP-Tests" --debug
```

### View Test Report
```bash
npx playwright show-report
```

## PLP Test Suite Details

### Regular PLP Tests (16 Test Cases)

**URL**: https://www.gillette.de/de-de/produkte

**Test Cases**:
- TC-PLP-01: Page loads properly
- TC-PLP-02: Category tabs
- TC-PLP-03: Links verification
- TC-PLP-04: MEHR ERFAHREN button
- TC-PLP-05: JETZT KAUFEN button
- TC-PLP-06 to TC-PLP-09: Filter functionality (4 filters)
- TC-PLP-10 to TC-PLP-13: Filter deny functionality (4 filters)
- TC-PLP-14: Dropdown functionality
- TC-PLP-15: Favorite icon
- TC-PLP-16: SEO components

**Run Command**:
```bash
npx playwright test --project="PLP-Tests"
```

**Documentation**: See [tests/PLP_README.md](tests/PLP_README.md)

### Categorized PLP Tests (18 Test Cases)

**URL**: https://www.gillette.de/de-de/produkte/rasierer

**Test Cases**: All from Regular PLP PLUS:
- TC-PLP-16: **PCP (Product Comparison) functionality** ⭐
  - Click PCP buttons
  - Verify card focus
  - Test expand/collapse with "+" and "–" buttons
  
- TC-PLP-17: **FAQ functionality** ⭐
  - Verify all FAQs collapsed by default
  - Test expand/collapse accordion
  - Validate button state changes
  
- TC-PLP-18: SEO components (moved from TC-PLP-16)

**Run Command**:
```bash
npx playwright test --project="Categorized-PLP-Tests"
```

**Documentation**: See [tests/CATEGORIZED_PLP_README.md](tests/CATEGORIZED_PLP_README.md)

## Key Features

### 1. Page Object Model (POM)
Clean separation of test logic and page selectors:
- `plpPage.js` - Base PLP functionality
- `categorizedPlpPage.js` - Extended with PCP and FAQ methods

### 2. Comprehensive Logging
Every test action is logged with descriptive symbols:
```
🔍 Verifying PLP loads properly
✅ Page loaded successfully
📦 Total products found: 24
ℹ️ Testing filter option: "Rasierer"
✅ Filter "Rasierer": 12 products displayed
```

### 3. PCP (Product Comparison) Testing
Unique to Categorized PLP:
```javascript
// Methods available
await catPlpPage.isPcpSectionVisible();
await catPlpPage.clickPcpButton(0);
await catPlpPage.clickPcpCardButton(0); // Toggle expand/collapse
await catPlpPage.isPcpCardExpanded(0);
```

### 4. FAQ Accordion Testing
Unique to Categorized PLP:
```javascript
// Methods available
await catPlpPage.isFaqSectionVisible();
await catPlpPage.getFaqQuestions();
await catPlpPage.areAllFaqsCollapsed(); // Verify default state
await catPlpPage.clickFaqButton(0); // Toggle FAQ
```

### 5. Filter Testing
Both PLP suites include comprehensive filter testing:
- **NACH TYP** - Filter by product type
- **NACH THEMA** - Filter by theme
- **NACH KOLLEKTIONEN** - Filter by collection
- **SORTIEREN NACH** - Sort options

Each filter has:
- **Apply test** - Select option and click ANWENDEN
- **Deny test** - Select option and click ALLES LÖSCHEN

### 6. SEO Testing
Comprehensive SEO component verification:
- Meta Title
- Meta Description
- OG Title
- OG Description
- Canonical URL
- H1, H2, H3 tags

## Running Tests by Feature

### Run All Filter Tests
```bash
# Regular PLP
npx playwright test plp.spec.js -g "filter"

# Categorized PLP
npx playwright test categorizedplp.spec.js -g "filter"

# Both
npx playwright test plp.spec.js categorizedplp.spec.js -g "filter"
```

### Run All Button Tests
```bash
npx playwright test plp.spec.js categorizedplp.spec.js -g "button"
```

### Run PCP and FAQ Tests Only
```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-16|TC-PLP-17"
```

### Run All SEO Tests
```bash
npx playwright test plp.spec.js categorizedplp.spec.js -g "SEO"
```

## Configuration

### Test Projects in playwright.config.js

```javascript
projects: [
  {
    name: 'Homepage-Tests',
    testMatch: ['**/homepage.spec.js'],
    outputDir: './test-results/homepage-artifacts/'
  },
  {
    name: 'PLP-Tests',
    testMatch: ['**/plp.spec.js'],
    outputDir: './test-results/plp-artifacts/'
  },
  {
    name: 'Categorized-PLP-Tests',
    testMatch: ['**/categorizedplp.spec.js'],
    outputDir: './test-results/categorized-plp-artifacts/'
  }
]
```

### Viewport Configuration
All tests use:
- **Viewport**: 1920x1080 (Desktop)
- **Browser**: Microsoft Edge (Chromium)
- **Mode**: Non-headless (visible browser)
- **Slow Motion**: 500ms

## Test Reports

### Artifacts Locations
```
test-results/
├── homepage-artifacts/[timestamp]/
├── plp-artifacts/[timestamp]/
├── categorized-plp-artifacts/[timestamp]/
└── reports/[timestamp]/
    └── index.html  # HTML Report
```

### View Reports
```bash
# Latest report
npx playwright show-report

# Specific report
npx playwright show-report ./test-results/reports/[timestamp]
```

## Debugging

### Playwright Inspector
```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-16" --debug
```

### UI Mode (Interactive)
```bash
npx playwright test --project="Categorized-PLP-Tests" --ui
```

### View Trace
```bash
npx playwright show-trace ./test-results/categorized-plp-artifacts/[timestamp]/trace.zip
```

### Add Breakpoint in Test
```javascript
await page.pause(); // Pauses execution
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run Homepage Tests
        run: npx playwright test --project="Homepage-Tests"
      - name: Run PLP Tests
        run: npx playwright test --project="PLP-Tests"
      - name: Run Categorized PLP Tests
        run: npx playwright test --project="Categorized-PLP-Tests"
      - name: Upload Test Report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: test-results/reports/
```

## Best Practices

### 1. Sequential Execution
Tests run sequentially (one at a time) to avoid race conditions:
```javascript
test.describe.configure({ mode: 'serial' });
```

### 2. Cookie Handling
Automatic cookie acceptance in `beforeEach`:
```javascript
await catPlpPage.acceptCookies();
```

### 3. Wait Strategies
Appropriate waits for dynamic content:
```javascript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2000);
```

### 4. Error Handling
Screenshots and videos captured on failure:
```javascript
test.afterEach(async ({}, testInfo) => {
  await attachFailureScreenshot(page, testInfo);
});
```

### 5. Flexible Selectors
Multiple fallback selectors for robustness:
```javascript
this.pageHeader = page.locator('h1:has-text("Produkte"), .page-title, [data-testid="plp-title"]');
```

## Maintenance

### Update Selectors
If page structure changes:
1. Update selectors in appropriate page object file
2. Run tests to verify
3. Update documentation if needed

### Add New Tests
1. Add test case to test plan markdown file
2. Implement test in spec file
3. Add necessary methods to page object
4. Update README documentation

### Testing New Categories
To test different product categories:
```javascript
// In categorizedPlpPage.js
this.baseUrl = 'https://www.gillette.de/de-de/produkte/[category-name]';
```

Available categories:
- rasierer (razors)
- rasierklingen (blades)
- barttrimmer (trimmers)
- gesichtspflege (facial care)
- bartpflege (beard care)

## Troubleshooting

### Tests Failing?
1. Check browser console for errors
2. Review screenshots in artifacts folder
3. View video recording of failure
4. Check trace file for detailed execution

### Slow Execution?
1. Reduce `slowMo` value in config
2. Increase `workers` for parallel execution
3. Run specific tests instead of full suite

### Selectors Not Found?
1. Use Playwright Inspector to verify selectors
2. Check if page structure changed
3. Update selectors in page object files

## Quick Reference

### Essential Commands
```bash
# Run all PLP tests
npx playwright test --project="PLP-Tests" --project="Categorized-PLP-Tests"

# Run specific test
npx playwright test plp.spec.js -g "TC-PLP-01"

# Debug mode
npx playwright test categorizedplp.spec.js -g "TC-PLP-16" --debug

# View report
npx playwright show-report

# Update Playwright
npm install -D @playwright/test@latest
npx playwright install
```

### Documentation Files
- **PLP README**: [tests/PLP_README.md](tests/PLP_README.md)
- **Categorized PLP README**: [tests/CATEGORIZED_PLP_README.md](tests/CATEGORIZED_PLP_README.md)
- **PLP Commands**: [PLP_COMMANDS.md](PLP_COMMANDS.md)
- **Categorized PLP Commands**: [CATEGORIZED_PLP_COMMANDS.md](CATEGORIZED_PLP_COMMANDS.md)

## Test Coverage Summary

### Total Tests Implemented
- **Homepage Tests**: Multiple test cases
- **PLP Tests**: 16 test cases
- **Categorized PLP Tests**: 18 test cases

### Features Covered
✅ Page load verification  
✅ Category tabs navigation  
✅ Link functionality  
✅ Product buttons (MEHR ERFAHREN, JETZT KAUFEN)  
✅ Retailer popup  
✅ Filter functionality (4 types)  
✅ Filter deny functionality (4 types)  
✅ Dropdown navigation  
✅ Favorite functionality  
✅ PCP (Product Comparison) - Categorized PLP only  
✅ FAQ accordion - Categorized PLP only  
✅ SEO components  

## Support

For questions or issues:
1. Check the relevant README file
2. Review test logs and reports
3. Examine screenshots and videos
4. Use Playwright Inspector for debugging

## Version History

- **v1.0** (Feb 2026): Initial implementation
  - Regular PLP tests (16 test cases)
  - Categorized PLP tests (18 test cases including PCP and FAQ)
  - Complete Page Object Model
  - Comprehensive documentation

---

**Happy Testing! 🚀**
