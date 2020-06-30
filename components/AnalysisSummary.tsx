import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core'
import _ from 'lodash'
import React, {useMemo} from 'react'

import DatetimeText from '@/components/DatetimeText'
import {
  Analysis,
  AnalysisStrategy,
  AnalysisStrategyToHuman,
  AttributionWindowSecondsToHuman,
  ExperimentFull,
  MetricBare,
  Recommendation,
  RecommendationWarningToHuman,
  Variation,
} from '@/models'
import AnalysisProcessor from '@/utils/AnalysisProcessor'
import {formatBoolean} from '@/utils/formatters'

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
              {DatetimeText({ datetime: latestAnalyses[0].analysisDatetime, excludeTime: true })}
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

function LatestResults({ analysisProcessor }: { analysisProcessor: AnalysisProcessor }) {
  const filteredResults = useMemo(() => {
    // TODO: Move?
    const defaultAnalysisStrategy = analysisProcessor.experiment.exposureEvents ? AnalysisStrategy.PpNaive : AnalysisStrategy.MittNoSpammersNoCrossovers
    return analysisProcessor.resultSummaries.map(
      ({ metricAssignmentId, metricName, attributionWindowSeconds, latestAnalyses }) => {
        return {
          metricAssignmentId,
          metricName,
          attributionWindowSeconds,
          analysis: latestAnalyses.filter((analysis) => analysis.analysisStrategy === defaultAnalysisStrategy)[0]
        }
      }
    )
  }, [analysisProcessor])
  // TODO: collapse all cells except for metric, attribution window, last analyzed, and recommendation
  // TODO: drop strategy column
  // TODO: try material table again?
  // TODO: combine with LatestResultsDebug?
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              <TableCell>Attribution window</TableCell>
              <TableCell>Last analyzed</TableCell>
              <TableCell>Strategy</TableCell>
              <TableCell>Participants (not final)</TableCell>
              <TableCell>Difference interval</TableCell>
              <TableCell>Recommendation</TableCell>
              <TableCell>Warnings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredResults.map(
              ({ metricAssignmentId, metricName, attributionWindowSeconds, analysis }) => (
                <TableRow key={metricAssignmentId}>
                  <TableCell><code>{metricName}</code></TableCell>
                  <TableCell>{AttributionWindowSecondsToHuman[attributionWindowSeconds]}</TableCell>
                  {analysis ? (
                    <>
                      <TableCell>{DatetimeText({ datetime: analysis.analysisDatetime, excludeTime: true })}</TableCell>
                      <TableCell>{AnalysisStrategyToHuman[analysis.analysisStrategy]}</TableCell>
                      <TableCell>{analysis.participantStats.total} ({analysis.participantStats.not_final})</TableCell>
                    </>
                   ) : (
                     <>
                       <TableCell>N/A</TableCell>
                       <TableCell>N/A</TableCell>
                       <TableCell>N/A</TableCell>
                     </>
                   )
                  }
                  {analysis && analysis.metricEstimates && analysis.recommendation ? (
                    <>
                      <TableCell>
                        [{_.round(analysis.metricEstimates.diff.bottom, 4)}, {_.round(analysis.metricEstimates.diff.top, 4)}]
                      </TableCell>
                      <TableCell>
                        <RecommendationString
                          recommendation={analysis.recommendation}
                          experiment={analysisProcessor.experiment}
                        />
                      </TableCell>
                      <TableCell>
                        {analysis.recommendation.warnings.map((warning) => (
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
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
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
    return <h2>No analyses yet for {experiment.name}.</h2>
  }

  if (analysisProcessor.manualAnalysisRequired) {
    return <h2>Manual analysis required.</h2>
  }

  // TODO:
  // - Show ParticipantCounts and LatestResults only in debug mode? Definitely LatestResults
  // - Create a single LatestResults table that will be shown in non-debug mode if no manualAnalysisRequired:
  //   - Show mitt_no_spammers_no_crossovers if there are no exposure events
  //   - Show pp_naive if there are exposure events
  // - Add more warnings? seems unnecessary and better handled elsewhere
  //   - If the observed variation split is very different from the requested split?
  //   - If a metric assignment hasn’t been analysed? May be completely missing?
  //   - If the total and variation counts for a metric assignment don't match the latest for the primary metric?
  //     (might be fine due to different analysis datetimes)
  // - Handle Python warnings better? Or at a later stage.

  return (
    <>
      <h2>Analysis summary</h2>
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
        <LatestResults analysisProcessor={analysisProcessor} />
      </div>

      {debugMode ? <pre className='debug-json'>{JSON.stringify(analyses, null, 2)}</pre> : ''}
    </>
  )
}
