# HTML Report Generator - Usage Guide

## Overview
The HTML Report Generator creates beautiful, interactive HTML reports for your Gillette Germany test automation suite.

## 📁 Folder Structure
```
test-results/
  └── html-reports/
      └── homepage/
          ├── homepage_summary_YYYYMMDD_HHMMSS.html (Summary Report)
          ├── TC-Homepage-01_report.html (Individual Test Reports)
          ├── TC-Homepage-02_report.html
          └── ... (21 individual test reports)
```

## 🚀 Quick Start

### Generate Homepage Reports
```bash
node generate-homepage-reports.js
```

This will generate:
- **21 Individual Test Reports** - One for each test case (TC-Homepage-01 through TC-Homepage-21)
- **1 Summary Report** - Complete overview of all homepage tests

## 📊 Report Features

### Summary Report
- **Executive Dashboard** with test statistics
- **Pass/Fail Rate** with visual progress bar
- **Total Duration** across all tests
- **Interactive Filtering** by status (All/Passed/Failed/Skipped)
- **Search Functionality** to find specific tests
- **Expandable Test Cards** with detailed information

### Individual Test Reports
- **Test Steps** with status indicators
- **Validations** performed
- **Screenshots & Artifacts** links
- **Error Details** (if test failed)
- **Test Metadata** (browser, viewport, URL)

## 🎨 Report Highlights

✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Interactive** - Filter, search, and expand test details
✅ **Beautiful UI** - Modern gradient design with Gillette branding
✅ **Print-Friendly** - Optimized for printing or PDF export
✅ **German Localization** - Supports German characters (ä, ö, ü, ß)

## 📝 Custom Report Generation

### Using the API
```javascript
import { HTMLReportGenerator } from './utils/htmlReportGenerator.js';

const generator = new HTMLReportGenerator({
  reportTitle: 'My Custom Test Report',
  projectName: 'Gillette Germany',
  testSuite: 'Custom Test Suite',
  outputPath: './test-results/html-reports/custom'
});

const testResults = {
  tests: [
    {
      testId: 'TC-Custom-01',
      title: 'My Test',
      status: 'passed',
      duration: 5000,
      steps: [...],
      validations: [...]
    }
  ]
};

const reportPath = generator.generateReport(testResults);
console.log(`Report: ${reportPath}`);
```

### Test Result Structure
```javascript
{
  testId: 'TC-Homepage-01',              // Test identifier
  title: 'Test title',                   // Test description
  status: 'passed|failed|skipped',       // Test status
  duration: 8500,                        // Duration in ms
  browser: 'Chromium',                   // Browser used
  viewport: '1366x768',                  // Viewport size
  url: 'https://...',                    // Test URL
  steps: [                               // Test steps (optional)
    { description: 'Step 1', status: 'passed' }
  ],
  validations: [                         // Validations (optional)
    { description: 'Check X', passed: true }
  ],
  screenshots: ['path/to/screenshot.png'], // Screenshot paths (optional)
  artifacts: ['path/to/artifact.json'],  // Artifact paths (optional)
  error: {                               // Error details (if failed)
    message: 'Error message',
    stack: 'Stack trace'
  }
}
```

## 🔧 Configuration Options

```javascript
new HTMLReportGenerator({
  reportTitle: 'Report Title',           // Main title
  projectName: 'Project Name',           // Project name
  testSuite: 'Test Suite Name',          // Test suite name
  outputPath: './reports',               // Output directory
  includeScreenshots: true,              // Include screenshots
  includeTimestamps: true                // Include timestamps
})
```

## 📂 Viewing Reports

1. **Open in Browser**: Double-click any HTML file
2. **Navigate**: Use filters and search to find specific tests
3. **Expand Details**: Click test cards to see detailed information
4. **Export**: Use browser print function to save as PDF

## 🔍 Report Locations

- **Homepage Reports**: `test-results/html-reports/homepage/`
- **Summary Report**: `homepage_summary_[timestamp].html`
- **Individual Reports**: `TC-Homepage-[XX]_report.html`

## 📈 Statistics Included

- Total Tests Executed
- Tests Passed / Failed / Skipped
- Pass Rate Percentage
- Total Execution Duration
- Individual Test Durations

## 🎯 Best Practices

1. **Generate After Each Run** - Create reports immediately after test execution
2. **Archive Old Reports** - Move older reports to archive folder
3. **Share Summary Reports** - Send summary to stakeholders
4. **Use Individual Reports** - For detailed debugging of specific tests
5. **Include Screenshots** - Always capture screenshots for failed tests

## 🛠️ Integration with Playwright

Add to your test setup:

```javascript
import { HomepageReportCollector } from './utils/homepageReportGenerator.js';

const collector = new HomepageReportCollector();

test.afterEach(async ({ page }, testInfo) => {
  collector.addTestResult({
    testId: testInfo.title,
    title: testInfo.title,
    status: testInfo.status,
    duration: testInfo.duration,
    // ... other details
  });
});

test.afterAll(async () => {
  collector.generateSummaryReport();
});
```

## 🎉 Example Output

```
🚀 Starting Homepage Test Report Generation...
📊 Total Tests Collected: 21
📝 Generating individual test reports...
  ✅ [1/21] TC-Homepage-01: TC-Homepage-01_report.html
  ✅ [2/21] TC-Homepage-02: TC-Homepage-02_report.html
  ...
✅ Individual reports generated: 21/21
📊 Generating final summary report...
  ✅ Summary report: homepage_summary_20260223_161502.html
📈 Test Execution Summary:
  Total Tests: 21
  ✅ Passed: 21
  ❌ Failed: 0
  ⚠️  Skipped: 0
  📊 Pass Rate: 100.0%
🎉 Report generation completed successfully!
```

## 📞 Support

For issues or questions about the HTML Report Generator:
- Check test execution logs
- Verify test result data structure
- Ensure output directory has write permissions

---

**Generated by**: Gillette Germany Test Automation Framework  
**Powered by**: Playwright + Custom HTML Report Generator
