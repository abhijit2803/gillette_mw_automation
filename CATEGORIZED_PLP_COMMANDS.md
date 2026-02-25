# Categorized PLP Tests - Quick Command Reference

## Essential Commands

### Run All Categorized PLP Tests
```bash
npx playwright test --project="Categorized-PLP-Tests"
```

### Run Specific Test by ID
```bash
# Run TC-PLP-01 (Page Load)
npx playwright test categorizedplp.spec.js -g "TC-PLP-01"

# Run TC-PLP-16 (PCP Functionality) ⭐ NEW
npx playwright test categorizedplp.spec.js -g "TC-PLP-16"

# Run TC-PLP-17 (FAQ Functionality) ⭐ NEW
npx playwright test categorizedplp.spec.js -g "TC-PLP-17"

# Run TC-PLP-18 (SEO Components)
npx playwright test categorizedplp.spec.js -g "TC-PLP-18"
```

### Run Tests by Category

#### Run All Filter Tests (TC-PLP-06 to TC-PLP-13)
```bash
npx playwright test categorizedplp.spec.js -g "filter"
```

#### Run Button Tests (TC-PLP-04 and TC-PLP-05)
```bash
npx playwright test categorizedplp.spec.js -g "button"
```

#### Run New Features (PCP + FAQ)
```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-16|TC-PLP-17"
```

#### Run SEO Test (TC-PLP-18)
```bash
npx playwright test categorizedplp.spec.js -g "SEO"
```

### Debugging Commands

#### Run with Browser Visible
```bash
npx playwright test --project="Categorized-PLP-Tests" --headed
```

#### Run in Debug Mode (step through)
```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-16" --debug
```

#### Run with UI Mode (interactive)
```bash
npx playwright test --project="Categorized-PLP-Tests" --ui
```

#### Debug PCP Test
```bash
npx playwright test categorizedplp.spec.js -g "PCP" --debug
```

#### Debug FAQ Test
```bash
npx playwright test categorizedplp.spec.js -g "FAQ" --debug
```

#### Show Test Trace (after failure)
```bash
npx playwright show-trace ./test-results/categorized-plp-artifacts/[timestamp]/trace.zip
```

### Report Commands

#### View Latest HTML Report
```bash
npx playwright show-report
```

#### View Specific Report
```bash
npx playwright show-report ./test-results/reports/[timestamp]
```

### Combined Commands (Regular + Categorized PLP)

#### Run Both PLP Test Suites
```bash
npx playwright test --project="PLP-Tests" --project="Categorized-PLP-Tests"
```

#### Run Specific Test Across Both Suites
```bash
# Run TC-PLP-01 from both suites
npx playwright test plp.spec.js categorizedplp.spec.js -g "TC-PLP-01"

# Run all filter tests from both
npx playwright test plp.spec.js categorizedplp.spec.js -g "filter"

# Run all SEO tests from both
npx playwright test plp.spec.js categorizedplp.spec.js -g "SEO"
```

### Advanced Commands

#### Run Tests in Parallel (2 workers)
```bash
npx playwright test --project="Categorized-PLP-Tests" --workers=2
```

#### Run with Maximum Logging
```bash
DEBUG=pw:api npx playwright test --project="Categorized-PLP-Tests"
```

#### Update Playwright
```bash
npm install -D @playwright/test@latest
npx playwright install
```

## Test File Locations

- **Test Spec**: `tests/categorizedplp.spec.js`
- **Page Object**: `pages/categorizedPlpPage.js`
- **Test Plan**: `test-plans/categorizedplp.md`
- **Config**: `playwright.config.js`

## Output Locations

- **Artifacts**: `./test-results/categorized-plp-artifacts/[timestamp]/`
- **Reports**: `./test-results/reports/[timestamp]/`
- **Screenshots**: Saved in artifacts folder on failure

## Quick Test Scenarios

### Smoke Test (Essential Tests Only)
```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-01|TC-PLP-02|TC-PLP-04"
```

### Filter Tests Only
```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-06|TC-PLP-07|TC-PLP-08|TC-PLP-09"
```

### Filter Deny Tests Only
```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-10|TC-PLP-11|TC-PLP-12|TC-PLP-13"
```

### New Features Only (PCP + FAQ)
```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-16|TC-PLP-17"
```

### Functional Tests (Buttons, PCP, FAQ)
```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-04|TC-PLP-05|TC-PLP-16|TC-PLP-17"
```

## Useful Options

- `--headed` - Show browser during execution
- `--debug` - Step through tests with debugger
- `--ui` - Interactive UI mode
- `--workers=N` - Set number of parallel workers
- `-g "pattern"` - Run tests matching pattern
- `--project="name"` - Run specific project
- `--reporter=list` - Use list reporter (detailed console output)
- `--reporter=dot` - Use dot reporter (minimal output)

## Example: Run PCP Test with Full Visibility

```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-16" --headed --reporter=list
```

This command:
- Runs only TC-PLP-16 (PCP test)
- Shows browser window
- Displays detailed console output

## Example: Run FAQ Test with Debug Mode

```bash
npx playwright test categorizedplp.spec.js -g "TC-PLP-17" --debug
```

This command:
- Runs only TC-PLP-17 (FAQ test)
- Opens Playwright Inspector
- Allows step-by-step execution

## Testing Different Product Categories

To test other product categories (not just rasierer), update the baseUrl in `pages/categorizedPlpPage.js`:

```javascript
// Change from:
this.baseUrl = 'https://www.gillette.de/de-de/produkte/rasierer';

// To (example):
this.baseUrl = 'https://www.gillette.de/de-de/produkte/rasierklingen';
this.baseUrl = 'https://www.gillette.de/de-de/produkte/barttrimmer';
```

Then run:
```bash
npx playwright test --project="Categorized-PLP-Tests"
```

## Comparison Commands

### Run Only Regular PLP
```bash
npx playwright test --project="PLP-Tests"
```

### Run Only Categorized PLP
```bash
npx playwright test --project="Categorized-PLP-Tests"
```

### Run Both Sequentially
```bash
npx playwright test --project="PLP-Tests" && npx playwright test --project="Categorized-PLP-Tests"
```

### Run Both in Parallel Projects
```bash
npx playwright test --project="PLP-Tests" --project="Categorized-PLP-Tests"
```

## Special Feature Testing

### Test Only PCP Feature
```bash
npx playwright test categorizedplp.spec.js -g "PCP functionality"
```

### Test Only FAQ Feature
```bash
npx playwright test categorizedplp.spec.js -g "FAQ functionality"
```

### Test Both New Features
```bash
npx playwright test categorizedplp.spec.js -g "PCP|FAQ"
```

## CI/CD Integration Examples

### GitHub Actions
```yaml
- name: Test Categorized PLP
  run: npx playwright test --project="Categorized-PLP-Tests"
```

### Azure DevOps
```yaml
- script: npx playwright test --project="Categorized-PLP-Tests"
  displayName: 'Run Categorized PLP Tests'
```

### Jenkins
```groovy
stage('Test Categorized PLP') {
    steps {
        sh 'npx playwright test --project="Categorized-PLP-Tests"'
    }
}
```
