import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core'
import _ from 'lodash'
import React, {useMemo} from 'react'

import DatetimeText from '@/components/DatetimeText'
import {
  Analysis,
  AnalysisStrategy,
  AnalysisStrategyToHuman, AttributionWindowSeconds,
  AttributionWindowSecondsToHuman,
  ExperimentFull,
  MetricBare,
  Recommendation,
  RecommendationWarningToHuman,
  Variation,
} from '@/models'
import AnalysisProcessor from '@/utils/AnalysisProcessor'
import {formatBoolean} from '@/utils/formatters'
import MaterialTable from "material-table";

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
  const sortedVariations = _.orderBy(experiment.variations, ['isDefault', 'name'], ['desc', 'asc'])
  // TODO: convert to static material table (next component as well)?
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Strategy</TableCell>
            <TableCell>Total</TableCell>
            {sortedVariations.map(({ variationId, name }) => (
              <TableCell key={variationId}>
                <code>{name}</code>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {latestPrimaryMetricAnalyses.map(({ analysisStrategy, participantStats }) => (
            <TableRow key={analysisStrategy}>
              <TableCell>{AnalysisStrategyToHuman[analysisStrategy]}</TableCell>
              <TableCell>{participantStats.total}</TableCell>
              {sortedVariations.map(({ variationId }) => (
                <TableCell key={variationId}>{participantStats[`variation_${variationId}`] || 0}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

/**
 * Render the latest results for the experiment for each metric assignment.
 *
 * Note: This is likely to change a lot as part of https://github.com/Automattic/abacus/issues/96.
 */
function LatestResultsDebug({ analysisProcessor }: { analysisProcessor: AnalysisProcessor }) {
  return (
    <>
      {analysisProcessor.resultSummaries.map(
        ({ metricAssignmentId, metricName, attributionWindowSeconds, latestAnalyses, recommendationConflict }) => (
          <div key={metricAssignmentId}>
            <div>
              <strong>Metric: </strong>
              <code>{metricName}</code>
            </div>
            <div>
              <strong>Attribution window: </strong>
              {AttributionWindowSecondsToHuman[attributionWindowSeconds]}
            </div>
            <div>
              <strong>Last analyzed: </strong>
              {latestAnalyses.length > 0 ? DatetimeText({ datetime: latestAnalyses[0].analysisDatetime, excludeTime: true }) : 'N/A'}
            </div>
            <div>
              <strong>Recommendations conflict? </strong>
              {formatBoolean(recommendationConflict)}
            </div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Strategy</TableCell>
                    <TableCell>Participants (not final)</TableCell>
                    <TableCell>Difference interval</TableCell>
                    <TableCell>Recommendation</TableCell>
                    <TableCell>Warnings</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {latestAnalyses.map(({ analysisStrategy, participantStats, metricEstimates, recommendation }) => (
                    <TableRow key={`${metricAssignmentId}_${analysisStrategy}`}>
                      <TableCell>{AnalysisStrategyToHuman[analysisStrategy]}</TableCell>
                      <TableCell>
                        {participantStats.total} ({participantStats.not_final})
                      </TableCell>
                      {metricEstimates && recommendation ? (
                        <>
                          <TableCell>
                            [{_.round(metricEstimates.diff.bottom, 4)}, {_.round(metricEstimates.diff.top, 4)}]
                          </TableCell>
                          <TableCell>
                            <RecommendationString
                              recommendation={recommendation}
                              experiment={analysisProcessor.experiment}
                            />
                          </TableCell>
                          <TableCell>
                            {recommendation.warnings.map((warning) => (
                              <div key={warning}>{RecommendationWarningToHuman[warning]}</div>
                            ))}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>N/A</TableCell>
                          <TableCell>N/A</TableCell>
                          <TableCell>Not analyzed yet</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ),
      )}
    </>
  )
}

function ResultDetail({ analysis, experiment }: { analysis: Analysis, experiment: ExperimentFull }) {
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
          <span key={variationId}>; {analysis.participantStats[`variation_${variationId}`] || 0} in {name}</span>)
        )}
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

function LatestResults({ analysisProcessor }: { analysisProcessor: AnalysisProcessor }) {
  const filteredResults = useMemo(() => {
    // TODO: Move?
    const defaultAnalysisStrategy = analysisProcessor.experiment.exposureEvents ? AnalysisStrategy.PpNaive : AnalysisStrategy.MittNoSpammersNoCrossovers
    return analysisProcessor.resultSummaries.map(
      ({ metricAssignmentId, metricName, attributionWindowSeconds, recommendationConflict, latestAnalyses }) => {
        return {
          metricAssignmentId,
          metricName,
          attributionWindowSeconds,
          recommendationConflict,
          analysis: latestAnalyses.filter((analysis) => analysis.analysisStrategy === defaultAnalysisStrategy)[0]
        }
      }
    )
  }, [analysisProcessor])
  // TODO: mark primary
  // TODO: recommendation text should match status (keep running after the experiment ended is useless)
  const tableColumns = [
    { title: 'Metric', field: 'metricName' },
    { title: 'Attribution window', render: ({attributionWindowSeconds}: {attributionWindowSeconds: AttributionWindowSeconds}) => AttributionWindowSecondsToHuman[attributionWindowSeconds] },
    {
      title: 'Recommendation',
      render: ({analysis, recommendationConflict}: {analysis?: Analysis, recommendationConflict?: boolean}) => {
        if (recommendationConflict) {
          return <>Manual analysis required</>
        }
        if (!analysis?.recommendation) {
          return <>Not analyzed yet</>
        }
        return <RecommendationString recommendation={analysis.recommendation} experiment={analysisProcessor.experiment} />
      }
    },
  ]
  const detailPanel = [
    ({analysis, recommendationConflict}: {analysis?: Analysis, recommendationConflict?: boolean}) => {
      return {
        render: () => analysis && <ResultDetail analysis={analysis} experiment={analysisProcessor.experiment}/>,
        disabled: !analysis || recommendationConflict
      }
    }
  ]
  const tableOptions = {
    pageSize: filteredResults.length,
    paging: false,
    sorting: false,
    toolbar: false,
  }
  return (
    <MaterialTable
      columns={tableColumns}
      data={filteredResults}
      options={tableOptions}
      onRowClick={(_event, rowData, togglePanel) => togglePanel && rowData?.analysis && !rowData?.recommendationConflict && togglePanel()}
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
  const analysisProcessor = useMemo(() => new AnalysisProcessor(analyses, experiment, metrics), [
    analyses,
    experiment,
    metrics,
  ])

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
            latestPrimaryMetricAnalyses={analysisProcessor.getLatestPrimaryMetricAnalyses()}
          />
        </div>

        <div className='analysis-latest-results'>
          <h3>Latest results by metric</h3>
          <LatestResultsDebug analysisProcessor={analysisProcessor} />
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
      <LatestResults analysisProcessor={analysisProcessor} />
    </div>
  )
}
