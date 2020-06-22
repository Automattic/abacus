import { getByText, render } from '@testing-library/react'
import React from 'react'

import { MetricBare } from '@/models/MetricBare'

import MetricsTable from './MetricsTable'

test('with no metrics, renders an empty table', () => {
  const metrics: MetricBare[] = []
  const { container, getByText } = render(<MetricsTable metrics={metrics} />)

  expect(getByText('Name')).toBeInTheDocument()
  expect(getByText('Description')).toBeInTheDocument()
  expect(getByText('Parameter Type')).toBeInTheDocument()

  const tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(tBodyElmt).toHaveTextContent('')
})

test('with one page of metrics, renders a table', () => {
  const metrics: MetricBare[] = [
    {
      metricId: 1,
      name: 'name',
      description: 'description',
      parameterType: 'revenue',
    },
  ]
  const { container } = render(<MetricsTable metrics={metrics} />)

  const tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(getByText(tBodyElmt, 'name', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'description', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'revenue', { selector: 'tr > td' })).toBeInTheDocument()
})
