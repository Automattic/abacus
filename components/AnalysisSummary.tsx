import { Analysis, AnalysisStrategy, ExperimentFull, MetricBare, Recommendation } from '@/models'
// TODO: split to specific imports
import _ from 'lodash'
// TODO: use MaterialTable?
// import MaterialTable from 'material-table'
import React from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { format } from 'date-fns'

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

export default function AnalysisSummary(props: {
  analyses: Analysis[]
  experiment: ExperimentFull
  metrics: MetricBare[]
}) {
  const { analyses, experiment, metrics } = props
  if (analyses.length === 0) {
    return <h2>No analyses yet.</h2>
  }
  const metricsById = _.zipObject(_.map(metrics, 'metricId'), metrics)
  const metricAssignmentsById = _.zipObject(
    _.map(experiment.metricAssignments, 'metricAssignmentId') as number[],
    experiment.metricAssignments,
  )
  const sortedAnalyses = _.orderBy(analyses, ['analysisDatetime'], ['desc'])
  const latestAnalysisDatetime = sortedAnalyses[0].analysisDatetime
  // TODO: is order still guaranteed after grouping?
  const metricAssignmentIdToLatestAnalyses = _.mapValues(
    _.groupBy(sortedAnalyses, 'metricAssignmentId'),
    (metricAnalyses) =>
      _.sortBy(_.filter(metricAnalyses, ['analysisDatetime', metricAnalyses[0].analysisDatetime]), 'analysisStrategy'),
  )

  const primaryMetricAssignmentId = _.filter(experiment.metricAssignments, ['isPrimary', true])[0]
    .metricAssignmentId as number
  const sortedVariations = _.orderBy(experiment.variations, ['isPrimary', 'name'], ['desc', 'asc'])
  // TODO:
  // - warn if a metric assignment doesn't have any data
  // - warn if the total and variation counts for a metric assignment don't match the latest for the primary metric (might be fine due to different analysis datetimes)
  // - clean up presentation: show percent final rather than count? format days rather than hours when appropriate, make warnings human-friendly
  // - handle edge cases -- add them to the story
  // - add some light tests for things that shouldn't change
  return (
    <>
      <h2>Analysis summary for {format(latestAnalysisDatetime, 'yyyy-MM-dd')}</h2>
      <p>Found {analyses.length} analysis objects in total.</p>

      <h3>Participant counts for the primary metric</h3>
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
            {metricAssignmentIdToLatestAnalyses[primaryMetricAssignmentId].map((analysis: Analysis) => (
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

      <h3>Latest results by metric</h3>
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
            {Object.entries(metricAssignmentIdToLatestAnalyses).map(([metricAssignmentId, metricAnalyses]) =>
              metricAnalyses.map((analysis, index) => (
                <TableRow key={metricAssignmentId + strategyToTitle[analysis.analysisStrategy]}>
                  {index === 0 ? (
                    <>
                      <TableCell>
                        <code>{metricsById[metricAssignmentsById[metricAssignmentId].metricId].name}</code>
                      </TableCell>
                      <TableCell>
                        {metricAssignmentsById[metricAssignmentId].attributionWindowSeconds / 3600} hours
                      </TableCell>
                      <TableCell>{format(analysis.analysisDatetime, 'yyyy-MM-dd')}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                    </>
                  )}
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
              )),
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/*<MaterialTable*/}
      {/*  columns={[*/}
      {/*    {title: 'Metric', field: 'metricAssigmentId'},*/}
      {/*    {title: 'Strategy', field: 'analysisStrategy'},*/}
      {/*    {title: 'Participants (not final)', field: 'participantStats'},*/}
      {/*    {title: 'Difference interval', field: 'metricEstimates'},*/}
      {/*    {title: 'Recommendation', field: 'recommendation.endExperiment'},*/}
      {/*    {title: 'Warnings', field: 'recommendation.warnings'}*/}
      {/*  ]}*/}
      {/*  data={metricAssignmentIdToLatestAnalyses[primaryMetricAssignmentId]}*/}
      {/* />*/}
      <pre>{JSON.stringify(analyses, null, 2)}</pre>
    </>
  )
}
