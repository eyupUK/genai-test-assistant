import { Page, expect } from '@playwright/test';

/**
 * Base Page Object class that all page objects should extend.
 * Provides common functionality and consistent patterns.
 */
export abstract class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a specific URL
     * @param url - The URL to navigate to
     */
    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * Wait for the page to be loaded (override in child classes)
     */
    abstract waitForPageLoad(): Promise<void>;

    /**
     * Get the page title
     */
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * Take a screenshot
     * @param name - Screenshot name
     */
    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `screenshots/${name}.png` });
    }

    /**
     * Wait for an element to be visible
     * @param selector - Element selector
     * @param timeout - Optional timeout in milliseconds
     */
    async waitForElement(selector: string, timeout = 30000): Promise<void> {
        await this.page.locator(selector).waitFor({ 
            state: 'visible', 
            timeout 
        });
    }

    /**
     * Scroll element into view
     * @param selector - Element selector
     */
    async scrollIntoView(selector: string): Promise<void> {
        await this.page.locator(selector).scrollIntoViewIfNeeded();
    }
}