import MetricsApi from '@/api/MetricsApi'

describe('MetricsApi.ts module', () => {
  describe('findAll', () => {
    it('should return a set of metrics with the expected metric shape', async () => {
      const metrics = await MetricsApi.findAll()
      expect(metrics).toBeDefined()
      expect(Array.isArray(metrics)).toBe(true)
      expect(metrics.length).toBeGreaterThan(0)
      metrics.forEach((metric) => {
        expect(typeof metric.metricId).toBe('number')
        expect(typeof metric.name).toBe('string')
        expect(typeof metric.description).toBe('string')
      })
    })
  })

  describe('findById', () => {
    it('should return the metric with the expected metric shape', async () => {
      // TODO: Test different metrics with different parameter types (conversion and
      // revenue). Can't do it now because only one metric is available to test.
      const metrics = await MetricsApi.findById([31])
      expect(metrics).toBeDefined()
      expect(Array.isArray(metrics)).toBe(true)
      expect(metrics.length).toBeGreaterThan(0)
      metrics.forEach((metric) => {
        expect(typeof metric.metricId).toBe('number')
        expect(typeof metric.name).toBe('string')
        expect(typeof metric.description).toBe('string')
        expect(typeof metric.higherIsBetter).toBe('boolean')
        expect(Array.isArray(metric.eventParams)).toBe(true)
        metric.eventParams?.forEach((eventParam) => {
          expect(typeof eventParam.event).toBe('string')
          expect(typeof eventParam.props).toBe('object')
          expect(eventParam.props).not.toBe(null)
        })
        expect(metric.revenueParams).toBe(null)
      })
    })

    it('called multiple times with same ID should return a cached metric', async () => {
      const metrics1 = await MetricsApi.findById([31])
      const metrics2 = await MetricsApi.findById([31])

      expect(metrics1[0]).toBe(metrics2[0])
    })
  })
})
