import _ from 'lodash'
import React from 'react'

import * as MetricAssignments from '@/lib/metric-assignments'
import { indexMetrics } from '@/lib/normalizers'
import { Analysis, AnalysisStrategy, ExperimentFull, MetricAssignment, MetricBare } from '@/lib/schemas'

import CondensedLatestAnalyses from './CondensedLatestAnalyses'

export type MetricAssignmentAnalysesData = {
  metricAssignment: MetricAssignment
  metric: MetricBare
  analysesByStrategyDateAsc: Record<AnalysisStrategy, Analysis[]>
}

/**
 * Main component for summarizing experiment results.
 */
export default function ExperimentResults({
  analyses,
  experiment,
  metrics,
}: {
  analyses: Analysis[]
  experiment: ExperimentFull
  metrics: MetricBare[]
  debugMode?: boolean
}): JSX.Element {
  const indexedMetrics = indexMetrics(metrics)
  const analysesByMetricAssignmentId = _.groupBy(analyses, 'metricAssignmentId')
  const allMetricAssignmentAnalysesData: MetricAssignmentAnalysesData[] = MetricAssignments.sort(
    experiment.metricAssignments,
  ).map((metricAssignment) => {
    const metricAssignmentAnalyses = analysesByMetricAssignmentId[metricAssignment.metricAssignmentId] || []
    return {
      metricAssignment,
      metric: indexedMetrics[metricAssignment.metricId],
      analysesByStrategyDateAsc: _.groupBy(
        _.orderBy(metricAssignmentAnalyses, ['analysisDatetime'], ['asc']),
        'analysisStrategy',
      ) as Record<AnalysisStrategy, Analysis[]>,
    }
  })

  if (analyses.length === 0) {
    return <p>No analyses yet for {experiment.name}.</p>
  }

  return (
    <div className='analysis-latest-results'>
      <CondensedLatestAnalyses
        experiment={experiment}
        allMetricAssignmentAnalysesData={allMetricAssignmentAnalysesData}
      />
    </div>
  )
}
