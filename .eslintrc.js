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

    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',

    'plugin:jsx-a11y/recommended',

    'plugin:promise/recommended',

    'plugin:react/recommended',

    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint', 'jsx-a11y', 'promise', 'react-hooks', 'simple-import-sort'],
  rules: {
    // Off because favoring @typescript-eslint/naming-convention instead.
    camelcase: 'off',

    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 1, maxEOF: 1 }],

    // Disabling the base rule as it can report incorrect errors and is recommended by
    // @typescript-eslint/no-unused-vars.
    'no-unused-vars': 'off',

    'padded-blocks': 'off',

    'promise/catch-or-return': ['error', { allowFinally: true }],

    // Off because we are using `simple-import-sort` instead.
    'sort-imports': 'off',

    // Off because we are using `simple-import-sort` instead.
    'import/order': 'off',

    // Allows to use an `a` element without an `href` attribute inside a `Link`
    // component which in our case is a Next.js Link component.
    // See https://github.com/evcohen/eslint-plugin-jsx-a11y/issues/402#issuecomment-368305051.
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        aspects: ['invalidHref', 'preferButton'],
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
      },
    ],

    'react/display-name': 'off',
    'react/jsx-child-element-spacing': 'warn',
    'react/jsx-closing-bracket-location': 'error',
    'react/jsx-closing-tag-location': 'error',
    'react/jsx-curly-newline': 'error',
    'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],
    'react/jsx-equals-spacing': 'error',
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-tag-spacing': 'error',
    'react/no-unsafe': ['error', { checkAliases: true }],

    // Off because we are using TypeScript which expects us to declare the props.
    'react/prop-types': 'off',

    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: 'useDataSource',
      },
    ],

    'simple-import-sort/sort': 'error',

    // Off because it is deprecated and favoring @typescript-eslint/naming-convention
    // instead.
    '@typescript-eslint/camelcase': 'off',

    '@typescript-eslint/explicit-function-return-type': 'off',

    // The Experiment API uses snake_case, so we decided to disable enforcing
    // camelcase.
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['strictCamelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'enumMember',
        format: ['StrictPascalCase'],
      },
      {
        selector: 'function',
        format: ['strictCamelCase', 'StrictPascalCase'],
      },
      {
        selector: 'parameter',
        format: ['strictCamelCase'],
        leadingUnderscore: 'allow', // For indicating unused parameter to TypeScript.
      },
      {
        selector: 'property',
        format: ['snake_case', 'strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'variable',
        format: ['strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['strictCamelCase'],
        leadingUnderscore: 'require',
      },
      {
        selector: 'typeLike',
        format: ['StrictPascalCase'],
      },
    ],

    '@typescript-eslint/no-unused-vars': 'error',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './']],
        extensions: ['.ts', '.json', '.tsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
}
