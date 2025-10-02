import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page, APIRequestContext } from '@playwright/test';

export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: string };
}

export class CustomWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  public request!: APIRequestContext;
  
  constructor(options: IWorldOptions) {
    super(options);
  }

  async init() {
    // Initialize browser for UI tests
    this.browser = await chromium.launch({
      headless: process.env.HEADLESS !== 'false',
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
    });
    
    this.context = await this.browser.newContext({
      // Add any default context options here
      viewport: { width: 1280, height: 720 },
      acceptDownloads: true,
      recordVideo: process.env.RECORD_VIDEO === 'true' ? { dir: 'reports/videos' } : undefined
    });
    
    this.page = await this.context.newPage();
    
    // Initialize API request context
    this.request = await this.context.request;
  }

  async cleanup() {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);