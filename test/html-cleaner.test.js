const path = require('path');
const fs = require('fs-extra');
const { cleanHtmlFile } = require('../src/html-cleaner');
const cleaner = require('clean-html');

// Mock the clean-html module
jest.mock('clean-html', () => ({
  clean: jest.fn((input, options, callback) => {
    callback(input); // Just return the input for testing
  })
}));

// Test paths
const fixtureDir = path.join(process.cwd(), 'fixtures');
const outputDir = path.join(process.cwd(), 'test', 'output');
const testHtmlPath = path.join(fixtureDir, 'test.html');
const outputHtmlPath = path.join(outputDir, 'test-output.html');

// Sample HTML content
const sampleHtml = `<!DOCTYPE html>
<html>
<body bgcolor="white" width="800">
  <center><h1>Test</h1></center>
  <div align="center">Content</div>
  <font color="red">Text</font>
</body>
</html>`;

// Ensure directories exist before tests
beforeAll(async () => {
  await fs.ensureDir(outputDir);
  await fs.ensureDir(fixtureDir);
  await fs.writeFile(testHtmlPath, sampleHtml);
});

// Clean up after tests
afterAll(async () => {
  await fs.emptyDir(outputDir);
});

describe('HTML Cleaner', () => {
  test('cleans HTML with default options', async () => {
    const defaultOptions = {};
    
    const result = await cleanHtmlFile(testHtmlPath, outputHtmlPath, defaultOptions);
    
    // Check if the output file exists
    const outputExists = await fs.pathExists(outputHtmlPath);
    expect(outputExists).toBe(true);
    
    // Verify the result object
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('inputPath', testHtmlPath);
    expect(result).toHaveProperty('outputPath', outputHtmlPath);
    
    // Verify clean-html was called with correct parameters
    expect(cleaner.clean).toHaveBeenCalledWith(
      expect.any(String),
      defaultOptions,
      expect.any(Function)
    );
  });
  
  test('cleans HTML with custom options', async () => {
    const customOptions = {
      'remove-attributes': ['align', 'bgcolor', 'width'],
      'remove-tags': ['center', 'font'],
      'lower-case-tags': true
    };
    
    const customOutputPath = path.join(outputDir, 'test-custom.html');
    await cleanHtmlFile(testHtmlPath, customOutputPath, customOptions);
    
    // Check if the output file exists
    const outputExists = await fs.pathExists(customOutputPath);
    expect(outputExists).toBe(true);
    
    // Verify clean-html was called with correct parameters
    expect(cleaner.clean).toHaveBeenCalledWith(
      expect.any(String),
      customOptions,
      expect.any(Function)
    );
  });
  
  test('throws error when input file does not exist', async () => {
    const nonExistentPath = path.join(fixtureDir, 'non-existent.html');
    const outputPath = path.join(outputDir, 'error-output.html');
    
    await expect(
      cleanHtmlFile(nonExistentPath, outputPath, {})
    ).rejects.toThrow();
  });
});