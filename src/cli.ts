#!/usr/bin/env tsx
import "dotenv/config";
import { Command } from "commander";
import { generateGherkin } from "./features/generateGherkin.js";
import { synthesizeData } from "./features/synthesizeData.js";
import { summarizeFailures } from "./features/summarizeFailures.js";

const program = new Command();
program.name("genai-test-assistant").description("GenAI helpers for QA").version("0.1.0");

program.command("gherkin")
  .requiredOption("--story <path>", "Path to user story/AC markdown")
  .requiredOption("--out <dir>", "Output directory for feature & steps")
  .action(async (o) => {
    const res = await generateGherkin(o.story, o.out);
    console.log("Gherkin generated:", Object.keys(res));
  });

program.command("data")
  .requiredOption("--schema <path>", "Path to JSON Schema file")
  .option("--n <num>", "Number of items", "20")
  .requiredOption("--out <file>", "Output JSON file")
  .action(async (o) => {
    const res = await synthesizeData(o.schema, Number(o.n), o.out);
    console.log("Data synthesis:", res);
  });

program.command("triage")
  .requiredOption("--log <path>", "Path to failure log")
  .requiredOption("--out <file>", "Output Markdown file")
  .action(async (o) => {
    const res = await summarizeFailures(o.log, o.out);
    console.log("Triage summary written:", res);
  });

program.parseAsync();
