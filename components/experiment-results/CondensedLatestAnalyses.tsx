import _ from 'lodash'
import MaterialTable from 'material-table'
import React from 'react'

import DatetimeText from '@/components/DatetimeText'
import Label from '@/components/Label'
import { AnalysisStrategyToHuman, RecommendationWarningToHuman } from '@/lib/analyses'
import * as Experiments from '@/lib/experiments'
import * as MetricAssignments from '@/lib/metric-assignments'
import { AttributionWindowSecondsToHuman } from '@/lib/metric-assignments'
import { Analysis, ExperimentFull, MetricAssignment, MetricBare } from '@/lib/schemas'
import * as Variations from '@/lib/variations'
import { createStaticTableOptions } from '@/utils/material-table'

import RecommendationString from './RecommendationString'
import { Table, TableBody, TableRow, TableCell, makeStyles, Theme, createStyles, TableContainer } from '@material-ui/core'

/**
 * Render the latest analyses for the experiment for each metric assignment as a single condensed table, using only
 * the experiment's default analysis strategy.
 */
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
  const defaultAnalysisStrategy = Experiments.getDefaultAnalysisStrategy(experiment)
  const resultSummaries = MetricAssignments.sort(experiment.metricAssignments).map((metricAssignment) => {
    const latestAnalyses = metricAssignmentIdToLatestAnalyses[metricAssignment.metricAssignmentId] || []
    const uniqueRecommendations = _.uniq(latestAnalyses.map(({ recommendation }) => JSON.stringify(recommendation)))
    return {
      metricAssignment,
      metric: metricsById[metricAssignment.metricId],
      analysis: latestAnalyses.find((analysis) => analysis.analysisStrategy === defaultAnalysisStrategy),
      recommendationConflict: uniqueRecommendations.length > 1,
    }
  })
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
        const { analysis, recommendationConflict } = rowData as {
          analysis?: Analysis
          recommendationConflict?: boolean
        }
        if (togglePanel && analysis && !recommendationConflict) {
          togglePanel()
        }
      }}
      detailPanel={detailPanel}
    />
  )
}


const useAnalysisDetailStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2, 8),
      background: theme.palette.action.hover,
    },
    headerCell: {
      fontWeight: 'bold',
      width: '9rem',
      verticalAlign: 'top',
    },
    dataCell: {
      fontFamily: theme.custom.fonts.monospace,
    },
  }),
)

function AnalysisDetailPanel({ analysis, experiment }: { analysis: Analysis; experiment: ExperimentFull }) {
  const classes = useAnalysisDetailStyles()

  return (
    <TableContainer className={classes.root}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell component='th' scope='row' variant='head'>
              Last analyzed
            </TableCell>
            <TableCell>
              <DatetimeText datetime={analysis.analysisDatetime} excludeTime={true} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component='th' scope='row' variant='head'>
              Analysis strategy
            </TableCell>
            <TableCell className={classes.dataCell}>
              {AnalysisStrategyToHuman[analysis.analysisStrategy]}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component='th' scope='row' variant='head'>
              Analyzed participants
            </TableCell>
            <TableCell className={classes.dataCell}>
              {analysis.participantStats.total} ({analysis.participantStats.not_final} not final
                {Variations.sort(experiment.variations).map(({ variationId, name }) => (
                  <span key={variationId}>
                    ; {analysis.participantStats[`variation_${variationId}`]} in {name}
                  </span>
                ))}
              )
            </TableCell>
          </TableRow>
          {analysis.metricEstimates && analysis.recommendation && (
            <>
              <TableRow>
                <TableCell component='th' scope='row' variant='head'>
                  Difference interval
                </TableCell>
                <TableCell className={classes.dataCell}>
                    [{_.round(analysis.metricEstimates.diff.bottom, 4)}, {_.round(analysis.metricEstimates.diff.top, 4)}]
                </TableCell>
              </TableRow>
              {analysis.recommendation.warnings.length > 0 && (
                <TableRow>
                  <TableCell component='th' scope='row' variant='head'>
                    Warnings
                  </TableCell>
                  <TableCell className={classes.dataCell}>
                    {analysis.recommendation.warnings.map((warning) => (
                      <div key={warning}>{RecommendationWarningToHuman[warning]}</div>
                    ))}
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
