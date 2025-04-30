const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { cleanHtmlFile } = require('../src/html-cleaner');

describe('HTML Cleaner Unit Test', () => {
  // Create temp files for testing
  const tempDir = os.tmpdir();
  const inputPath = path.join(tempDir, 'test-input.html');
  const outputPath = path.join(tempDir, 'test-output.html');
  
  const testHtml = `<!DOCTYPE html>
<html>
<body bgcolor="white" width="800">
  <center><h1>Test</h1></center>
  <div align="center">Content</div>
  <font color="red">Text</font>
</body>
</html>`;

  beforeAll(async () => {
    // Write test HTML to input file
    await fs.writeFile(inputPath, testHtml, 'utf8');
  });

  afterAll(async () => {
    // Clean up test files
    try {
      await fs.unlink(inputPath);
      await fs.unlink(outputPath);
    } catch (err) {
      // Ignore errors if files don't exist
    }
  });

  test('should clean HTML file with options', async () => {
    const options = {
      'remove-attributes': ['bgcolor', 'width'],
      'remove-tags': ['center', 'font']
    };

    // Clean the HTML
    const result = await cleanHtmlFile(inputPath, outputPath, options);

    // Verify result object
    expect(result).toEqual({
      success: true,
      inputPath,
      outputPath
    });

    // Verify output file exists
    const outputExists = await fs.pathExists(outputPath);
    expect(outputExists).toBe(true);

    // Read and verify output content
    const outputContent = await fs.readFile(outputPath, 'utf8');
    expect(outputContent).not.toContain('bgcolor="white"');
    expect(outputContent).not.toContain('width="800"');
    // Content should be preserved
    expect(outputContent).toContain('Test');
    expect(outputContent).toContain('Content');
    expect(outputContent).toContain('Text');
  });
});