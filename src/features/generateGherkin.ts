import { readFileSync } from "fs";
import { llmJson, LLMConfig } from "../ai/llm.js";
import { writeOut } from "../utils/io.js";
import path from "path";

export async function generateGherkin(storyPath: string, outDir: string, config?: LLMConfig) {
  const story = readFileSync(storyPath, "utf8");
  
  // Dynamic schema based on test type detection
  const schema = {
    type: "object",
    required: ["test_type", "feature_text", "steps_ts"],
    properties: {
      test_type: { type: "string", enum: ["api", "ui"] },
      feature_text: { type: "string" },
      steps_ts: { type: "string" },
      pages_ts: { type: "string" }
    }
  };
  
  const system = readFileSync("src/ai/prompts/gherkin.md", "utf8");
  const user = `USER STORY & AC:\n\n${story}\n\nFollow the instructions strictly.`;

  const result = await llmJson(system, user, schema, config);
  
  // Add error handling for undefined results
  if (!result.feature_text || !result.steps_ts || !result.test_type) {
    console.error("AI response missing required fields:", result);
    throw new Error("AI failed to generate required feature_text, steps_ts, and test_type");
  }

  const isApiTest = result.test_type === "api";
  const isUiTest = result.test_type === "ui";

  // Validate that UI tests have pages_ts
  if (isUiTest && !result.pages_ts) {
    console.error("UI test missing pages_ts:", result);
    throw new Error("UI test requires pages_ts field");
  }

  const storyCode = story.split("\n")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  // Create separate directories for API and UI tests
  const typeDir = isApiTest ? "api" : "ui";
  const testDir = path.join(outDir, typeDir, storyCode);

  console.log(`🔍 Detected test type: ${result.test_type.toUpperCase()}`);
  console.log(`📁 Output directory: ${typeDir}/${storyCode}`);
  
  writeOut(path.join(testDir, "generated.feature"), result.feature_text);
  writeOut(path.join(testDir, "steps.generated.ts"), result.steps_ts);
  
  // Only generate pages for UI tests
  if (isUiTest && result.pages_ts) {
    writeOut(path.join(testDir, "pages.generated.ts"), result.pages_ts);
    console.log("✅ Page Object Model: pages.generated.ts");
  }
  
  // Log what was generated
  console.log("✅ Feature file: generated.feature");
  console.log("✅ Step definitions: steps.generated.ts");
  if (isApiTest) {
    console.log("ℹ️  No POM files generated (API test detected)");
  }
  
  return { ...result, isApiTest, isUiTest };
}
