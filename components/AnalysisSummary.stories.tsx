import React from 'react'

import Fixtures from '@/helpers/fixtures'

import AnalysisSummary from './AnalysisSummary'

export default { title: 'Analysis summary' }

const analyses = Fixtures.createAnalyses()
const experiment = Fixtures.createExperimentFull()
const metrics = Fixtures.createMetricsBares()

export const noAnalyses = () => <AnalysisSummary analyses={[]} experiment={experiment} metrics={metrics} />
export const someAnalyses = () => <AnalysisSummary analyses={analyses} experiment={experiment} metrics={metrics} />
export const someAnalysesDebugMode = () => (
  <AnalysisSummary analyses={analyses} experiment={experiment} metrics={metrics} debugMode={true} />
)
