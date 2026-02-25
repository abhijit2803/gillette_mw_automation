# Categorized Product Listing Page (PLP) Tests - README

## Overview
This test suite contains comprehensive regression tests for the Gillette Germany Categorized Product Listing Page (specifically for the "Rasierer" category) based on the test plan in `test-plans/categorizedplp.md`.

## Key Differences from Regular PLP

The Categorized PLP has additional features compared to the regular PLP:
- **PCP (Product Comparison)** functionality with expand/collapse cards
- **FAQ section** with accordion-style expand/collapse
- Different base URL: `/produkte/rasierer` instead of just `/produkte`

## Test Coverage

### Test Cases Implemented

1. **TC-PLP-01**: Categorized Product Listing Page loads properly
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
16. **TC-PLP-16**: PCP (Product Comparison) functionality ⭐ NEW
17. **TC-PLP-17**: FAQ functionality ⭐ NEW
18. **TC-PLP-18**: Verify SEO components

## File Structure

```
pages/
  categorizedPlpPage.js    # Page Object Model for Categorized PLP
tests/
  categorizedplp.spec.js   # Test specifications
test-plans/
  categorizedplp.md        # Test plan document
```

## Running the Tests

### Run All Categorized PLP Tests
```bash
npx playwright test --project="Categorized-PLP-Tests"
```

### Run Specific Test Case
```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-01"
```

### Run PCP Test Only
```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-16"
```

### Run FAQ Test Only
```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-17"
```

### Run in Headed Mode (Watch execution)
```bash
npx playwright test --project="Categorized-PLP-Tests" --headed
```

### Run with UI Mode (Interactive)
```bash
npx playwright test --project="Categorized-PLP-Tests" --ui
```

### Run in Debug Mode
```bash
npx playwright test --project="Categorized-PLP-Tests" --debug
```

### Generate and View Test Report
```bash
npx playwright show-report ./test-results/reports/[timestamp]
```

## Test Configuration

The Categorized PLP tests are configured in `playwright.config.js` with the following settings:

- **Project Name**: Categorized-PLP-Tests
- **Browser**: Microsoft Edge (Chromium)
- **Viewport**: 1920x1080 (Desktop)
- **Base URL**: https://www.gillette.de/de-de/produkte/rasierer
- **Headless**: false (visible browser)
- **Slow Motion**: 500ms (for better visibility)
- **Timeout**: 180 seconds per test
- **Retries**: 0 (no retries)

## Test Artifacts

Test artifacts are saved in:
- **Test Results**: `./test-results/categorized-plp-artifacts/[timestamp]/`
- **HTML Reports**: `./test-results/reports/[timestamp]/`
- **Screenshots**: Captured on test failures
- **Videos**: Recorded on test failures
- **Traces**: Available for debugging failed tests

## Page Object Model (POM)

The `categorizedPlpPage.js` file extends the base PLP functionality with additional methods for PCP and FAQ testing.

### Key Methods (All PLP Methods + New Ones)

#### PCP (Product Comparison) Methods
- `isPcpSectionVisible()` - Check if PCP section exists
- `getPcpButtons()` - Get all PCP buttons
- `clickPcpButton(index)` - Click specific PCP button
- `getPcpCards()` - Get all PCP cards
- `isPcpCardInFocus(index)` - Check if card is focused
- `getPcpCardButtonState(index)` - Get expand/collapse state
- `clickPcpCardButton(index)` - Toggle card expand/collapse
- `isPcpCardExpanded(index)` - Check if card is expanded
- `isPcpCardCollapsed(index)` - Check if card is collapsed

#### FAQ Methods
- `isFaqSectionVisible()` - Check if FAQ section exists
- `getFaqItems()` - Get all FAQ items
- `getFaqCount()` - Get number of FAQs
- `getFaqQuestions()` - Get all FAQ question texts
- `getFaqButtonState(index)` - Get expand/collapse state
- `clickFaqButton(index)` - Toggle FAQ expand/collapse
- `isFaqExpanded(index)` - Check if FAQ is expanded
- `isFaqCollapsed(index)` - Check if FAQ is collapsed
- `areAllFaqsCollapsed()` - Verify all FAQs are collapsed (default state)

#### All Standard PLP Methods
All methods from the regular PLP are also available (filters, products, tabs, etc.)

## Special Test Cases

### TC-PLP-16: PCP Functionality

This test verifies the Product Comparison (PCP) feature:

1. Checks if PCP section is visible on the page
2. Clicks PCP buttons to activate comparison
3. Verifies browser focuses on the PCP card
4. Tests expand/collapse functionality:
   - If button shows "–", card should collapse
   - If button shows "+", card should expand
5. Validates state changes correctly

**Example Output:**
```
🔍 Verifying PCP functionality
✅ PCP section: Visible
ℹ️ PCP buttons found: 5
✅ Clicked PCP button
ℹ️ PCP cards found: 3
ℹ️ Testing PCP card 1
• Initial state: + (Expanded: false)
• Final state: – (Expanded: true)
✅ Card 1: State changed correctly
```

### TC-PLP-17: FAQ Functionality

This test verifies the FAQ accordion feature:

1. Scrolls to FAQ section at page bottom
2. Verifies FAQ section is visible
3. Gets all FAQ questions
4. **Verifies all FAQs are collapsed by default** (important requirement)
5. Tests expand/collapse for first 3 FAQs:
   - Clicking "+" should expand FAQ
   - Clicking "–" should collapse FAQ
6. Validates state transitions

**Example Output:**
```
🔍 Verifying FAQ functionality
✅ FAQ section: Visible
ℹ️ FAQs found: 8
📝 FAQ Questions:
• 1. Wie oft sollte ich meinen Rasierer wechseln?
• 2. Was ist der Unterschied zwischen Rasierer-Typen?
✅ All FAQs collapsed by default: true
ℹ️ Testing FAQ 1
• Initial: + (Expanded: false)
• After click: – (Expanded: true)
✅ FAQ 1: Expanded (button should show "–")
```

## Test Execution Workflow

Each test follows this pattern:

1. **Setup** (beforeEach):
   - Navigate to Categorized PLP (/produkte/rasierer)
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

### Debug PCP Tests
```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-16" --debug
```

### Debug FAQ Tests
```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-17" --debug
```

### View Test Traces
```bash
npx playwright show-trace ./test-results/categorized-plp-artifacts/[timestamp]/trace.zip
```

### Check Element States
Use `await page.pause()` in the test to pause execution and inspect element states in the browser.

## Common Issues & Solutions

### Issue: PCP section not found
**Solution**: PCP may not be available on all product categories. The test handles this gracefully with a warning message.

### Issue: FAQ section not found
**Solution**: FAQ section is typically at the bottom of the page. The test scrolls down before searching for FAQs.

### Issue: Expand/collapse not working
**Solution**: 
1. Check `aria-expanded` attribute is toggling correctly
2. Verify button text changes between "+" and "–"
3. Increase wait time after clicking for animation to complete

### Issue: FAQs not all collapsed by default
**Solution**: This indicates a bug. All FAQs should be collapsed on page load according to requirements.

## Test Data

The tests use dynamic data from the actual website:
- Category tabs detected automatically
- Filter options fetched from the page
- Product information retrieved in real-time
- PCP buttons and cards discovered dynamically
- FAQ items loaded from page content

## Comparison: Regular PLP vs Categorized PLP

| Feature | Regular PLP | Categorized PLP |
|---------|-------------|-----------------|
| URL | /produkte | /produkte/rasierer |
| Product Filters | ✅ | ✅ |
| Tabs | ✅ | ✅ |
| PCP Section | ❌ | ✅ |
| FAQ Section | ❌ | ✅ |
| SEO Test ID | TC-PLP-16 | TC-PLP-18 |
| Total Tests | 16 | 18 |

## Running Both PLP Test Suites

### Run All PLP Tests (Regular + Categorized)
```bash
npx playwright test --project="PLP-Tests" --project="Categorized-PLP-Tests"
```

### Run Specific Tests Across Both Suites
```bash
# Run all filter tests from both suites
npx playwright test plp.spec.js categorizedplp.spec.js -g "filter"

# Run all SEO tests
npx playwright test plp.spec.js categorizedplp.spec.js -g "SEO"
```

## Continuous Integration

Example CI/CD configuration:

```yaml
# GitHub Actions example
- name: Run Categorized PLP Tests
  run: npx playwright test --project="Categorized-PLP-Tests"
  
- name: Upload Test Report
  uses: actions/upload-artifact@v3
  with:
    name: categorized-plp-test-report
    path: ./test-results/reports/
```

## Maintenance

### Updating PCP Selectors
If PCP structure changes, update selectors in `pages/categorizedPlpPage.js`:
- `pcpSection`
- `pcpButtons`
- `pcpCards`
- `pcpCardButtons`

### Updating FAQ Selectors
If FAQ structure changes, update selectors in `pages/categorizedPlpPage.js`:
- `faqSection`
- `faqItems`
- `faqButtons`
- `faqQuestions`

### Adding New Category URLs
To test other product categories:
1. Update `baseUrl` in page object
2. Run the same test suite
3. Verify PCP and FAQ sections exist for that category

## Version History

- **v1.0** (Feb 2026): Initial implementation of all 18 test cases including PCP and FAQ functionality

## Related Documentation

- Regular PLP Tests: See `tests/PLP_README.md`
- Quick Commands: See `PLP_COMMANDS.md`
- Test Plan: See `test-plans/categorizedplp.md`
