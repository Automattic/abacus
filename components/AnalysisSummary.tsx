import React from 'react'

import { Analysis, ExperimentFull, MetricBare } from '@/models'

/**
 * Main component for summarizing experiment analyses.
 */
export default function AnalysisSummary({
  analyses,
  experiment,
  metrics,
  debugMode,
}: {
  analyses: Analysis[]
  experiment: ExperimentFull
  metrics: MetricBare[]
  debugMode?: boolean
}) {
  if (analyses.length === 0) {
    return <h2>No analyses yet for {experiment.name}.</h2>
  }

  return (
    <>
      <h2>Analysis summary</h2>
      <p>
        Found {analyses.length} analysis objects in total. There are {metrics.length} metrics in the system.
      </p>

      {debugMode ? <pre>{JSON.stringify(analyses, null, 2)}</pre> : ''}
    </>
  )
}
