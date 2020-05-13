require('dotenv').config()
const { toBool } = require('qc-to_bool')

module.exports = {
  launch: {
    headless: toBool(process.env.PUPPETEER_HEADLESS, true),
  },
  server: {
    command: 'echo "Building app..." && npm run build && echo "Starting app..." && npm run start',
    debug: true, // Allows us to see the output of the above commands.
    launchTimeout: 60 * 1000,
    port: 3000,
  },
}
