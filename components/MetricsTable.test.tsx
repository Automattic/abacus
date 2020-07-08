import { fireEvent, getByText, getDefaultNormalizer, screen, waitFor } from '@testing-library/react'
import React from 'react'

import MetricsApi from '@/api/MetricsApi'
import Fixtures from '@/helpers/fixtures'
import { render } from '@/helpers/test-utils'

import MetricsTable from './MetricsTable'

jest.mock('@/api/MetricsApi')

const mockedMetricsApi = (MetricsApi as unknown) as jest.Mocked<typeof MetricsApi>

test('with no metrics, renders an empty table', () => {
  const { container, getByText } = render(<MetricsTable metrics={[]} />)

  expect(getByText('Name')).toBeInTheDocument()
  expect(getByText('Description')).toBeInTheDocument()
  expect(getByText('Parameter Type')).toBeInTheDocument()

  const tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(tBodyElmt).toHaveTextContent('')
})

test('with some metrics, renders a table', () => {
  const { container } = render(<MetricsTable metrics={Fixtures.createMetricBares(2)} />)

  const tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(getByText(tBodyElmt, 'metric_1', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'This is metric 1', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'revenue', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'conversion', { selector: 'tr > td' })).toBeInTheDocument()
})

test('with some metrics, displays an error on trouble loading metric details', async () => {
  mockedMetricsApi.findById.mockRejectedValue(new Error())

  const { container } = render(<MetricsTable metrics={Fixtures.createMetricBares(2)} />)

  const tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()

  fireEvent.click(screen.getByText('metric_1'))
  await waitFor(() => screen.getByText('Oops! Something went wrong while trying to load a Metric.'))
})

test('with some metrics, loads and opens metric details', async () => {
  const { container } = render(<MetricsTable metrics={Fixtures.createMetricBares(2)} />)
  const tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()

  for (let i = 1; i < 7; i++) {
    const metricFull = Fixtures.createMetricFull(i)
    mockedMetricsApi.findById.mockResolvedValueOnce(metricFull)

    // Open metric details
    fireEvent.click(getByText(container, /metric_1/))

    await waitFor(() => getByText(container, /Higher is Better/), { container })
    metricFull.higherIsBetter ? getByText(container, /Yes/) : getByText(container, /No/)
    getByText(container, /Parameters/)
    getByText(
      container,
      JSON.stringify(
        metricFull.parameterType === 'conversion' ? metricFull.eventParams : metricFull.revenueParams,
        null,
        4,
      ),
      { normalizer: getDefaultNormalizer({ trim: true, collapseWhitespace: false }) },
    )

    // Close metric details
    fireEvent.click(getByText(container, /metric_1/))
  }
})
