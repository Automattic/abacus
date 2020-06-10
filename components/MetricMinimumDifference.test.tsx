import { render } from '@testing-library/react'
import React from 'react'

import { Event, MetricFull, MetricRevenueParams, TransactionTypes } from '@/models'
import MetricMinimumDifference from './MetricMinimumDifference'

test('renders dollars for conversion metrics', () => {
  // TODO: Get from fixtures.
  const metric = new MetricFull({
    metricId: 1,
    description: 'This is metric 1',
    name: 'metric_1',
    higherIsBetter: true,
    eventParams: null,
    revenueParams: new MetricRevenueParams({
      productSlugs: ['foo-bar'],
      refundDays: 42,
      transactionTypes: [TransactionTypes.NewPurchase],
    }),
  })
  const { getByText } = render(<MetricMinimumDifference metric={metric} minDifference={0.02} />)

  expect(getByText('$0.02')).toBeInTheDocument()
})

test('renders percentage points for conversion metrics', () => {
  // TODO: Get from fixtures.
  const metric = new MetricFull({
    metricId: 1,
    description: 'This is metric 1',
    name: 'metric_1',
    higherIsBetter: false,
    eventParams: [new Event({ event: 'an_event', props: { foo: 'bar' } })],
    revenueParams: null,
  })
  const { getByText } = render(<MetricMinimumDifference metric={metric} minDifference={0.02} />)

  expect(getByText('0.02 pp')).toBeInTheDocument()
})
