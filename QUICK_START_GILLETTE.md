# Quick Start Guide - Gillette Labs Testing

## ⚡ Quick Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Encrypt Your Password
```bash
node scripts/encryptPassword.js "YourActualPassword"
```

Copy the output that looks like: `encrypted:abc123...xyz789`

### Step 3: Update Credentials
Open `test-data/users.json` and update:

```json
"gillette-dev": {
  "username": "your-qa-username",
  "password": "encrypted:PASTE_YOUR_ENCRYPTED_PASSWORD_HERE",
  "pingId": "your-ping-id",
  "isEncrypted": true
}
```

### Step 4: Run Tests
```bash
# Run all tests
npm run test:gillette

# Run with browser visible
npm run test:gillette:headed

# Run in debug mode
npm run test:gillette:debug
```

### Step 5: View Results
```bash
# Open HTML report
npm run report
```

---

## 📋 Test Cases Coverage

| TC | Test Case | Status | Description |
|----|-----------|--------|-------------|
| TC1 | Page Check | ✅ | Verifies all sections are visible |
| TC2 | Banner Section | ✅ | Validates banner content and colors |
| TC3 | Face & Body Section | ✅ | Tests navigation CTAs |
| TC4 | Product Parts | ✅ | Verifies interactive features |
| TC5 | Our Products | ✅ | Tests carousel functionality |
| TC6 | SEO | ✅ | Validates meta tags |
| TC7 | UI Alignment | ✅ | Visual verification |
| TC8 | Image Alt Text | ✅ | Accessibility check |

---

## 🎯 Common Commands

```bash
# Run specific test case
npx playwright test --grep "TC1"
npx playwright test --grep "TC2"
# ... etc

# Run with specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox

# Run in headed mode (see browser)
npm run test:gillette:headed

# Debug mode (step through tests)
npm run test:gillette:debug

# Update snapshots
npx playwright test --update-snapshots

# Show test report
npm run report
```

---

## 📸 Screenshots & Reports

### Screenshots Location
- **Success**: `test-results/screenshots/tc*.png`
- **Failures**: `test-results/screenshots/failure-*.png`

### Reports Location
- **HTML Report**: `test-results/reports/[TIMESTAMP]/index.html`
- **Artifacts**: `test-results/gillette-artifacts/[TIMESTAMP]/`

---

## 🔧 Troubleshooting

### ❌ Authentication Failed
**Problem**: Tests fail with 401/403 errors

**Solution**:
1. Verify username in `test-data/users.json`
2. Re-encrypt password: `node scripts/encryptPassword.js "YourPassword"`
3. Update the encrypted password in `users.json`
4. Ensure `isEncrypted: true` is set

### ❌ Element Not Found
**Problem**: Tests fail with "locator not found"

**Solution**:
1. Run in headed mode to see what's happening: `npm run test:gillette:headed`
2. Update locators in `pages/gilletteLabsPage.js`
3. Increase timeout if page is slow to load

### ❌ Timeout Errors
**Problem**: Tests timeout waiting for elements

**Solution**:
1. Increase timeout in `playwright.config.js`:
   ```javascript
   timeout: 300000, // 5 minutes
   ```
2. Add explicit waits in test:
   ```javascript
   await page.waitForTimeout(2000);
   ```

### ❌ Network Issues
**Problem**: Tests fail due to slow network

**Solution**:
1. Increase `navigationTimeout` in config:
   ```javascript
   navigationTimeout: 60000, // 1 minute
   ```
2. Disable video recording for faster execution

---

## 🎨 Test Execution Tips

### 1. Run Smoke Test First
```bash
npx playwright test --grep "smoke test"
```
This runs all validations quickly to ensure basic functionality.

### 2. Run Individual TCs for Debugging
```bash
npx playwright test --grep "TC1"  # Page check
npx playwright test --grep "TC3"  # Face & Body section
```

### 3. Use Debug Mode for Development
```bash
npm run test:gillette:debug
```
- Step through tests line by line
- Inspect elements in real-time
- Modify locators on the fly

### 4. View Live Browser
```bash
npm run test:gillette:headed
```
Watch the browser as tests execute.

---

## 📊 Understanding Test Results

### ✅ Passed Test
```
✓ TC1: Verify all page sections are visible (15s)
```

### ❌ Failed Test
```
✗ TC1: Verify all page sections are visible (15s)
  Error: locator.waitFor: Timeout 5000ms exceeded
```

### 📸 Screenshots
- Automatically captured on failure
- Saved to `test-results/screenshots/`
- Named with test case and timestamp

### 🎥 Videos
- Recorded on failure (if enabled)
- Saved to `test-results/gillette-artifacts/`
- Can be disabled in config for faster execution

---

## 🔄 CI/CD Integration

### GitHub Actions
Create `.github/workflows/gillette-tests.yml`:

```yaml
name: Gillette Labs Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run Gillette Labs tests
        run: npm run test:gillette
        env:
          GILLETTE_USERNAME: ${{ secrets.GILLETTE_USERNAME }}
          GILLETTE_PASSWORD: ${{ secrets.GILLETTE_PASSWORD }}
          GILLETTE_PING_ID: ${{ secrets.GILLETTE_PING_ID }}
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

---

## 📝 Best Practices

### ✅ DO:
- Run tests in CI/CD pipeline
- Review failure screenshots
- Keep credentials encrypted
- Update locators when UI changes
- Add new tests for new features

### ❌ DON'T:
- Commit unencrypted passwords
- Ignore flaky tests
- Skip test documentation
- Run tests directly in production
- Modify page objects without testing

---

## 🆘 Getting Help

1. **Check Logs**: Review console output for errors
2. **Check Screenshots**: Look at `test-results/screenshots/`
3. **Run in Debug Mode**: Use `npm run test:gillette:debug`
4. **Check Documentation**: Read `GILLETTE_LABS_README.md`
5. **Playwright Docs**: https://playwright.dev/

---

## 📞 Support Contact

For technical issues or questions:
- Review test documentation in `GILLETTE_LABS_README.md`
- Check Playwright documentation
- Contact the test automation team

---

**Last Updated**: January 18, 2026
