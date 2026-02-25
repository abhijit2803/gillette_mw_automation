// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { getBaseUrlForEnvironment } from './utils/helper.js';

// Dynamic base URL configuration
const PROD_BASE_URL = getBaseUrlForEnvironment('prod');
const STAGE_BASE_URL = getBaseUrlForEnvironment('qa');

// Timestamp helper for report folders - generates fresh timestamp for each test run
const getTimestamp = () => {
  const now = new Date();
  // @ts-ignore
  const pad = (n) => String(n).padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${pad(now.getDate())}-${months[now.getMonth()]}-${now.getFullYear()}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
};

// Generate timestamp for this run
const runTimestamp = getTimestamp();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Default artifacts output directory (can be overridden per-project)
  outputDir: `./test-results/default-artifacts/${runTimestamp}`,
  testDir: './tests',
  /* Run tests in files sequentially (one by one) */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Use single worker to run tests one by one in same browser */
  workers: 1,
  /* Global timeout for each test */
  timeout: 120000,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', {
      outputFolder: `./test-results/reports/${runTimestamp}`,
      open: 'never'
    }],
    ['list', { printSteps: true }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Run tests in headed mode (non-headless) to see the browser */
    headless: false,
    
    /* Laptop-friendly viewport size */
    viewport: { width: 1366, height: 768 },
    
    /* Slow down operations for better visibility */
    slowMo: 500,
    /* Default baseURL: use production by default. Project configs may override this. */
    baseURL: PROD_BASE_URL,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Gillette-Tests',
      testMatch: ['**/navigation.spec.js', '**/rating-system.spec.js', '**/form-input.spec.js', '**/form-validation.spec.js', '**/e2e-review-submission.spec.js'],
      outputDir: `./test-results/gillette-artifacts/${runTimestamp}`,
      use: { 
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        channel: 'msedge',
        headless: false,
        slowMo: 500,
        actionTimeout: 20000,
        navigationTimeout: 30000,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
      },
      timeout: 180000,
      retries: 0
    },
    {
      name: 'Homepage-Tests',
      testMatch: ['**/homepage.spec.js'],
      outputDir: `./test-results/homepage-artifacts/${runTimestamp}`,
      use: { 
        baseURL: 'https://www.gillette.de/de-de',
        browserName: 'chromium',
        channel: 'chrome',
        headless: false,
        viewport: { width: 1366, height: 768 },
        screen: { width: 1366, height: 768 },
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        actionTimeout: 30000,
        navigationTimeout: 45000,
        trace: 'on',
        screenshot: 'on',
        video: 'on',
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled',
            '--window-size=1366,768',
            '--force-device-scale-factor=1',
            '--high-dpi-support=1',
            '--disable-dev-shm-usage',
            '--no-sandbox'
          ],
          ignoreDefaultArgs: ['--enable-automation']
        }
      },
      timeout: 180000,
      retries: 0
    },
    {
      name: 'PLP-Tests',
      testMatch: ['**/plp.spec.js'],
      outputDir: `./test-results/plp-artifacts/${runTimestamp}`,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.gillette.de/de-de',
        browserName: 'chromium',
        channel: 'msedge',
        headless: false,
        slowMo: 500,
        actionTimeout: 20000,
        navigationTimeout: 30000,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        launchOptions: {
          args: ['--start-maximized', '--disable-blink-features=AutomationControlled']
        }
      },
      timeout: 180000,
      retries: 0
    },
    {
      name: 'Categorized-PLP-Tests',
      testMatch: ['**/categorizedplp.spec.js'],
      outputDir: `./test-results/categorized-plp-artifacts/${runTimestamp}`,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.gillette.de/de-de',
        browserName: 'chromium',
        channel: 'chrome', // Use Google Chrome instead of Edge
        headless: false,
        slowMo: 1000,
        actionTimeout: 20000,
        navigationTimeout: 30000,
        trace: 'on',
        screenshot: 'on',
        video: 'on',
        launchOptions: {
          args: [
            '--start-maximized',
            '--disable-blink-features=AutomationControlled',
            '--window-position=0,0',
            '--window-size=1920,1080',
            '--force-device-scale-factor=1',
            '--high-dpi-support=1',
            '--disable-infobars'
          ]
        }
      },
      timeout: 180000,
      retries: 0
    },
    {
      name: 'Desktop-Prod',
      testMatch: ['**/login.spec.js'],
      outputDir: `./test-results/prod-artifacts/${runTimestamp}`,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: PROD_BASE_URL,
        browserName: 'chromium',
        channel: 'msedge', // Use Microsoft Edge
        actionTimeout: 20000,
        navigationTimeout: 30000,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
      },
      timeout: 300000, // 5 minutes for prod tests
      retries: 0
    },
    {
      name: 'Mobile-Prod',
      testMatch: ['**/login.spec.js'],
      outputDir: `./test-results/prod-artifacts/${runTimestamp}`,
      use: { 
        ...devices['Pixel 5'],
        baseURL: PROD_BASE_URL,
        actionTimeout: 20000,
        navigationTimeout: 30000,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
      },
      timeout: 300000, // 5 minutes for prod tests
      retries: 0
    },
     {
      name: 'Desktop-Stage',
      testMatch: ['**/login.spec.js'],
      outputDir: `./test-results/qa-artifacts/${runTimestamp}`,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: STAGE_BASE_URL,
        actionTimeout: 20000,
        navigationTimeout: 30000,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
      },
      timeout: 300000, // 5 minutes for stage tests
      retries: 0
    },
    {
      name: 'Mobile-Stage',
      testMatch: ['**/login.spec.js'],
      outputDir: `./test-results/qa-artifacts/${runTimestamp}`,
      use: { 
        ...devices['Pixel 5'],
        baseURL: STAGE_BASE_URL,
        actionTimeout: 20000,
        navigationTimeout: 30000,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
      },
      timeout: 300000, // 5 minutes for stage tests
      retries: 0
    }




    /* Test against branded browsers - Using Google Chrome */
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
  
  /* Global expect timeout */
  expect: {
    timeout: 10000 // Increased for profile verification
  },
  
  /* Global timeout settings */
  globalTimeout: 3600000 // 1 hour for both environments
});

