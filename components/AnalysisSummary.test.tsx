import { render } from '@testing-library/react'
import React from 'react'

import Fixtures from '@/helpers/fixtures'

import AnalysisSummary from './AnalysisSummary'

const experiment = Fixtures.createExperimentFull()
const metrics = Fixtures.createMetricsBares()
const analyses = Fixtures.createAnalyses()

test('renders an appropriate message with no analyses', () => {
  const { container } = render(<AnalysisSummary analyses={[]} experiment={experiment} metrics={metrics} />)
  expect(container).toHaveTextContent('No analyses yet for experiment_1.')
})

// TODO: test the actual content (snapshots?)
test('renders an appropriate message with some analyses', () => {
  const { container } = render(<AnalysisSummary analyses={analyses} experiment={experiment} metrics={metrics} />)
  expect(container).toHaveTextContent(`Found ${analyses.length} analysis objects in total.`)
})

test('renders an appropriate message with some analyses and a different primary metric', () => {
  const diffPrimaryExperiment = Fixtures.createExperimentFull({
    metricAssignments: [
      Fixtures.createMetricAssignment({ ...experiment.metricAssignments[0], isPrimary: false }),
      Fixtures.createMetricAssignment({ ...experiment.metricAssignments[1], isPrimary: true }),
    ],
  })
  const { container } = render(
    <AnalysisSummary analyses={analyses} experiment={diffPrimaryExperiment} metrics={metrics} />,
  )
  expect(container).toHaveTextContent(`Found ${analyses.length} analysis objects in total.`)
})

test('shows the analyses JSON in debug mode', () => {
  const { container } = render(
    <AnalysisSummary analyses={analyses} experiment={experiment} metrics={metrics} debugMode={true} />,
  )
  expect(container.querySelector('pre')).not.toBeNull()
})
