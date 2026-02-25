# Product Listing Page (PLP) Tests - README

## Overview
This test suite contains comprehensive regression tests for the Gillette Germany Product Listing Page (PLP) based on the test plan in `test-plans/PLP.md`.

## Test Coverage

### Test Cases Implemented

1. **TC-PLP-01**: Product Listing Page loads properly
2. **TC-PLP-02**: Verify category tabs functionality
3. **TC-PLP-03**: Verify all links function correctly
4. **TC-PLP-04**: MEHR ERFAHREN button navigates to PDP
5. **TC-PLP-05**: JETZT KAUFEN button shows retailer popup
6. **TC-PLP-06**: NACH TYP filter functionality
7. **TC-PLP-07**: NACH THEMA filter functionality
8. **TC-PLP-08**: NACH KOLLEKTIONEN filter functionality
9. **TC-PLP-09**: SORTIEREN NACH filter functionality
10. **TC-PLP-10**: NACH TYP filter deny - ALLES LÖSCHEN
11. **TC-PLP-11**: NACH THEMA filter deny - ALLES LÖSCHEN
12. **TC-PLP-12**: NACH KOLLEKTIONEN filter deny - ALLES LÖSCHEN
13. **TC-PLP-13**: SORTIEREN NACH filter deny - ALLES LÖSCHEN
14. **TC-PLP-14**: PLP dropdown functionality
15. **TC-PLP-15**: Favorite icon functionality
16. **TC-PLP-16**: Verify SEO components

## File Structure

```
pages/
  plpPage.js           # Page Object Model for PLP
tests/
  plp.spec.js          # Test specifications
test-plans/
  PLP.md               # Test plan document
```

## Running the Tests

### Run All PLP Tests
```bash
npx playwright test --project="PLP-Tests"
```

### Run Specific Test Case
```bash
npx playwright test plp.spec.js -g "TC-PLP-01"
```

### Run in Headed Mode (Watch execution)
```bash
npx playwright test --project="PLP-Tests" --headed
```

### Run with UI Mode (Interactive)
```bash
npx playwright test --project="PLP-Tests" --ui
```

### Run in Debug Mode
```bash
npx playwright test --project="PLP-Tests" --debug
```

### Generate and View Test Report
```bash
npx playwright show-report ./test-results/reports/[timestamp]
```

## Test Configuration

The PLP tests are configured in `playwright.config.js` with the following settings:

- **Project Name**: PLP-Tests
- **Browser**: Microsoft Edge (Chromium)
- **Viewport**: 1920x1080 (Desktop)
- **Base URL**: https://www.gillette.de/de-de
- **Headless**: false (visible browser)
- **Slow Motion**: 500ms (for better visibility)
- **Timeout**: 180 seconds per test
- **Retries**: 0 (no retries)

## Test Artifacts

Test artifacts are saved in:
- **Test Results**: `./test-results/plp-artifacts/[timestamp]/`
- **HTML Reports**: `./test-results/reports/[timestamp]/`
- **Screenshots**: Captured on test failures
- **Videos**: Recorded on test failures
- **Traces**: Available for debugging failed tests

## Page Object Model (POM)

The `plpPage.js` file contains all selectors and methods for interacting with the PLP:

### Key Methods

#### Navigation
- `navigate()` - Navigate to PLP
- `waitForPageLoad()` - Wait for page to load
- `acceptCookies()` - Accept cookie banner

#### Product Verification
- `getProductCards()` - Get all product cards
- `getProductNames()` - Get product names
- `verifyProductHasRating()` - Check if product has rating
- `verifyProductHasMehrErfahrenButton()` - Check MEHR ERFAHREN button
- `verifyProductHasJetztKaufenButton()` - Check JETZT KAUFEN button

#### Category & Tabs
- `getCategoryTabs()` - Get all category tabs
- `clickCategoryTab(tabName)` - Click specific tab

#### Filters
- `clickNachTypFilter()` - Open NACH TYP filter
- `selectNachTypOption(option)` - Select filter option
- `clickAnwendenButton()` - Apply filter
- `clickAllesLoeschenButton()` - Clear filter

#### Buttons
- `clickMehrErfahrenButton(index)` - Click MEHR ERFAHREN
- `clickJetztKaufenButton(index)` - Click JETZT KAUFEN

#### Retailer Popup
- `isRetailerPopupVisible()` - Check popup visibility
- `getRetailerLinks()` - Get retailer information
- `closeRetailerPopup()` - Close popup

#### SEO
- `getSEOMetadata()` - Get all SEO components

## Test Execution Workflow

Each test follows this pattern:

1. **Setup** (beforeEach):
   - Navigate to PLP
   - Set viewport to 1920x1080
   - Accept cookies
   - Wait for page stabilization

2. **Test Execution**:
   - Perform test-specific actions
   - Verify expected outcomes
   - Log results with symbols

3. **Cleanup** (afterEach):
   - Capture screenshot on failure
   - Attach artifacts to report

## Debugging Tips

### View Test Traces
```bash
npx playwright show-trace ./test-results/plp-artifacts/[timestamp]/trace.zip
```

### Run Single Test with Debug
```bash
npx playwright test plp.spec.js -g "TC-PLP-01" --debug
```

### Pause Test Execution
Add `await page.pause()` in the test code to pause execution at a specific point.

### Inspect Elements
Use the Playwright Inspector to see element selectors and page state during test execution.

## Common Issues & Solutions

### Issue: Cookie banner not closing
**Solution**: The test automatically handles cookies in `beforeEach`. If issues persist, increase wait time after cookie acceptance.

### Issue: Elements not visible
**Solution**: Increase timeout or add explicit waits. Check if the page structure has changed.

### Issue: Filter tests failing
**Solution**: Verify filter selectors match the actual page structure. Use Playwright Inspector to validate selectors.

### Issue: Test timeout
**Solution**: Increase test timeout in playwright.config.js or add explicit waits for slow-loading elements.

## Test Data

The tests use dynamic data from the actual website:
- Category tabs are detected automatically
- Filter options are fetched from the page
- Product information is retrieved in real-time

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run PLP Tests
  run: npx playwright test --project="PLP-Tests"
  
- name: Upload Test Report
  uses: actions/upload-artifact@v3
  with:
    name: plp-test-report
    path: ./test-results/reports/
```

## Maintenance

### Updating Selectors
If the website structure changes, update selectors in `pages/plpPage.js`.

### Adding New Tests
1. Add test case to `test-plans/PLP.md`
2. Implement test in `tests/plp.spec.js`
3. Add necessary methods to `pages/plpPage.js`
4. Update this README

## Contact & Support

For questions or issues with the PLP tests:
- Review test logs in the console output
- Check HTML reports for detailed failure information
- Examine screenshots and videos in test artifacts folder

## Version History

- **v1.0** (Feb 2026): Initial implementation of all 16 test cases from PLP.md
