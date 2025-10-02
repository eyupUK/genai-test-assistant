import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

/**
 * Enhanced LLM integration with dual provider support (OpenAI + Claude)
 * Features:
 * - Lazy client initialization with proper error handling
 * - Input validation and provider verification
 * - Improved error messages with helpful tips
 * - Robust JSON parsing with fallbacks
 * - Support for both OpenAI and Claude APIs
 */

export type LLMProvider = 'openai' | 'claude';

export interface LLMConfig {
  provider?: LLMProvider;
  model?: string;
}

// Initialize clients with better error handling
let openaiClient: OpenAI | null = null;
let claudeClient: Anthropic | null = null;

// Lazy initialization of OpenAI client
function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required for OpenAI provider');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

// Lazy initialization of Claude client  
function getClaudeClient(): Anthropic {
  if (!claudeClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY or CLAUDE_API_KEY environment variable is required for Claude provider');
    }
    claudeClient = new Anthropic({ apiKey });
  }
  return claudeClient;
}

// Default models for each provider
const DEFAULT_MODELS = {
  openai: 'gpt-4o-mini',
  claude: 'claude-3-5-haiku-20241022' // Claude 3.5 Haiku (fast and reliable)
} as const;

// Available models for validation
const AVAILABLE_MODELS = {
  openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
  claude: ['claude-3-5-haiku-20241022', 'claude-3-haiku-20240307', 'claude-3-5-sonnet-latest']
} as const;

// Helper function to validate inputs
function validateInputs(provider: string, system: string, user: string): void {
  if (provider !== 'openai' && provider !== 'claude') {
    throw new Error(`Invalid LLM provider: ${provider}. Must be 'openai' or 'claude'`);
  }
  if (!system || !user) {
    throw new Error('System and user prompts are required');
  }
}

// Helper function to handle errors
function handleLLMError(error: unknown, provider: string, model: string): never {
  console.error(`❌ ${provider.toUpperCase()} API error:`, error instanceof Error ? error.message : error);
  
  if (error instanceof Error) {
    if (error.message.includes('API key')) {
      console.error('💡 Tip: Make sure your API key is set in the .env file');
      console.error(`   For ${provider}: ${provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY'}`);
    } else if (error.message.includes('model')) {
      console.error('💡 Tip: The model may be deprecated or invalid');
      console.error(`   Current model: ${model}`);
    }
  }
  
  throw error;
}

export async function llmJson(system: string, user: string, schema?: object, config?: LLMConfig): Promise<any> {
  const provider = config?.provider || (process.env.LLM_PROVIDER as LLMProvider) || 'openai';
  const model = config?.model || DEFAULT_MODELS[provider];
  
  validateInputs(provider, system, user);
  console.log(`🤖 Using ${provider.toUpperCase()} (${model}) for AI generation...`);
  
  try {
    return provider === 'claude' 
      ? await callClaude(system, user, model, schema)
      : await callOpenAI(system, user, model, schema);
  } catch (error) {
    handleLLMError(error, provider, model);
  }
}

async function callOpenAI(system: string, user: string, model: string, schema?: object): Promise<any> {
  const client = getOpenAIClient();
  const res = await client.chat.completions.create({
    model,
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

async function callClaude(system: string, user: string, model: string, schema?: object): Promise<any> {
  // For Claude, we need to embed the JSON schema instruction in the system prompt
  let enhancedSystem = system;
  if (schema) {
    enhancedSystem += `\n\nIMPORTANT: You must respond with valid JSON that conforms to this schema:\n${JSON.stringify(schema, null, 2)}\n\nYour response must be valid JSON only, no additional text.`;
  } else {
    enhancedSystem += '\n\nIMPORTANT: You must respond with valid JSON only, no additional text.';
  }

  const client = getClaudeClient();
  const response = await client.messages.create({
    model,
    max_tokens: 4000,
    temperature: 0.7,
    system: enhancedSystem,
    messages: [
      { role: "user", content: user }
    ]
  });

  const content = response.content[0]?.type === 'text' ? response.content[0].text : "{}";
  
  try {
    return JSON.parse(content);
  } catch (parseError) {
    console.warn('⚠️  Claude response was not valid JSON, attempting to extract JSON...', parseError);
    
    // Try to extract JSON from the response if it contains other text
    const jsonRegex = /\{[\s\S]*\}/;
    const jsonMatch = jsonRegex.exec(content);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (secondParseError) {
        console.warn('⚠️  Failed to parse extracted JSON:', secondParseError);
        // Fall back to wrapping the response
        return { output: content };
      }
    }
    
    return { output: content };
  }
}

// Convenience functions for specific providers
export async function llmJsonOpenAI(system: string, user: string, schema?: object, model?: string): Promise<any> {
  return llmJson(system, user, schema, { provider: 'openai', model });
}

export async function llmJsonClaude(system: string, user: string, schema?: object, model?: string): Promise<any> {
  return llmJson(system, user, schema, { provider: 'claude', model });
}
