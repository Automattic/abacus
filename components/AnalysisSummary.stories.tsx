import React from 'react'

import Fixtures from '@/helpers/fixtures'
import ThemeProvider from '@/styles/ThemeProvider'

import AnalysisSummary from './AnalysisSummary'

export default { title: 'Analysis summary' }

const analyses = Fixtures.createAnalyses()
const experiment = Fixtures.createExperimentFull()
const metrics = Fixtures.createMetricsBares()

export const noAnalyses = () => (
  <ThemeProvider>
    <AnalysisSummary analyses={[]} experiment={experiment} metrics={metrics} />
  </ThemeProvider>
)

export const someAnalyses = () => (
  <ThemeProvider>
    <AnalysisSummary analyses={analyses} experiment={experiment} metrics={metrics} />
  </ThemeProvider>
)

export const someAnalysesDebugMode = () => (
  <ThemeProvider>
    <AnalysisSummary analyses={analyses} experiment={experiment} metrics={metrics} debugMode={true} />
  </ThemeProvider>
)
