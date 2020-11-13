require('dotenv').config()

module.exports = {
  launch: {
    headless: process.env.PUPPETEER_HEADLESS === 'false' ? false : true,
  },
  server: {
    command:
      'echo "Building app..." && NEXT_PUBLIC_NODE_ENV_OVERRIDE=test npm run build && echo "Starting app..." && npm run start -- -p 3001',
    debug: true, // Allows us to see the output of the above commands.
    launchTimeout: 180 * 1000,
    port: 3001,
  },
}
