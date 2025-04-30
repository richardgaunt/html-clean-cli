const path = require('path');
const fs = require('fs-extra');
const { selectInputFile, selectOutputPath } = require('../src/file-selector');
const { glob } = require('glob');

// Mock the dependencies
jest.mock('glob');
jest.mock('fs-extra');
jest.mock('@inquirer/prompts', () => ({
  input: jest.fn()
}));

describe('File Selector', () => {
  const testFile = '/home/user/test.html';
  const { input } = require('@inquirer/prompts');
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Set up default mock implementations
    glob.mockResolvedValue([testFile]);
    fs.stat.mockResolvedValue({ isFile: () => true });
    input.mockResolvedValue(testFile);
  });
  
  describe('selectInputFile', () => {
    test('returns valid HTML file path', async () => {
      const result = await selectInputFile();
      
      // Verify the input prompt was called
      expect(input).toHaveBeenCalled();
      
      // Verify the file was validated
      expect(fs.stat).toHaveBeenCalledWith(testFile);
      
      // Verify the correct path was returned
      expect(result).toBe(testFile);
    });
    
    test('throws error for non-HTML file', async () => {
      const nonHtmlFile = '/home/user/test.txt';
      input.mockResolvedValue(nonHtmlFile);
      fs.stat.mockResolvedValue({ isFile: () => true });
      
      await expect(selectInputFile()).rejects.toThrow('Invalid file');
    });
    
    test('throws error for non-existent file', async () => {
      fs.stat.mockRejectedValue(new Error('File not found'));
      
      await expect(selectInputFile()).rejects.toThrow('Invalid file');
    });
    
    test('throws error for directory', async () => {
      fs.stat.mockResolvedValue({ isFile: () => false });
      
      await expect(selectInputFile()).rejects.toThrow('Invalid file');
    });
  });
  
  describe('selectOutputPath', () => {
    test('returns output path with default directory', async () => {
      const expectedOutputPath = path.join(process.cwd(), 'output', path.basename(testFile));
      
      const result = await selectOutputPath(testFile);
      
      // Verify the input prompt was called with default value
      expect(input).toHaveBeenCalledWith(expect.objectContaining({
        default: expectedOutputPath
      }));
      
      // Verify the directory was created
      expect(fs.ensureDir).toHaveBeenCalledWith(path.dirname(expectedOutputPath));
      
      // Verify the correct path was returned
      expect(result).toBe(testFile);
    });
  });
});