# HTML Cleaner Application

✨ A CLI application for cleaning and formatting HTML files

![Test Suite](https://github.com/yourusername/clean-html-cli/actions/workflows/test.yml/badge.svg)
![Lint](https://github.com/yourusername/clean-html-cli/actions/workflows/lint.yml/badge.svg)

## Overview

HTML Cleaner is an interactive CLI tool that wraps the functionality of the [clean-html](https://www.npmjs.com/package/clean-html) package with a user-friendly interface. It allows you to clean and format HTML files with customizable options.

## Features

- 📄 Interactive file selector with autocomplete
- 🛠️ Multi-select option chooser for HTML cleaning
- 💾 Configurable output location
- 📋 Save and reuse cleaning configurations
- 🔄 Re-run cleaning with modified options

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/clean-html-cli.git
cd clean-html-cli

# Install dependencies
npm install

# Make the CLI globally available (optional)
npm link
```

## Usage

```bash
# Run the application
npm start

# Or if installed globally
clean-html-cli
```

## Development

### Running Tests

```bash
npm test
```

### Project Structure

- `src/` - Application source code
- `config/` - Saved configurations
- `output/` - Cleaned HTML output
- `fixtures/` - Test HTML files
- `test/` - Test files

## Clean HTML Options

The application supports all options from the `clean-html` package:

### Core Options

- **allow-attributes-without-values**: Allow attributes without values (`checked` vs `checked=""`)
- **break-around-comments**: Add line breaks before and after comments
- **break-around-tags**: Tags that should have line breaks added before and after
- **decode-entities**: Replace HTML entities with decoded equivalents
- **indent**: String to use for indentation
- **lower-case-tags**: Convert tag names to lowercase
- **lower-case-attribute-names**: Convert attribute names to lowercase
- **preserve-tags**: Tags that should be left alone (content not formatted)
- **remove-attributes**: Attributes to remove from markup
- **remove-comments**: Remove comments
- **remove-empty-tags**: Tags to remove if empty
- **remove-tags**: Tags to always remove (nested content preserved)
- **wrap**: Column number where lines should wrap

### Additional Options

- **add-break-around-tags**: Additional tags to include in `break-around-tags`
- **add-remove-attributes**: Additional attributes to include in `remove-attributes`
- **add-remove-tags**: Additional tags to include in `remove-tags`

## Example Usage

```js
const options = {
  'break-around-comments': false,
  'decode-entities': true,
  'remove-tags': ['b', 'i', 'center', 'font'],
  'wrap': 80
};
```

For detailed information about each option, please refer to the [clean-html documentation](https://www.npmjs.com/package/clean-html).
