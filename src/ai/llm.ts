import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function llmJson(system: string, user: string, schema?: object): Promise<any> {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    response_format: schema
      ? { type: "json_schema", json_schema: { name: "schema", schema } as any }
      : { type: "json_object" }
    // Note: gpt-4o-mini only supports default temperature (1)
  });

  const content = res.choices[0].message?.content ?? "{}";
  try {
    return JSON.parse(content);
  } catch {
    return { output: content };
  }
}
