import { getExperimentsAuthInfo } from '@/utils/auth'

import UnauthorizedError from './UnauthorizedError'

const DEVELOPMENT_API_URL_ROOT = 'https://virtserver.swaggerhub.com/yanir/experiments/0.1.0'
const PRODUCTION_API_URL_ROOT = 'https://public-api.wordpress.com/wpcom/v2/experiments/0.1.0'

/**
 * Makes a request to the Experiment Platform's API with any necessary
 * authorization information, parses the response as JSON, and returns the parsed
 * response.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function fetchApi(method: string, path: string, body: BodyInit | null = null) {
  const apiUrlRoot = window.location.host === 'experiments.a8c.com' ? PRODUCTION_API_URL_ROOT : DEVELOPMENT_API_URL_ROOT

  let headers
  if (apiUrlRoot === PRODUCTION_API_URL_ROOT) {
    const accessToken = getExperimentsAuthInfo()?.accessToken
    if (!accessToken) {
      throw new UnauthorizedError()
    }
    headers = new Headers({ Authorization: `Bearer ${accessToken}` })
  }

  return (
    await fetch(`${apiUrlRoot}${path}`, {
      method,
      headers,
      body,
    })
  ).json()
}

export { fetchApi }
