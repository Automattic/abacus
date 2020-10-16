import {
  Chip,
  createStyles,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  useTheme,
} from '@material-ui/core'
import clsx from 'clsx'
import _, { identity } from 'lodash'
import MaterialTable from 'material-table'
import { PlotData } from 'plotly.js'
import React from 'react'
import Plot from 'react-plotly.js'

import DatetimeText from 'src/components/DatetimeText'
import { AnalysisStrategyToHuman, RecommendationWarningToHuman } from 'src/lib/analyses'
import * as Experiments from 'src/lib/experiments'
import { AttributionWindowSecondsToHuman } from 'src/lib/metric-assignments'
import {
  Analysis,
  AnalysisStrategy,
  ExperimentFull,
  MetricAssignment,
  MetricBare,
  MetricParameterType,
} from 'src/lib/schemas'
import * as Variations from 'src/lib/variations'
import * as Visualizations from 'src/lib/visualizations'
import { createStaticTableOptions } from 'src/utils/material-table'

import { MetricAssignmentAnalysesData } from './ExperimentResults'
import RecommendationString from './RecommendationString'

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
    summary: {
      padding: theme.spacing(2),
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(2),
    },
    participantsPlot: {
      width: '100%',
      height: 300,
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
}): JSX.Element {
  const classes = useStyles()
  const theme = useTheme()

  // Sort the assignments for consistency and collect the data we need to render the component.
  const defaultAnalysisStrategy = Experiments.getDefaultAnalysisStrategy(experiment)

  // When will the Javascript pipe operator ever arrive... :'(
  const metricAssignmentSummaryData = allMetricAssignmentAnalysesData.map(
    ({ metricAssignment, metric, analysesByStrategyDateAsc }) => {
      const recommendations = Object.values(analysesByStrategyDateAsc)
        .map(
          (analyses) =>
            //  istanbul ignore next; We don't need to test empty analyses as we filter out all undefined values
            _.last(analyses)?.recommendation,
        )
        .filter((recommendation) => !!recommendation)
      const uniqueRecommendations = _.uniq(recommendations.map((recommendation) => JSON.stringify(recommendation)))

      return {
        metricAssignment,
        metric,
        analysesByStrategyDateAsc,
        latestDefaultAnalysis: _.last(analysesByStrategyDateAsc[defaultAnalysisStrategy]),
        recommendationConflict: uniqueRecommendations.length > 1,
      }
    },
  )

  // ### Result Summary Visualizations

  const primaryMetricAssignmentAnalysesData = allMetricAssignmentAnalysesData.find(
    ({ metricAssignment: { isPrimary } }) => isPrimary,
  ) as MetricAssignmentAnalysesData
  const strategy = Experiments.getDefaultAnalysisStrategy(experiment)
  const analyses = primaryMetricAssignmentAnalysesData.analysesByStrategyDateAsc[strategy]
  const dates = analyses.map(({ analysisDatetime }) => analysisDatetime.toISOString())

  const plotlyDataParticipantGraph: Array<Partial<PlotData>> = [
    ..._.flatMap(experiment.variations, (variation, index) => {
      const variationKey = `variation_${variation.variationId}`
      return [
        {
          name: `${variation.name}`,
          x: dates,
          y: analyses.map(({ participantStats: { [variationKey]: variationCount } }) => variationCount),
          line: {
            color: Visualizations.variantColors[index],
          },
          mode: 'lines' as const,
          type: 'scatter' as const,
        },
      ]
    }),
  ]

  // ### Metric Assignments Table

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
      render: ({
        latestDefaultAnalysis,
        recommendationConflict,
      }: {
        latestDefaultAnalysis?: Analysis
        recommendationConflict?: boolean
      }) => {
        if (recommendationConflict) {
          return <>Manual analysis required</>
        }
        if (!latestDefaultAnalysis?.recommendation) {
          return <>Not analyzed yet</>
        }
        return <RecommendationString recommendation={latestDefaultAnalysis.recommendation} experiment={experiment} />
      },
      cellStyle: {
        fontFamily: theme.custom.fonts.monospace,
      },
    },
  ]

  const DetailPanel = [
    ({
      analysesByStrategyDateAsc,
      latestDefaultAnalysis,
      metricAssignment,
      metric,
      recommendationConflict,
    }: {
      analysesByStrategyDateAsc: Record<AnalysisStrategy, Analysis[]>
      latestDefaultAnalysis?: Analysis
      metricAssignment: MetricAssignment
      metric: MetricBare
      recommendationConflict?: boolean
    }) => {
      return {
        render: () =>
          latestDefaultAnalysis && (
            <AnalysisDetailPanel
              {...{ analysesByStrategyDateAsc, latestDefaultAnalysis, metricAssignment, metric, experiment }}
            />
          ),
        disabled: !latestDefaultAnalysis || recommendationConflict,
      }
    },
  ]

  return (
    <div className={classes.root}>
      <Paper className={classes.summary}>
        <Plot
          layout={{
            ...Visualizations.plotlyLayoutDefault,
            title: `Participants (${AnalysisStrategyToHuman[strategy]})`,
          }}
          data={plotlyDataParticipantGraph}
          className={classes.participantsPlot}
        />
      </Paper>
      <MaterialTable
        columns={tableColumns}
        data={metricAssignmentSummaryData}
        options={createStaticTableOptions(metricAssignmentSummaryData.length)}
        onRowClick={(_event, rowData, togglePanel) => {
          const { latestDefaultAnalysis, recommendationConflict } = rowData as {
            latestDefaultAnalysis?: Analysis
            recommendationConflict?: boolean
          }
          if (togglePanel && latestDefaultAnalysis && !recommendationConflict) {
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
    metricEstimatePlots: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: theme.spacing(2),
    },
    metricEstimatePlot: {
      width: `calc(50% - ${theme.spacing(1)}px)`,
      height: 400,
    },
    participantsPlot: {
      height: 400,
      marginTop: theme.spacing(2),
      width: '100%',
    },
  }),
)

function AnalysisDetailPanel({
  latestDefaultAnalysis,
  metricAssignment,
  metric,
  analysesByStrategyDateAsc,
  experiment,
}: {
  latestDefaultAnalysis: Analysis
  metricAssignment: MetricAssignment
  metric: MetricBare
  analysesByStrategyDateAsc: Record<AnalysisStrategy, Analysis[]>
  experiment: ExperimentFull
}) {
  const classes = useAnalysisDetailStyles()

  const isConversion = metric.parameterType === MetricParameterType.Conversion
  const estimateTransform: (estimate: number | null) => number | null = isConversion
    ? (estimate: number | null) => estimate && estimate * 100
    : identity
  const strategy = Experiments.getDefaultAnalysisStrategy(experiment)
  const analyses = analysesByStrategyDateAsc[strategy]
  const dates = analyses.map(({ analysisDatetime }) => analysisDatetime.toISOString())

  const plotlyDataVariationGraph: Array<Partial<PlotData>> = [
    ..._.flatMap(experiment.variations, (variation, index) => {
      const variationKey = `variation_${variation.variationId}`
      return [
        {
          name: `${variation.name}: lower bound`,
          x: dates,
          y: analyses
            .map(({ metricEstimates }) => metricEstimates && metricEstimates[variationKey].bottom)
            .map(estimateTransform),
          line: {
            color: Visualizations.variantColors[index],
          },
          mode: 'lines' as const,
          type: 'scatter' as const,
        },
        {
          name: `${variation.name}: upper bound`,
          x: dates,
          y: analyses
            .map(({ metricEstimates }) => metricEstimates && metricEstimates[variationKey].top)
            .map(estimateTransform),
          line: {
            color: Visualizations.variantColors[index],
          },
          fill: 'tonexty' as const,
          fillcolor: Visualizations.variantColors[index],
          mode: 'lines' as const,
          type: 'scatter' as const,
        },
      ]
    }),
  ]

  const plotlyDataDifferenceGraph: Array<Partial<PlotData>> = [
    {
      name: `difference: lower bound`,
      x: dates,
      y: analyses
        .map(({ metricEstimates }) => metricEstimates && metricEstimates['diff'].bottom)
        .map(estimateTransform),
      line: { width: 0 },
      marker: { color: '444' },
      mode: 'lines' as const,
      type: 'scatter' as const,
    },
    {
      name: `difference: upper bound`,
      x: dates,
      y: analyses.map(({ metricEstimates }) => metricEstimates && metricEstimates['diff'].top).map(estimateTransform),
      fill: 'tonexty',
      fillcolor: 'rgba(0,0,0,.2)',
      line: { width: 0 },
      marker: { color: '444' },
      mode: 'lines' as const,
      type: 'scatter' as const,
    },
    {
      name: 'ROPE: lower bound',
      x: dates,
      y: analyses.map((_) => -metricAssignment.minDifference).map(estimateTransform),
      line: {
        color: 'rgba(0,0,0,.4)',
        dash: 'dash',
      },
      mode: 'lines' as const,
      type: 'scatter' as const,
    },
    {
      name: 'ROPE: upper bound',
      x: dates,
      y: analyses.map((_) => metricAssignment.minDifference).map(estimateTransform),
      line: {
        color: 'rgba(0,0,0,.4)',
        dash: 'dash',
      },
      mode: 'lines' as const,
      type: 'scatter' as const,
    },
  ]

  return (
    <TableContainer className={clsx(classes.root, 'analysis-detail-panel')}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell component='th' scope='row' variant='head'>
              Last analyzed
            </TableCell>
            <TableCell>
              <DatetimeText datetime={latestDefaultAnalysis.analysisDatetime} excludeTime={true} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component='th' scope='row' variant='head'>
              Analysis strategy
            </TableCell>
            <TableCell className={classes.dataCell}>
              {AnalysisStrategyToHuman[latestDefaultAnalysis.analysisStrategy]}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component='th' scope='row' variant='head'>
              Analyzed participants
            </TableCell>
            <TableCell className={classes.dataCell}>
              {latestDefaultAnalysis.participantStats.total} ({latestDefaultAnalysis.participantStats.not_final} not
              final
              {Variations.sort(experiment.variations).map(({ variationId, name }) => (
                <span key={variationId}>
                  ; {latestDefaultAnalysis.participantStats[`variation_${variationId}`]} in {name}
                </span>
              ))}
              )
            </TableCell>
          </TableRow>
          {latestDefaultAnalysis.metricEstimates && latestDefaultAnalysis.recommendation && (
            <>
              <TableRow>
                <TableCell component='th' scope='row' variant='head'>
                  Difference interval
                </TableCell>
                <TableCell className={classes.dataCell}>
                  [{_.round(latestDefaultAnalysis.metricEstimates.diff.bottom, 4)},
                  {_.round(latestDefaultAnalysis.metricEstimates.diff.top, 4)}]
                </TableCell>
              </TableRow>
              {latestDefaultAnalysis.recommendation.warnings.length > 0 && (
                <TableRow>
                  <TableCell component='th' scope='row' variant='head'>
                    Warnings
                  </TableCell>
                  <TableCell className={classes.dataCell}>
                    {latestDefaultAnalysis.recommendation.warnings.map((warning) => (
                      <div key={warning}>{RecommendationWarningToHuman[warning]}</div>
                    ))}
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
      <div className={classes.metricEstimatePlots}>
        <Plot
          layout={{
            ...Visualizations.plotlyLayoutDefault,
            title: isConversion ? `Conversion rate estimates by variation (%)` : `Revenue estimates by variation ($)`,
          }}
          data={plotlyDataVariationGraph}
          className={classes.metricEstimatePlot}
        />
        <Plot
          layout={{
            ...Visualizations.plotlyLayoutDefault,
            title: isConversion ? `Conversion rate difference estimates (%)` : `Revenue difference estimates ($)`,
          }}
          data={plotlyDataDifferenceGraph}
          className={classes.metricEstimatePlot}
        />
      </div>
    </TableContainer>
  )
}
