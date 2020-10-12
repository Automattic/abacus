import React from 'react'

import ExperimentResults from '@/components/experiment-results/ExperimentResults'
import Fixtures from '@/test-helpers/fixtures'

export default { title: 'Experiment results' }

const analyses = Fixtures.createAnalyses()
const experiment = Fixtures.createExperimentFull()
const metrics = Fixtures.createMetricBares()

export const noAnalyses = (): JSX.Element => (
  <ExperimentResults analyses={[]} experiment={experiment} metrics={metrics} />
)
export const someAnalyses = (): JSX.Element => (
  <ExperimentResults analyses={analyses} experiment={experiment} metrics={metrics} />
)
export const someAnalysesDebugMode = (): JSX.Element => (
  <ExperimentResults analyses={analyses} experiment={experiment} metrics={metrics} debugMode={true} />
)
