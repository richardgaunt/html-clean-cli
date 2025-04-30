const path = require('path');

// Mock fs-extra module - we need to define our mocks before requiring any module
const fsReadFileMock = jest.fn().mockResolvedValue('<html></html>');
const fsWriteFileMock = jest.fn().mockResolvedValue(undefined);

jest.mock('fs-extra', () => ({
  readFile: fsReadFileMock,
  writeFile: fsWriteFileMock,
  pathExists: jest.fn().mockResolvedValue(true)
}));

// Mock clean-html module
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

// Import the module after mocks
const { cleanHtmlFile } = require('../src/html-cleaner');

describe('HTML Cleaner', () => {
  const fixtureDir = path.join(process.cwd(), 'fixtures');
  const outputDir = path.join(process.cwd(), 'test', 'output');
  const testHtmlPath = path.join(fixtureDir, 'test.html');
  const outputHtmlPath = path.join(outputDir, 'test-output.html');

  beforeEach(() => {
    // Clear all mocks
    mockClean.mockClear();
    fsReadFileMock.mockClear();
    fsWriteFileMock.mockClear();
  });

  test('cleans HTML with default options', async () => {
    const defaultOptions = {};
    
    const result = await cleanHtmlFile(testHtmlPath, outputHtmlPath, defaultOptions);
    
    // Check if fs.readFile was called with correct path
    expect(fsReadFileMock).toHaveBeenCalledWith(testHtmlPath, 'utf8');
    
    // Check if clean function was called with correct parameters
    expect(mockClean).toHaveBeenCalledWith(
      expect.any(String),
      defaultOptions,
      expect.any(Function)
    );
    
    // Check if fs.writeFile was called with correct parameters
    expect(fsWriteFileMock).toHaveBeenCalledWith(
      outputHtmlPath,
      expect.any(String),
      'utf8'
    );
    
    // Verify the result object
    expect(result).toEqual({
      success: true,
      inputPath: testHtmlPath,
      outputPath: outputHtmlPath
    });
  });
  
  test('cleans HTML with custom options', async () => {
    const customOptions = {
      'remove-attributes': ['align', 'bgcolor', 'width'],
      'remove-tags': ['center', 'font'],
      'lower-case-tags': true
    };
    
    const customOutputPath = path.join(outputDir, 'test-custom.html');
    await cleanHtmlFile(testHtmlPath, customOutputPath, customOptions);
    
    // Check if clean-html was called with correct options
    expect(mockClean).toHaveBeenCalledWith(
      expect.any(String),
      customOptions,
      expect.any(Function)
    );
    
    // Check if output was written to the correct file
    expect(fsWriteFileMock).toHaveBeenCalledWith(
      customOutputPath,
      expect.any(String),
      'utf8'
    );
  });
  
  test('throws error when input file does not exist', async () => {
    // Mock readFile to reject for this specific test
    fsReadFileMock.mockRejectedValueOnce(new Error('File not found'));
    
    const nonExistentPath = path.join(fixtureDir, 'non-existent.html');
    const outputPath = path.join(outputDir, 'error-output.html');
    
    await expect(
      cleanHtmlFile(nonExistentPath, outputPath, {})
    ).rejects.toThrow('Failed to clean HTML');
  });
});