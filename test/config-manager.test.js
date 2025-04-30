const path = require('path');

// Mock the fs-extra module
jest.mock('fs-extra', () => ({
  ensureDir: jest.fn().mockResolvedValue(undefined),
  writeJson: jest.fn().mockResolvedValue(undefined),
  readdir: jest.fn().mockResolvedValue(['test-config.json']),
  readJson: jest.fn().mockImplementation(async (filePath) => {
    return {
      name: 'test-config',
      options: { 'remove-tags': ['div', 'span'], 'wrap': 80 },
      createdAt: new Date().toISOString()
    };
  }),
  pathExists: jest.fn().mockResolvedValue(true),
  remove: jest.fn().mockResolvedValue(undefined)
}));

// Properly mock the inquirer prompts
jest.mock('@inquirer/prompts', () => ({
  input: jest.fn().mockResolvedValue('test-config'),
  select: jest.fn().mockImplementation(() => Promise.resolve({
    options: { 'remove-tags': ['div', 'span'], 'wrap': 80 }
  }))
}));

// Import dependencies and modules
const fs = require('fs-extra');
const { saveConfig, loadConfig } = require('../src/config-manager');

describe('Config Manager', () => {
  // Define test paths and data
  const CONFIG_DIR = path.join(process.cwd(), 'config');
  const TEST_CONFIG_PATH = path.join(CONFIG_DIR, 'test-config.json');
  const testOptions = {
    'remove-tags': ['div', 'span'],
    'wrap': 80
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Spy on console.log to suppress output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('saves configuration to file', async () => {
    const configPath = await saveConfig(testOptions);
    
    // Verify directory was created
    expect(fs.ensureDir).toHaveBeenCalledWith(CONFIG_DIR);
    
    // Verify configuration was written
    expect(fs.writeJson).toHaveBeenCalledWith(
      TEST_CONFIG_PATH,
      expect.objectContaining({
        name: 'test-config',
        options: testOptions
      }),
      { spaces: 2 }
    );
    
    // Verify returned path is correct
    expect(configPath).toBe(TEST_CONFIG_PATH);
  });
  
  test('loads configuration from file', async () => {
    const loadedOptions = await loadConfig();
    
    // Verify directory was created
    expect(fs.ensureDir).toHaveBeenCalledWith(CONFIG_DIR);
    
    // Verify directory was read
    expect(fs.readdir).toHaveBeenCalledWith(CONFIG_DIR);
    
    // Verify returned options match expected
    expect(loadedOptions).toEqual(testOptions);
  });
});