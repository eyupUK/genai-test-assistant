import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');
  
  // Clean up any temporary files or resources
  console.log('📊 Test execution completed');
  
  // Optional: Generate consolidated reports
  const fs = await import('fs');
  const path = await import('path');
  
  const reportsDir = path.join(process.cwd(), 'reports');
  if (fs.existsSync(reportsDir)) {
    const files = fs.readdirSync(reportsDir);
    console.log(`📁 Generated reports: ${files.length} files in reports/`);
  }
  
  console.log('✅ Global teardown completed');
}

export default globalTeardown;