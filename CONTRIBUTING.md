# Contributing to HTML Cleaner CLI

👍 First off, thanks for taking the time to contribute! 👍

## How to contribute

### Reporting bugs

If you find a bug, please create an issue with the following information:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (OS, Node.js version, etc.)

### Suggesting enhancements

If you have an idea for a new feature or enhancement, please create an issue with the following information:

- A clear and descriptive title
- A detailed description of the proposed feature
- Examples of how the feature would be used
- Why this feature would be useful

### Contributing code

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run tests to ensure they pass (`npm test`)
5. Commit your changes (`git commit -m 'Add feature'`)
6. Push to the branch (`git push origin feature/your-feature`)
7. Create a Pull Request

## Development setup

```bash
# Clone the repository
git clone https://github.com/yourusername/clean-html-cli.git
cd clean-html-cli

# Install dependencies
npm install

# Run tests
npm test
```

## Code style

Please follow the existing code style. We use ESLint to enforce coding standards. Run the linter before submitting your code:

```bash
npx eslint .
```

## Pull Request process

1. Update the README.md with details of changes if applicable
2. Update the tests to cover your changes
3. The PR should work for all supported Node.js versions
4. The PR will be merged once it passes all CI checks and gets approval