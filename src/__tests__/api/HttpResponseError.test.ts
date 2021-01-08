import { WretcherError } from "wretch"
import HttpResponseError, { wretcherErrorToHttpResponseError } from "../../api/HttpResponseError"

describe('HttpResponseError.ts module', () => {
  describe('wretcherErrorToHttpResponseError', () => {
      it('should return a correct HttpResponseError', () => {
          const error : WretcherError = new Error() as WretcherError
          error.status = 404
          error.message = 'Not Found'
          error.json = {foo: 'bar'}
          const httpResponseError = wretcherErrorToHttpResponseError(error)
          expect(httpResponseError).toBeInstanceOf(HttpResponseError)
          expect(httpResponseError).toMatchInlineSnapshot()
      })
    })
})