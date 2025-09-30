import { readFileSync } from "fs";
import { llmJson } from "../ai/llm.js";
import { writeOut } from "../utils/io.js";
import path from "path";

export async function generateGherkin(storyPath: string, outDir: string) {
  const story = readFileSync(storyPath, "utf8");
  const schema = {
    type: "object",
    required: ["feature_text", "steps_ts", "pages_ts"],
    properties: {
      feature_text: { type: "string" },
      steps_ts: { type: "string" },
      pages_ts: { type: "string" }
    }
  };
  const system = readFileSync("src/ai/prompts/gherkin.md", "utf8");
  const user = `USER STORY & AC:\n\n${story}\n\nFollow the instructions strictly.`;

  const result = await llmJson(system, user, schema);
  
  // Add error handling for undefined results
  if (!result.feature_text || !result.steps_ts || !result.pages_ts) {
    console.error("AI response missing required fields:", result);
    throw new Error("AI failed to generate required feature_text, steps_ts, and pages_ts");
  }

  const storyCode = story.split("\n")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-");

  writeOut(path.join(outDir + "/" + storyCode,  "generated.feature"), result.feature_text);
  writeOut(path.join(outDir + "/" + storyCode,  "steps.generated.ts"), result.steps_ts);
  writeOut(path.join(outDir + "/" + storyCode,  "pages.generated.ts"), result.pages_ts);
  return result;
}
