const path = require('path');
const fs = require('fs-extra');
const { glob } = require('glob');
const { input } = require('@inquirer/prompts');

async function selectInputFile() {
  const initialPattern = '**/*.html';

  const matchingFiles = await glob(initialPattern, {
    ignore: ['node_modules/**', 'output/**'],
    cwd: process.cwd(),
    absolute: true
  });

  const result = await input({
    message: 'Enter HTML file path (type to filter):',
    validate: (value) => {
      if (!value) return 'Please enter a file path';
      return true;
    },
    suggest: async (input) => {
      if (!input) return matchingFiles;

      const inputPattern = `**/${input}*.html`;
      return glob(inputPattern, {
        ignore: ['node_modules/**', 'output/**'],
        cwd: process.cwd(),
        absolute: true
      });
    }
  });

  // Validate the selected file exists and is HTML
  try {
    const stat = await fs.stat(result);
    if (!stat.isFile()) {
      throw new Error(`${result} is not a file`);
    }

    if (!result.toLowerCase().endsWith('.html')) {
      throw new Error(`${result} is not an HTML file`);
    }

    return result;
  } catch (error) {
    throw new Error(`Invalid file: ${error.message}`);
  }
}

async function selectOutputPath(inputFile) {
  const fileName = path.basename(inputFile);
  const defaultOutputPath = path.join(process.cwd(), 'output', fileName);

  await fs.ensureDir(path.dirname(defaultOutputPath));

  const outputPath = await input({
    message: 'Enter output file path:',
    default: defaultOutputPath,
    validate: (value) => {
      if (!value) return 'Please enter an output path';
      return true;
    }
  });

  // Ensure output directory exists
  await fs.ensureDir(path.dirname(outputPath));

  return outputPath;
}

module.exports = {
  selectInputFile,
  selectOutputPath
};
