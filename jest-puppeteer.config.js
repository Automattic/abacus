require('dotenv').config()

const developmentMode = process.env.PUPPETEER_HEADLESS === 'false'

const defaultConfig = {
  server: {
    command:
      'echo "Building app..." && REACT_APP_E2E_TEST_BUILD=true npm run build && echo "Starting app..." && npm run start -- -l 3001',
    debug: true, // Allows us to see the output of the above commands.
    launchTimeout: 300 * 1000,
    port: 3001,
  },
}

const developmentConfig = {
  ...defaultConfig,
  launch: {
    headless: false,
    slowMo: 500,
    devtools: true,
  },
  server: {
    ...defaultConfig.server,
    // We only start the app, so it doesn't have to get built every time:
    command: `echo && echo "E2E Development Mode: SKIPPING BUILD!" && echo "Run 'NEXT_PUBLIC_NODE_ENV_OVERRIDE=test npm run build' to rebuild" && echo && echo "Starting app..." && npm run start -- -p 3001`,
  },
}

module.exports = developmentMode ? developmentConfig : defaultConfig
