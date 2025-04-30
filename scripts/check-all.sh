#!/bin/bash
set -e

# Colors for pretty output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Running all checks...${NC}"

# Run tests
echo -e "${BLUE}Running tests...${NC}"
npm test
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Tests passed${NC}"
else
  echo -e "${RED}✗ Tests failed${NC}"
  exit 1
fi

# Run linting
echo -e "${BLUE}Running linter...${NC}"
npm run lint
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Linting passed${NC}"
else
  echo -e "${RED}✗ Linting failed${NC}"
  exit 1
fi

# Check dependency audit
echo -e "${BLUE}Running npm audit...${NC}"
npm audit --production
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Dependency audit passed${NC}"
else
  echo -e "${RED}! Dependency audit found issues${NC}"
  # Don't exit with error on audit warnings
fi

echo -e "${GREEN}All checks completed successfully!${NC}"