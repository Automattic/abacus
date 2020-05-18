import { MetricBare } from './MetricBare'

describe('models/MetricBare.ts module', () => {
  describe('MetricBare', () => {
    describe('constructor', () => {
      it('called with valid API data should create a new `MetricBare` instance', () => {
        const metricBare = new MetricBare({
          metric_id: 123,
          name: 'Example Metric',
          description: 'An example metric.',
        })
        expect(metricBare).toEqual({
          metricId: 123,
          name: 'Example Metric',
          description: 'An example metric.',
        })
      })
    })
  })
})
