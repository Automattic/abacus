import { Experiment } from '@/models/index'
import { getExperimentsAuthInfo } from '@/utils/auth'

import UnauthorizedError from './UnauthorizedError'

const DEVELOPMENT_API_URL_ROOT = 'https://virtserver.swaggerhub.com/yanir/experiments/0.1.0'
const PRODUCTION_API_URL_ROOT = 'https://public-api.wordpress.com/wpcom/v2/experiments/0.1.0'

function resolveApiUrlRoot(host: string) {
  const url = host === 'experiments.a8c.com' ? PRODUCTION_API_URL_ROOT : DEVELOPMENT_API_URL_ROOT
  return url
}

/**
 * Finds all the available experiments.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findAll(): Promise<Experiment[]> {
  const apiUrlRoot = resolveApiUrlRoot(window.location.host)

  const headers: HeadersInit = new Headers()
  const experimentsApiAuthInfo = getExperimentsAuthInfo()
  if (experimentsApiAuthInfo) {
    if (!experimentsApiAuthInfo.accessToken) {
      throw new UnauthorizedError()
    }
    headers.append('Authorization', `Bearer ${experimentsApiAuthInfo.accessToken}`)
  }

  const fetchUrl = `${apiUrlRoot}/experiments`
  return fetch(fetchUrl, {
    method: 'GET',
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      const { experiments } = result

      return experiments
    })
}

const ExperimentsApi = {
  findAll,
}

export default ExperimentsApi
