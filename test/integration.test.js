const fs = require('fs');
const path = require('path');
const cleaner = require('clean-html');

describe('Clean HTML Integration Test', () => {
  const fixtureHtml = `<!DOCTYPE html>
<html>
<body bgcolor="white" width="800">
  <center><h1>Test</h1></center>
  <div align="center">Content</div>
  <font color="red">Text</font>
</body>
</html>`;
  
  test('should clean HTML using the clean-html package', done => {
    // Define test options
    const options = {
      'remove-attributes': ['bgcolor', 'width'],
      'remove-tags': ['center', 'font'],
      'lower-case-tags': true
    };
    
    // Call clean-html directly
    cleaner.clean(fixtureHtml, options, output => {
      // Check if removed attributes and tags are gone
      expect(output).not.toContain('bgcolor="white"');
      expect(output).not.toContain('width="800"');
      expect(output).not.toContain('<center>');
      expect(output).not.toContain('<font');
      
      // Content should still be preserved
      expect(output).toContain('<h1>Test</h1>');
      expect(output).toContain('Content');
      expect(output).toContain('Text');
      
      done();
    });
  });
});