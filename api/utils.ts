import { config } from '@/config'
import { getExperimentsAuthInfo } from '@/utils/auth'

import NotFoundError from './NotFoundError'
import UnauthorizedError from './UnauthorizedError'

/**
 * Makes a request to the Experiment Platform's API with any necessary
 * authorization information, parses the response as JSON, and returns the parsed
 * response.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function fetchApi(method: string, path: string, body: unknown | null = null) {
  /* istanbul ignore next; code branch not reachable in integration tests -- we don't hit production */
  const apiUrlRoot = config.experimentApi.rootUrl

  const headers = new Headers()
  /* istanbul ignore next; code branch not reachable in integration tests -- we don't hit production */
  if (config.experimentApi.needsAuth) {
    const accessToken = getExperimentsAuthInfo()?.accessToken
    if (!accessToken) {
      throw new UnauthorizedError()
    }
    headers.append('Authorization', `Bearer ${accessToken}`)
  }

  if (body !== null) {
    headers.append('Content-Type', 'application/json')
  }

  const response = await fetch(`${apiUrlRoot}${path}`, {
    method,
    headers,
    body: body === null ? null : JSON.stringify(body),
  })

  // istanbul ignore next; branch can't be reached with the current tests.
  if (response.status === 404) {
    throw new NotFoundError()
  }

  return response.json()
}

export { fetchApi }
