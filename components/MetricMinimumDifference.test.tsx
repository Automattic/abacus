import { render } from '@testing-library/react'
import React from 'react'

import { MetricBare } from '@/models'

import MetricMinimumDifference from './MetricMinimumDifference'

test('renders dollars for conversion metrics', () => {
  // TODO: Get from fixtures.
  const metric = new MetricBare({
    metricId: 1,
    description: 'This is metric 1',
    name: 'metric_1',
    parameterType: 'revenue',
  })
  const { getByText } = render(<MetricMinimumDifference metric={metric} minDifference={0.02} />)

  expect(getByText('$0.02')).toBeInTheDocument()
})

test('renders percentage points for conversion metrics', () => {
  // TODO: Get from fixtures.
  const metric = new MetricBare({
    metricId: 1,
    description: 'This is metric 1',
    name: 'metric_1',
    parameterType: 'conversion',
  })
  const { getByText } = render(<MetricMinimumDifference metric={metric} minDifference={0.02} />)

  expect(getByText('0.02 pp')).toBeInTheDocument()
})
