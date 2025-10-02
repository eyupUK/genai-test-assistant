# Test Configuration Templates

This directory contains configuration templates for running the generated tests.

## Files Generated During Test Setup:

- `cucumber.js` - Cucumber configuration
- `tsconfig.json` - TypeScript configuration for test execution
- `support/world.ts` - Playwright world context for Cucumber
- `test-results.json` - Test results output (generated after test run)

## Running Tests:

1. Generate tests: `npm run gherkin`
2. Run tests: `npm run test`
3. Or do both: `npm run run`

## Commands:

- `tsx src/cli.ts test --dir <test-directory> --setup` - Run tests with setup
- `tsx src/cli.ts run --story <story-file>` - Generate and run tests in one command
- Add `--browser firefox` or `--browser webkit` for different browsers
- Add `--headless false` to see browser UI during test execution