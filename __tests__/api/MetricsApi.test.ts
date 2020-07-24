import MetricsApi from '@/api/MetricsApi'
import NotFoundError from '@/api/NotFoundError'
import { validationErrorDisplayer } from '@/test-helpers/test-utils'

describe('MetricsApi.ts module', () => {
  describe('findAll', () => {
    it('should return a set of metrics with the expected metric shape', async () => {
      const metrics = await validationErrorDisplayer(MetricsApi.findAll())
      expect(metrics.length).toBeGreaterThan(0)
    })
  })

  describe('findById', () => {
    it('should return the metric with the expected metric shape', async () => {
      // TODO: Test different metrics with different parameter types (conversion and
      // revenue). Can't do it now because only one metric is available to test.
      const metric = await validationErrorDisplayer(MetricsApi.findById(31))
      expect(metric.metricId).toBeGreaterThan(0)
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
