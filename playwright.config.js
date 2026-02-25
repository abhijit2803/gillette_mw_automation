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
  /* Use single worker to run tests one by one */
  workers: 1,
  /* Global timeout for each test */
  timeout: 120000,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', {
      outputFolder: `./test-results/reports/${runTimestamp}`,
      open: 'never'
    }]
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
    // Default Chromium project - matches all test files
    {
      name: 'chromium',
      testMatch: ['**/*.spec.js'],
      outputDir: `./test-results/default-artifacts/${runTimestamp}`,
      use: { 
        baseURL: 'https://www.gillette.de',
        browserName: 'chromium',
        actionTimeout: 20000,
        navigationTimeout: 30000,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        viewport: null, // Start maximized
        launchOptions: {
          args: ['--start-maximized']
        }
      },
      timeout: 1800000,
      retries: 0
    },

    // Article Listing Page Tests (specific project)
    {
      name: 'alp-chromium',
      testMatch: ['**/allArticlesALP.spec.js'],
      outputDir: `./test-results/alp-artifacts/${runTimestamp}`,
      use: { 
        baseURL: 'https://www.gillette.de',
        browserName: 'chromium',
        actionTimeout: 20000,
        navigationTimeout: 30000,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        viewport: null, // Start maximized
        launchOptions: {
          args: ['--start-maximized']
        }
      },
      timeout: 1200000,
      retries: 0
    },

    // Article Details Page Tests (ADP)
    {
      name: 'adp-chromium',
      testMatch: ['**/articlesADP.spec.js'],
      outputDir: `./test-results/adp-artifacts/${runTimestamp}`,
      use: { 
        baseURL: 'https://www.gillette.de',
        browserName: 'chromium',
        actionTimeout: 20000,
        navigationTimeout: 30000,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        viewport: null, // Start maximized
        launchOptions: {
          args: ['--start-maximized']
        }
      },
      timeout: 1200000,
      retries: 0
    },

    // Gels & Foams PDP Sanity Tests
    {
      name: 'gels-foams-chromium',
      testMatch: ['**/gelsAndFoamsPDP.spec.js'],
      outputDir: `./test-results/gels-foams-artifacts/${runTimestamp}`,
      use: { 
        baseURL: 'https://www.gillette.de',
        browserName: 'chromium',
        actionTimeout: 20000,
        navigationTimeout: 30000,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        viewport: null, // Start maximized
        launchOptions: {
          args: ['--start-maximized']
        }
      },
      timeout: 1800000, // 30 minutes - longer timeout for multiple products
      retries: 0
    },

    // Body & Intimate PDP Sanity Tests
    {
      name: 'body-intimate-chromium',
      testMatch: ['**/bodyIntimatePDP.spec.js'],
      outputDir: `./test-results/body-intimate-artifacts/${runTimestamp}`,
      use: { 
        baseURL: 'https://www.gillette.de',
        browserName: 'chromium',
        actionTimeout: 20000,
        navigationTimeout: 30000,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        viewport: null, // Start maximized
        launchOptions: {
          args: ['--start-maximized']
        }
      },
      timeout: 1800000, // 30 minutes - longer timeout for multiple products
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

