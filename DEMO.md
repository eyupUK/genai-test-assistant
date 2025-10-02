# Test Execution Demo

This demonstrates the complete flow from test generation to execution.

## Quick Demo

```bash
# 1. Generate tests with AI
npm run gherkin

# 2. Set up API key for Weather API tests
echo "WEATHER_API_KEY=your-key-here" >> .env

# 3. Run the generated tests
npm run test:api

# 4. View results
open reports/cucumber-report.html
```

## What Gets Generated

**Feature File Example** (`out/api/.../generated.feature`):
```gherkin
Feature: Weather API - Current Weather for a Single Location
  @smoke
  Scenario Outline: Get current weather for a single city
    When I request current weather for "<query>"
    Then the HTTP status is 200
    And the payload fields have valid types
    And the response conforms to current_schema.json
```

**Step Definitions** (`out/api/.../steps.generated.ts`):
- ✅ Complete Playwright API calls
- ✅ JSON Schema validation with AJV
- ✅ Type-safe assertions
- ✅ Error handling for edge cases

**Test Execution Results**:
```
Feature: Weather API - Current Weather for a Single Location
  ✓ Get current weather for "London" 
  ✓ Get current weather for "New York"
  ✓ Invalid queries return appropriate error responses

3 scenarios (3 passed)
9 steps (9 passed)
```

## Available Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | All tests (API + UI) |
| `npm run test:api` | API tests only |
| `npm run test:ui` | UI tests with browser |
| `npm run test:smoke` | Quick smoke tests |
| `npm run test:headed` | UI tests with visible browser |
| `npm run test:playwright` | Playwright test runner |

## Reports Generated

- **HTML Report**: `reports/cucumber-report.html`
- **JSON Results**: `reports/cucumber-report.json` 
- **Screenshots**: `reports/screenshots/` (failures only)
- **Playwright Report**: `reports/playwright-report/`

The generated tests are **production-ready** with:
- ✅ Proper error handling
- ✅ Schema validation  
- ✅ Realistic test data
- ✅ Browser automation (UI tests)
- ✅ API testing with assertions
- ✅ Comprehensive reporting