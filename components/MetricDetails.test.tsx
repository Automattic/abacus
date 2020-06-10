import { render } from '@testing-library/react'
import React from 'react'

import { Event, MetricFull, MetricRevenueParams, TransactionTypes } from '@/models'
import MetricDetails from './MetricDetails'

const WITHIN_TD = 'td, td > *'

test('conversion metric should render expected labels and data', () => {
  const metric = new MetricFull({
    metricId: 1,
    description: 'This is metric 1',
    name: 'metric_1',
    higherIsBetter: false,
    eventParams: [new Event({ event: 'an_event', props: { foo: 'bar' } })],
    revenueParams: null,
  })
  const { getByText } = render(<MetricDetails metric={metric} />)

  expect(getByText('Name', { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText('metric_1', { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText('Description', { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText('This is metric 1', { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText('Higher Is Better?', { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText('No', { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText('Event Parameters', { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText(/an_event/, { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText(/foo/, { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText(/bar/, { selector: WITHIN_TD })).toBeInTheDocument()
  expect(() => {
    getByText('Revenue Parameters', { selector: WITHIN_TD })
  }).toThrowError('Unable to find an element with the text: Revenue Parameters.')
})

test('revenue metric should render expected labels and data', () => {
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
  const { getByText } = render(<MetricDetails metric={metric} />)

  expect(getByText('Name', { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText('metric_1', { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText('Description', { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText('This is metric 1', { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText('Higher Is Better?', { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText('Yes', { selector: WITHIN_TD })).toBeInTheDocument()
  expect(() => {
    getByText('Event Parameters', { selector: WITHIN_TD })
  }).toThrowError('Unable to find an element with the text: Event Parameters.')
  expect(getByText('Revenue Parameters', { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText(/foo-bar/, { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText(/42/, { selector: WITHIN_TD })).toBeInTheDocument()
  expect(getByText(new RegExp(TransactionTypes.NewPurchase), { selector: WITHIN_TD })).toBeInTheDocument()
})
