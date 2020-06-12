import { Event } from './Event'
import { MetricFull } from './MetricFull'
import { MetricRevenueParams, TransactionTypes } from './MetricRevenueParams'

describe('models/MetricFull.ts module', () => {
  describe('MetricFull', () => {
    describe('fromApiData', () => {
      it('with non-null eventParams should create a valid instance', () => {
        const metricFull = MetricFull.fromApiData({
          metric_id: 123,
          name: 'Example Metric',
          description: 'An example metric.',
          higher_is_better: true,
          event_params: [
            {
              event: 'foo',
              props: {
                foo: 'bar',
              },
            },
          ],
          revenue_params: null,
        })
        expect(metricFull).toEqual(
          new MetricFull({
            metricId: 123,
            name: 'Example Metric',
            description: 'An example metric.',
            higherIsBetter: true,
            eventParams: [
              new Event({
                event: 'foo',
                props: {
                  foo: 'bar',
                },
              }),
            ],
            parameterType: 'conversion',
            revenueParams: null,
          }),
        )
      })

      it('with non-null revenueParams and empty arrays should create a valid instance', () => {
        const metricFull = MetricFull.fromApiData({
          metric_id: 123,
          name: 'Example Metric',
          description: 'An example metric.',
          higher_is_better: true,
          event_params: null,
          revenue_params: {
            refund_days: 30,
            product_slugs: [],
            transaction_types: [],
          },
        })
        expect(metricFull).toEqual(
          new MetricFull({
            metricId: 123,
            name: 'Example Metric',
            description: 'An example metric.',
            higherIsBetter: true,
            eventParams: null,
            parameterType: 'revenue',
            revenueParams: new MetricRevenueParams({
              refundDays: 30,
              productSlugs: [],
              transactionTypes: [],
            }),
          }),
        )
      })

      it('with non-null revenueParams and non-empty product_slugs should create a valid instance', () => {
        const metricFull = MetricFull.fromApiData({
          metric_id: 123,
          name: 'Example Metric',
          description: 'An example metric.',
          higher_is_better: true,
          event_params: null,
          revenue_params: {
            refund_days: 30,
            product_slugs: ['foo', 'bar'],
            transaction_types: [],
          },
        })
        expect(metricFull).toEqual(
          new MetricFull({
            metricId: 123,
            name: 'Example Metric',
            description: 'An example metric.',
            higherIsBetter: true,
            eventParams: null,
            parameterType: 'revenue',
            revenueParams: new MetricRevenueParams({
              refundDays: 30,
              productSlugs: ['foo', 'bar'],
              transactionTypes: [],
            }),
          }),
        )
      })

      it('with non-null revenueParams and non-empty transaction_types should create a valid instance', () => {
        const metricFull = MetricFull.fromApiData({
          metric_id: 123,
          name: 'Example Metric',
          description: 'An example metric.',
          higher_is_better: true,
          event_params: null,
          revenue_params: {
            refund_days: 30,
            product_slugs: [],
            transaction_types: ['new purchase', 'start trial'],
          },
        })
        expect(metricFull).toEqual(
          new MetricFull({
            metricId: 123,
            name: 'Example Metric',
            description: 'An example metric.',
            higherIsBetter: true,
            eventParams: null,
            parameterType: 'revenue',
            revenueParams: new MetricRevenueParams({
              refundDays: 30,
              productSlugs: [],
              transactionTypes: [TransactionTypes.NewPurchase, TransactionTypes.StartTrial],
            }),
          }),
        )
      })

      it('with non-null revenueParams and non-empty arrays should create a valid instance', () => {
        const metricFull = MetricFull.fromApiData({
          metric_id: 123,
          name: 'Example Metric',
          description: 'An example metric.',
          higher_is_better: true,
          event_params: null,
          revenue_params: {
            refund_days: 30,
            product_slugs: ['foo', 'bar'],
            transaction_types: ['new purchase', 'start trial'],
          },
        })
        expect(metricFull).toEqual(
          new MetricFull({
            metricId: 123,
            name: 'Example Metric',
            description: 'An example metric.',
            higherIsBetter: true,
            eventParams: null,
            parameterType: 'revenue',
            revenueParams: new MetricRevenueParams({
              refundDays: 30,
              productSlugs: ['foo', 'bar'],
              transactionTypes: [TransactionTypes.NewPurchase, TransactionTypes.StartTrial],
            }),
          }),
        )
      })
    })
  })
})
