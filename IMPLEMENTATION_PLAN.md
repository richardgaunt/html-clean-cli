# Implementation Plan for HTML Cleaner

## 1. Project Setup
- Install required dependencies
  - `@inquirer/prompts` for CLI interactions
  - `clean-html` (already installed) for HTML cleaning
- Create basic directory structure
  - `src/` - application code
  - `config/` - saved configurations
  - `output/` - cleaned HTML output
  - `test/` - test files
  - `fixtures/` - test HTML files

## 2. Core Functionality Implementation

### File Selection
- Create a file browser with auto-completion
- Allow users to navigate directories and select HTML files
- Validate file is valid HTML

### Options Selection
- Create a multi-select interface for clean-html options
- Group options by type (formatting, removal, etc.)
- Implement conditional follow-up questions for options that need configuration
  - For array options (like remove-tags), allow adding custom values
  - For boolean options, present as yes/no
  - For string/number options, provide input with validation

### Output Configuration
- Allow selecting output location (default to `output/`)
- Generate output filename from input filename if not specified

### Cleaning Process
- Implement function to read input file
- Apply selected options to clean-html
- Write cleaned output to selected location
- Show success message with file path

## 3. Configuration Management

### Save Configuration
- Create JSON structure for saving configurations
- Save selected options to `config/` directory with user-provided name
- Include metadata (date created, source file, etc.)

### Load Configuration
- List available configurations for selection
- Allow editing loaded configuration before applying
- Support deletion of saved configurations

### Re-run with Modifications
- After cleaning, prompt to re-run with option to change settings
- If re-run, pre-fill selections with current choices

## 4. Testing

### Unit Tests
- Test option validation
- Test configuration saving/loading
- Test HTML cleaning with various options

### Integration Tests
- Create HTML fixtures with various elements to clean
- Test end-to-end workflow with fixture files
- Verify output matches expected cleaned HTML

## 5. Code Organization

### Main Modules
- `index.js` - Entry point
- `file-selector.js` - File navigation and selection
- `option-selector.js` - Options management and UI
- `config-manager.js` - Configuration persistence
- `html-cleaner.js` - Core cleaning functionality
- `cli.js` - CLI interface and workflow

## Implementation Order
1. Basic CLI structure and file selection
2. HTML cleaning with hardcoded options
3. Interactive options selection
4. Configuration saving/loading
5. Re-run functionality
6. Testing
7. Refinements and edge cases