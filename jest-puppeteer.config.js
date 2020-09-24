require('dotenv').config()
const { toBool } = require('qc-to_bool')

module.exports = {
  launch: {
    headless: toBool(process.env.PUPPETEER_HEADLESS, true),
  },
  server: {
    command:
      'echo "Building app..." && NEXT_PUBLIC_NODE_ENV_OVERRIDE=test npm run build && echo "Starting app..." && npm run start -- -p 3001',
    debug: true, // Allows us to see the output of the above commands.
    launchTimeout: 180 * 1000,
    port: 3001,
  },
}
