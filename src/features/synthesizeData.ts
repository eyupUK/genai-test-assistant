import { readFileSync } from "fs";
import Ajv from "ajv";
import { llmJson } from "../ai/llm.js";
import { writeOut } from "../utils/io.js";

export async function synthesizeData(schemaPath: string, n: number, outFile: string) {
  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  const prompt = readFileSync("src/ai/prompts/testdata.md", "utf8");
  const sys = "You are a data generator that strictly follows JSON Schemas.";
  const usr = `${prompt}\n\nSchema:\n${JSON.stringify(schema)}\n\nGenerate ${n} items.`;

  const result = await llmJson(sys, usr); // Expect an array
  const arr = Array.isArray(result) ? result : (Array.isArray(result.output) ? result.output : []);

  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const validItems: any[] = [];
  for (const item of arr) if (validate(item)) validItems.push(item);

  writeOut(outFile, JSON.stringify(validItems, null, 2));
  return { requested: n, generated: arr.length, valid: validItems.length };
}
