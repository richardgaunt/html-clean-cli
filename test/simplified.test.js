const path = require('path');

// Mock dependencies
jest.mock('fs-extra', () => ({
  readFile: jest.fn().mockResolvedValue('<html></html>'),
  writeFile: jest.fn().mockResolvedValue(undefined),
  ensureDir: jest.fn().mockResolvedValue(undefined),
  pathExists: jest.fn().mockResolvedValue(true)
}));

// Mock the clean-html module with a jest.fn
const mockClean = jest.fn((input, options, callback) => {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  callback('<html>cleaned</html>');
});

jest.mock('clean-html', () => ({
  clean: mockClean
}));

// Import modules after mock setup
const fs = require('fs-extra');
const { cleanHtmlFile } = require('../src/html-cleaner');

describe('HTML Cleaner Basic Tests', () => {
  const testInputPath = '/test/input.html';
  const testOutputPath = '/test/output/result.html';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should clean HTML with default options', async () => {
    const result = await cleanHtmlFile(testInputPath, testOutputPath, {});
    
    // Check if fs.readFile was called with the correct path
    expect(fs.readFile).toHaveBeenCalledWith(testInputPath, 'utf8');
    
    // Check if fs.writeFile was called with the correct path and content
    expect(fs.writeFile).toHaveBeenCalledWith(
      testOutputPath,
      expect.any(String),
      'utf8'
    );
    
    // Check the returned result object
    expect(result).toEqual({
      success: true,
      inputPath: testInputPath,
      outputPath: testOutputPath
    });
  });
});