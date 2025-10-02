# Changelog

## [0.2.0] - 2025-01-04

### Added
- **Dual AI Provider Support**: Full integration with both OpenAI GPT-4o-mini and Claude 3.7 Sonnet
- **Directory Organization**: Automatic test type detection and routing (API tests → `out/api/`, UI tests → `out/ui/`)
- **HTML Report Generation**: Comprehensive test reports with multiple formats (summary, basic, native Cucumber)
- **Provider-Specific Scripts**: Dedicated npm scripts for each AI provider (`gherkin:claude`, `data:claude`, `triage:claude`)
- **Page Object Model**: Complete POM generation for UI tests with BasePage inheritance
- **Intelligent Test Detection**: Automatically detects API vs UI test scenarios from user stories

### Enhanced
- **LLM Integration**: Robust multi-provider system with fallback mechanisms and schema validation
- **Error Handling**: Improved error messages and graceful degradation for both providers
- **TypeScript Compliance**: Full ES modules support with strict TypeScript configuration
- **Documentation**: Updated README with dual provider setup and usage examples

### Technical Improvements
- **Model Updates**: Updated to current stable Claude model (`claude-3-7-sonnet-20250219`)
- **Environment Configuration**: Flexible provider selection via `LLM_PROVIDER` environment variable
- **Cross-Platform Compatibility**: Improved path handling and directory creation
- **Report Generation**: Professional HTML styling with metadata integration

### Fixed
- **Claude Integration**: Resolved model deprecation issues and API compatibility
- **Step Definitions**: Fixed TypeScript compilation errors in generated test files
- **File Organization**: Proper directory structure creation for test outputs

## [0.1.0] - Initial Release

### Features
- Basic Gherkin generation from user stories
- JSON Schema-based test data synthesis
- Test failure log analysis and triage
- OpenAI GPT-4o-mini integration
- TypeScript ES modules architecture