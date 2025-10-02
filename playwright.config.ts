import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './out',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'reports/playwright-report' }],
    ['json', { outputFile: 'reports/playwright-results.json' }],
    ['junit', { outputFile: 'reports/playwright-results.xml' }],
    ['list']
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Screenshot settings */
    screenshot: 'only-on-failure',
    
    /* Video settings */
    video: 'retain-on-failure',
    
    /* API request settings */
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'User-Agent': 'GenAI-Test-Assistant/1.0'
    }
  },

  /* Configure projects for major browsers and API testing */
  projects: [
    // API Testing Project
    {
      name: 'api-tests',
      testDir: './out/api',
      use: {
        baseURL: 'https://api.weatherapi.com',
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'User-Agent': 'GenAI-Test-Assistant-API/1.0'
        }
      },
    },

    // Desktop Browsers for UI tests
    {
      name: 'chromium-ui',
      testDir: './out/ui',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL || 'http://localhost:3000'
      },
    },

    // {
    //   name: 'firefox-ui',
    //   testDir: './out/ui', 
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     baseURL: process.env.BASE_URL || 'http://localhost:3000'
    //   },
    // },

    // {
    //   name: 'webkit-ui',
    //   testDir: './out/ui',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     baseURL: process.env.BASE_URL || 'http://localhost:3000'
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'mobile-chrome-ui',
    //   testDir: './out/ui',
    //   use: { 
    //     ...devices['Pixel 5'],
    //     baseURL: process.env.BASE_URL || 'http://localhost:3000'
    //   },
    // },
    
    // {
    //   name: 'mobile-safari-ui',
    //   testDir: './out/ui',
    //   use: { 
    //     ...devices['iPhone 12'],
    //     baseURL: process.env.BASE_URL || 'http://localhost:3000'
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: process.env.START_LOCAL_SERVER === 'true' ? {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  } : undefined,

  /* Global setup and teardown */
  globalSetup: './test-setup/global-setup.ts',
  globalTeardown: './test-setup/global-teardown.ts',
  
  /* Output directories */
  outputDir: './reports/test-results',
});