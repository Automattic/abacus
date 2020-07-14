import { fireEvent, getAllByText, getByText, waitFor } from '@testing-library/react'
import React from 'react'

import ExperimentResults from '@/components/experiment-results/ExperimentResults'
import Fixtures from '@/helpers/fixtures'
import { render } from '@/helpers/test-utils'

const experiment = Fixtures.createExperimentFull()
const metrics = Fixtures.createMetricBares()
const analyses = Fixtures.createAnalyses()

test('renders an appropriate message with no analyses', () => {
  const { container } = render(<ExperimentResults analyses={[]} experiment={experiment} metrics={metrics} />)
  expect(container).toHaveTextContent('No analyses yet for experiment_1.')
})

test('renders the full tables with some analyses in debug mode', () => {
  const { container } = render(
    <ExperimentResults analyses={analyses} experiment={experiment} metrics={metrics} debugMode={true} />,
  )

  // In debug mode, we should have a <pre> element with the JSON.
  expect(container).toHaveTextContent(`Found ${analyses.length} analysis objects in total.`)
  expect(container.querySelector('pre.debug-json')).toMatchSnapshot()

  // Table snapshots are somewhat verbose, but they will allow us to see if there are any expected changes to the
  // numbers in the tables.
  expect(container.querySelector('.analysis-participant-counts')).toMatchSnapshot()
  expect(container.querySelector('.analysis-latest-results')).toMatchSnapshot()
})

test('renders the full tables with some analyses and a different primary metric in debug mode', () => {
  const diffPrimaryExperiment = Fixtures.createExperimentFull({
    metricAssignments: [
      Fixtures.createMetricAssignment({ ...experiment.metricAssignments[0], isPrimary: false }),
      Fixtures.createMetricAssignment({ ...experiment.metricAssignments[1], isPrimary: true }),
    ],
  })
  const { container } = render(
    <ExperimentResults analyses={analyses} experiment={diffPrimaryExperiment} metrics={metrics} debugMode={true} />,
  )

  // Only looking at the participant counts for this test: They should match the primary metric.
  expect(container.querySelector('.analysis-participant-counts')).toMatchSnapshot()
})

test('renders the condensed table with some analyses in non-debug mode', async () => {
  const { container } = render(<ExperimentResults analyses={analyses} experiment={experiment} metrics={metrics} />)

  // In non-debug mode, we shouldn't have a <pre> element with the JSON.
  expect(container.querySelector('pre.debug-json')).toBeNull()

  // Check the table snapshot before expanding any metric.
  expect(container.querySelector('.analysis-latest-results')).toMatchSnapshot()

  // Clicking on metric_1 or metric_2 should have no effect on anything, but metric_3 should render the details.
  fireEvent.click(getByText(container, /metric_1/))
  fireEvent.click(getAllByText(container, /metric_2/)[0])
  fireEvent.click(getByText(container, /metric_3/))
  await waitFor(() => getByText(container, /Last analyzed/), { container })
  expect(container.querySelector('.analysis-latest-results .analysis-detail-panel')).toMatchSnapshot()
})
