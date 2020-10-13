import React from 'react'

import ExperimentDebug from 'src/components/experiment-results/ExperimentDebug'
import Fixtures from 'src/test-helpers/fixtures'
import { render } from 'src/test-helpers/test-utils'

const experiment = Fixtures.createExperimentFull()
const metrics = Fixtures.createMetricBares()
const analyses = Fixtures.createAnalyses()

test('renders an appropriate message with no analyses', () => {
  const { container } = render(<ExperimentDebug analyses={[]} experiment={experiment} metrics={metrics} />)
  expect(container).toHaveTextContent('No analyses yet for experiment_1.')
})

test('renders the full tables with some analyses in debug mode', () => {
  const { container } = render(<ExperimentDebug analyses={analyses} experiment={experiment} metrics={metrics} />)

  // In debug mode, we should have a <pre> element with the JSON.
  expect(container).toHaveTextContent(`All analysis objects (${analyses.length})`)
  expect(container.querySelector('.debug-json')).toMatchSnapshot()

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
    <ExperimentDebug analyses={analyses} experiment={diffPrimaryExperiment} metrics={metrics} />,
  )

  // Only looking at the participant counts for this test: They should match the primary metric.
  expect(container.querySelector('.analysis-participant-counts')).toMatchSnapshot()
})
