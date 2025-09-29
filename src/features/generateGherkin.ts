import { readFileSync } from "fs";
import { llmJson } from "../ai/llm.js";
import { writeOut } from "../utils/io.js";
import path from "path";

export async function generateGherkin(storyPath: string, outDir: string) {
  const story = readFileSync(storyPath, "utf8");
  const schema = {
    type: "object",
    required: ["feature_text", "steps_ts"],
    properties: {
      feature_text: { type: "string" },
      steps_ts: { type: "string" }
    }
  };
  const system = readFileSync("src/ai/prompts/gherkin.md", "utf8");
  const user = `USER STORY & AC:\n\n${story}\n\nFollow the instructions strictly.`;

  const result = await llmJson(system, user, schema);
  writeOut(path.join(outDir, "generated.feature"), result.feature_text);
  writeOut(path.join(outDir, "steps.generated.ts"), result.steps_ts);
  return result;
}
