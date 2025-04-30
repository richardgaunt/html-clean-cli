// Set a longer timeout for all tests since we're dealing with file operations
jest.setTimeout(10000);

// Mock console output to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn()
};
