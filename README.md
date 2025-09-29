# GenAI Test Assistant

A hands-on **GenAI-powered QA toolkit** that demonstrates practical use of LLMs in testing:
1. **NL → Gherkin**: Convert a user story into a `.feature` file and **Cucumber/Playwright step skeletons**.
2. **JSON Schema → Test Data**: Generate realistic, constraint-aware JSON test data and validate it.
3. **Failure Triage**: Summarize failing logs into a concise report with hypotheses and an action plan.

> Built in **TypeScript** with the official **OpenAI Node SDK**. Easily extend to Azure OpenAI.

---

## Quick start

```bash
# 1) Install deps
npm i

# 2) Set your API key
cp .env.example .env
# Edit .env and set OPENAI_API_KEY

# 3) Try each feature with the examples
npm run gherkin    # writes out/feature/generated.feature and steps.generated.ts
npm run data       # writes out/data.json (validated against schema)
npm run triage     # writes out/triage.md
```

### Environment variables

Create an `.env` (see `.env.example`):

```
OPENAI_API_KEY=sk-...
```

> **Azure OpenAI?** This starter uses the standard OpenAI endpoint for simplicity.
> If you prefer Azure, you can adapt `src/ai/llm.ts` to set `baseURL` + `api-version`
> and pass your deployment name as the model.

---

## What this project demonstrates (for your CV/JD)

- Applying **GenAI to QA**: test authoring, synthetic data creation, and failure triage.
- **Guardrails**: JSON-mode prompting + **AJV** validation of generated data.
- **Engineering hygiene**: modular code, CLI, TypeScript, strict mode.

---

## Structure

```
src/
  ai/
    llm.ts               # LLM wrapper (JSON-mode)
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
examples/
  user-story.md
  product.schema.json
  playwright-fail.log
templates/
  stepdef.skeleton.ts
```

---

## Notes

- The generated step file is a **skeleton** meant to be pasted into your Playwright+Cucumber project.
- For **determinism/cost**, the wrapper uses a low temperature.
- Keep production logs free of PII before sending to an LLM.
