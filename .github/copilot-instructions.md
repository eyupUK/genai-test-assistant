# GitHub Copilot Instructions - GenAI Test Assistant

## Architecture Overview

This is a **TypeScript ES module** CLI tool that applies GenAI to QA workflows. Three core features:

1. **NL → Gherkin + POM**: Convert user stories to `.feature` files + Playwright step definitions + Page Object Model classes
2. **JSON Schema → Test Data**: Generate validated synthetic test data using AJV
3. **Failure Triage**: Analyze test logs and output structured Markdown reports

**Key Pattern**: All features follow `src/features/*.ts` → `src/ai/llm.ts` → structured prompts in `src/ai/prompts/*.md`

## LLM Integration Pattern

- **Single LLM wrapper**: `src/ai/llm.ts` uses OpenAI JSON mode with default temperature (1.0)
- **Model compatibility**: Uses `gpt-4o-mini` which only supports default temperature
- **Schema-driven**: All LLM calls use JSON Schema validation for structured outputs
- **Error handling**: Graceful JSON parsing fallback to `{ output: content }`
- **Prompts as files**: System prompts stored in `src/ai/prompts/*.md` for easy iteration

```typescript
// Standard pattern for LLM calls
const result = await llmJson(system, user, schema);
```

## CLI & Scripts

Run via package.json scripts (preferred):
- `npm run gherkin` - generates `out/feature/generated.feature` + `steps.generated.ts` + `pages.generated.ts`
- `npm run data` - validates against schema, outputs to `out/data.json`
- `npm run triage` - processes logs to `out/triage.md`

**File I/O**: All outputs use `src/utils/io.ts` with automatic directory creation via `ensureDir()`

## Code Conventions

- **ES modules**: Use `.js` imports even for `.ts` files due to `"type": "module"`
- **Strict TypeScript**: Full strict mode enabled in `tsconfig.json`
- **Validation layer**: AJV for JSON Schema validation in `synthesizeData.ts`
- **Path handling**: Always use `path.join()` for cross-platform compatibility
- **No async/await pollution**: Clean separation between sync file ops and async LLM calls

## Prompt Engineering

Prompts in `src/ai/prompts/` follow specific patterns:
- **gherkin.md**: Generates 3-part test suite (Feature + Steps + POM) with industry best practices
- **testdata.md**: Constraint-aware data generation with boundary cases
- **triage.md**: Failure analysis with root cause grouping

## Page Object Model (POM) Generation

The gherkin command now generates complete test suites including:
- **Feature file**: Gherkin scenarios with @smoke/@regression tags
- **Step definitions**: Import and use generated POM classes
- **POM classes**: Extend BasePage with locators, actions, and assertions
- **Templates**: `templates/BasePage.ts` provides common page functionality

## Key Dependencies

- **OpenAI SDK**: Standard client, easily adaptable to Azure OpenAI
- **Commander.js**: CLI argument parsing with required/optional flags
- **AJV**: JSON Schema validation for synthetic data
- **ts-node**: Direct TypeScript execution in development

## Environment Setup

```bash
cp .env.example .env
# Set OPENAI_API_KEY=sk-...
npm install  # Install dependencies including tsx for ES module support
```

**Critical**: Uses `tsx` instead of `ts-node` for ES module TypeScript execution. The CLI loads environment variables via `import "dotenv/config"` at the top.

Azure OpenAI adaptation: Modify `src/ai/llm.ts` baseURL and pass deployment name as model.

## Development Execution

- **Runtime**: `tsx` handles TypeScript ES modules natively
- **Environment**: dotenv auto-loads `.env` file on CLI startup
- **Scripts**: Use `npm run <command>` - never call tsx directly