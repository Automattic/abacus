// Most of this file is based on
// https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb.

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  // The following based on
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md.
  //
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  extends: [
    'eslint:recommended',

    'plugin:@typescript-eslint/eslint-recommended',

    'plugin:@typescript-eslint/recommended',

    // Note: `recommended-requiring-type-checking` have type-aware rules. This comes
    // with a performance penalty. For small projects, this is usually negligible.
    // It is recommended to separate the linting into two stagings once the type-aware
    // checking becomes a productivity issue. See second half of the "Recommended
    // Configs" section at
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#recommended-configs.
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    'plugin:react/recommended',

    // Disables react-specific linting rules that conflict with prettier.
    'prettier/react',

    // Uses `eslint-config-prettier` to disable ESLint rules from
    // `@typescript-eslint/eslint-plugin` that would conflict with prettier.
    'prettier/@typescript-eslint',

    // Enables `eslint-plugin-prettier` and displays prettier errors as ESLint errors.
    // Make sure this is always the last configuration in the extends array.
    // The advantage of having prettier setup as an ESLint rule using
    // `eslint-plugin-prettier` is that code can automatically be fixed using ESLint's
    // `--fix` option.
    'plugin:prettier/recommended',

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

    // Disabling the base rule as it can report incorrect errors.
    'no-unused-vars': 'off',

    'padded-blocks': 'off',

    // Off because we are using TypeScript which expects us to declare the props.
    'react/prop-types': 'off',

    '@typescript-eslint/explicit-function-return-type': 'off',

    '@typescript-eslint/no-unused-vars': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
