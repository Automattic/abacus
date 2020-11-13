const productionConfig = {
  experimentApi: {
    needsAuth: true,
    authPath: 'https://public-api.wordpress.com/oauth2/authorize',
    authClientId: 68795,
    rootUrl: 'https://public-api.wordpress.com/wpcom/v2/experiments/0.1.0',
  },
}

const mockConfig = {
  experimentApi: {
    needsAuth: false,
    authPath: 'http://example.com',
    authClientId: 68797,
    rootUrl: 'https://virtserver.swaggerhub.com/yanir/experiments/0.1.0',
  },
}

/**
 * Allows us to test out the production API locally while developing.
 */
export const isE2eTestBuild = process.env.REACT_APP_E2E_TEST_BUILD === 'true'

/**
 * Allows us to test out the production API locally while developing.
 *
 * Simply set `REACT_APP_PRODUCTION_CONFIG_IN_DEVELOPMENT=true` before spinning up the app.
 *
 * You may need to clear your localstorage to get the app to reauth.
 */
export const isTestingProductionConfigInDevelopment = process.env.REACT_APP_PRODUCTION_CONFIG_IN_DEVELOPMENT === 'true'

// istanbul ignore next; Development only
if (isE2eTestBuild && isTestingProductionConfigInDevelopment) {
  throw new Error('Invalid config switch combination: isE2ETestBuild && isTestingProductionConfigInDevelopment')
}

export /* istanbul ignore next; Development only */ const config =
  (process.env.NODE_ENV === 'production' || isTestingProductionConfigInDevelopment) && !isE2eTestBuild
    ? productionConfig
    : mockConfig
