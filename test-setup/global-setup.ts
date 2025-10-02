import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');
  
  // Create reports directory if it doesn't exist
  const fs = await import('fs');
  const path = await import('path');
  
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
    console.log('📁 Created reports directory');
  }
  
  // Validate environment variables for API tests
  if (process.env.WEATHER_API_KEY) {
    console.log('✅ Weather API key found');
  } else {
    console.log('⚠️  Weather API key not found - API tests may fail');
    console.log('   Set WEATHER_API_KEY in your .env file');
  }
  
  // Test connectivity to API endpoints
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Test API connectivity
    const response = await page.request.get('https://api.weatherapi.com/v1/current.json?key=test&q=London');
    if (response.status() === 401 || response.status() === 403) {
      console.log('🌐 Weather API endpoint is reachable (auth required)');
    } else {
      console.log('🌐 Weather API endpoint connectivity test completed');
    }
    
    await browser.close();
  } catch (error) {
    console.log('⚠️  Could not test API connectivity:', error);
  }
  
  console.log('✅ Global setup completed');
}

export default globalSetup;