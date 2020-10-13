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
 * Our own NODE_ENV.
 *
 * We should be using this throughout our codebase rather than process.env.NODE_ENV
 *
 * Not guaranteed to match process.env.NODE_ENV
 *
 * This is needed as NextJS under some circumstances doesn't allow applying a different NODE_ENV.
 * Particularly for `next build` where we need to pass in `NODE_ENV=test` for E2E testing
 */
export /* istanbul ignore next; Development only */ const NODE_ENV =
  process.env.NEXT_PUBLIC_NODE_ENV_OVERRIDE ?? process.env.NODE_ENV ?? 'development'

/**
 * Allows us to test out the production API locally while developing.
 *
 * Simply set `NEXT_PUBLIC_PRODUCTION_CONFIG_IN_DEVELOPMENT=true` before spinning up the app.
 *
 * You may need to clear your localstorage to get the app to reauth.
 */
export const isTestingProductionConfigInDevelopment =
  process.env.NEXT_PUBLIC_PRODUCTION_CONFIG_IN_DEVELOPMENT === 'true'

export /* istanbul ignore next; Development only */ const config =
  NODE_ENV === 'production' || isTestingProductionConfigInDevelopment ? productionConfig : mockConfig
