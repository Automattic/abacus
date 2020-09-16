import _ from 'lodash'
import React, { useMemo } from 'react'

import DebugOutput from '@/components/DebugOutput'
import * as Experiments from '@/lib/experiments'
import { Analysis, ExperimentFull, MetricBare } from '@/lib/schemas'

import CondensedLatestAnalyses from './CondensedLatestAnalyses'
import FullLatestAnalyses from './FullLatestAnalyses'
import ParticipantCounts from './ParticipantCounts'

/**
 * Main component for summarizing experiment results.
 */
export default function ExperimentResults({
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
  const metricsById = useMemo(() => _.zipObject(_.map(metrics, 'metricId'), metrics), [metrics])
  const metricAssignmentIdToLatestAnalyses = useMemo(
    () =>
      _.mapValues(_.groupBy(analyses, 'metricAssignmentId'), (metricAnalyses) => {
        metricAnalyses = _.orderBy(metricAnalyses, ['analysisDatetime'], ['desc'])
        return _.sortBy(
          _.filter(metricAnalyses, ['analysisDatetime', metricAnalyses[0].analysisDatetime]),
          'analysisStrategy',
        )
      }),
    [analyses],
  )

  if (analyses.length === 0) {
    return <p>No analyses yet for {experiment.name}.</p>
  }

  if (debugMode) {
    return (
      <>
        <div className='analysis-participant-counts'>
          <h3>Participant counts for the primary metric</h3>
          <ParticipantCounts
            experiment={experiment}
            latestPrimaryMetricAnalyses={
              metricAssignmentIdToLatestAnalyses[Experiments.getPrimaryMetricAssignmentId(experiment) as number]
            }
          />
        </div>

        <div className='analysis-latest-results'>
          <h3>Latest results by metric</h3>
          <FullLatestAnalyses
            experiment={experiment}
            metricsById={metricsById}
            metricAssignmentIdToLatestAnalyses={metricAssignmentIdToLatestAnalyses}
          />
        </div>

        <p>Found {analyses.length} analysis objects in total.</p>
        <DebugOutput label={`All analysis objects (${analyses.length})`} content={analyses} className='debug-json' />
      </>
    )
  }

  return (
    <div className='analysis-latest-results'>
      <CondensedLatestAnalyses
        experiment={experiment}
        metricsById={metricsById}
        metricAssignmentIdToLatestAnalyses={metricAssignmentIdToLatestAnalyses}
      />
    </div>
  )
}
