import _ from 'lodash'
import MaterialTable from 'material-table'
import React, { useMemo } from 'react'

import DatetimeText from '@/components/DatetimeText'
import Label from '@/components/Label'
import {
  Analysis,
  AnalysisStrategy,
  AnalysisStrategyToHuman,
  AttributionWindowSecondsToHuman,
  ExperimentFull,
  MetricAssignment,
  MetricBare,
  RecommendationWarningToHuman,
} from '@/models'
import { createStaticTableOptions } from '@/utils/material-table'

import RecommendationString from './RecommendationString'

export default function CondensedLatestAnalyses({
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
    const defaultAnalysisStrategy = experiment.exposureEvents
      ? AnalysisStrategy.PpNaive
      : AnalysisStrategy.MittNoSpammersNoCrossovers
    return experiment.getSortedMetricAssignments().map((metricAssignment) => {
      const latestAnalyses = metricAssignmentIdToLatestAnalyses[metricAssignment.metricAssignmentId as number] || []
      const uniqueRecommendations = _.uniq(latestAnalyses.map(({ recommendation }) => JSON.stringify(recommendation)))
      return {
        metricAssignment,
        metric: metricsById[metricAssignment.metricId],
        analysis: latestAnalyses.find((analysis) => analysis.analysisStrategy === defaultAnalysisStrategy),
        recommendationConflict: uniqueRecommendations.length > 1,
      }
    })
  }, [experiment, metricsById, metricAssignmentIdToLatestAnalyses])
  const tableColumns = [
    {
      title: 'Metric',
      render: ({ metric, metricAssignment }: { metric: MetricBare; metricAssignment: MetricAssignment }) => (
        <>
          {metric.name} {metricAssignment.isPrimary && <Label text='Primary' />}
        </>
      ),
    },
    {
      title: 'Attribution window',
      render: ({ metricAssignment }: { metricAssignment: MetricAssignment }) =>
        AttributionWindowSecondsToHuman[metricAssignment.attributionWindowSeconds],
    },
    {
      title: 'Recommendation',
      render: ({ analysis, recommendationConflict }: { analysis?: Analysis; recommendationConflict?: boolean }) => {
        if (recommendationConflict) {
          return <>Manual analysis required</>
        }
        if (!analysis?.recommendation) {
          return <>Not analyzed yet</>
        }
        return <RecommendationString recommendation={analysis.recommendation} experiment={experiment} />
      },
    },
  ]
  const detailPanel = [
    ({ analysis, recommendationConflict }: { analysis?: Analysis; recommendationConflict?: boolean }) => {
      return {
        render: () => analysis && <AnalysisDetailPanel analysis={analysis} experiment={experiment} />,
        disabled: !analysis || recommendationConflict,
      }
    },
  ]
  return (
    <MaterialTable
      columns={tableColumns}
      data={resultSummaries}
      options={createStaticTableOptions(resultSummaries.length)}
      onRowClick={(_event, rowData, togglePanel) => {
        togglePanel && rowData?.analysis && !rowData?.recommendationConflict && togglePanel()
      }}
      detailPanel={detailPanel}
    />
  )
}

function AnalysisDetailPanel({ analysis, experiment }: { analysis: Analysis; experiment: ExperimentFull }) {
  return (
    <dl>
      <dt>Last analyzed</dt>
      <dd>{DatetimeText({ datetime: analysis.analysisDatetime, excludeTime: true })}</dd>
      <dt>Analysis strategy</dt>
      <dd>{AnalysisStrategyToHuman[analysis.analysisStrategy]}</dd>
      <dt>Analyzed participants</dt>
      <dd>
        {analysis.participantStats.total} ({analysis.participantStats.not_final} not final
        {experiment.getSortedVariations().map(({ variationId, name }) => (
          <span key={variationId}>
            ; {analysis.participantStats[`variation_${variationId}`] || 0} in {name}
          </span>
        ))}
        )
      </dd>
      {analysis.metricEstimates && analysis.recommendation && (
        <>
          <dt>Difference interval</dt>
          <dd>
            [{_.round(analysis.metricEstimates.diff.bottom, 4)}, {_.round(analysis.metricEstimates.diff.top, 4)}]
          </dd>
          {analysis.recommendation.warnings.length > 0 && (
            <>
              <dt>Warnings</dt>
              <dd>
                {analysis.recommendation.warnings.map((warning) => (
                  <div key={warning}>{RecommendationWarningToHuman[warning]}</div>
                ))}
              </dd>
            </>
          )}
        </>
      )}
    </dl>
  )
}
