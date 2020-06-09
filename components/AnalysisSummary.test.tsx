import { render } from '@testing-library/react'
import React from 'react'

import AnalysisSummary from './AnalysisSummary'
import Fixtures from '@/helpers/fixtures'

const experiment = Fixtures.createExperimentFull()
const metrics = Fixtures.createMetricsBares()
const analyses = Fixtures.createAnalyses()

test('renders an appropriate message with no analyses', () => {
  const { container } = render(<AnalysisSummary analyses={[]} experiment={experiment} metrics={metrics} />)
  expect(container).toHaveTextContent('No analyses yet for experiment_1.')
})

test('renders an appropriate message with some analyses', () => {
  const { container } = render(<AnalysisSummary analyses={analyses} experiment={experiment} metrics={metrics} />)
  expect(container).toHaveTextContent('Found 5 analysis objects in total.')
})

test('shows the analyses JSON in debug mode', () => {
  const { container } = render(
    <AnalysisSummary analyses={analyses} experiment={experiment} metrics={metrics} debugMode={true} />,
  )
  expect(container.querySelector('pre')).not.toBeNull()
})
