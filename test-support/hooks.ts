import { BeforeAll, AfterAll, Before, After, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world.js';

// Global setup - runs once before all scenarios
BeforeAll(async function () {
  console.log('🚀 Starting test suite...');
  
  // Ensure reports directory exists
  const fs = await import('fs');
  const path = await import('path');
  
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
});

// Global teardown - runs once after all scenarios
AfterAll(async function () {
  console.log('✅ Test suite completed');
});

// Scenario setup - runs before each scenario
Before(async function (this: CustomWorld) {
  // Initialize browser and context for each scenario
  await this.init();
});

// Scenario teardown - runs after each scenario
After(async function (this: CustomWorld, scenario) {
  // Take screenshot on failure
  if (scenario.result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({
      path: `reports/screenshots/failed-${Date.now()}.png`,
      fullPage: true
    });
    
    // Attach screenshot to scenario (for reporting)
    this.attach(screenshot, 'image/png');
  }
  
  // Clean up browser resources
  await this.cleanup();
});