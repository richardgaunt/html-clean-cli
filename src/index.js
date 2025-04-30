#!/usr/bin/env node

const { runCli } = require('./cli');

async function main() {
  try {
    await runCli();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
