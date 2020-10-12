import MetricsApi from '@/api/MetricsApi'
import NotFoundError from '@/api/NotFoundError'
import { metricFullNewOutboundSchema, TransactionTypes } from '@/lib/schemas'
import Fixtures from '@/test-helpers/fixtures'
import { validationErrorDisplayer } from '@/test-helpers/test-utils'

describe('MetricsApi.ts module', () => {
  describe('outbound form', () => {
    it(`should transform a metric into an outbound form`, () => {
      expect(metricFullNewOutboundSchema.cast(Fixtures.createMetricFull(1))).toEqual({
        description: 'This is metric 1',
        event_params: [
          {
            event: 'event_name',
            props: {
              has_blocks: 'true',
            },
          },
        ],
        higher_is_better: false,
        metric_id: 1,
        name: 'metric_1',
        parameter_type: 'conversion',
        revenue_params: undefined,
      })

      expect(metricFullNewOutboundSchema.cast(Fixtures.createMetricFull(2))).toEqual({
        description: 'This is metric 2',
        event_params: undefined,
        higher_is_better: false,
        metric_id: 2,
        name: 'metric_2',
        parameter_type: 'revenue',
        revenue_params: {
          refund_days: 4,
          product_slugs: ['xx-bundles'],
          transaction_types: [TransactionTypes.NewPurchase],
        },
      })
    })
  })

  describe('create', () => {
    it(`should create a new metric`, async () => {
      const returnedMetric = await validationErrorDisplayer(MetricsApi.create(Fixtures.createMetricFull(1)))
      expect(returnedMetric.metricId).toBeGreaterThan(0)
    })
  })

  describe('put', () => {
    it(`should put a metric`, async () => {
      const returnedMetric = await validationErrorDisplayer(MetricsApi.put(1, Fixtures.createMetricFull(1)))
      expect(returnedMetric.metricId).toBeGreaterThan(0)
    })
  })

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
