# Abacus: Automattic's Experimentation Platform UI

[![CircleCI](https://circleci.com/gh/Automattic/abacus.svg?style=svg)](https://circleci.com/gh/Automattic/abacus)

## Getting started

Run `npm install` to install dependencies, then run one of the following commands:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm start`: Runs the built app in production mode.

## Scripts

All the scripts for this project are initiated via npm scripts. Please see the `"scripts"` section in `package.json`.

### Bundle Analysis

The Next.js build creates two bundles of files. One for the client and one for the server.

Running the following will build, analyze, and open two browser windows with a report on the client and server bundles.

```sh
npm run analyze
```

### Component Building

See the Storybook section below.

### Linting

**lint**

Runs all the linters.

```sh
npm run lint
```

**lint:css**

Runs a linter on all the styling code.

```sh
npm run lint:css
```

**lint:css:fix**

Runs a linter on all the styling code and fixes issues that are fixable.

```sh
npm run lint:css:fix
```

**lint:js**

Runs a linter on all the JavaScript and TypeScript code including those with JSX.

```sh
npm run lint:js
```

**lint:js:fix**

Runs a linter on all the JavaScript and TypeScript code and fixes any found issues that are fixable.

```sh
npm run lint:js:fix
```

### Pre-Commit Hooks

Pre-commit hooks have been put in place via `husky` which will run the `precommit` NPM script. This script runs `lint-staged` but could be used to run different or more commands. The `lint-staged` command will run commands on only the staged files of the commit according to the configuration. The `lint-staged` configuration is in `package.json`.

### Storybook

Storybook allows you to render components in isolation.

This is useful when building components. It allows you to create "stories" for the various states that the component can be in.

Storybook can be used for other purposes too. You could run e2e tests on it to ensure components are functioning as expected. It could be used to render a style guide too.

To run Storybook:

```sh
npm run storybook
```

This will open a browser window of the Storybook webapp.

### Testing

**test:unit**

Runs the unit tests with Jest.

The unit tests are found throughout the project excluding tests in the `__tests__` directory which is being reserved for integration tests.

```sh
npm run test:unit
npm run test:unit -- --coverage
npm run test:unit -- --watch
```

**test:e2e**

Runs the end-to-end tests with Jest and Puppeteer in a headless Chrome browser.

```sh
# Run all the E2E tests
npm run test:e2e
# Run just the E2E smoke tests (intended to be used in development for quick iterations)
npm run test:e2e:smoke
```

### Verification

Format checks, linting, and testing are all forms of verification. As a convenience, we have the `verify` NPM script that will run all the checks.

```sh
npm run verify
```
