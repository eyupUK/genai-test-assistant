# Test Execution Guide

This guide explains how to execute the generated test scenarios from the `out/api` and `out/ui` directories.

## Prerequisites

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys:
   # - WEATHER_API_KEY (get from https://www.weatherapi.com/)
   # - OPENAI_API_KEY or ANTHROPIC_API_KEY (for test generation)
   ```

3. **Generate some tests** (if you haven't already):
   ```bash
   npm run gherkin        # Generates tests in out/api or out/ui
   npm run gherkin:claude # Alternative using Claude AI
   ```

## Test Execution Methods

### Method 1: Cucumber + Playwright (Recommended)

**Run all tests**:
```bash
npm test                # All tests (API + UI)
```

**Run specific test types**:
```bash
npm run test:api        # API tests only
npm run test:ui         # UI tests only  
npm run test:smoke      # Smoke tests only (@smoke tag)
```

**Run with specific tags**:
```bash
CUCUMBER_TAGS=@regression npm test    # Regression tests only
CUCUMBER_TAGS="@smoke or @api" npm test # Smoke tests or API tests
```

**Debug mode** (see browser for UI tests):
```bash
npm run test:headed     # UI tests with visible browser
npm run test:debug      # Smoke tests with debug output
```

### Method 2: Playwright Test Runner

**Run tests with Playwright's test runner**:
```bash
npm run test:playwright       # All tests
npm run test:playwright:api   # API tests only
npm run test:playwright:ui    # UI tests only (Chromium)
```

**Playwright with specific browsers**:
```bash
npx playwright test --project=firefox-ui    # Firefox UI tests
npx playwright test --project=webkit-ui     # Safari UI tests  
npx playwright test --project=mobile-chrome-ui # Mobile tests
```

## Test Reports

After running tests, reports are generated in the `reports/` directory:

- **HTML Reports**: `reports/cucumber-report.html`
- **JSON Reports**: `reports/cucumber-report.json`
- **Screenshots**: `reports/screenshots/` (for failed tests)
- **Videos**: `reports/videos/` (if enabled)

**Open HTML report**:
```bash
open reports/cucumber-report.html        # macOS
start reports/cucumber-report.html       # Windows
xdg-open reports/cucumber-report.html    # Linux
```

## Example: Running Weather API Tests

1. **Set up Weather API key**:
   ```bash
   # Get free API key from https://www.weatherapi.com/
   echo "WEATHER_API_KEY=your-actual-api-key-here" >> .env
   ```

2. **Run the tests**:
   ```bash
   npm run test:api
   ```

   Expected output:
   ```
   🚀 Starting test suite...
   ✅ Weather API key found
   🌐 Weather API endpoint is reachable
   
   Feature: Weather API - Current Weather for a Single Location
     ✓ Get current weather for "London"
     ✓ Get current weather for "New York" 
     ✓ Whitespace in query is handled correctly
     ✓ Invalid queries return appropriate error responses
   
   4 scenarios (4 passed)
   12 steps (12 passed)
   ```

## Test Structure

Generated tests follow this structure:

```
out/
├── api/
│   └── us-weather-001-.../
│       ├── generated.feature      # Gherkin scenarios
│       └── steps.generated.ts     # Step definitions
└── ui/
    └── ecommerce-checkout-.../
        ├── generated.feature      # Gherkin scenarios  
        ├── steps.generated.ts     # Step definitions
        └── pages.generated.ts     # Page Object Models
```

## Customizing Test Execution

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `WEATHER_API_KEY` | - | Weather API key (required for API tests) |
| `BASE_URL` | `http://localhost:3000` | Base URL for UI tests |
| `HEADLESS` | `true` | Run browser tests headlessly |
| `CUCUMBER_TAGS` | `@smoke or @regression` | Which test tags to run |
| `SLOW_MO` | `0` | Slow down Playwright actions (ms) |
| `RECORD_VIDEO` | `false` | Record videos of test execution |

### Configuration Files

- **`cucumber.js`**: Cucumber test runner configuration
- **`playwright.config.ts`**: Playwright browser and API configuration  
- **`test-support/world.ts`**: Test context and browser setup
- **`test-support/hooks.ts`**: Before/after test hooks

### Custom Test Profiles

Edit `cucumber.js` to add custom profiles:

```javascript
// Add to cucumber.js
myProfile: {
  features: ['out/api/**/*.feature'],
  tags: '@myTag',
  format: ['progress-bar'],
  parallel: 1
}
```

Run with: `npx cucumber-js --profile myProfile`

## Troubleshooting

### Common Issues

1. **"No features found"**: 
   - Generate tests first: `npm run gherkin`
   - Check `out/api/` or `out/ui/` directories contain `.feature` files

2. **"WEATHER_API_KEY not found"**:
   - Set API key in `.env` file
   - Get free key from https://www.weatherapi.com/

3. **TypeScript compilation errors**:
   - Run `npm run build` to check TypeScript issues
   - Ensure all imports are correct in generated step files

4. **Browser launch failures**:
   - Install Playwright browsers: `npx playwright install`
   - Check system requirements for browser dependencies

5. **Port conflicts for UI tests**:
   - Change `BASE_URL` in `.env` to your application's URL
   - Or start your application on the expected port

### Debug Mode

For detailed debugging:

```bash
# Enable debug output
DEBUG=cucumber* npm test

# Run single scenario with debug
npx cucumber-js --tags "@debug" --format @cucumber/pretty-formatter

# Playwright debug mode
PWDEBUG=1 npm run test:playwright:ui
```

### Test Data Setup

For tests requiring specific data:

1. **API Tests**: Mock responses or use test data endpoints
2. **UI Tests**: Set up test database or use test user accounts
3. **Schema Validation**: Update schemas in `out/api/schemas/` as needed

## Best Practices

1. **Use tags effectively**: `@smoke`, `@regression`, `@api`, `@ui`
2. **Keep tests independent**: Each scenario should set up its own data
3. **Use meaningful test data**: Generated tests include realistic examples
4. **Monitor API rate limits**: Weather API has usage limits
5. **Clean up resources**: Hooks automatically handle browser cleanup

## Next Steps

1. **Add more test scenarios**: Generate tests from different user stories
2. **Integrate with CI/CD**: Add test execution to your pipeline
3. **Custom assertions**: Extend step definitions with domain-specific checks
4. **Test data management**: Create fixtures for complex test scenarios
5. **Performance testing**: Add timing assertions for API response times