module.exports = {
  server: {
    command: 'echo "Building app..." && npm run build && echo "Starting app..." && npm run start',
    debug: true, // Allows use to see the output of the above commands.
    launchTimeout: 30 * 1000,
    port: 3000,
  },
}
