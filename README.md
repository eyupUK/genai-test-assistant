# GenAI Test Assistant

A hands-on **GenAI-powered QA toolkit** that demonstrates practical use of LLMs in testing:
1. **NL → Gherkin**: Convert a user story into a `.feature` file and **Cucumber/Playwright step skeletons**.
2. **JSON Schema → Test Data**: Generate realistic, constraint-aware JSON test data and validate it.
3. **Failure Triage**: Summarize failing logs into a concise report with hypotheses and an action plan.

> Built in **TypeScript** with support for **OpenAI GPT-4o-mini** and **Claude 3.7 Sonnet**. Easily switch between AI providers.

---

## Quick start

```bash
# 1) Install deps
npm i

# 2) Set your API key(s)
cp .env.example .env
# Edit .env and set OPENAI_API_KEY and/or ANTHROPIC_API_KEY

# 3) Try each feature with the examples
npm run gherkin           # OpenAI: writes out/api/ or out/ui/ tests
npm run gherkin:claude    # Claude: writes out/api/ or out/ui/ tests
npm run data              # OpenAI: writes out/data.json (validated)
npm run data:claude       # Claude: writes out/data.json (validated)
npm run triage            # OpenAI: writes out/triage.md
npm run triage:claude     # Claude: writes out/triage.md
```

### Environment variables

Create an `.env` (see `.env.example`):

```bash
# Choose your AI provider(s)
LLM_PROVIDER=openai          # or 'claude'
OPENAI_API_KEY=sk-...        # OpenAI API key
ANTHROPIC_API_KEY=sk-ant-... # Claude API key (optional)
```

**AI Provider Options:**

- **OpenAI**: Uses `gpt-4o-mini` (fast, cost-effective)
- **Claude**: Uses `claude-3-7-sonnet-20250219` (advanced reasoning)
- **Azure OpenAI**: Adapt `src/ai/llm.ts` to set `baseURL` + `api-version`

---

## What this project demonstrates (for your CV/JD)

- Applying **GenAI to QA**: test authoring, synthetic data creation, and failure triage.
- **Guardrails**: JSON-mode prompting + **AJV** validation of generated data.
- **Engineering hygiene**: modular code, CLI, TypeScript, strict mode.

---

## Structure

```text
src/
  ai/
    llm.ts               # Multi-provider LLM wrapper (OpenAI + Claude)
    prompts/
      gherkin.md
      testdata.md
      triage.md
  features/
    generateGherkin.ts
    synthesizeData.ts
    summarizeFailures.ts
  utils/
    io.ts
    reportGenerator.ts   # HTML report generation
examples/
  user-story.md
  product.schema.json
  playwright-fail.log
templates/
  BasePage.ts           # Page Object Model base class
  stepdef.skeleton.ts
```

---

## Executing Generated Tests

The generated tests in `out/api/` and `out/ui/` are ready to run:

```bash
# Set up environment (one time)
cp .env.example .env
# Add WEATHER_API_KEY=your-key-here to .env

# Run tests
npm test                # All tests (Cucumber + Playwright)
npm run test:api        # API tests only
npm run test:ui         # UI tests only  
npm run test:smoke      # Smoke tests only
```

**Test Structure:**
- **`.feature` files**: Gherkin scenarios with @smoke/@regression tags
- **`steps.generated.ts`**: Playwright step definitions with API calls
- **`pages.generated.ts`**: Page Object Models for UI tests (when applicable)

**Reports**: Generated in `reports/` directory with HTML, JSON, and screenshots.

See [TEST_EXECUTION.md](./TEST_EXECUTION.md) for complete setup and execution guide.

---

## Notes

- Generated tests are **complete and executable** with Cucumber + Playwright framework.
- **API tests** validate response schemas and business logic.
- **UI tests** use Page Object Model with robust locators.
- For **determinism/cost**, the LLM uses appropriate temperature settings.
- Keep production logs free of PII before sending to an LLM.
