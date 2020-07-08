import { Typography } from '@material-ui/core'
import _ from 'lodash'
import MaterialTable from 'material-table'
import React, { useMemo } from 'react'

import DatetimeText from '@/components/DatetimeText'
import RecommendationString from '@/components/experiment-results/RecommendationString'
import {
  Analysis,
  AnalysisStrategyToHuman,
  AttributionWindowSecondsToHuman,
  ExperimentFull,
  MetricBare,
  RecommendationWarningToHuman,
} from '@/models'
import { createStaticTableOptions } from '@/utils/material-table'

/**
 * Render the latest analyses for the experiment for each metric assignment.
 */
export default function FullLatestAnalyses({
  experiment,
  metricsById,
  metricAssignmentIdToLatestAnalyses,
}: {
  experiment: ExperimentFull
  metricsById: { [key: number]: MetricBare }
  metricAssignmentIdToLatestAnalyses: { [key: number]: Analysis[] }
}) {
  // Sort the assignments for consistency and collect the data we need to render the component.
  const resultSummaries = useMemo(() => {
    return experiment.getSortedMetricAssignments().map((metricAssignment) => {
      return {
        metricAssignment,
        metric: metricsById[metricAssignment.metricId],
        latestAnalyses: metricAssignmentIdToLatestAnalyses[metricAssignment.metricAssignmentId as number],
      }
    })
  }, [experiment, metricsById, metricAssignmentIdToLatestAnalyses])
  const tableColumns = [
    { title: 'Strategy', render: ({ analysisStrategy }: Analysis) => AnalysisStrategyToHuman[analysisStrategy] },
    {
      title: 'Participants (not final)',
      render: ({ participantStats }: Analysis) => `${participantStats.total} (${participantStats.not_final})`,
    },
    {
      title: 'Difference interval',
      render: ({ metricEstimates }: Analysis) =>
        metricEstimates
          ? `[${_.round(metricEstimates.diff.bottom, 4)}, ${_.round(metricEstimates.diff.top, 4)}]`
          : 'N/A',
    },
    {
      title: 'Recommendation',
      render: ({ recommendation }: Analysis) =>
        recommendation && <RecommendationString recommendation={recommendation} experiment={experiment} />,
    },
    {
      title: 'Warnings',
      render: ({ recommendation }: Analysis) => {
        if (!recommendation) {
          return ''
        }
        return (
          <>
            {recommendation.warnings.map((warning) => (
              <div key={warning}>{RecommendationWarningToHuman[warning]}</div>
            ))}
          </>
        )
      },
    },
  ]
  return (
    <>
      {resultSummaries.map(({ metricAssignment, metric, latestAnalyses }) => (
        <div key={metricAssignment.metricAssignmentId}>
          <Typography variant={'subtitle1'}>
            <strong>
              <code>{metric.name}</code>
            </strong>{' '}
            with {AttributionWindowSecondsToHuman[metricAssignment.attributionWindowSeconds]} attribution, last analyzed
            on <DatetimeText datetime={latestAnalyses[0].analysisDatetime} excludeTime={true} />
          </Typography>
          <MaterialTable
            columns={tableColumns}
            data={latestAnalyses}
            options={createStaticTableOptions(latestAnalyses.length)}
          />
          <br />
        </div>
      ))}
    </>
  )
}
