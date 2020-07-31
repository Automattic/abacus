const productionConfig = {
  experimentApi: {
    needsAuth: true,
    authPath: 'https://public-api.wordpress.com/oauth2/authorize',
    authClientId: 68795,
    rootUrl: 'https://public-api.wordpress.com/wpcom/v2/experiments/0.1.0',
  },
}

const developmentConfig = {
  experimentApi: {
    needsAuth: false,
    authPath: null,
    authClientId: 68797,
    rootUrl: 'https://virtserver.swaggerhub.com/yanir/experiments/0.1.0',
  },
}

export const isTestingProductionConfigInDevelopment = false

const isProduction = false

export const config = isProduction || isTestingProductionConfigInDevelopment ? productionConfig : developmentConfig
