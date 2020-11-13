// This script exports CRA's default jest config.
//
// This isn't public api but it is stable and we will know straight away if it stops working.
// It is also fairly straight forward to code this by hand as well.
// See /node_modules/react-scripts/scripts/test.js for more info.

process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'
process.env.PUBLIC_URL = ''
require('react-scripts/config/env')

const path = require('path')
const createJestConfig = require('react-scripts/scripts/utils/createJestConfig')

module.exports = createJestConfig(
  (relativePath) => require.resolve(path.join('react-scripts', relativePath)),
  __dirname, // given that Jest config is in project root
  false,
)
