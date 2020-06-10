// TODO: split to specific imports
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { format } from 'date-fns'
import _ from 'lodash'
import React from 'react'

import { Analysis, AnalysisStrategy, ExperimentFull, MetricBare, Recommendation } from '@/models'

// TODO: move these helpers? make them methods of model classes?
const strategyToTitle = {
  [AnalysisStrategy.IttPure]: 'All participants',
  [AnalysisStrategy.MittNoCrossovers]: 'Without crossovers',
  [AnalysisStrategy.MittNoSpammers]: 'Without spammers',
  [AnalysisStrategy.MittNoSpammersNoCrossovers]: 'Without crossovers and spammers',
  [AnalysisStrategy.PpNaive]: 'Exposed without crossovers and spammers',
}

function recommendationToString(recommendation: Recommendation, experiment: ExperimentFull) {
  if (recommendation.endExperiment) {
    if (recommendation.chosenVariationId) {
      const variationName = _.filter(experiment.variations, ['variationId', recommendation.chosenVariationId])[0].name
      return (
        <>
          End experiment; deploy <code>{variationName}</code>
        </>
      )
    }
    return <>End experiment; deploy either variation</>
  }
  return <>Keep running</>
}

function ParticipantCounts(props: { experiment: ExperimentFull; latestPrimaryMetricAnalyses: Analysis[] }) {
  const { experiment, latestPrimaryMetricAnalyses } = props
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

function LatestResults(props: {
  experiment: ExperimentFull
  metrics: MetricBare[]
  metricAssignmentIdToLatestAnalyses: { [key: number]: Analysis[] }
}) {
  const { experiment, metrics, metricAssignmentIdToLatestAnalyses } = props
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
                        <TableCell>{recommendationToString(analysis.recommendation, experiment)}</TableCell>
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
  if (analyses.length === 0) {
    return <h2>No analyses yet for {experiment.name}.</h2>
  }

  const metricAssignmentIdToLatestAnalyses = _.mapValues(
    _.groupBy(analyses, 'metricAssignmentId'),
    (metricAnalyses) => {
      metricAnalyses = _.orderBy(metricAnalyses, ['analysisDatetime'], ['desc'])
      return _.sortBy(
        _.filter(metricAnalyses, ['analysisDatetime', metricAnalyses[0].analysisDatetime]),
        'analysisStrategy',
      )
    },
  )

  // TODO:
  // - warn if the total and variation counts for a metric assignment don't match the latest for the primary metric (might be fine due to different analysis datetimes)
  // - clean up presentation: show percent final rather than count? make warnings human-friendly
  // - handle edge cases -- add them to the story
  // - add some light tests for things that shouldn't change
  return (
    <>
      <h2>Analysis summary</h2>
      <p>Found {analyses.length} analysis objects in total.</p>

      <h3>Participant counts for the primary metric</h3>
      <ParticipantCounts
        experiment={experiment}
        latestPrimaryMetricAnalyses={metricAssignmentIdToLatestAnalyses[experiment.getPrimaryMetricAssignmentId() || 0]}
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
