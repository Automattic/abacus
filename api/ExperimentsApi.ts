import { Experiment } from '@/models/index'
import { getExperimentsAuthInfo } from '@/utils/auth'

import UnauthorizedError from './UnauthorizedError'

const DEVELOPMENT_API_URL_ROOT = 'https://virtserver.swaggerhub.com/yanir/experiments/0.1.0'
const PRODUCTION_API_URL_ROOT = 'https://public-api.wordpress.com/wpcom/v2/experiments/0.1.0'

function resolveApiUrlRoot() {
  return window.location.host === 'experiments.a8c.com' ? PRODUCTION_API_URL_ROOT : DEVELOPMENT_API_URL_ROOT
}

/**
 * Finds all the available experiments.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findAll(): Promise<Experiment[]> {
  const apiUrlRoot = resolveApiUrlRoot()

  const accessToken = getExperimentsAuthInfo()?.accessToken
  if (!accessToken) {
    throw new UnauthorizedError()
  }

  const fetchUrl = `${apiUrlRoot}/experiments`
  return fetch(fetchUrl, {
    method: 'GET',
    headers:
      apiUrlRoot === PRODUCTION_API_URL_ROOT ? new Headers({ Authorization: `Bearer ${accessToken}` }) : undefined,
  })
    .then((response) => response.json())
    .then((result) => result.experiments)
}

const ExperimentsApi = {
  findAll,
}

export default ExperimentsApi
