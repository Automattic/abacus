// Allows developers to set developer specific environment variables. Commonly used
// for debugging purposes or to use a non-production resource.
require('dotenv').config()

const path = require('path')

const nextBundleAnalyzer = require('@next/bundle-analyzer')

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextJsConfig = {
  webpack: (webpackConfig, webpackDefaults) => {
    webpackConfig.resolve.alias['@'] = path.join(__dirname)

    return webpackConfig
  },
}

module.exports = withBundleAnalyzer(nextJsConfig)
