import { ValidationError } from 'yup'

import MetricsApi from '@/api/MetricsApi'
import NotFoundError from '@/api/NotFoundError'

describe('MetricsApi.ts module', () => {
  describe('findAll', () => {
    it('should return a set of metrics with the expected metric shape', async () => {
      try {
        const metrics = await MetricsApi.findAll()
        expect(metrics.length).toBeGreaterThan(0)
      } catch (e) {
        if (e instanceof ValidationError) {
          expect(e.errors).toEqual([])
        }
        throw e
      }
    })
  })

  describe('findById', () => {
    it('should return the metric with the expected metric shape', async () => {
      // TODO: Test different metrics with different parameter types (conversion and
      // revenue). Can't do it now because only one metric is available to test.
      try {
        const metric = await MetricsApi.findById(31)
        expect(metric.metricId).toBeGreaterThan(0)
      } catch (e) {
        if (e instanceof ValidationError) {
          expect(e.errors).toEqual([])
        }
        throw e
      }
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
