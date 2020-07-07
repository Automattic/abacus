import _ from 'lodash'
import React, { useMemo } from 'react'

import { Analysis, ExperimentFull, MetricBare } from '@/models'

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
    return <h2>No analyses yet for {experiment.name}.</h2>
  }

  return (
    <>
      <h2>Analysis summary</h2>
      <p>Found {analyses.length} analysis objects in total.</p>

      <div className='analysis-participant-counts'>
        <h3>Participant counts for the primary metric</h3>
        <ParticipantCounts
          experiment={experiment}
          latestPrimaryMetricAnalyses={
            metricAssignmentIdToLatestAnalyses[experiment.getPrimaryMetricAssignmentId() as number]
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

      {debugMode ? <pre className='debug-json'>{JSON.stringify(analyses, null, 2)}</pre> : ''}
    </>
  )
}
