import { readFileSync } from "fs";
import { llmJson } from "../ai/llm.js";
import { writeOut } from "../utils/io.js";

export async function summarizeFailures(logPath: string, outFile: string) {
  const log = readFileSync(logPath, "utf8");
  const system = readFileSync("src/ai/prompts/triage.md", "utf8");
  const user = `Analyze this log and produce the required Markdown sections.\n\nLOG:\n${log}`;

  const schema = {
    type: "object",
    required: ["markdown"],
    properties: { markdown: { type: "string" } }
  };

  const result = await llmJson(system, user, schema);
  const md = typeof result === "string" ? result : (result.markdown || result.output || "# No output");
  writeOut(outFile, md);
  return { bytes: md.length };
}
