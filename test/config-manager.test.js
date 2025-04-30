const path = require('path');
const fs = require('fs-extra');
const { saveConfig, loadConfig } = require('../src/config-manager');

// Mock the inquirer prompts
jest.mock('@inquirer/prompts', () => ({
  input: jest.fn().mockResolvedValue('test-config'),
  select: jest.fn().mockImplementation(async ({ choices }) => choices[1].value)
}));

// Define test paths
const CONFIG_DIR = path.join(process.cwd(), 'config');
const TEST_CONFIG_PATH = path.join(CONFIG_DIR, 'test-config.json');

describe('Config Manager', () => {
  beforeAll(async () => {
    await fs.ensureDir(CONFIG_DIR);
  });

  afterAll(async () => {
    await fs.remove(TEST_CONFIG_PATH);
  });

  test('saves configuration to file', async () => {
    const testOptions = {
      'remove-tags': ['div', 'span'],
      'wrap': 80
    };

    const configPath = await saveConfig(testOptions);

    // Check if the config file was created
    const configExists = await fs.pathExists(configPath);
    expect(configExists).toBe(true);

    // Verify the config content
    const configData = await fs.readJson(configPath);
    expect(configData).toHaveProperty('name', 'test-config');
    expect(configData).toHaveProperty('options');
    expect(configData.options).toEqual(testOptions);
    expect(configData).toHaveProperty('createdAt');
  });

  test('loads configuration from file', async () => {
    // First create a test config
    const testOptions = {
      'remove-tags': ['div', 'span'],
      'wrap': 80
    };

    // Create a test config file directly
    await fs.writeJson(TEST_CONFIG_PATH, {
      name: 'test-config',
      options: testOptions,
      createdAt: new Date().toISOString()
    });

    // Attempt to load the config
    const loadedOptions = await loadConfig();

    // Verify the loaded options
    expect(loadedOptions).toEqual(testOptions);
  });
});
