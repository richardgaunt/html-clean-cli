const fs = require('fs-extra');
const path = require('path');
const { input, select } = require('@inquirer/prompts');

const CONFIG_DIR = path.join(process.cwd(), 'config');

async function saveConfig(options) {
  await fs.ensureDir(CONFIG_DIR);

  const configName = await input({
    message: 'Enter a name for this configuration:',
    validate: (value) => {
      if (!value) return 'Please enter a configuration name';
      return true;
    }
  });

  const configData = {
    name: configName,
    options,
    createdAt: new Date().toISOString()
  };

  const configPath = path.join(CONFIG_DIR, `${configName}.json`);
  await fs.writeJson(configPath, configData, { spaces: 2 });

  console.log(`Configuration saved as: ${configPath}`);
  return configPath;
}

async function loadConfig() {
  try {
    await fs.ensureDir(CONFIG_DIR);

    const configFiles = await fs.readdir(CONFIG_DIR);
    const jsonFiles = configFiles.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
      console.log('No saved configurations found.');
      return null;
    }

    const choices = await Promise.all(jsonFiles.map(async file => {
      const filePath = path.join(CONFIG_DIR, file);
      const data = await fs.readJson(filePath);
      return {
        name: `${data.name} (${new Date(data.createdAt).toLocaleDateString()})`,
        value: data
      };
    }));

    choices.unshift({ name: 'None - use new configuration', value: null });

    const selectedConfig = await select({
      message: 'Select a saved configuration:',
      choices
    });

    return selectedConfig ? selectedConfig.options : null;
  } catch (error) {
    console.error('Error loading configurations:', error.message);
    return null;
  }
}

module.exports = {
  saveConfig,
  loadConfig
};
