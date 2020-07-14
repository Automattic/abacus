import MetricsApi from '@/api/MetricsApi'
import NotFoundError from '@/api/NotFoundError'

describe('MetricsApi.ts module', () => {
  describe('findAll', () => {
    it('should return a set of metrics with the expected metric shape', async () => {
      await MetricsApi.findAll()
    })
  })

  describe('findById', () => {
    it('should return the metric with the expected metric shape', async () => {
      // TODO: Test different metrics with different parameter types (conversion and
      // revenue). Can't do it now because only one metric is available to test.
      await MetricsApi.findById(31)
    })

    // TODO: Unskip this once the mock API stops returning the mock metric regardless
    // of the given ID. Also, remove the `instanbul ignore` comment from NotFoundError
    // and in `api/utils.ts` above the `if (response.status === 404)`.
    it.skip('called with an unknown metric ID should throw a NotFoundError', async () => {
      try {
        await MetricsApi.findById(0)
        expect(false).toBe(true) // This should never be reached.
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError)
      }
    })
  })
})
