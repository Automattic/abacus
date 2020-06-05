import { Analysis, AnalysisStrategy, ExperimentFull } from '@/models'
// TODO: split to specific imports
import _ from 'lodash'
import { formatIsoUtcOffset } from '@/utils/date'
// TODO: use MaterialTable?
// import MaterialTable from 'material-table'
import React from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { format } from 'date-fns'

// TODO: move?
const strategyToTitle = {
  [AnalysisStrategy.IttPure]: 'All participants',
  [AnalysisStrategy.MittNoCrossovers]: 'Without crossovers',
  [AnalysisStrategy.MittNoSpammers]: 'Without spammers',
  [AnalysisStrategy.MittNoSpammersNoCrossovers]: 'Without crossovers and spammers',
  [AnalysisStrategy.PpNaive]: 'Exposed without crossovers and spammers',
}

export default function AnalysisSummary(props: { analyses: Analysis[]; experiment: ExperimentFull }) {
  const { analyses, experiment } = props
  if (analyses.length === 0) {
    return <h2>No analyses yet.</h2>
  }
  const sortedAnalyses = _.orderBy(analyses, ['analysisDatetime'], ['desc'])
  const latestAnalysisDatetime = sortedAnalyses[0].analysisDatetime
  // TODO: is order still guaranteed?
  const metricAssignmentIdToSortedAnalyses = _.groupBy(sortedAnalyses, 'metricAssignmentId')
  // _.forOwn(metricAssignmentIdToSortedAnalyses, (val, key) => console.log(val + key))
  const metricAssignmentIdToLatestAnalyses = _.mapValues(metricAssignmentIdToSortedAnalyses, (arr) =>
    _.sortBy(_.filter(arr, ['analysisDatetime', arr[0].analysisDatetime]), 'analysisStrategy'),
  )

  const primaryMetricAssignmentId = _.filter(experiment.metricAssignments, ['isPrimary', true])[0]
    .metricAssignmentId as number
  const sortedVariations = _.orderBy(experiment.variations, ['isPrimary', 'name'], ['desc', 'asc'])
  // TODO:
  // - add metric assignment values
  // - warn if a metric assignment doesn't have any data
  // - warn if the total and variation counts for a metric assignment don't match the latest for the primary metric
  // - show the latest values for each metric assignment, noting the analysis date
  // - add not final under metric assignment summary -- confusing under counts since it's metric-specific (show percent final?)
  // - handle edge cases
  // - add some light tests
  return (
    <>
      <h2>Analysis summary for {formatIsoUtcOffset(latestAnalysisDatetime)}</h2>
      <p>Found {analyses.length} analysis objects in total.</p>

      <h3>Participant counts</h3>
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
              metricAnalyses.map((analysis) => (
                <TableRow key={metricAssignmentId + strategyToTitle[analysis.analysisStrategy]}>
                  <TableCell>{metricAssignmentId}</TableCell>
                  <TableCell>{format(analysis.analysisDatetime, 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{strategyToTitle[analysis.analysisStrategy]}</TableCell>
                  <TableCell>
                    {analysis.participantStats.total} ({analysis.participantStats.not_final})
                  </TableCell>
                  {analysis.metricEstimates && analysis.recommendation ? (
                    <>
                      <TableCell>
                        [{analysis.metricEstimates.diff.bottom}, {analysis.metricEstimates.diff.top}]
                      </TableCell>
                      <TableCell>{analysis.recommendation.endExperiment ? 'End experiment' : 'N/A'}</TableCell>
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
