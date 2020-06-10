import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { format } from 'date-fns'
// TODO: split to specific imports
import _ from 'lodash'
import React, { useMemo } from 'react'

import { Analysis, AnalysisStrategy, ExperimentFull, MetricBare, Recommendation, Variation } from '@/models'

const strategyToTitle = {
  [AnalysisStrategy.IttPure]: 'All participants',
  [AnalysisStrategy.MittNoCrossovers]: 'Without crossovers',
  [AnalysisStrategy.MittNoSpammers]: 'Without spammers',
  [AnalysisStrategy.MittNoSpammersNoCrossovers]: 'Without crossovers and spammers',
  [AnalysisStrategy.PpNaive]: 'Exposed without crossovers and spammers',
}

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

function ParticipantCounts({
  experiment,
  latestPrimaryMetricAnalyses,
}: {
  experiment: ExperimentFull
  latestPrimaryMetricAnalyses: Analysis[]
}) {
  const sortedVariations = _.orderBy(experiment.variations, ['isPrimary', 'name'], ['desc', 'asc'])
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Strategy</TableCell>
            <TableCell>Total</TableCell>
            {sortedVariations.map((variation) => (
              <TableCell key={variation.variationId}>
                <code>{variation.name}</code>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {latestPrimaryMetricAnalyses.map((analysis) => (
            <TableRow key={analysis.analysisStrategy}>
              <TableCell>{strategyToTitle[analysis.analysisStrategy]}</TableCell>
              <TableCell>{analysis.participantStats.total}</TableCell>
              {sortedVariations.map((variation) => (
                <TableCell key={variation.variationId}>
                  {analysis.participantStats[`variation_${variation.variationId}`] || 0}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
  const metricsById = _.zipObject(_.map(metrics, 'metricId'), metrics)
  const metricAssignmentsById = _.zipObject(
    _.map(experiment.metricAssignments, 'metricAssignmentId') as number[],
    experiment.metricAssignments,
  )
  return (
    <>
      {Object.entries(metricAssignmentIdToLatestAnalyses).map(([metricAssignmentId, metricAnalyses]) => (
        <div key={metricAssignmentId}>
          <div>
            <strong>Metric: </strong>
            <code>{metricsById[metricAssignmentsById[metricAssignmentId].metricId].name}</code>
          </div>
          <div>
            <strong>Attribution window: </strong>
            {metricAssignmentsById[metricAssignmentId].attributionWindowSeconds / 3600} hours
          </div>
          <div>
            <strong>Last analyzed: </strong>
            {format(metricAnalyses[0].analysisDatetime, 'yyyy-MM-dd')}
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
                {metricAnalyses.map((analysis) => (
                  <TableRow key={metricAssignmentId + strategyToTitle[analysis.analysisStrategy]}>
                    <TableCell>{strategyToTitle[analysis.analysisStrategy]}</TableCell>
                    <TableCell>
                      {analysis.participantStats.total} ({analysis.participantStats.not_final})
                    </TableCell>
                    {analysis.metricEstimates && analysis.recommendation ? (
                      <>
                        <TableCell>
                          [{_.round(analysis.metricEstimates.diff.bottom, 4)},{' '}
                          {_.round(analysis.metricEstimates.diff.top, 4)}]
                        </TableCell>
                        <TableCell>
                          <RecommendationString recommendation={analysis.recommendation} experiment={experiment} />
                        </TableCell>
                        <TableCell>{analysis.recommendation.warnings.join(', ')}</TableCell>
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
      ))}
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

  // TODO:
  // - make warnings human-friendly
  // - handle edge cases -- add them to the story (see real data)
  return (
    <>
      <h2>Analysis summary</h2>
      <p>Found {analyses.length} analysis objects in total.</p>

      <h3>Participant counts for the primary metric</h3>
      <ParticipantCounts
        experiment={experiment}
        latestPrimaryMetricAnalyses={
          metricAssignmentIdToLatestAnalyses[experiment.getPrimaryMetricAssignmentId() as number]
        }
      />

      <h3>Latest results by metric</h3>
      <LatestResults
        experiment={experiment}
        metrics={metrics}
        metricAssignmentIdToLatestAnalyses={metricAssignmentIdToLatestAnalyses}
      />

      {debugMode ? <pre>{JSON.stringify(analyses, null, 2)}</pre> : ''}
    </>
  )
}
