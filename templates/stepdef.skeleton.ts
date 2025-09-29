/**
 * Skeleton step definitions for Cucumber + Playwright.
 * Replace TODOs with your real locators and business logic.
 */
import { Given, When, Then } from '@cucumber/cucumber';

Given('I am on the {string} page', async function(pageName: string) {
  // TODO: navigate using a page object
  await this.page.goto('https://example.com');
});

When('I perform the primary action', async function() {
  // TODO: perform an action, e.g. click a CTA
  await this.page.click('[data-test-id="primary-cta"]');
});

Then('I should see a success message', async function() {
  // TODO: assert a visible element
  const locator = this.page.locator('[data-test-id="success"]');
  if (!(await locator.isVisible())) {
    throw new Error('Expected success message to be visible');
  }
});
