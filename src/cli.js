const { confirm } = require('@inquirer/prompts');
const { selectInputFile, selectOutputPath } = require('./file-selector');
const { selectOptions } = require('./option-selector');
const { loadConfig, saveConfig } = require('./config-manager');
const { cleanHtmlFile } = require('./html-cleaner');

async function runCli() {
  console.log('✨ HTML Cleaner CLI ✨');
  console.log('--------------');

  // First, ask if they want to use a saved configuration
  const savedOptions = await loadConfig();

  // Select input file
  const inputFile = await selectInputFile();
  console.log(`📄 Selected input file: ${inputFile}`);

  // Select cleaning options
  const options = await selectOptions(savedOptions);
  console.log('🛠️  Selected options:', JSON.stringify(options, null, 2));

  // Select output path
  const outputPath = await selectOutputPath(inputFile);
  console.log(`💾 Output will be saved to: ${outputPath}`);

  // Ask if the user wants to save this configuration
  const shouldSaveConfig = await confirm({
    message: 'Do you want to save this configuration for future use?'
  });

  if (shouldSaveConfig) {
    await saveConfig(options);
  }

  // Clean the HTML
  console.log('🧹 Cleaning HTML...');
  const result = await cleanHtmlFile(inputFile, outputPath, options);
  console.log(`✅ HTML cleaned successfully! File saved to: ${result.outputPath}`);

  // Ask if the user wants to run the process again
  const shouldRunAgain = await confirm({
    message: 'Do you want to clean another HTML file?'
  });

  if (shouldRunAgain) {
    return runCli();
  }

  console.log('👋 Goodbye!');
}

module.exports = {
  runCli
};
