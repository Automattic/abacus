import _ from 'lodash'
import React from 'react'

import DebugOutput from '@/components/DebugOutput'
import * as Experiments from '@/lib/experiments'
import * as MetricAssignments from '@/lib/metric-assignments'
import { indexMetrics } from '@/lib/normalizers'
import { Analysis, AnalysisStrategy, ExperimentFull, MetricBare } from '@/lib/schemas'

import { MetricAssignmentAnalysesData } from './ExperimentResults'
import FullLatestAnalyses from './FullLatestAnalyses'
import ParticipantCounts from './ParticipantCounts'

/**
 * Main component for summarizing experiment results.
 */
export default function ExperimentDebug({
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

  const primaryMetricAssignmentId = Experiments.getPrimaryMetricAssignmentId(experiment)
  const primaryMetricAssignmentAnalysesData = allMetricAssignmentAnalysesData.find(
    ({ metricAssignment: { metricAssignmentId } }) => metricAssignmentId === primaryMetricAssignmentId,
  )

  // istanbul ignore next; Should never occur
  if (!primaryMetricAssignmentAnalysesData) {
    throw new Error('Missing primary metricAssignment!')
  }

  return (
    <>
      <div className='analysis-participant-counts'>
        <h3>Participant counts for the primary metric</h3>
        <ParticipantCounts
          experiment={experiment}
          primaryMetricAssignmentAnalysesData={primaryMetricAssignmentAnalysesData}
        />
      </div>

      <div className='analysis-latest-results'>
        <h3>Latest results by metric</h3>
        <FullLatestAnalyses experiment={experiment} allMetricAssignmentAnalysesData={allMetricAssignmentAnalysesData} />
      </div>

      <p>Found {analyses.length} analysis objects in total.</p>
      <DebugOutput label={`All analysis objects (${analyses.length})`} content={analyses} className='debug-json' />
    </>
  )
}
