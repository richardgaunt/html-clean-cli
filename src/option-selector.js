const { checkbox, input, confirm, select } = require('@inquirer/prompts');

const OPTION_DEFINITIONS = {
  'allow-attributes-without-values': {
    type: 'boolean',
    default: false,
    description: 'Allows attributes to be output without values (e.g., `checked` instead of `checked=""`).'
  },
  'break-around-comments': {
    type: 'boolean',
    default: true,
    description: 'Adds line breaks before and after comments.'
  },
  'break-around-tags': {
    type: 'array',
    default: ['body', 'blockquote', 'br', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr',
      'link', 'meta', 'p', 'table', 'title', 'td', 'tr'],
    description: 'Tags that should have line breaks added before and after.',
    configurable: true
  },
  'decode-entities': {
    type: 'boolean',
    default: false,
    description: 'Replaces HTML entities with their decoded equivalents.'
  },
  'indent': {
    type: 'string',
    default: '  ',
    description: 'The string to use for indentation.',
    configurable: true
  },
  'lower-case-tags': {
    type: 'boolean',
    default: true,
    description: 'Converts all tag names to lower case.'
  },
  'lower-case-attribute-names': {
    type: 'boolean',
    default: true,
    description: 'Converts all attribute names to lower case.'
  },
  'preserve-tags': {
    type: 'array',
    default: ['script', 'style'],
    description: 'Tags that should be left alone (content will not be formatted or indented).',
    configurable: true
  },
  'remove-attributes': {
    type: 'array',
    default: ['align', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'color', 'height', 'target',
      'valign', 'width'],
    description: 'Attributes to remove from markup.',
    configurable: true
  },
  'remove-comments': {
    type: 'boolean',
    default: false,
    description: 'Removes comments.'
  },
  'remove-empty-tags': {
    type: 'array',
    default: [],
    description: 'Tags to remove from markup if empty.',
    configurable: true
  },
  'remove-tags': {
    type: 'array',
    default: ['center', 'font'],
    description: 'Tags to always remove from markup. Nested content is preserved.',
    configurable: true
  },
  'wrap': {
    type: 'number',
    default: 120,
    description: 'The column number where lines should wrap. Set to 0 to disable line wrapping.',
    configurable: true
  },
  'add-break-around-tags': {
    type: 'array',
    default: null,
    description: 'Additional tags to include in break-around-tags.',
    configurable: true
  },
  'add-remove-attributes': {
    type: 'array',
    default: null,
    description: 'Additional attributes to include in remove-attributes.',
    configurable: true
  },
  'add-remove-tags': {
    type: 'array',
    default: null,
    description: 'Additional tags to include in remove-tags.',
    configurable: true
  }
};

async function selectOptions(preselectedOptions = null) {
  // Create choices for the checkbox prompt
  const choices = Object.entries(OPTION_DEFINITIONS).map(([key, definition]) => ({
    name: `${key}: ${definition.description.split('.')[0]}`,
    value: key,
    checked: preselectedOptions ? preselectedOptions[key] !== undefined : false
  }));

  const selectedOptionKeys = await checkbox({
    message: 'Select options to apply:',
    choices,
    pageSize: 15
  });

  if (selectedOptionKeys.length === 0) {
    console.log('No options selected. Using default clean-html options.');
    return {};
  }

  const options = {};
  
  // Configure each selected option
  for (const key of selectedOptionKeys) {
    const definition = OPTION_DEFINITIONS[key];
    
    if (definition.type === 'boolean') {
      options[key] = await confirm({
        message: `Enable ${key}?`,
        default: definition.default
      });
    } else if (definition.type === 'number') {
      options[key] = parseInt(await input({
        message: `Enter value for ${key}:`,
        default: definition.default.toString(),
        validate: (value) => {
          const num = parseInt(value);
          if (isNaN(num)) return 'Please enter a valid number';
          return true;
        }
      }));
    } else if (definition.type === 'string') {
      options[key] = await input({
        message: `Enter value for ${key}:`,
        default: definition.default
      });
    } else if (definition.type === 'array' && definition.configurable) {
      const defaultStr = definition.default ? definition.default.join(', ') : '';
      
      const arrayInput = await input({
        message: `Enter comma-separated values for ${key}:`,
        default: defaultStr
      });
      
      options[key] = arrayInput
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
  }
  
  return options;
}

module.exports = {
  selectOptions,
  OPTION_DEFINITIONS
};