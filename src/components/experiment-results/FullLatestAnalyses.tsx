import { Typography } from '@material-ui/core'
import _, { last } from 'lodash'
import MaterialTable from 'material-table'
import React from 'react'

import DatetimeText from '@/components/DatetimeText'
import RecommendationString from '@/components/experiment-results/RecommendationString'
import { AnalysisStrategyToHuman, RecommendationWarningToHuman } from '@/lib/analyses'
import { AttributionWindowSecondsToHuman } from '@/lib/metric-assignments'
import { Analysis, ExperimentFull } from '@/lib/schemas'
import { createStaticTableOptions } from '@/utils/material-table'

import { MetricAssignmentAnalysesData } from './ExperimentResults'

/**
 * Render the latest analyses for the experiment for each metric assignment.
 */
export default function FullLatestAnalyses({
  experiment,
  allMetricAssignmentAnalysesData,
}: {
  experiment: ExperimentFull
  allMetricAssignmentAnalysesData: MetricAssignmentAnalysesData[]
}): JSX.Element {
  const metricAssignmentSummaries = allMetricAssignmentAnalysesData.map(
    ({ metricAssignment, metric, analysesByStrategyDateAsc }) => {
      return {
        metricAssignment,
        metric,
        analysesByStrategyDateAsc,
        latestAnalyses: Object.values(analysesByStrategyDateAsc).map(last) as Analysis[],
      }
    },
  )

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
      {metricAssignmentSummaries.map(({ metricAssignment, metric, latestAnalyses }) => (
        <div key={metricAssignment.metricAssignmentId}>
          <Typography variant={'subtitle1'}>
            <strong>
              <code>{metric.name}</code>
            </strong>{' '}
            with {AttributionWindowSecondsToHuman[metricAssignment.attributionWindowSeconds]} attribution,{' '}
            {latestAnalyses.length > 0 ? (
              <>
                last analyzed on <DatetimeText datetime={latestAnalyses[0].analysisDatetime} excludeTime={true} />
              </>
            ) : (
              <strong>not analyzed yet</strong>
            )}
          </Typography>
          <MaterialTable
            columns={tableColumns}
            data={_.sortBy(latestAnalyses, 'analysisStrategy')}
            options={createStaticTableOptions(latestAnalyses.length)}
          />
          <br />
        </div>
      ))}
    </>
  )
}
