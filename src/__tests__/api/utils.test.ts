import HttpResponseError from 'src/api/HttpResponseError'
import fetchMock from 'fetch-mock-jest'
import { fetchApi } from 'src/api/utils'

fetchMock.config.overwriteRoutes = true

describe('utils.ts module', () => {
  describe('fetchApi errors correctly', () => {
    it('should return no error for a good request', async () => {
      fetchMock.once('*', {
        status: 200,
        body: '{ "foo": 123 }',
      })

      const res = await fetchApi('GET', '/')
      expect(res).toEqual({ foo: 123 })
    })

    it('should return an error if thrown and not an HttpResponseError', async () => {
      expect.assertions(3)
      fetchMock.once('*', { throws: new Error('Error Message') })

      try {
        await fetchApi('GET', '/')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        if (error instanceof Error) {
          expect(error.name).toBe('Error')
          expect(error.message).toBe('Error Message')
        }
      }
    })

    it('should return a correct HttpResponseError for a bad HTTP request', async () => {
      expect.assertions(3)
      fetchMock.once('*', {
        status: 400,
        body: '{"code":"invalid_name","message":"The experiment name is already taken","data":{"status":400}}',
      })

      try {
        const resp = await fetchApi('GET', '/')
      } catch (error) {
        expect(error).toBeInstanceOf(HttpResponseError)
        if (error instanceof HttpResponseError) {
          expect(error.status).toBe(400)
          expect(error.json).toEqual({
            "code": "invalid_name",
            "data": {
              "status": 400,
            },
            "message": "The experiment name is already taken",
          })
        }
      }
    })
  })
})
