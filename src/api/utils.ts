import wretch, { WretcherError } from 'wretch'

import { config } from 'src/config'
import { getExperimentsAuthInfo } from 'src/utils/auth'

import { wretcherErrorToHttpResponseError } from './HttpResponseError'
import UnauthorizedError from './UnauthorizedError'

/**
 * A typeguard specific to this file, do not use elsewhere.
 * @param error
 */
function isWretcherError(error: unknown): error is WretcherError {
  return typeof error === 'object' && error !== null && typeof (error as WretcherError).status === 'number'
}

/**
 * ExPlat API Wretcher (Fetch Wrapper)
 * See wretch docs for more info
 *
 * Makes a request to the Experiment Platform's API with any necessary
 * authorization information, parses the response as JSON, and returns the parsed
 * response.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError HttpResponseError
 */
export const exPlatWretcher = wretch()
  .url(config.experimentApi.rootUrl)
  // Get access token at call time
  .defer((wretcher) => {
    /* istanbul ignore next; code branch not reachable in integration tests -- we don't hit production */
    if (config.experimentApi.needsAuth) {
      const accessToken = getExperimentsAuthInfo()?.accessToken
      if (!accessToken) {
        throw new UnauthorizedError()
      }
      return wretcher.auth(`Bearer ${accessToken}`)
    }
    return wretcher
  })
  // This would ideally be JSON but can't be due to the below reasons.
  .errorType('text')
  // This is messy as our responses are non-standard:
  // Everything should ideally return JSON, and at least if it doesn't it should return 204 No-Content
  .resolve(async (resolver) => {
    try {
      const textResponse = await (await resolver.res()).text()
      if (textResponse === '') {
        return undefined
      } else {
        return JSON.parse(textResponse) as unknown
      }
    } catch (error) {
      if (isWretcherError(error)) {
        // Due to non-standard responses:
        // istanbul ignore next; Main case is tested, edge cases shouldn't occur
        const json: unknown = error.text === '' || error.text === undefined ? undefined : JSON.parse(error.text)
        // Have to have this line separate as the semicolon interferes with istanbul:
        ;(error.json as unknown) = json
        throw wretcherErrorToHttpResponseError(error)
      }
      throw error
    }
  })

/**
 * Wrapper for the ExPlat Wretcher
 */
export async function fetchApi(
  method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body: unknown | null = null,
): Promise<unknown> {
  if (method === 'GET' || method === 'DELETE') {
    return exPlatWretcher.url(path)[method.toLowerCase() as 'get' | 'delete']()
  } else {
    return exPlatWretcher.url(path)[method.toLowerCase() as 'put' | 'post' | 'patch'](body)
  }
}
