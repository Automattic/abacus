import {
  createStyles,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core'
import clsx from 'clsx'
import _, { identity } from 'lodash'
import { PlotData } from 'plotly.js'
import React from 'react'
import Plot from 'react-plotly.js'

import DatetimeText from 'src/components/general/DatetimeText'
import MetricValue from 'src/components/general/MetricValue'
import { AnalysisStrategyToHuman, RecommendationWarningToHuman } from 'src/lib/analyses'
import * as Experiments from 'src/lib/experiments'
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
import { formatBoolean } from 'src/utils/formatters'

const useStyles = makeStyles((theme: Theme) =>
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

/**
 * Display results for a MetricAssignment
 */
export default function MetricAssignmentResults({
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
}): JSX.Element {
  const classes = useStyles()

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
