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
async function fetchApi(method: string, path: string, body: unknown | null = null): Promise<unknown> {
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

  // istanbul ignore next; branch can't be reached with the current tests.
  if (response.status >= 300 || response.status < 200) {
    throw new Error('Received a non-2XX response from server.')
  }

  // Sometimes we don't have a JSON response but this abstraction was built as if all returns were JSON.
  // This is unfortunately the best way I can see to deal with it.
  // We lose the streaming parsing of fetch, but it shouldn't be a performance problem for now.
  //
  // TODO: Should return the response object so the function calling can decide how to parse the result.
  const responseText = await response.text()
  if (responseText === '') {
    return
  }
  return JSON.parse(responseText) as unknown
}

export { fetchApi }
