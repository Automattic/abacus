import { MetricBare } from './MetricBare'

describe('models/MetricBare.ts module', () => {
  describe('MetricBare', () => {
    describe('fromApiData', () => {
      it('called with valid API data should create a new `MetricBare` instance', () => {
        const metricBare = MetricBare.fromApiData({
          metric_id: 123,
          name: 'Example Metric',
          description: 'An example metric.',
        })
        expect(metricBare).toEqual({
          metricId: 123,
          name: 'Example Metric',
          description: 'An example metric.',
          parameterType: 'revenue',
        })
      })
    })
  })
})
