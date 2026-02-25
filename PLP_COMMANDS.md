# PLP Tests - Quick Command Reference

## Essential Commands

### Run All PLP Tests
```bash
npx playwright test --project="PLP-Tests"
```

### Run Specific Test by ID
```bash
# Run TC-PLP-01
npx playwright test plp.spec.js -g "TC-PLP-01"

# Run TC-PLP-02
npx playwright test plp.spec.js -g "TC-PLP-02"

# Run TC-PLP-05 (JETZT KAUFEN button)
npx playwright test plp.spec.js -g "TC-PLP-05"
```

### Run Tests by Category

#### Run All Filter Tests (TC-PLP-06 to TC-PLP-13)
```bash
npx playwright test plp.spec.js -g "filter"
```

#### Run Button Tests (TC-PLP-04 and TC-PLP-05)
```bash
npx playwright test plp.spec.js -g "button"
```

#### Run SEO Test (TC-PLP-16)
```bash
npx playwright test plp.spec.js -g "SEO"
```

### Debugging Commands

#### Run with Browser Visible
```bash
npx playwright test --project="PLP-Tests" --headed
```

#### Run in Debug Mode (step through)
```bash
npx playwright test plp.spec.js -g "TC-PLP-01" --debug
```

#### Run with UI Mode (interactive)
```bash
npx playwright test --project="PLP-Tests" --ui
```

#### Show Test Trace (after failure)
```bash
npx playwright show-trace ./test-results/plp-artifacts/[timestamp]/trace.zip
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

### Advanced Commands

#### Run Tests in Parallel (2 workers)
```bash
npx playwright test --project="PLP-Tests" --workers=2
```

#### Run with Maximum Logging
```bash
DEBUG=pw:api npx playwright test --project="PLP-Tests"
```

#### Update Playwright
```bash
npm install -D @playwright/test@latest
npx playwright install
```

## Test File Locations

- **Test Spec**: `tests/plp.spec.js`
- **Page Object**: `pages/plpPage.js`
- **Test Plan**: `test-plans/PLP.md`
- **Config**: `playwright.config.js`

## Output Locations

- **Artifacts**: `./test-results/plp-artifacts/[timestamp]/`
- **Reports**: `./test-results/reports/[timestamp]/`
- **Screenshots**: Saved in artifacts folder on failure

## Quick Test Scenarios

### Smoke Test (Essential Tests Only)
```bash
npx playwright test plp.spec.js -g "TC-PLP-01|TC-PLP-02|TC-PLP-04"
```

### Filter Tests Only
```bash
npx playwright test plp.spec.js -g "TC-PLP-06|TC-PLP-07|TC-PLP-08|TC-PLP-09"
```

### Filter Deny Tests Only
```bash
npx playwright test plp.spec.js -g "TC-PLP-10|TC-PLP-11|TC-PLP-12|TC-PLP-13"
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

## Example: Run Single Test with Full Visibility

```bash
npx playwright test plp.spec.js -g "TC-PLP-01" --headed --reporter=list
```

This command:
- Runs only TC-PLP-01
- Shows browser window
- Displays detailed console output
