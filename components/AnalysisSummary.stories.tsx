import '@/styles/main.scss'
import React from 'react'

import AnalysisSummary from './AnalysisSummary'
import Fixtures from '@/helpers/fixtures'

export default { title: 'Analysis summary' }

const analyses = Fixtures.createAnalyses()
const experiment = Fixtures.createExperimentFull()
const metrics = Fixtures.createMetricsBares()

export const noAnalyses = () => <AnalysisSummary analyses={[]} experiment={experiment} metrics={metrics} />
export const someAnalyses = () => <AnalysisSummary analyses={analyses} experiment={experiment} metrics={metrics} />
export const someAnalysesDebugMode = () => (
  <AnalysisSummary analyses={analyses} experiment={experiment} metrics={metrics} debugMode={true} />
)
