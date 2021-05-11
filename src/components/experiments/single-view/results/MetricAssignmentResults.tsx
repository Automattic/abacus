import {
  createStyles,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import clsx from 'clsx'
import _, { identity } from 'lodash'
import { PlotData } from 'plotly.js'
import React from 'react'
import Plot from 'react-plotly.js'

import DatetimeText from 'src/components/general/DatetimeText'
import MetricValue from 'src/components/general/MetricValue'
import { AnalysisStrategyToHuman } from 'src/lib/analyses'
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
    tooltipped: {
      borderBottomWidth: 1,
      borderBottomStyle: 'dashed',
      borderBottomColor: theme.palette.grey[500],
    },
    dataTableContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridColumnGap: theme.spacing(2),
    },
    latestEstimates: {},
    metricAssignmentDetails: {},
    metricDescription: {
      opacity: 0.7,
    },
    analysisFinePrint: {
      fontSize: '.8rem',
      marginTop: '1rem',
      fontStyle: 'italic',
      opacity: 0.7,
    },
    credibleIntervalHeader: {
      width: '8rem',
    },
    dataTableHeader: {
      margin: theme.spacing(2, 2, 1, 0),
    },
  }),
)

function MissingAnalysisMessage() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography variant='h5' gutterBottom>
        {' '}
        No Analysis Data Found{' '}
      </Typography>
      <Typography variant='body1'> It can take 24-48 hours for analysis data to be generated. </Typography>
    </div>
  )
}

/**
 * Display results for a MetricAssignment
 */
export default function MetricAssignmentResults({
  strategy,
  metricAssignment,
  metric,
  analysesByStrategyDateAsc,
  experiment,
}: {
  strategy: AnalysisStrategy
  metricAssignment: MetricAssignment
  metric: MetricBare
  analysesByStrategyDateAsc: Record<AnalysisStrategy, Analysis[]>
  experiment: ExperimentFull
}): JSX.Element | null {
  const classes = useStyles()

  const isConversion = metric.parameterType === MetricParameterType.Conversion
  const estimateTransform: (estimate: number | null) => number | null = isConversion
    ? (estimate: number | null) => estimate && estimate * 100
    : identity
  const analyses = analysesByStrategyDateAsc[strategy]
  const latestAnalysis = _.last(analyses)
  const latestEstimates = latestAnalysis?.metricEstimates
  if (!latestAnalysis || !latestEstimates) {
    return <MissingAnalysisMessage />
  }

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
            <TableCell component='th' scope='row' variant='head' className={classes.headerCell}>
              Metric Description
            </TableCell>
            <TableCell className={classes.metricDescription}>{metric.description}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className={classes.dataTableContainer}>
        <div className={classes.latestEstimates}>
          <Typography variant='h5' className={classes.dataTableHeader}>
            Estimated 95% Credible Intervals (CIs){' '}
          </Typography>
          <Table>
            <TableBody>
              {latestAnalysis.recommendation && (
                <>
                  <TableRow>
                    <TableCell
                      component='th'
                      scope='row'
                      variant='head'
                      className={clsx(classes.rowHeader, classes.headerCell, classes.credibleIntervalHeader)}
                    >
                      Difference
                    </TableCell>
                    <TableCell className={classes.monospace}>
                      <Tooltip
                        title={
                          <>
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
                          </>
                        }
                      >
                        <span className={classes.tooltipped}>
                          <MetricValue
                            value={latestEstimates.diff.bottom}
                            metricParameterType={metric.parameterType}
                            isDifference={true}
                          />
                          &nbsp;to&nbsp;
                          <MetricValue
                            value={latestEstimates.diff.top}
                            metricParameterType={metric.parameterType}
                            isDifference={true}
                          />
                        </span>
                      </Tooltip>
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
                      className={clsx(classes.rowHeader, classes.headerCell, classes.credibleIntervalHeader)}
                    >
                      <span className={classes.monospace}>{variation.name}</span>
                    </TableCell>
                    <TableCell className={classes.monospace}>
                      <Tooltip
                        title={
                          <>
                            <strong>Interpretation:</strong>
                            <br />
                            There is a 95% probability that the metric value between variations is between{' '}
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
                          </>
                        }
                      >
                        <span className={classes.tooltipped}>
                          <MetricValue
                            value={latestEstimates[`variation_${variation.variationId}`].bottom}
                            metricParameterType={metric.parameterType}
                          />
                          &nbsp;to&nbsp;
                          <MetricValue
                            value={latestEstimates[`variation_${variation.variationId}`].top}
                            metricParameterType={metric.parameterType}
                          />
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className={classes.metricAssignmentDetails}>
          <Typography variant='h5' className={classes.dataTableHeader}>
            Metric Assignment Settings
          </Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell component='th' scope='row' variant='head' className={classes.headerCell}>
                  Attribution Window
                </TableCell>
                <TableCell className={classes.monospace}>
                  {AttributionWindowSecondsToHuman[metricAssignment.attributionWindowSeconds]}
                </TableCell>
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
        </div>
      </div>
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
      <Typography className={classes.analysisFinePrint}>
        <strong>Last analyzed:</strong> <DatetimeText datetime={latestAnalysis.analysisDatetime} excludeTime={true} />.{' '}
        <strong>Analysis strategy:</strong> {AnalysisStrategyToHuman[latestAnalysis.analysisStrategy]}.{' '}
        <strong>Participants:</strong> {latestAnalysis.participantStats.total} (
        {_.join(
          Variations.sort(experiment.variations).map(
            ({ variationId, name }) => `${latestAnalysis.participantStats[`variation_${variationId}`]} in ${name}`,
          ),
          '; ',
        )}
        ).
      </Typography>
    </TableContainer>
  )
}
