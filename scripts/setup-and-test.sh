#!/bin/bash
set -e

# Colors for pretty output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up clean-html-cli...${NC}"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

# Create required directories
echo -e "${BLUE}Creating required directories...${NC}"
mkdir -p config output fixtures test/output

# Run tests
echo -e "${BLUE}Running tests...${NC}"
npm test

echo -e "${GREEN}Setup complete and tests passed! You can now use the clean-html-cli:${NC}"
echo -e "npm start"