import { spawn } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { writeOut } from "../utils/io.js";
import { generateReports } from "../utils/reportGenerator.js";

export interface TestRunResult {
  success: boolean;
  output: string;
  duration: number;
  testsPassed: number;
  testsFailed: number;
}

export async function runTests(
  testDir: string, 
  browser = "chromium", 
  headless = true
): Promise<TestRunResult> {
  const startTime = Date.now();
  
  // Verify test directory exists
  if (!existsSync(testDir)) {
    throw new Error(`Test directory not found: ${testDir}`);
  }

  // Check for required files
  const featureFile = path.join(testDir, "generated.feature");
  const stepsFile = path.join(testDir, "steps.generated.ts");
  const pagesFile = path.join(testDir, "pages.generated.ts");

  const missingFiles = [];
  if (!existsSync(featureFile)) missingFiles.push("generated.feature");
  if (!existsSync(stepsFile)) missingFiles.push("steps.generated.ts");
  
  // Page objects are optional (not needed for API tests)
  const hasPageObjects = existsSync(pagesFile);

  if (missingFiles.length > 0) {
    throw new Error(`Missing required files: ${missingFiles.join(", ")}`);
  }

  console.log(`📋 Test type: ${hasPageObjects ? "UI" : "API"} (${hasPageObjects ? "with" : "without"} page objects)`);
  

  console.log("🎭 Starting Playwright + Cucumber test execution...");
  console.log(`📁 Test directory: ${testDir}`);
  console.log(`🌍 Browser: ${browser}`);
  console.log(`👁️  Headless: ${headless}`);

  // Setup test environment
  await setupTestEnvironment(testDir);

  return new Promise((resolve) => {
    // Create cucumber command arguments - updated for ES modules
    const cucumberArgs = [
      "cucumber-js",
      featureFile,
      "--import", "tsx/esm",
      "--require", stepsFile,
      "--format", "progress",
      "--format", "json:reports/cucumber-report.json",
      "--format", "html:reports/cucumber-report.html"
    ];

    // Set environment variables for Playwright
    const env = {
      ...process.env,
      BROWSER: browser,
      HEADLESS: headless.toString(),
      NODE_OPTIONS: "--import tsx/esm"
    };

    console.log("🚀 Running command:", `npx ${cucumberArgs.join(" ")}`);

    const cucumberProcess = spawn("npx", cucumberArgs, {
      cwd: testDir,
      env,
      stdio: "pipe"
    });

    let output = "";
    let errorOutput = "";

    cucumberProcess.stdout?.on("data", (data) => {
      const chunk = data.toString();
      output += chunk;
      console.log(chunk);
    });

    cucumberProcess.stderr?.on("data", (data) => {
      const chunk = data.toString();
      errorOutput += chunk;
      console.error(chunk);
    });

    cucumberProcess.on("close", async (code) => {
      const duration = Date.now() - startTime;
      const success = code === 0;
      const fullOutput = output + (errorOutput ? `\\n--- ERRORS ---\\n${errorOutput}` : "");
      
      // Parse test results if available
      let testsPassed = 0;
      let testsFailed = 0;
      
      try {
        const resultsPath = path.join(testDir, "reports", "cucumber-report.json");
        if (existsSync(resultsPath)) {
          const results = JSON.parse(readFileSync(resultsPath, "utf8"));
          // Parse Cucumber JSON results
          results.forEach((feature: any) => {
            feature.elements?.forEach((scenario: any) => {
              if (scenario.steps?.every((step: any) => step.result?.status === "passed")) {
                testsPassed++;
              } else {
                testsFailed++;
              }
            });
          });
        }
      } catch (error) {
        console.warn("Could not parse test results:", error);
      }
      
      console.log(success ? "✅ Tests completed successfully!" : "❌ Tests failed!");
      console.log(`📊 Exit code: ${code}`);
      console.log(`⏱️  Duration: ${duration}ms`);
      console.log(`✅ Passed: ${testsPassed}`);
      console.log(`❌ Failed: ${testsFailed}`);
      
      // Generate HTML reports
      try {
        const testType = hasPageObjects ? 'ui' : 'api';
        await generateReports({
          testDir,
          projectName: 'GenAI Test Assistant',
          browser,
          testType
        });
      } catch (error) {
        console.warn("⚠️  Report generation failed:", error instanceof Error ? error.message : error);
      }
      
      resolve({
        success,
        output: fullOutput,
        duration,
        testsPassed,
        testsFailed
      });
    });

    cucumberProcess.on("error", (error) => {
      console.error("❌ Failed to start test process:", error.message);
      resolve({
        success: false,
        output: `Process error: ${error.message}\\n${output}\\n${errorOutput}`,
        duration: Date.now() - startTime,
        testsPassed: 0,
        testsFailed: 1
      });
    });
  });
}

export async function setupTestEnvironment(testDir: string): Promise<void> {
  console.log("🔧 Setting up test environment...");
  
  // Create reports directory
  const reportsDir = path.join(testDir, "reports");
  writeOut(path.join(reportsDir, ".gitkeep"), "");
  
  // Create cucumber configuration for ES modules with comprehensive reporting
  const cucumberConfigPath = path.join(testDir, "cucumber.js");
  const cucumberConfig = `
const config = {
  default: {
    paths: ['generated.feature'],
    import: ['tsx/esm'],
    require: ['steps.generated.ts', 'support/**/*.ts'],
    format: [
      'progress',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
      'junit:reports/cucumber-report.xml'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    parallel: 1
  }
};

export default config;
`.trim();
  
  writeOut(cucumberConfigPath, cucumberConfig);
  console.log("📝 Created cucumber.js configuration");
  console.log("📁 Created reports directory");

  // Create support directory with world setup
  const supportDir = path.join(testDir, "support");
  const worldPath = path.join(supportDir, "world.ts");
  
  const worldContent = `
import { Before, After, setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';

export class PlaywrightWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init(): Promise<void> {
    const browserType = process.env.BROWSER || 'chromium';
    const headless = process.env.HEADLESS !== 'false';

    // Launch browser based on environment variable
    switch (browserType) {
      case 'firefox':
        this.browser = await firefox.launch({ headless });
        break;
      case 'webkit':
        this.browser = await webkit.launch({ headless });
        break;
      case 'chromium':
      default:
        this.browser = await chromium.launch({ headless });
        break;
    }

    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true
    });

    this.page = await this.context.newPage();
  }

  async cleanup(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(PlaywrightWorld);

// Hooks
Before(async function (this: PlaywrightWorld) {
  await this.init();
});

After(async function (this: PlaywrightWorld) {
  await this.cleanup();
});
`.trim();

  writeOut(worldPath, worldContent);
  console.log("📝 Created Playwright world context");

  // Create tsconfig for the test directory
  const tsconfigPath = path.join(testDir, "tsconfig.json");
  const tsconfigContent = `
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["node", "@cucumber/cucumber", "playwright"]
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
`.trim();

  writeOut(tsconfigPath, tsconfigContent);
  console.log("📝 Created TypeScript configuration");

  console.log("✅ Test environment ready!");
}

export async function generateAndRunTests(
  storyPath: string, 
  browser = "chromium", 
  headless = true
): Promise<TestRunResult> {
  console.log("🚀 Generate and Run workflow starting...");
  
  // Generate tests first
  const { generateGherkin } = await import("./generateGherkin.js");
  const baseDir = "out";
  
  console.log("📝 Generating tests...");
  const result = await generateGherkin(storyPath, baseDir);
  console.log("✅ Tests generated successfully!");
  
  // Determine the actual test directory based on test type
  const { readFileSync } = await import("fs");
  const story = readFileSync(storyPath, "utf8");
  const storyCode = story.split("\n")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const typeDir = result.isApiTest ? "api" : "ui";
  const actualTestDir = path.join(baseDir, typeDir, storyCode);
  
  console.log(`🎭 Running generated ${typeDir.toUpperCase()} tests from: ${actualTestDir}`);
  return await runTests(actualTestDir, browser, headless);
}