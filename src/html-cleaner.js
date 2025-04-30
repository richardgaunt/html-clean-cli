const fs = require('fs-extra');
const cleaner = require('clean-html');

// Convert the clean-html callback API to a Promise-based one
function cleanHtml(input, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      cleaner.clean(input, options, (output) => {
        resolve(output);
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function cleanHtmlFile(inputPath, outputPath, options) {
  try {
    // Read the input file
    const input = await fs.readFile(inputPath, 'utf8');
    
    // Clean the HTML
    const output = await cleanHtml(input, options);
    
    // Write the cleaned HTML to the output file
    await fs.writeFile(outputPath, output, 'utf8');
    
    return {
      success: true,
      inputPath,
      outputPath
    };
  } catch (error) {
    throw new Error(`Failed to clean HTML: ${error.message}`);
  }
}

module.exports = {
  cleanHtmlFile
};