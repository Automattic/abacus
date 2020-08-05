# Abacus: Automattic's Experimentation Platform UI

[![CircleCI](https://circleci.com/gh/Automattic/abacus.svg?style=svg)](https://circleci.com/gh/Automattic/abacus)

## Getting Started

### Requirements

- `npm`

### Update Your System Host File

In order for our OAuth authorization to work, it needs to be given a redirect URI that has been declared as acceptable. In order to aid with using the site locally, add the following DNS mapping to your system's host file.

```
127.0.0.1 a8c-abacus-local
```

### Spin up your Development server

```bash
npm install
npm run dev
```

### Check your code

```bash
# Run all tests and checks
npm run verify

# Code testing
npm run test:all

npm run test:e2e
npm run test:e2e -- --watch
npm run test:e2e -- --updateSnapshot

npm run test:integration
npm run test:integration -- --watch
npm run test:integration -- --updateSnapshot

npm run test:unit
npm run test:unit -- -- --watch
npm run test:unit -- -- --updateSnapshot


# Code formatting
npm run format:check
npm run format # Fixes formatting

# Code linting
npm run lint
npm run lint:ts:fix # Fixes lint issues
```

### Build for Deployment

```bash
npm run build
```

## Testing Tips/Notes

### Where to find tests

- Integration: `/__tests__`
- E2E: `/e2e`
- Unit tests: Rest of the codebase, alongside file it is testing.

### E2E Testing tips

Our e2e tests use Jest and Puppeteer in a headless Chrome browser.

#### Smoke Tests:

We have smoke tests that are inteded to be used in development for quick iterations.

```
npm run test:e2e:smoke
```

#### Debugging

For debugging, you'll likely want to run with a full visual browser. To do that:

1. Create a .env file at the project's root if it does not already exist.
   You can copy the .env.example file as an initial template.
1. Add `PUPPETEER_HEADLESS=false`.
   This will cause the E2E tests to run in a browser that can be visually seen.

See https://developers.google.com/web/tools/puppeteer/debugging for more debugging tips.

### Use Production Config/APIs

Since we don't have a mock server it is important to test on the Production config/APIs.

To do so, spin up your dev server like this:

```bash
NEXT_PUBLIC_PRODUCTION_CONFIG_IN_DEVELOPMENT=true npm run dev
```

See `/config.ts` for more info.

### Auth Flow

We don't currently have a log-out feature but it can be necessary to log a user out for testing, this is how to do so manually:

Once a user is authenticated and they authorize Abacus to have access, we save the authorization info in local storage under the key `experiments_auth_info`. To simulate using Abacus on a new browser or the access token expiring, you can remove this item from local storage using the Chrome devtools > Application tab.

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

## Advanced Tools

### Docker (_Not Recommended_)

You can use the following commands to run the server in a Docker container:

- `npm run docker-build`: Build a docker image that runs a production Abacus server at port 3000.
- `npm run docker-start`: Run the above docker image, mapping port 3000 from the image to port 8888 on your local machine.

### Bundle Analysis (_Not Recommended_)

_Shouldn't be a concern for this App_

The Next.js build creates two bundles of files. One for the client and one for the server.

Running the following will build, analyze, and open two browser windows with a report on the client and server bundles.

```sh
npm run analyze
```
