// Set a longer timeout for all tests since we're dealing with file operations
jest.setTimeout(30000);

// Mock console output to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

// Mock process.cwd() to return a consistent value
const originalCwd = process.cwd;
process.cwd = jest.fn().mockImplementation(() => originalCwd());
