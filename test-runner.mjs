#!/usr/bin/env node

// Simple test runner for generated scenarios
import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

const testType = process.argv[2] || 'api'; // 'api' or 'ui'
const testDir = join(process.cwd(), 'out', testType);

console.log(`🔍 Looking for ${testType} tests in: ${testDir}`);

if (!existsSync(testDir)) {
  console.log(`❌ No ${testType} tests found. Run 'npm run gherkin' first.`);
  process.exit(1);
}

// Find all test directories
const testDirs = readdirSync(testDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

if (testDirs.length === 0) {
  console.log(`❌ No test directories found in ${testDir}`);
  process.exit(1);
}

console.log(`✅ Found ${testDirs.length} test suite(s)`);

// Run tests using tsx directly (simpler than Cucumber for now)
for (const dir of testDirs) {
  const testPath = join(testDir, dir);
  const featureFile = join(testPath, 'generated.feature');
  const stepsFile = join(testPath, 'steps.generated.ts');
  
  if (existsSync(featureFile) && existsSync(stepsFile)) {
    console.log(`\n🧪 Running tests in: ${dir}`);
    console.log(`📋 Feature: ${featureFile}`);
    console.log(`⚙️  Steps: ${stepsFile}`);
    
    // For now, just validate the files exist and can be compiled
    try {
      execSync(`npx tsc --noEmit ${stepsFile}`, { stdio: 'inherit' });
      console.log('✅ TypeScript compilation successful');
    } catch (error) {
      console.log('❌ TypeScript compilation failed');
      console.error(error.message);
    }
  }
}

console.log('\n📊 Test discovery completed');
console.log('💡 Full Cucumber execution coming soon - files are ready!');