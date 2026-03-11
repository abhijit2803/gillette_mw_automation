# Playwright E-commerce Automation

## Overview
This project contains automated tests for the Braun e-commerce platform using Playwright with JavaScript ES modules and a professional Page Object Model (POM) architecture. Features dynamic environment management, centralized PageFactory pattern, and comprehensive test reporting.

## Test Cases Implemented

### Login Test Suite (login.spec.js)

#### TC-001: Header- Login
**Test Scenario:** Verify the header Login/Logout popup matches Figma design  
**Type:** Positive  
**Description:** Validates that the account popup displays all required elements (Braun Care+ text, welcome message, signin button, register link, etc.) and matches the Figma design specifications.

#### TC-002: Signin
**Test Scenario:** Verify User is able to Successfully Login  
**Type:** Positive  
**Description:** Validates that a user can successfully navigate to the signin page, enter credentials, and login to access their profile page.

#### TC-002-Extended: Signin Page Layout
**Test Scenario:** Verify all signin page elements layout and accessibility  
**Type:** Positive  
**Description:** Validates signin page layout, form structure, and accessibility features including tab navigation.

## Project Architecture

### 🏗️ **Page Manager Pattern**
Utilizes centralized Page Manager for clean, maintainable page object management:

```javascript
// Single import for page manager
import { pageManager } from '../utils/pageManager.js';

// Automatic initialization of all page objects
const pm = new pageManager(page);

// Access any page object through helper methods
pm.onHomePage().navigateToHome('/');
pm.onLoginPage().enterCredentials(email, password);
pm.onProfilePage().verifyUserProfile();
```

### 🌐 **Dynamic Environment Management**
Environment-specific baseURLs loaded dynamically from environmentConfig.json:

```javascript
// playwright.config.js
import { getBaseUrlForEnvironment } from './utils/helper.js';

const PROD_BASE_URL = getBaseUrlForEnvironment('prod');
const STAGE_BASE_URL = getBaseUrlForEnvironment('qa');
```

## Project Structure

```
playwright/
├── 📁 .github/                 # GitHub workflows and actions
│   ├── chatmodes/             # Custom chat configurations
│   └── workflows/             # CI/CD workflow definitions
├── 📁 .playwright-mcp/         # Playwright MCP configurations
├── 📁 .vscode/                 # VS Code workspace settings
│
├── 📁 pages/                   # Page Object Model classes
│   ├── helperBase.js           # Base page with common functionality
│   ├── homePage.js             # Home page interactions
│   ├── accountPopupPage.js     # Account popup handling
│   ├── loginPage.js            # Login page interactions
│   └── profilePage.js          # Profile page interactions
│
├── 📁 tests/                   # Test specification files
│   └── login.spec.js           # Login functionality tests (TC-001, TC-002)
│
├── 📁 test-data/               # Test data and configuration
│   ├── environmentConfig.json  # Environment URLs & application data
│   └── users.json              # User credentials and test accounts
│
├── 📁 utils/                   # Utility functions and helpers
│   ├── pageManager.js          # 🆕 Centralized page object manager
│   ├── dataProvider.js         # 🆕 Test data provider utilities
│   ├── testSetup.js            # 🆕 Test setup and teardown functions
│   ├── logConstants.js         # 🆕 Logging utilities and symbols
│   ├── helper.js               # Dynamic baseURL & common utilities
│   └── apiHelper.js            # API testing utilities
│
├── 📁 test-results/            # 🆕 Centralized test output (timestamped)
│   ├── prod-artifacts/         # Production artifacts (DD-Mon-YYYY_HH-MM-SS folders)
│   │   └── 11-Dec-2025_19-24-29/  # Test run artifacts
│   ├── reports/                # HTML reports (timestamped folders)
│   │   └── 11-Dec-2025_19-24-29/  # HTML report
│   │       └── index.html
│   └── screenshots/            # Manual test screenshots
│
├── 📁 manual-testcases/        # Manual test case documentation
│   └── Account_And_Login_Checkout.csv # Manual test scenarios
│
├── 📁 test-plans/              # Test planning documents
├── 📁 node_modules/            # NPM dependencies (auto-generated)
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore configuration
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── playwright.config.js        # Playwright configuration with dynamic environments
└── README.md                   # This documentation
```

## 🚀 **Key Features**

### 🏭 **Page Manager Pattern**
- **Centralized Page Management**: All page objects created via pageManager utility
- **Automatic Page Loading**: All pages initialized in single constructor
- **Single Import**: One import for complete page management
- **Simple Access**: Access pages via `pm.onHomePage()`, `pm.onLoginPage()` etc.

### 🌐 **Dynamic Environment System**
- **Smart URL Management**: Environment-specific URLs from environmentConfig.json
- **No Hardcoding**: All URLs centralized in configuration files
- **Fail-Fast**: Clear errors if environment configuration missing
- **Zero Setup**: Automatic environment detection from playwright.config.js

### 📊 **Organized Test Results**
- **Timestamped Folders**: Each run creates new folder (DD-Mon-YYYY_HH-MM-SS)
- **Centralized Output**: All test artifacts in test-results/ folder
- **Clean Screenshots**: Screenshots organized with test results
- **HTML Reports**: Rich HTML reports with failure details

### 🧪 **Advanced Test Utilities**
- **Test Setup**: Automated test setup and environment detection (testSetup.js)
- **Data Provider**: Centralized test data management (dataProvider.js)
- **Logging**: Enhanced console logging with symbols and colors (logConstants.js)
- **Screenshot on Failure**: Automatic screenshot capture for failed tests

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation
```powershell
# Clone or navigate to project directory
cd playwright

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Configuration

1. **Environment URLs (environmentConfig.json):**
   ```json
   {
     "environments": {
       "qa": {
         "baseUrl": "https://stage-us.braun.com/en-us", 
         "apiUrl": "https://api-qa.braun.com"
       },
       "prod": {
         "baseUrl": "https://us.braun.com/en-us",
         "apiUrl": "https://api.braun.com"
       }
     }
   }
   ```

2. **Test Credentials (users.json):**
   ```json
   {
     "testCredentials": {
       "default": {
         "email": "test@example.com",
         "password": "testpassword"
       }
     }
   }
   ```



4. **Environment Variables (Optional):**
   Create a `.env` file to override defaults:
   ```bash
   # Override test credentials
   TEST_EMAIL=your@email.com
   TEST_PASSWORD=yourpassword
   
   # Timeout settings
   TIMEOUT_SHORT=5000
   TIMEOUT_MEDIUM=10000
   TIMEOUT_LONG=30000
   ```

## Running Tests

### 🎯 **Quick Test Commands**
```bash
# Run all tests (default configuration)
npm test

# Run specific test suites
npm run test:login         # Login tests only

# Run tests in headed mode (browser visible)
npm run test:headed

# Debug tests
npm run test:debug

# View test reports
npm run report
```

### 🔧 **Advanced Test Commands**
```bash
# Run specific test file
npx playwright test tests/sanity.spec.js

# Run specific test by name
npx playwright test -g "TC-001"

# Run tests in UI mode (recommended for debugging)
npx playwright test --ui

# Run on specific project
npx playwright test --project="Desktop-Prod"
npx playwright test --project="Mobile-Prod"
npx playwright test --project="Desktop-Stage"
npx playwright test --project="Mobile-Stage"
```

### 🎪 **Execution Flow**

When you run `npm test`, here's what happens:

```
1. Command: npm test
   ↓
2. Loads: playwright.config.js
   ↓ calls getBaseUrlForEnvironment('prod')
   ↓
3. helper.js reads: test-data/environmentConfig.json
   ↓ returns "https://us.braun.com/en-us"
   ↓
4. Playwright starts with PROD baseURL
   ↓
5. Test loads: pageManager from utils/pageManager.js
   ↓ pageManager initializes all page objects
   ↓ setupTest() loads environment and credentials
   ↓
6. Tests execute with:
   - Production Environment URL (automatic)
   - Test Credentials (from dataProvider)
   - Artifacts → test-results/prod-artifacts/DD-Mon-YYYY_HH-MM-SS/
   - Reports → test-results/reports/DD-Mon-YYYY_HH-MM-SS/
```

### 📊 **Test Output Structure**
```
test-results/
├── prod-artifacts/              # Production test artifacts (timestamped)
│   └── 11-Dec-2025_19-24-29/   # Run timestamp: DD-Mon-YYYY_HH-MM-SS
│       ├── screenshots/         # Failure screenshots
│       ├── videos/              # Test execution videos
│       └── traces/              # Debug traces
├── reports/                     # HTML reports (timestamped)
│   └── 11-Dec-2025_19-24-29/   # Run timestamp
│       └── index.html          # HTML report for this run
└── screenshots/                 # Manual test screenshots
    ├── tc-001-account-popup.png
    └── tc-002-login-success.png
```

### Manual Playwright Commands

```powershell
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/login.spec.js

# Run tests in UI mode (recommended for debugging)
npx playwright test --ui

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run specific test by name
npx playwright test -g "TC-001"
npx playwright test -g "Hero banner"

# Run tests on specific project (Desktop or Mobile)
npx playwright test --project="Desktop-Prod"
npx playwright test --project="Mobile-Prod"
npx playwright test --project="Desktop-Stage"
npx playwright test --project="Mobile-Stage"

# Debug mode
npx playwright test --debug

# Generate test code with Codegen
npx playwright codegen https://us.braun.com
```

## 📊 **Test Reports**

### Viewing Reports
```powershell
# View latest HTML report using Playwright's report server
npx playwright show-report test-results\reports\11-Dec-2025_19-24-29

# Or use the shortcut to open the most recent report
npm run report

# Timestamped report folders (format: DD-Mon-YYYY_HH-MM-SS):
# Reports: test-results/reports/11-Dec-2025_19-24-29/index.html
# Artifacts: test-results/prod-artifacts/11-Dec-2025_19-24-29/

# Each run creates a new timestamped folder - no reports are overwritten!
```

### Report Features:
- **Rich HTML Reports**: Detailed execution results with links to artifacts
- **Timestamped Folders**: Each run creates a new folder (DD-Mon-YYYY_HH-MM-SS) - no overwrites!
- **Automatic Artifacts**: Screenshot, video, and trace capture on failures
- **Test Metadata**: Duration, retry information, error details
- **Historical Tracking**: Keep all previous test runs for comparison and analysis

## 📸 **Screenshots & Artifacts**

Test artifacts are organized with timestamped folders to preserve all test run history:
```
test-results/
├── screenshots/                     # Manual test screenshots
│   ├── tc-001-account-popup.png    # Figma design comparison
│   └── tc-002-login-success.png    # Successful login state
├── prod-artifacts/                  # Production artifacts (timestamped)
│   └── 11-Dec-2025_19-24-29/       # Specific test run
│       ├── test-failed-1.png       # Failure screenshots
│       ├── video.webm              # Test execution video
│       ├── trace.zip               # Debug trace
│       └── error-context.md        # Error details
└── reports/                         # HTML reports (timestamped)
    └── 11-Dec-2025_19-24-29/
        └── index.html              # HTML report
```

### Screenshot Features:
- **Automatic Capture**: Screenshots on test failures (saved in timestamped artifact folders)
- **Manual Screenshots**: Custom screenshots for validation (saved in screenshots/ folder)
- **Timestamped Storage**: Each test run preserved in its own dated folder
- **Video Recording**: Full test execution videos on failures
- **Trace Files**: Detailed execution traces for debugging
- **No Overwrites**: Historical test runs retained for comparison and debugging

## 🎯 **Current Implementation Status**

### ✅ **Completed Features:**
- **Page Manager Pattern**: Centralized page object management with automatic initialization
- **Dynamic Environment System**: Environment-specific URLs from environmentConfig.json
- **Professional POM Structure**: Clean page objects with helperBase foundation
- **Multi-Environment Support**: Production and Stage configurations with isolated reports
- **Timestamped Report Folders**: Each run creates DD-Mon-YYYY_HH-MM-SS folders
- **ES Modules Integration**: Modern JavaScript module system
- **Centralized Test Data**: JSON-based fixture management (users, checkout, environment)
- **Advanced Utilities**: testSetup, dataProvider, logConstants for enhanced testing
- **Organized Test Output**: Timestamped reports and artifacts
- **Multiple Device Support**: Desktop and Mobile Chrome testing
- **Comprehensive Logging**: Detailed test execution feedback with symbols
- **Historical Test Tracking**: All test runs preserved with timestamps

### 📋 **Test Coverage:**
- ✅ TC-001: Account popup validation (Figma design comparison)
- ✅ TC-002: Complete login flow (authentication & profile verification)  
- ✅ TC-002-Extended: Login page layout and accessibility testing
- ✅ Error handling and fallback scenarios
- ✅ Automatic screenshot capture on failures

### 🔄 **Architecture Highlights**
- **Page Manager**: Single import for all page objects via `pageManager` class
- **Helper Base**: Foundation class (`helperBase.js`) with common functionality
- **Data Provider**: Centralized test data management with `dataProvider.js`
- **Test Setup**: Automated environment detection and test preparation
- **Enhanced Logging**: Color-coded console output with symbols

## 🏗️ **Page Object Model Architecture**

The project implements a modern Page Manager pattern with clean architecture:

### **Core Architecture:**
```javascript
// utils/pageManager.js - Central Page Manager
export class pageManager {
  constructor(page) {
    this.page = page;

    // Initialize all page objects as data members
    this.basePage = new helperBase(this.page);
    this.homePage = new homePage(this.page);
    this.accountPopupPage = new accountPopupPage(this.page);
    this.loginPage = new loginPage(this.page);
    this.profilePage = new profilePage(this.page);
  }

  // Convenient methods to access each page
  onHomePage() { return this.homePage; }
  onLoginPage() { return this.loginPage; }
  onProfilePage() { return this.profilePage; }
  // ... and more
}
```

### **Page Object Structure:**
- **helperBase.js** - Foundation class with common functionality (waiters, navigation, screenshots)
- **homePage.js** - Home page interactions and hero banner handling
- **accountPopupPage.js** - Account popup handling and element validation
- **loginPage.js** - Login form interactions and authentication
- **profilePage.js** - Profile page verification and user data validation

### **Benefits of Current Architecture:**
- **🏭 Manager Pattern**: Single point of page object creation
- **🔄 Shared Base**: Common functionality through helperBase
- **📦 Single Import**: All pages available from one pageManager import
- **🔧 Auto-Setup**: All pages initialized automatically
- **🎯 Simple Access**: Clean methods like `pm.onHomePage()`, `pm.onLoginPage()`
- **🧹 Clean Tests**: Minimal boilerplate in test files

## 🌐 **Dynamic Environment System**

### **Environment Flow:**
```
playwright.config.js → helper.js → environmentConfig.json → Dynamic baseURL
```

### **Configuration Implementation:**
```javascript
// playwright.config.js
import { getBaseUrlForEnvironment } from './utils/helper.js';

// Dynamic base URL configuration
const PROD_BASE_URL = getBaseUrlForEnvironment('prod');
const STAGE_BASE_URL = getBaseUrlForEnvironment('qa');

// Create timestamped folders for each run
const getTimestamp = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${pad(now.getDate())}-${months[now.getMonth()]}-${now.getFullYear()}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
};

const runTimestamp = getTimestamp();

export default defineConfig({
  outputDir: `./test-results/default-artifacts/${runTimestamp}`,
  use: {
    baseURL: PROD_BASE_URL, // → https://us.braun.com/en-us
  },
  reporter: [['html', { outputFolder: `./test-results/reports/${runTimestamp}` }]],
  projects: [
    {
      name: 'Desktop-Prod',
      outputDir: `./test-results/prod-artifacts/${runTimestamp}`,
      use: { baseURL: PROD_BASE_URL }
    },
    {
      name: 'Desktop-Stage',
      outputDir: `./test-results/stage-artifacts/${runTimestamp}`,
      use: { baseURL: STAGE_BASE_URL }
    }
  ]
});
```

### **Environment Management:**
| Project | URL Source | Output |
|---------|------------|--------|
| **Desktop-Prod** | `environmentConfig.json → prod.baseUrl` | `test-results/prod-artifacts/` |
| **Mobile-Prod** | `environmentConfig.json → prod.baseUrl` | `test-results/prod-artifacts/` |
| **Desktop-Stage** | `environmentConfig.json → qa.baseUrl` | `test-results/stage-artifacts/` |
| **Mobile-Stage** | `environmentConfig.json → qa.baseUrl` | `test-results/stage-artifacts/` |
```javascript
// utils/env.js provides:
- getBaseUrl()           // Environment-specific base URL
- getTestCredentials()   // Environment-specific test accounts
- getApiUrl()           // API endpoints for each environment
- getTimeouts()         // Environment-specific timeout values
```

## Test Data Management

### Test Data Structure:
```javascript
// test-data/users.json
{
  "validUsers": [...],      // Test user accounts
  "invalidUsers": [...],    // Invalid credentials for negative testing
  "testCredentials": {...}  // Default test credentials
}

// test-data/environmentConfig.json
{
  "environments": {
    "qa": {
      "baseUrl": "https://stage-us.braun.com/en-us",
      "apiUrl": "https://api-qa.braun.com"
    },
    "prod": {
      "baseUrl": "https://us.braun.com/en-us",
      "apiUrl": "https://api.braun.com"
    }
  }
}


```

### Data Provider Utilities:
```javascript
// utils/dataProvider.js provides:
- loadTestData(filename)         // Load any JSON file from test-data/
- getTestCredentials()           // Get test user credentials
```

## CI/CD Integration

The project is ready for CI/CD integration with GitHub Actions. Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
    
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm run test:qa
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## Utility Functions

### Page Management (`utils/pageManager.js`):
- `pageManager(page)` - Central manager for all page objects
- `onHomePage()` - Get home page instance
- `onLoginPage()` - Get login page instance
- `onProfilePage()` - Get profile page instance
- `onAccountPopupPage()` - Get account popup instance

### Data Provider (`utils/dataProvider.js`):
- `loadTestData(filename)` - Load JSON test data files
- `getTestCredentials()` - Get test account credentials
- `getCheckoutTestData(env)` - Get checkout data for environment
- `getAllCheckoutData()` - Get complete checkout data

### Test Setup (`utils/testSetup.js`):
- `setupTest(context, testInfo)` - Automated test setup and environment detection
- `attachFailureScreenshot(page, testInfo)` - Attach screenshots on failure
- `clearCookiesAndCache(context)` - Clear browser data

### Logging (`utils/logConstants.js`):
- `log(symbol, message)` - Enhanced console logging with symbols
- `SYMBOLS` - Predefined log symbols (SUCCESS, ERROR, INFO, WARNING, etc.)

### Helper Utilities (`utils/helper.js`):
- `getBaseUrlForEnvironment(env)` - Get environment-specific base URL
- `generateRandomEmail()` - Generate test email addresses
- `formatDate()` - Date formatting utilities
- `waitForElement()` - Advanced wait functions

### API Utilities (`utils/apiHelper.js`):
- `makeApiRequest()` - HTTP request utilities
- `validateApiResponse()` - Response validation
- `getAuthToken()` - Authentication helpers

## Best Practices Implemented

### 1. **Project Structure:**
- Industry-standard folder organization
- Separation of concerns (pages, tests, data, utils, configs)
- ES Module support for modern JavaScript

### 2. **Page Object Model:**
- Inheritance pattern with BasePage
- Centralized locator management
- Reusable component methods

### 3. **Test Data Management:**
- JSON-based fixture files
- Environment-specific configurations
- Centralized locator definitions

### 4. **Environment Management:**
- Multi-environment support (dev/qa/prod)
- Environment variable integration
- Flexible configuration system

### 5. **Code Quality:**
- TypeScript support with JSDoc
- Consistent naming conventions
- Comprehensive error handling

## Troubleshooting

### Common Issues:

#### **Tests failing with "Element not found"**
```bash
# Debug with headed mode
npm run test:headed

# Use debug mode
npm run test:debug

# Generate new selectors
npx playwright codegen https://us.braun.com
```

### #### **Import/Module errors**
- Ensure `package.json` has `"type": "module"`
- Check file extensions (.js) in import statements
- Verify relative paths in imports

#### **Environment configuration issues**
```bash
# Check environment settings from playwright.config.js
# Verify baseURL configuration

# Verify test credentials are loaded
node -e "import('./utils/dataProvider.js').then(m => console.log(m.getTestCredentials()))"
```

#### **SSL/Certificate errors**
Configure in `playwright.config.js`:
```javascript
use: {
  ignoreHTTPSErrors: true,
  // other settings...
}
```

## Best Practices

1. **Selectors Priority:**
   - Use `data-testid` attributes (most reliable)
   - Use role-based selectors (accessible)
   - Use text content (for unique text)
   - Avoid CSS selectors based on classes/ids (brittle)

2. **Waits:**
   - Playwright auto-waits for elements
   - Use explicit waits only when necessary
   - Use `waitForLoadState('networkidle')` after navigation

3. **Assertions:**
   - Use Playwright's built-in `expect` assertions
   - They have auto-retry mechanism

## Troubleshooting

### Tests failing with "Element not found"
- Run with `--headed` to see what's happening
- Use `--debug` mode to step through
- Use codegen to verify selectors: `npx playwright codegen`

### CAPTCHA issues
- Contact dev team to disable CAPTCHA in test environment
- Or implement CAPTCHA bypass mechanism

### SSL/Certificate errors
- Configure `ignoreHTTPSErrors: true` in playwright.config.js if needed

## Support & Documentation

### Additional Resources:
- **Manual Test Cases**: [manual-testcases/Account_And_Login_Checkout.csv](manual-testcases/Account_And_Login_Checkout.csv)
- **Playwright Documentation**: https://playwright.dev
- **Page Object Model Guide**: https://playwright.dev/docs/pom

### Getting Help:
1. Check this README for common issues
2. Review test execution logs and screenshots in test-results/
3. Use Playwright's debugging tools (`--debug`, `--ui`)
4. Check timestamped reports for detailed execution information

### Project Metrics:
- **Test Coverage**: Login functionality
- **Browser Support**: Desktop Chrome (Edge), Mobile Chrome (Pixel 5)
- **Environment Support**: Production and Stage configurations
- **Execution Time**: ~1-2 minutes per full test suite (depending on environment)

## Recent Updates

### v2.1.0 - Timestamped Report Folders ✅
- **Timestamped Output**: Each test run creates dated folders (DD-Mon-YYYY_HH-MM-SS)
- **No Overwrites**: All test runs preserved for historical tracking
- **Enhanced Traceability**: Easy identification of test runs by timestamp
- **Improved Debugging**: Keep artifacts from multiple runs for comparison

### v2.0.0 - Project Restructuring ✅
- Implemented professional folder structure
- Added Page Object Model with helperBase
- Created environment configuration system
- Added utility functions and helpers
- Integrated ES module support
- Centralized test data management

### Current Status: Production Ready 🚀
All tests are passing with timestamped report generation. The project includes comprehensive login tests with multi-device support.

*Last Updated: December 12, 2025*  
*Project Version: 2.1.0*  
*Playwright Version: 1.57.0*
