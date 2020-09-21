import {
  Chip,
  createStyles,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  useTheme,
} from '@material-ui/core'
import clsx from 'clsx'
import _ from 'lodash'
import MaterialTable from 'material-table'
import React from 'react'

import DatetimeText from '@/components/DatetimeText'
import { AnalysisStrategyToHuman, RecommendationWarningToHuman } from '@/lib/analyses'
import * as Experiments from '@/lib/experiments'
import * as MetricAssignments from '@/lib/metric-assignments'
import { AttributionWindowSecondsToHuman } from '@/lib/metric-assignments'
import { Analysis, ExperimentFull, MetricAssignment, MetricBare } from '@/lib/schemas'
import * as Variations from '@/lib/variations'
import { createStaticTableOptions } from '@/utils/material-table'

import RecommendationString from './RecommendationString'
import { MetricAssignmentAnalysesData } from './ExperimentResults'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // Hide the '>' expander buttons when they are disabled
      '& .MuiIconButton-root.Mui-disabled': {
        opacity: 0,
      },
    },
    primaryChip: {
      marginTop: theme.spacing(1),
    },
  }),
)

/**
 * Render the latest analyses for the experiment for each metric assignment as a single condensed table, using only
 * the experiment's default analysis strategy.
 */
export default function CondensedLatestAnalyses({
  experiment,
  allMetricAssignmentAnalysesData,
}: {
  experiment: ExperimentFull
  allMetricAssignmentAnalysesData: MetricAssignmentAnalysesData[]
}) {
  const classes = useStyles()
  const theme = useTheme()

  // Sort the assignments for consistency and collect the data we need to render the component.
  const defaultAnalysisStrategy = Experiments.getDefaultAnalysisStrategy(experiment)

  // When will the Javascript pipe operator ever arrive... :'(
  const metricAssignmentSummaryData = allMetricAssignmentAnalysesData.map(({ metricAssignment, metric, analysesByStrategyDateAsc }) => { 
    const recommendations = Object.values(analysesByStrategyDateAsc).map(analyses => _.last(analyses)?.recommendation).filter(x => !!x)
    const uniqueRecommendations = _.uniq(recommendations.map(recommendation => JSON.stringify(recommendation)))

    return {
      metricAssignment,
      metric,
      analysis: _.last(analysesByStrategyDateAsc[defaultAnalysisStrategy]),
      recommendationConflict: uniqueRecommendations.length > 1,
    }
  })
  // Lodash is a bit of a pain to reuse sorts for nested entities ¯\_(ツ)_/¯
  const sortedMetricAssignmentSummaryData = _.orderBy(metricAssignmentSummaryData, ['metricAssignment.isPrimary', 'metricAssignment.metricAssignmentId'], ['desc', 'asc'])

  const tableColumns = [
    {
      title: 'Metric',
      render: ({ metric, metricAssignment }: { metric: MetricBare; metricAssignment: MetricAssignment }) => (
        <>
          {metric.name}{' '}
          {metricAssignment.isPrimary && (
            <Chip label='Primary' variant='outlined' disabled className={classes.primaryChip} />
          )}
        </>
      ),
      cellStyle: {
        fontFamily: theme.custom.fonts.monospace,
        fontWeight: 600,
      },
    },
    {
      title: 'Attribution window',
      render: ({ metricAssignment }: { metricAssignment: MetricAssignment }) =>
        AttributionWindowSecondsToHuman[metricAssignment.attributionWindowSeconds],
      cellStyle: {
        fontFamily: theme.custom.fonts.monospace,
      },
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
      cellStyle: {
        fontFamily: theme.custom.fonts.monospace,
      },
    },
  ]

  const DetailPanel = [
    ({ analysis, recommendationConflict }: { analysis?: Analysis; recommendationConflict?: boolean }) => {
      return {
        render: () => analysis && <AnalysisDetailPanel analysis={analysis} experiment={experiment} />,
        disabled: !analysis || recommendationConflict,
      }
    },
  ]

  return (
    <div className={classes.root}>
      <MaterialTable
        columns={tableColumns}
        data={sortedMetricAssignmentSummaryData}
        options={createStaticTableOptions(sortedMetricAssignmentSummaryData.length)}
        onRowClick={(_event, rowData, togglePanel) => {
          const { analysis, recommendationConflict } = rowData as {
            analysis?: Analysis
            recommendationConflict?: boolean
          }
          if (togglePanel && analysis && !recommendationConflict) {
            togglePanel()
          }
        }}
        detailPanel={DetailPanel}
      />
    </div>
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
    <TableContainer className={clsx(classes.root, 'analysis-detail-panel')}>
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
            <TableCell className={classes.dataCell}>{AnalysisStrategyToHuman[analysis.analysisStrategy]}</TableCell>
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
