import { StatusCodes } from 'http-status-codes'
import { WretcherError } from 'wretch'

import HttpResponseError, { serverErrorMessage, wretcherErrorToHttpResponseError } from '../../api/HttpResponseError'

describe('HttpResponseError.ts module', () => {
  describe('wretcherErrorToHttpResponseError', () => {
    it('should return a correct HttpResponseError', () => {
      const error: WretcherError = new Error() as WretcherError
      error.status = StatusCodes.NOT_FOUND
      ;(error.response as unknown) = { statusText: 'Not Found' }
      error.message = 'Not Found'
      error.json = { foo: 'bar' }
      const httpResponseError = wretcherErrorToHttpResponseError(error)
      expect(httpResponseError).toBeInstanceOf(HttpResponseError)
      expect(httpResponseError).toMatchInlineSnapshot(`[HttpResponseError: 404 Not Found]`)
    })
  })

  describe('serverErrorMessage', () => {
    it('should return an empty message for an unknown error', () => {
      const error = new Error()
      expect(serverErrorMessage(error)).toBe('')
    })

    it('should return a correct error message', () => {
      const error = new HttpResponseError(StatusCodes.BAD_REQUEST)
      expect(serverErrorMessage(error)).toMatchInlineSnapshot(`"Response Error [400]: No server message"`)
      error.json = { code: 'invalid_name', message: 'The experiment name is already taken', data: { status: 400 } }
      expect(serverErrorMessage(error)).toMatchInlineSnapshot(
        `"Response Error [400]: The experiment name is already taken"`,
      )
    })
  })
})
