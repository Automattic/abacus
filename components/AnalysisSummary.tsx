import { Typography } from '@material-ui/core'
import _ from 'lodash'
import MaterialTable from 'material-table'
import React, { useMemo } from 'react'

import DatetimeText from '@/components/DatetimeText'
import {
  Analysis,
  AnalysisStrategy,
  AnalysisStrategyToHuman,
  AttributionWindowSeconds,
  AttributionWindowSecondsToHuman,
  ExperimentFull,
  MetricBare,
  Recommendation,
  RecommendationWarningToHuman,
  Variation,
} from '@/models'
import { createStaticTableOptions } from '@/utils/material-table'

/**
 * Convert a recommendation's endExperiment and chosenVariationId fields to a human-friendly description.
 */
function RecommendationString({
  recommendation,
  experiment,
}: {
  recommendation: Recommendation
  experiment: ExperimentFull
}) {
  if (recommendation.endExperiment) {
    if (recommendation.chosenVariationId) {
      const chosenVariation = experiment.variations.find(
        (variation) => variation.variationId === recommendation.chosenVariationId,
      ) as Variation
      return (
        <>
          End experiment; deploy <code>{chosenVariation.name}</code>
        </>
      )
    }
    return <>End experiment; deploy either variation</>
  }
  return <>Keep running</>
}

/**
 * Render a table of participant counts based on the latest metric analyses for the given experiment.
 */
function ParticipantCounts({
  experiment,
  latestPrimaryMetricAnalyses,
}: {
  experiment: ExperimentFull
  latestPrimaryMetricAnalyses: Analysis[]
}) {
  // TODO: add sortedVariations as method or sort on load?
  const sortedVariations = _.orderBy(experiment.variations, ['isDefault', 'name'], ['desc', 'asc'])
  const tableColumns = [
    { title: 'Strategy', render: ({ analysisStrategy }: Analysis) => AnalysisStrategyToHuman[analysisStrategy] },
    { title: 'Total', render: ({ participantStats }: Analysis) => participantStats.total },
  ]
  sortedVariations.forEach(({ variationId, name }) => {
    tableColumns.push({
      title: name,
      render: ({ participantStats }: Analysis) => participantStats[`variation_${variationId}`] || 0,
    })
  })
  return (
    <MaterialTable
      columns={tableColumns}
      data={latestPrimaryMetricAnalyses}
      options={createStaticTableOptions(latestPrimaryMetricAnalyses.length)}
    />
  )
}

/**
 * Render the latest results for the experiment for each metric assignment.
 *
 * Note: This is likely to change a lot as part of https://github.com/Automattic/abacus/issues/96.
 */
function LatestResultsDebug({
  experiment,
  metrics,
  metricAssignmentIdToLatestAnalyses,
}: {
  experiment: ExperimentFull
  metrics: MetricBare[]
  metricAssignmentIdToLatestAnalyses: { [key: number]: Analysis[] }
}) {
  // TODO: It'd be better to move some mappings to model methods once things are more stable. We should be able to make
  // TODO: calls like metricAssignment.getMetric().name and experiment.getMetricAssignmentById(123).getMetric().name
  // TODO: rather than construct mappings in the components.
  const metricsById = useMemo(() => _.zipObject(_.map(metrics, 'metricId'), metrics), [metrics])
  // Sort the assignments for consistency and collect the data we need to render the component.
  const resultSummaries = useMemo(() => {
    return _.orderBy(experiment.metricAssignments, ['isPrimary', 'metricAssignmentId'], ['desc', 'asc']).map(
      ({ metricAssignmentId, attributionWindowSeconds, metricId }) => {
        return {
          metricAssignmentId,
          attributionWindowSeconds,
          metricName: metricsById[metricId].name,
          latestAnalyses: metricAssignmentIdToLatestAnalyses[metricAssignmentId as number] || [],
        }
      },
    )
  }, [experiment.metricAssignments, metricsById, metricAssignmentIdToLatestAnalyses])
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
      {resultSummaries.map(({ metricAssignmentId, metricName, attributionWindowSeconds, latestAnalyses }) => (
        <div key={metricAssignmentId}>
          <Typography variant={'subtitle1'}>
            <strong>
              <code>{metricName}</code>
            </strong>{' '}
            with {AttributionWindowSecondsToHuman[attributionWindowSeconds]} attribution, last analyzed on{' '}
            {latestAnalyses.length > 0
              ? DatetimeText({ datetime: latestAnalyses[0].analysisDatetime, excludeTime: true })
              : 'N/A'}
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

function ResultDetail({ analysis, experiment }: { analysis: Analysis; experiment: ExperimentFull }) {
  // TODO: move to ExperimentFull, do it on construction?
  const sortedVariations = _.orderBy(experiment.variations, ['isDefault', 'name'], ['desc', 'asc'])
  return (
    <dl>
      <dt>Last analyzed</dt>
      <dd>{DatetimeText({ datetime: analysis.analysisDatetime, excludeTime: true })}</dd>
      <dt>Analysis strategy</dt>
      <dd>{AnalysisStrategyToHuman[analysis.analysisStrategy]}</dd>
      <dt>Analyzed participants</dt>
      <dd>
        {analysis.participantStats.total} ({analysis.participantStats.not_final} not final
        {sortedVariations.map(({ variationId, name }) => (
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

function LatestResults({
  experiment,
  metrics,
  metricAssignmentIdToLatestAnalyses,
}: {
  experiment: ExperimentFull
  metrics: MetricBare[]
  metricAssignmentIdToLatestAnalyses: { [key: number]: Analysis[] }
}) {
  // TODO: eliminate duplication with LatestResults
  const metricsById = useMemo(() => _.zipObject(_.map(metrics, 'metricId'), metrics), [metrics])
  // Sort the assignments for consistency and collect the data we need to render the component.
  const resultSummaries = useMemo(() => {
    return _.orderBy(experiment.metricAssignments, ['isPrimary', 'metricAssignmentId'], ['desc', 'asc']).map(
      ({ metricAssignmentId, attributionWindowSeconds, metricId }) => {
        const latestAnalyses = metricAssignmentIdToLatestAnalyses[metricAssignmentId as number] || []
        const uniqueRecommendations = _.uniq(latestAnalyses.map(({ recommendation }) => JSON.stringify(recommendation)))
        return {
          metricAssignmentId,
          attributionWindowSeconds,
          metricName: metricsById[metricId].name,
          latestAnalyses,
          recommendationConflict: uniqueRecommendations.length > 1,
        }
      },
    )
  }, [experiment.metricAssignments, metricsById, metricAssignmentIdToLatestAnalyses])
  const filteredResults = useMemo(() => {
    // TODO: Move?
    const defaultAnalysisStrategy = experiment.exposureEvents
      ? AnalysisStrategy.PpNaive
      : AnalysisStrategy.MittNoSpammersNoCrossovers
    return resultSummaries.map(
      ({ metricAssignmentId, metricName, attributionWindowSeconds, recommendationConflict, latestAnalyses }) => {
        return {
          metricAssignmentId,
          metricName,
          attributionWindowSeconds,
          recommendationConflict,
          analysis: latestAnalyses.filter((analysis) => analysis.analysisStrategy === defaultAnalysisStrategy)[0],
        }
      },
    )
  }, [experiment, resultSummaries])
  // TODO: mark primary
  // TODO: recommendation text should match status (keep running after the experiment ended is useless)
  const tableColumns = [
    { title: 'Metric', field: 'metricName' },
    {
      title: 'Attribution window',
      render: ({ attributionWindowSeconds }: { attributionWindowSeconds: AttributionWindowSeconds }) =>
        AttributionWindowSecondsToHuman[attributionWindowSeconds],
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
        render: () => analysis && <ResultDetail analysis={analysis} experiment={experiment} />,
        disabled: !analysis || recommendationConflict,
      }
    },
  ]
  return (
    <MaterialTable
      columns={tableColumns}
      data={filteredResults}
      options={createStaticTableOptions(filteredResults.length)}
      onRowClick={(_event, rowData, togglePanel) => {
        togglePanel && rowData?.analysis && !rowData?.recommendationConflict && togglePanel()
      }}
      detailPanel={detailPanel}
    />
  )
}

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
          <LatestResultsDebug
            experiment={experiment}
            metrics={metrics}
            metricAssignmentIdToLatestAnalyses={metricAssignmentIdToLatestAnalyses}
          />
        </div>

        <pre className='debug-json'>{JSON.stringify(analyses, null, 2)}</pre>
      </>
    )
  }

  // TODO:
  // - Add more warnings? seems unnecessary and better handled elsewhere
  //   - If the observed variation split is very different from the requested split?
  //   - If a metric assignment hasn’t been analysed? May be completely missing? Iterate over the metric assignments
  // - Handle Python warnings better? Or at a later stage.

  return (
    <div className='analysis-latest-results'>
      <h3>Latest results by metric</h3>
      <LatestResults
        experiment={experiment}
        metrics={metrics}
        metricAssignmentIdToLatestAnalyses={metricAssignmentIdToLatestAnalyses}
      />
    </div>
  )
}
