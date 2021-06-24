import {
  createStyles,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core'
import { ChevronRight, ExpandMore } from '@material-ui/icons'
import clsx from 'clsx'
import _, { identity } from 'lodash'
import { PlotData } from 'plotly.js'
import React, { useState } from 'react'
import Plot from 'react-plotly.js'

import DatetimeText from 'src/components/general/DatetimeText'
import MetricValue from 'src/components/general/MetricValue'
import { AggregateRecommendation } from 'src/lib/analyses'
import * as Analyses from 'src/lib/analyses'
import {
  Analysis,
  AnalysisStrategy,
  ExperimentFull,
  MetricAssignment,
  MetricBare,
  MetricParameterType,
} from 'src/lib/schemas'
import * as Visualizations from 'src/lib/visualizations'

import MetricValueInterval from '../../../general/MetricValueInterval'
import AggregateRecommendationDisplay from './AggregateRecommendationDisplay'

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
    metricDescription: {
      opacity: 0.7,
    },
    analysisFinePrint: {
      fontSize: '.7rem',
      fontStyle: 'italic',
      opacity: 0.7,
      margin: theme.spacing(1, 0, 2, 2),
    },
    credibleIntervalHeader: {
      width: '8rem',
    },
    aggregateRecommendation: {
      fontFamily: theme.custom.fonts.monospace,
      marginBottom: theme.spacing(2),
    },
    dataTableHeader: {
      margin: theme.spacing(2, 2, 1, 2),
      display: 'block',
      fontSize: '0.8rem',
      color: theme.palette.grey[600],
      '&:first-of-type': {
        marginTop: 0,
      },
    },
    coolTable: {
      '& tbody td, & tbody th': {
        borderBottom: 0,
      },
      '& th:first-of-type': {
        borderRightWidth: 1,
        borderRightStyle: 'solid',
        borderRightColor: theme.palette.grey[300],
      },
    },
    clickable: {
      cursor: 'pointer',
      userSelect: 'none',
    },
    expandCollapseIcon: {
      verticalAlign: 'middle',
      height: '1.3rem',
      width: '1.3rem',
      marginTop: '-2px',
      marginLeft: '-1.3rem',
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
  aggregateRecommendation,
}: {
  strategy: AnalysisStrategy
  metricAssignment: MetricAssignment
  metric: MetricBare
  analysesByStrategyDateAsc: Record<AnalysisStrategy, Analysis[]>
  experiment: ExperimentFull
  aggregateRecommendation: AggregateRecommendation
}): JSX.Element | null {
  const classes = useStyles()

  const [isShowObservedData, setIsShowObservedData] = useState<boolean>(false)
  const toggleIsShowObservedData = () => {
    setIsShowObservedData((isShowObservedData) => !isShowObservedData)
  }

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
    <div className={clsx(classes.root, 'analysis-detail-panel')}>
      <Typography className={classes.dataTableHeader}>Summary</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant='h5' gutterBottom className={classes.aggregateRecommendation}>
                  <AggregateRecommendationDisplay {...{ experiment, aggregateRecommendation }} />
                </Typography>
                <strong>Last analyzed:</strong>{' '}
                <DatetimeText datetime={latestAnalysis.analysisDatetime} excludeTime={true} />.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Metric description:</strong> {metric.description}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography className={classes.dataTableHeader}>Analysis</Typography>
      <TableContainer component={Paper}>
        <Table className={classes.coolTable}>
          <TableHead>
            <TableRow>
              <TableCell>Variant</TableCell>
              <TableCell align='right'>
                {metric.parameterType === MetricParameterType.Revenue
                  ? 'Average revenue per user (ARPU) interval'
                  : 'Conversion rate interval'}
              </TableCell>
              <TableCell align='right'>Absolute change</TableCell>
              <TableCell align='right'>Relative change (lift)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
                  <TableCell className={classes.monospace} align='right'>
                    <MetricValueInterval
                      intervalName={'the metric value'}
                      metricParameterType={metric.parameterType}
                      bottomValue={latestEstimates[`variation_${variation.variationId}`].bottom}
                      topValue={latestEstimates[`variation_${variation.variationId}`].top}
                      displayPositiveSign={false}
                    />
                  </TableCell>
                  <TableCell className={classes.monospace} align='right'>
                    {variation.isDefault ? (
                      'Baseline'
                    ) : (
                      <MetricValueInterval
                        intervalName={'the absolute change between variations'}
                        metricParameterType={metric.parameterType}
                        isDifference={true}
                        bottomValue={latestEstimates.diff.bottom}
                        topValue={latestEstimates.diff.top}
                      />
                    )}
                  </TableCell>
                  <TableCell className={classes.monospace} align='right'>
                    {variation.isDefault ? (
                      'Baseline'
                    ) : (
                      <MetricValueInterval
                        intervalName={'the relative change between variations'}
                        metricParameterType={MetricParameterType.Conversion}
                        bottomValue={Analyses.ratioToDifferenceRatio(latestEstimates.ratio.bottom)}
                        topValue={Analyses.ratioToDifferenceRatio(latestEstimates.ratio.top)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography className={classes.analysisFinePrint}>
        95% Credible Intervals (CIs). <strong> Experimenter-set minimum practical difference: </strong>{' '}
        <MetricValue
          value={metricAssignment.minDifference}
          metricParameterType={metric.parameterType}
          isDifference={true}
        />
        .
      </Typography>
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
      <Typography
        className={clsx(classes.dataTableHeader, classes.clickable)}
        onClick={toggleIsShowObservedData}
        role='button'
      >
        {isShowObservedData ? (
          <ExpandMore className={classes.expandCollapseIcon} />
        ) : (
          <ChevronRight className={classes.expandCollapseIcon} />
        )}
        Observed data
      </Typography>
      {isShowObservedData && (
        <TableContainer component={Paper}>
          <Table className={classes.coolTable}>
            <TableHead>
              <TableRow>
                <TableCell>Variant</TableCell>
                <TableCell align='right'>Users</TableCell>
                <TableCell align='right'>
                  {metric.parameterType === MetricParameterType.Revenue ? 'Revenue' : 'Conversions'}
                </TableCell>
                <TableCell align='right'>
                  {metric.parameterType === MetricParameterType.Revenue
                    ? 'Average revenue per user (ARPU)'
                    : 'Conversion rate'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
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
                    <TableCell className={classes.monospace} align='right'>
                      {latestAnalysis.participantStats[`variation_${variation.variationId}`].toLocaleString()}
                    </TableCell>
                    <TableCell className={classes.monospace} align='right'>
                      <MetricValue
                        value={
                          latestAnalysis.participantStats[`variation_${variation.variationId}`] *
                          latestEstimates[`variation_${variation.variationId}`].estimate
                        }
                        metricParameterType={metric.parameterType}
                      />
                    </TableCell>
                    <TableCell className={classes.monospace} align='right'>
                      <MetricValue
                        value={latestEstimates[`variation_${variation.variationId}`].estimate}
                        metricParameterType={metric.parameterType}
                      />
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  )
}
