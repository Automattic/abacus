module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
    camelcase: ['error', { allow: ['_unused$'] }],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
      imports: 'always-multiline',
      objects: 'always-multiline',
    }],
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 1, maxEOF: 1 }],
    'padded-blocks': ['off'],

    // Off because we are using TypeScript which expects us to declare the props.
    'react/prop-types': 'off',

    '@typescript-eslint/explicit-function-return-type': 'off',

    // The standard `no-unused-vars` rule is handling unused variables.
    // Off because it incorrectly detects whether a variable is unused.
    // '@typescript-eslint/no-unused-vars': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
