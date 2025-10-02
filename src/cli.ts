#!/usr/bin/env tsx
import "dotenv/config";
import { Command } from "commander";
import { generateGherkin } from "./features/generateGherkin.js";
import { synthesizeData } from "./features/synthesizeData.js";
import { summarizeFailures } from "./features/summarizeFailures.js";
import { runTests, setupTestEnvironment } from "./features/runTests.js";

const program = new Command();
program.name("genai-test-assistant").description("GenAI helpers for QA").version("0.1.0");

program.command("gherkin")
  .requiredOption("--story <path>", "Path to user story/AC markdown")
  .requiredOption("--out <dir>", "Output base directory (will create api/ or ui/ subdirectories)")
  .option("--provider <provider>", "AI provider to use (openai, claude)", process.env.LLM_PROVIDER || "openai")
  .option("--model <model>", "Specific model to use (optional)")
  .action(async (o) => {
    const res = await generateGherkin(o.story, o.out, { provider: o.provider, model: o.model });
    const { readFileSync } = await import('fs');
    const storyCode = readFileSync(o.story, 'utf8').split('\n')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const outputPath = `${o.out}/${res.test_type}/${storyCode}`;
    console.log(`🎯 Generated ${res.test_type.toUpperCase()} test files in: ${outputPath}`);
    console.log(`📁 Files created: ${Object.keys(res).filter(key => !['isApiTest', 'isUiTest', 'test_type'].includes(key)).join(', ')}`);
  });

program.command("data")
  .requiredOption("--schema <path>", "Path to JSON Schema file")
  .option("--n <num>", "Number of items", "20")
  .requiredOption("--out <file>", "Output JSON file")
  .option("--provider <provider>", "AI provider to use (openai, claude)", process.env.LLM_PROVIDER || "openai")
  .option("--model <model>", "Specific model to use (optional)")
  .action(async (o) => {
    const res = await synthesizeData(o.schema, Number(o.n), o.out);
    console.log("Data synthesis:", res);
  });

program.command("triage")
  .requiredOption("--log <path>", "Path to failure log")
  .requiredOption("--out <file>", "Output Markdown file")
  .option("--provider <provider>", "AI provider to use (openai, claude)", process.env.LLM_PROVIDER || "openai")
  .option("--model <model>", "Specific model to use (optional)")
  .action(async (o) => {
    const res = await summarizeFailures(o.log, o.out);
    console.log("Triage summary written:", res);
  });

program.command("test")
  .requiredOption("--dir <path>", "Directory containing generated test files")  
  .option("--browser <browser>", "Browser to use (chromium, firefox, webkit)", "chromium")
  .option("--headless <bool>", "Run in headless mode", "true")
  .option("--setup", "Setup test environment before running")
  .action(async (o) => {
    try {
      if (o.setup) {
        await setupTestEnvironment(o.dir);
      }
      const headless = o.headless === "true";
      const result = await runTests(o.dir, o.browser, headless);
      
      console.log("\\n📊 Test Summary:");
      console.log(`✅ Passed: ${result.testsPassed}`);
      console.log(`❌ Failed: ${result.testsFailed}`);
      console.log(`⏱️  Duration: ${result.duration}ms`);
      
      process.exit(result.success ? 0 : 1);
    } catch (error) {
      console.error("❌ Test execution failed:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.command("run")
  .requiredOption("--story <path>", "Path to user story/AC markdown")
  .option("--browser <browser>", "Browser to use (chromium, firefox, webkit)", "chromium")
  .option("--headless <bool>", "Run in headless mode", "true")
  .action(async (o) => {
    try {
      const { generateAndRunTests } = await import("./features/runTests.js");
      const headless = o.headless === "true";
      const result = await generateAndRunTests(o.story, o.browser, headless);
      
      console.log("\\n📊 End-to-End Test Summary:");
      console.log(`✅ Passed: ${result.testsPassed}`);
      console.log(`❌ Failed: ${result.testsFailed}`);
      console.log(`⏱️  Duration: ${result.duration}ms`);
      
      process.exit(result.success ? 0 : 1);
    } catch (error) {
      console.error("❌ Generate and run failed:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.command("reports")
  .requiredOption("--dir <path>", "Directory containing test reports")
  .option("--type <type>", "Report type to open (summary, basic, html, json)", "summary")
  .action(async (o) => {
    const { exec } = await import('child_process');
    const reportsDir = `${o.dir}/reports`;
    
    let reportFile = '';
    switch (o.type) {
      case 'summary':
        reportFile = 'summary.html';
        break;
      case 'basic':
        reportFile = 'basic-report.html';
        break;
      case 'html':
        reportFile = 'cucumber-report.html';
        break;
      case 'json':
        reportFile = 'cucumber-report.json';
        break;
      default:
        reportFile = 'summary.html';
    }
    
    const reportPath = `${reportsDir}/${reportFile}`;
    console.log(`📊 Opening ${o.type} report: ${reportPath}`);
    
    // Open report in default browser
    let command = '';
    if (process.platform === 'darwin') {
      command = 'open';
    } else if (process.platform === 'win32') {
      command = 'start';
    } else {
      command = 'xdg-open';
    }
    
    exec(`${command} "${reportPath}"`, (error) => {
      if (error) {
        console.error(`❌ Failed to open report: ${error.message}`);
        console.log(`📁 Manual path: ${reportPath}`);
      } else {
        console.log("✅ Report opened in browser");
      }
    });
  });

program.parseAsync();
