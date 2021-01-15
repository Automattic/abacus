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
  Typography,
  useTheme,
} from '@material-ui/core'
import clsx from 'clsx'
import _, { identity } from 'lodash'
import MaterialTable from 'material-table'
import { PlotData } from 'plotly.js'
import React from 'react'
import Plot from 'react-plotly.js'

import DatetimeText from 'src/components/general/DatetimeText'
import MetricValue from 'src/components/general/MetricValue'
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
  Recommendation,
} from 'src/lib/schemas'
import * as Variations from 'src/lib/variations'
import * as Visualizations from 'src/lib/visualizations'
import { formatBoolean } from 'src/utils/formatters'
import { isDebugMode } from 'src/utils/general'
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
        .filter((recommendation) => !!recommendation) as Array<Recommendation>
      const recommendationConflict = _.uniq(_.map(recommendations, 'chosenVariationId')).length > 1

      return {
        metricAssignment,
        metric,
        analysesByStrategyDateAsc,
        latestDefaultAnalysis: _.last(analysesByStrategyDateAsc[defaultAnalysisStrategy]),
        recommendationConflict,
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
          mode: 'lines+markers' as const,
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
      let disabled = !latestDefaultAnalysis || recommendationConflict
      // istanbul ignore next; debug only
      disabled = disabled && !isDebugMode()
      return {
        render: () =>
          latestDefaultAnalysis && (
            <AnalysisDetailPanel
              {...{ analysesByStrategyDateAsc, latestDefaultAnalysis, metricAssignment, metric, experiment }}
            />
          ),
        disabled,
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
      width: '14rem',
      verticalAlign: 'top',
    },
    monospace: {
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
      marginBottom: theme.spacing(6),
      width: '100%',
    },
    noPlotMessage: {
      margin: theme.spacing(0, 0, 0, 2),
      color: theme.palette.grey[600],
    },
    tableHeader: {
      margin: theme.spacing(3, 0, 1, 2),
    },
    rowHeader: {
      verticalAlign: 'top',
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

  const latestEstimates = latestDefaultAnalysis.metricEstimates

  // istanbul ignore next; Shouldn't occur
  if (!latestEstimates) {
    throw new Error('Missing analysis data.')
  }

  return (
    <TableContainer className={clsx(classes.root, 'analysis-detail-panel')}>
      {dates.length > 1 ? (
        <div className={classes.metricEstimatePlots}>
          <Plot
            layout={{
              ...Visualizations.plotlyLayoutDefault,
              title: isConversion
                ? `Conversion rate estimates by variation (%)`
                : `Revenue estimates by variation (USD)`,
            }}
            data={plotlyDataVariationGraph}
            className={classes.metricEstimatePlot}
          />
          <Plot
            layout={{
              ...Visualizations.plotlyLayoutDefault,
              title: isConversion
                ? `Conversion rate difference estimates (percentage points)`
                : `Revenue difference estimates (USD)`,
            }}
            data={plotlyDataDifferenceGraph}
            className={classes.metricEstimatePlot}
          />
        </div>
      ) : (
        <Typography variant='body1' className={classes.noPlotMessage}>
          Past values will be plotted once we have more than one day of results.
        </Typography>
      )}
      <Typography variant='h4' className={classes.tableHeader}>
        Latest Estimates
      </Typography>
      <Table>
        <TableBody>
          {latestDefaultAnalysis.recommendation && (
            <>
              <TableRow>
                <TableCell
                  component='th'
                  scope='row'
                  variant='head'
                  className={clsx(classes.rowHeader, classes.headerCell)}
                >
                  Difference
                </TableCell>
                <TableCell className={classes.monospace}>
                  [
                  <MetricValue
                    value={latestEstimates.diff.bottom}
                    metricParameterType={metric.parameterType}
                    isDifference={true}
                  />
                  ,&nbsp;
                  <MetricValue
                    value={latestEstimates.diff.top}
                    metricParameterType={metric.parameterType}
                    isDifference={true}
                  />
                  ]
                  <br />
                  <br />
                  <strong>Interpretation:</strong>
                  <br />
                  There is a 95% probability that the difference between variations is between{' '}
                  <MetricValue
                    value={latestEstimates.diff.bottom}
                    metricParameterType={metric.parameterType}
                    isDifference={true}
                  />{' '}
                  and{' '}
                  <MetricValue
                    value={latestEstimates.diff.top}
                    metricParameterType={metric.parameterType}
                    isDifference={true}
                  />
                  .
                </TableCell>
              </TableRow>
            </>
          )}
          {experiment.variations.map((variation) => (
            <React.Fragment key={variation.variationId}>
              <TableRow>
                <TableCell
                  component='th'
                  scope='row'
                  variant='head'
                  valign='top'
                  className={clsx(classes.rowHeader, classes.headerCell)}
                >
                  <span className={classes.monospace}>{variation.name}</span>
                </TableCell>
                <TableCell className={classes.monospace}>
                  [
                  <MetricValue
                    value={latestEstimates[`variation_${variation.variationId}`].bottom}
                    metricParameterType={metric.parameterType}
                  />
                  ,&nbsp;
                  <MetricValue
                    value={latestEstimates[`variation_${variation.variationId}`].top}
                    metricParameterType={metric.parameterType}
                  />
                  ]
                  <br />
                  <br />
                  <strong>Interpretation:</strong>
                  <br />
                  There is a 95% probability that the metric value for this variation is between{' '}
                  <MetricValue
                    value={latestEstimates[`variation_${variation.variationId}`].bottom}
                    metricParameterType={metric.parameterType}
                  />{' '}
                  and{' '}
                  <MetricValue
                    value={latestEstimates[`variation_${variation.variationId}`].top}
                    metricParameterType={metric.parameterType}
                  />
                  .
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
          {latestDefaultAnalysis.recommendation && latestDefaultAnalysis.recommendation.warnings.length > 0 && (
            <TableRow>
              <TableCell component='th' scope='row' variant='head' className={classes.headerCell}>
                <span role='img' aria-label=''>
                  ⚠️
                </span>{' '}
                Warnings
              </TableCell>
              <TableCell className={classes.monospace}>
                {latestDefaultAnalysis.recommendation.warnings.map((warning) => (
                  <div key={warning}>{RecommendationWarningToHuman[warning]}</div>
                ))}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Typography variant='h4' className={classes.tableHeader}>
        Metric Assignment Details
      </Typography>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell component='th' scope='row' variant='head' className={classes.headerCell}>
              Metric Description
            </TableCell>
            <TableCell className={classes.monospace}>{metric.description}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component='th' scope='row' variant='head' className={classes.headerCell}>
              Minimum Practical Difference
            </TableCell>
            <TableCell className={classes.monospace}>
              <MetricValue
                value={metricAssignment.minDifference}
                metricParameterType={metric.parameterType}
                isDifference={true}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component='th' scope='row' variant='head' className={classes.headerCell}>
              Change Expected
            </TableCell>
            <TableCell className={classes.monospace}>{formatBoolean(metricAssignment.changeExpected)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Typography variant='h4' className={classes.tableHeader}>
        Analysis Fine Print
      </Typography>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell component='th' scope='row' variant='head' className={classes.headerCell}>
              Last analyzed
            </TableCell>
            <TableCell>
              <DatetimeText datetime={latestDefaultAnalysis.analysisDatetime} excludeTime={true} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component='th' scope='row' variant='head' className={classes.headerCell}>
              Analysis strategy
            </TableCell>
            <TableCell className={classes.monospace}>
              {AnalysisStrategyToHuman[latestDefaultAnalysis.analysisStrategy]}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component='th' scope='row' variant='head' className={classes.headerCell}>
              Analyzed participants
            </TableCell>
            <TableCell className={classes.monospace}>
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
        </TableBody>
      </Table>
    </TableContainer>
  )
}
