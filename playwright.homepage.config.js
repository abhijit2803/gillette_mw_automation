// Homepage Tests Configuration
// Extends the main playwright.config.js for homepage-specific tests

import { defineConfig, devices } from '@playwright/test';

// Timestamp for reports
const getTimestamp = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${pad(now.getDate())}-${months[now.getMonth()]}-${now.getFullYear()}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
};

const runTimestamp = getTimestamp();

export default defineConfig({
  testDir: './tests',
  testMatch: '**/homepage-*.spec.js',
  
  outputDir: `./test-results/homepage-artifacts/${runTimestamp}`,
  
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 120000,
  
  reporter: [
    ['html', {
      outputFolder: `./test-results/homepage-reports/${runTimestamp}`,
      open: 'never'
    }],
    ['list']
  ],
  
  use: {
    baseURL: 'https://www.gillette.de/de-de',
    headless: false,
    viewport: { width: 1366, height: 768 },
    slowMo: 500,
    actionTimeout: 20000,
    navigationTimeout: 30000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'Homepage-Tests-Edge',
      use: { 
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        channel: 'msedge',
      },
    },
  ],
});
