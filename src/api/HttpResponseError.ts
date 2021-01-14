import { WretcherError, WretcherResponse } from 'wretch'

/**
 * A HTTP Error we receive from the server.
 *
 * WretcherError gets close but isn't friendly enough.
 */
export default class HttpResponseError extends Error implements WretcherError {
  public status: number
  public response: WretcherResponse
  public text?: string
  public json?: unknown
  public name = 'HttpResponseError'

  /**
   * This constructor is only for mocking.
   * @param status
   */
  constructor(status: number, ...vendorSpecificParams: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore vendorSpecificParams
    super(`${status}`, ...vendorSpecificParams)
    this.status = status
    this.response = new Response('Mock Response', { status })
  }
}

/**
 * Transform a WretcherError to HttpResponseError
 *
 * Only necessary as a WretcherError isn't a named error :/
 *
 * @param wretcherError
 */
export function wretcherErrorToHttpResponseError(wretcherError: WretcherError): HttpResponseError {
  wretcherError.name = 'HttpResponseError'
  wretcherError.message = `${wretcherError.status} ${wretcherError.response.statusText}`
  Object.setPrototypeOf(wretcherError, HttpResponseError.prototype)
  // istanbul ignore next; V8 engine only
  if (Error.captureStackTrace) {
    Error.captureStackTrace(wretcherError, HttpResponseError)
  }
  return wretcherError
}
