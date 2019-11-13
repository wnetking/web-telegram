module.exports = {
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true,
      forOf: true,
      blockBindings: true,
      arrowFunctions: true,
      classes: true,
      defaultParams: true,
      destructuring: true,
      generators: true,
      restParams: true,
      spread: true,
      superInFunctions: true,
      templateStrings: true,
      experimentalObjectRestSpread: true,
      experimentalDecorators: true
    }
  },
  rules: {
    // 'prefer-const'               : 'warn',
    'no-var': 'warn',
    'no-const-assign': 'warn',
    'object-shorthand': 'warn',
    'no-loop-func': 'warn',
    'prefer-rest-params': 'warn',
    'space-before-blocks': 'warn',
    'prefer-spread': 'warn',
    'no-param-reassign': 'warn',
    'prefer-arrow-callback': 'warn',
    'arrow-spacing': 'warn',
    'arrow-parens': 'warn',
    'arrow-body-style': 'warn',
    'no-dupe-class-members': 'warn',
    'no-duplicate-imports': 'warn',
    'no-iterator': 'warn',
    'no-unused-vars': 'warn',
    'no-restricted-syntax': 'warn',
    'generator-star-spacing': 'warn',
    'dot-notation': 'warn',
    'no-restricted-properties': 'warn',
    'no-plusplus': 'warn',
    'no-unneeded-ternary': 'warn',
    'brace-style': 'warn',
    'spaced-comment': 'warn',
    'keyword-spacing': 'warn',
    'space-infix-ops': 'warn',
    semi: [
      'warn',
      'always',
      {
        omitLastInOneLineBlock: true
      }
    ],
    radix: 'warn',
    // 'new-cap': 'warn',
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline'
      }
    ],
    indent: [
      'warn',
      2,
      {
        VariableDeclarator: {
          var: 2,
          let: 2,
          const: 3
        },
        SwitchCase: 1
      }
    ],
    'jsx-quotes': ['warn', 'prefer-double'],
    quotes: ['warn', 'single'],
    'quote-props': ['warn', 'as-needed'],
    'no-multi-spaces': 'warn',
  }
};
