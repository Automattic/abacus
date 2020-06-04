import { Analysis, AnalysisStrategy, ExperimentFull } from '@/models'
import _ from 'lodash'
import { formatIsoUtcOffset } from '@/utils/date'
import React from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'

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
  const primaryMetricAssignmentId = _.filter(experiment.metricAssignments, ['isPrimary', true])[0]
    .metricAssignmentId as number
  const latestPrimaryMetricAnalyses = _.sortBy(
    _.filter(metricAssignmentIdToSortedAnalyses[primaryMetricAssignmentId], [
      'analysisDatetime',
      metricAssignmentIdToSortedAnalyses[primaryMetricAssignmentId][0].analysisDatetime,
    ]),
    'analysisStrategy',
  )
  const sortedVariations = _.orderBy(experiment.variations, ['isPrimary', 'name'], ['desc', 'asc'])
  // TODO:
  // - add metric assignment values
  // - warn if a metric assignment doesn't have any data
  // - warn if the total and variation counts for a metric assignment don't match the latest for the primary metric
  // - show the latest values for each metric assignment, noting the analysis date
  // - add not final under metric assignment summary -- confusing under counts since it's metric-specific
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
            {latestPrimaryMetricAnalyses.map((analysis: Analysis) => (
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

      {/*<pre>{JSON.stringify(analyses, null, 2)}</pre>*/}
    </>
  )
}
