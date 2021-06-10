/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Theme,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'
import clsx from 'clsx'
import _ from 'lodash'
import MaterialTable from 'material-table'
import { PlotData } from 'plotly.js'
import React, { useState } from 'react'
import Plot from 'react-plotly.js'

import MetricValue, { metricValueFormatData } from 'src/components/general/MetricValue'
import * as Analyses from 'src/lib/analyses'
import * as Experiments from 'src/lib/experiments'
import { AttributionWindowSecondsToHuman } from 'src/lib/metric-assignments'
import { Analysis, AnalysisStrategy, ExperimentFull, MetricAssignment, MetricBare } from 'src/lib/schemas'
import * as Visualizations from 'src/lib/visualizations'
import { isDebugMode } from 'src/utils/general'
import { createStaticTableOptions } from 'src/utils/material-table'
import { formatIsoDate } from 'src/utils/time'

import AggregateRecommendationDisplay from './AggregateRecommendationDisplay'
import { MetricAssignmentAnalysesData } from './ExperimentResults'
import HealthIndicatorTable from './HealthIndicatorTable'
import MetricAssignmentResults from './MetricAssignmentResults'

const formatTopLevelRelativeChange = (n: number): string => {
  return `${0 <= n ? '+' : ''}${n.toFixed(2)}`
}

const indicationSeverityClassSymbol = (severity: Analyses.HealthIndicationSeverity) => `indicationSeverity${severity}`

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
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(2),
    },
    advancedControls: {
      margin: theme.spacing(2, 0),
      padding: theme.spacing(2),
      display: 'inline-flex',
    },
    summaryColumn: {
      display: 'flex',
      flexDirection: 'column',
    },
    summaryStatsPaper: {
      padding: theme.spacing(4),
      marginLeft: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    summaryStatsPart: {
      marginBottom: theme.spacing(2),
      '&:last-child': {
        marginBottom: 0,
      },
    },
    summaryStatsPartStrategy: {
      marginTop: theme.spacing(6),
    },
    summaryStatsStat: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    summaryHealthPaper: {
      padding: theme.spacing(4),
      marginLeft: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      flex: 1,
      textDecoration: 'none',
    },
    [indicationSeverityClassSymbol(Analyses.HealthIndicationSeverity.Ok)]: {},
    [indicationSeverityClassSymbol(Analyses.HealthIndicationSeverity.Warning)]: {
      borderTopWidth: 12,
      borderTopStyle: 'solid',
      borderTopColor: '#ffa500',
    },
    [indicationSeverityClassSymbol(Analyses.HealthIndicationSeverity.Error)]: {
      borderTopWidth: 8,
      borderTopStyle: 'solid',
      borderTopColor: theme.palette.error.main,
    },
    participantsPlotPaper: {
      padding: theme.spacing(4, 4, 2),
      flex: 1,
    },
    participantsPlot: {
      width: '100%',
      height: 300,
    },
    tableTitle: {
      margin: theme.spacing(4, 2, 2),
    },
    accordion: {
      margin: theme.spacing(2, 0),
    },
    accordionDetails: {
      flexDirection: 'column',
    },
    noAnalysesPaper: {
      padding: theme.spacing(2),
    },
    pre: {
      background: '#f5f5f5',
      padding: theme.spacing(3),
      overflow: 'scroll',
    },
    topLevelDiff: {
      fontFamily: theme.custom.fonts.monospace,
      color: theme.palette.grey[600],
      whiteSpace: 'pre',
    },
  }),
)

/**
 * Render the latest analyses for the experiment for each metric assignment as a single condensed table, using only
 * the experiment's default analysis strategy.
 *
 * Should be merged with ExperimentResults
 */
export default function ActualExperimentResults({
  experiment,
  allMetricAssignmentAnalysesData,
}: {
  experiment: ExperimentFull
  allMetricAssignmentAnalysesData: MetricAssignmentAnalysesData[]
}): JSX.Element {
  const classes = useStyles()
  const theme = useTheme()

  const [strategy, setStrategy] = useState<AnalysisStrategy>(() => Experiments.getDefaultAnalysisStrategy(experiment))
  // istanbul ignore next; Debug only
  const onStrategyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (!Object.values(AnalysisStrategy).includes(event.target.value as AnalysisStrategy)) {
      throw new Error('Invalid strategy')
    }

    setStrategy(event.target.value as AnalysisStrategy)
  }

  const metricAssignmentSummaryData = allMetricAssignmentAnalysesData.map(
    ({ metricAssignment, metric, analysesByStrategyDateAsc }) => ({
      experiment,
      strategy,
      metricAssignment,
      metric,
      analysesByStrategyDateAsc,
      aggregateRecommendation: Analyses.getAggregateRecommendation(
        Object.values(analysesByStrategyDateAsc)
          .map(_.last.bind(null))
          .filter((x) => x !== undefined) as Analysis[],
        strategy,
      ),
    }),
  )

  // ### Result Summary Visualizations

  const primaryMetricAssignmentAnalysesData = allMetricAssignmentAnalysesData.find(
    ({ metricAssignment: { isPrimary } }) => isPrimary,
  ) as MetricAssignmentAnalysesData
  const analyses = primaryMetricAssignmentAnalysesData.analysesByStrategyDateAsc[strategy] || []
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

  // ### Top Level Stats

  const primaryMetricLatestAnalysesByStrategy = _.mapValues(
    primaryMetricAssignmentAnalysesData.analysesByStrategyDateAsc,
    _.last.bind(null),
  )
  const latestPrimaryMetricAnalysis = primaryMetricLatestAnalysesByStrategy[strategy]
  // istanbul ignore next; trivial
  const totalParticipants = latestPrimaryMetricAnalysis?.participantStats['total'] ?? 0
  const primaryMetricAggregateRecommendation = Analyses.getAggregateRecommendation(
    Object.values(primaryMetricLatestAnalysesByStrategy).filter((x) => x) as Analysis[],
    strategy,
  )
  const hasAnalyses =
    primaryMetricAggregateRecommendation.decision !== Analyses.AggregateRecommendationDecision.MissingAnalysis

  const experimentParticipantStats = Analyses.getExperimentParticipantStats(
    experiment,
    primaryMetricLatestAnalysesByStrategy,
  )
  const experimentHealthIndicators = [
    ...Analyses.getExperimentParticipantHealthIndicators(experimentParticipantStats),
    ...Analyses.getExperimentAnalysesHealthIndicators(experiment, primaryMetricLatestAnalysesByStrategy, strategy),
    ...Analyses.getExperimentHealthIndicators(experiment),
  ]

  const maxIndicationSeverity = experimentHealthIndicators
    .map(({ indication: { severity } }) => severity)
    .sort(
      (severityA, severityB) =>
        Analyses.healthIndicationSeverityOrder.indexOf(severityB) -
        Analyses.healthIndicationSeverityOrder.indexOf(severityA),
    )[0]

  const maxIndicationSeverityMessage = {
    [Analyses.HealthIndicationSeverity.Ok]: 'No issues detected',
    [Analyses.HealthIndicationSeverity.Warning]: 'Potential issues',
    [Analyses.HealthIndicationSeverity.Error]: 'Serious issues',
  }

  // ### Metric Assignments Table

  const tableColumns = [
    {
      title: 'Metric',
      render: ({ metric, metricAssignment }: { metric: MetricBare; metricAssignment: MetricAssignment }) => (
        <>
          <Tooltip title={metric.description}>
            <span>{metric.name}</span>
          </Tooltip>{' '}
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
      title: 'Absolute change',
      render: ({
        metric,
        strategy,
        analysesByStrategyDateAsc,
        aggregateRecommendation,
      }: {
        metric: MetricBare
        strategy: AnalysisStrategy
        analysesByStrategyDateAsc: Record<AnalysisStrategy, Analysis[]>
        aggregateRecommendation: Analyses.AggregateRecommendation
      }) => {
        const latestEstimates = _.last(analysesByStrategyDateAsc[strategy])?.metricEstimates
        if (
          !latestEstimates ||
          aggregateRecommendation.decision === Analyses.AggregateRecommendationDecision.ManualAnalysisRequired ||
          aggregateRecommendation.decision === Analyses.AggregateRecommendationDecision.MissingAnalysis
        ) {
          return null
        }

        return (
          <Tooltip
            title={
              <>
                <strong>Interpretation:</strong>
                <br />
                There is a 95% probability that the absolute change is between{' '}
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
            <span className={classes.topLevelDiff}>
              <MetricValue
                value={latestEstimates.diff.bottom}
                metricParameterType={metric.parameterType}
                isDifference={true}
                displayUnit={false}
                displayPositiveSign={true}
              />
              &nbsp;to&nbsp;
              <MetricValue
                value={latestEstimates.diff.top}
                metricParameterType={metric.parameterType}
                isDifference={true}
                displayUnit={false}
                displayPositiveSign={true}
              />
              &nbsp;{metricValueFormatData[`${metric.parameterType}_difference`].unit}
            </span>
          </Tooltip>
        )
      },
      cellStyle: {
        fontFamily: theme.custom.fonts.monospace,
      },
    },
    {
      title: 'Relative change (lift)',
      render: ({
        strategy,
        analysesByStrategyDateAsc,
        aggregateRecommendation,
      }: {
        metric: MetricBare
        strategy: AnalysisStrategy
        analysesByStrategyDateAsc: Record<AnalysisStrategy, Analysis[]>
        aggregateRecommendation: Analyses.AggregateRecommendation
      }) => {
        const latestEstimates = _.last(analysesByStrategyDateAsc[strategy])?.metricEstimates
        if (
          !latestEstimates ||
          !latestEstimates.ratio?.top ||
          aggregateRecommendation.decision === Analyses.AggregateRecommendationDecision.ManualAnalysisRequired ||
          aggregateRecommendation.decision === Analyses.AggregateRecommendationDecision.MissingAnalysis
        ) {
          return null
        }

        return (
          <Tooltip
            title={
              <>
                <strong>Interpretation:</strong>
                <br />
                There is a 95% probability that the relative change is between{' '}
                {Analyses.ratioToPercentDifference(latestEstimates.ratio.bottom).toFixed(2)}% and{' '}
                {Analyses.ratioToPercentDifference(latestEstimates.ratio.top).toFixed(2)}%
              </>
            }
          >
            <span className={classes.topLevelDiff}>
              {formatTopLevelRelativeChange(Analyses.ratioToPercentDifference(latestEstimates.ratio.bottom))}
              &nbsp;to&nbsp;
              {formatTopLevelRelativeChange(Analyses.ratioToPercentDifference(latestEstimates.ratio.top))}&nbsp;%
            </span>
          </Tooltip>
        )
      },
    },
    {
      title: 'Recommendation',
      render: ({
        experiment,
        aggregateRecommendation,
      }: {
        experiment: ExperimentFull
        aggregateRecommendation: Analyses.AggregateRecommendation
      }) => {
        return <AggregateRecommendationDisplay {...{ experiment, aggregateRecommendation }} />
      },
      cellStyle: {
        fontFamily: theme.custom.fonts.monospace,
      },
    },
  ]

  const DetailPanel = [
    ({
      strategy,
      analysesByStrategyDateAsc,
      metricAssignment,
      metric,
      aggregateRecommendation,
    }: {
      strategy: AnalysisStrategy
      analysesByStrategyDateAsc: Record<AnalysisStrategy, Analysis[]>
      metricAssignment: MetricAssignment
      metric: MetricBare
      aggregateRecommendation: Analyses.AggregateRecommendation
    }) => {
      let disabled =
        aggregateRecommendation.decision === Analyses.AggregateRecommendationDecision.ManualAnalysisRequired
      // istanbul ignore next; debug only
      disabled = disabled && !isDebugMode()
      return {
        render: () => (
          <MetricAssignmentResults
            {...{ strategy, analysesByStrategyDateAsc, metricAssignment, metric, experiment, aggregateRecommendation }}
          />
        ),
        disabled,
      }
    },
  ]

  return (
    <div className={classes.root}>
      {
        // istanbul ignore next; Debug only
        isDebugMode() && (
          <Paper className={classes.advancedControls}>
            <FormControl>
              <InputLabel htmlFor='strategy-selector'>Strategy:</InputLabel>
              <Select id='strategy-selector' value={strategy} onChange={onStrategyChange}>
                {Object.values(AnalysisStrategy).map((strat) => (
                  <MenuItem key={strat} value={strat}>
                    {Analyses.AnalysisStrategyToHuman[strat]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        )
      }
      {hasAnalyses ? (
        <>
          <div className={classes.summary}>
            <Paper className={classes.participantsPlotPaper}>
              <Typography variant='h3' gutterBottom>
                Participants by Variation
              </Typography>
              <Plot
                layout={{
                  ...Visualizations.plotlyLayoutDefault,
                  margin: {
                    l: theme.spacing(4),
                    r: theme.spacing(2),
                    t: 0,
                    b: theme.spacing(6),
                  },
                }}
                data={plotlyDataParticipantGraph}
                className={classes.participantsPlot}
              />
            </Paper>
            <div className={classes.summaryColumn}>
              <Paper className={classes.summaryStatsPaper}>
                {latestPrimaryMetricAnalysis && (
                  <>
                    <div className={classes.summaryStatsPart}>
                      <Typography variant='h3' className={classes.summaryStatsStat} color='primary'>
                        {totalParticipants.toLocaleString('en', { useGrouping: true })}
                      </Typography>
                      <Typography variant='subtitle1'>
                        <strong>analyzed participants</strong> as at{' '}
                        {formatIsoDate(latestPrimaryMetricAnalysis.analysisDatetime)}
                      </Typography>
                    </div>
                    <div className={classes.summaryStatsPart}>
                      <Typography variant='h3' className={classes.summaryStatsStat} color='primary'>
                        <AggregateRecommendationDisplay
                          {...{ experiment, aggregateRecommendation: primaryMetricAggregateRecommendation }}
                        />
                      </Typography>
                      <Typography variant='subtitle1'>
                        <strong>primary metric</strong> recommendation
                      </Typography>
                    </div>
                  </>
                )}
              </Paper>
              <Paper
                className={clsx(
                  classes.summaryHealthPaper,
                  classes[indicationSeverityClassSymbol(maxIndicationSeverity)],
                )}
                component='a'
                // @ts-ignore: Component extensions aren't appearing in types.
                href='#health-report'
              >
                <div className={classes.summaryStats}>
                  <Typography variant='h3' className={clsx(classes.summaryStatsStat)} color='primary'>
                    {maxIndicationSeverityMessage[maxIndicationSeverity]}
                  </Typography>
                  <Typography variant='subtitle1'>
                    see <strong>health report</strong>
                  </Typography>
                </div>
              </Paper>
            </div>
          </div>
          <Typography variant='h3' className={classes.tableTitle}>
            Metric Assignment Results
          </Typography>
          <MaterialTable
            columns={tableColumns}
            data={metricAssignmentSummaryData}
            options={createStaticTableOptions(metricAssignmentSummaryData.length)}
            onRowClick={(_event, rowData, togglePanel) => {
              const { aggregateRecommendation } = rowData as {
                aggregateRecommendation: Analyses.AggregateRecommendation
              }
              let disabled =
                aggregateRecommendation.decision === Analyses.AggregateRecommendationDecision.ManualAnalysisRequired
              // istanbul ignore next; debug only
              disabled = disabled && !isDebugMode()

              // istanbul ignore else; trivial
              if (togglePanel && !disabled) {
                togglePanel()
              }
            }}
            detailPanel={DetailPanel}
          />
          <Typography variant='h3' className={classes.tableTitle}>
            Health Report
          </Typography>
          <Paper id='health-report'>
            <HealthIndicatorTable indicators={experimentHealthIndicators} />
          </Paper>
        </>
      ) : (
        <Paper className={classes.noAnalysesPaper}>
          <Typography variant='h3' gutterBottom>
            {' '}
            No Results{' '}
          </Typography>
          <Typography variant='body1'>No results are available at the moment, this can be due to:</Typography>
          <ul>
            <Typography component='li'>
              <strong> An experiment being new. </strong> ExPlat can take 24-48 hours for results to process and become
              available. Updates are usually released at 06:00 UTC daily.
            </Typography>
            <Typography component='li'>
              <strong> No assignments occuring. </strong> Check the &quot;Early Monitoring&quot; section below to ensure
              that assignments are occuring.
            </Typography>
          </ul>
        </Paper>
      )}

      <Accordion className={classes.accordion}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h5'>Early Monitoring - Live Assignment Event Flow</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Typography variant='body1'>
            For early monitoring, you can run this query in Hue to retrieve unfiltered assignment counts from the
            unprocessed tracks queue.
          </Typography>

          <Typography variant='body1'>
            This query should only be used to monitor event flow. The best way to use it is to run it multiple times and
            ensure that counts go up and are roughly distributed as expected. Counts may also go down as events are
            moved to prod_events every day.
          </Typography>
          <pre className={classes.pre}>
            <code>
              {/* (Using a javasript string automatically replaces special characters with html entities.) */}
              {`with tracks_counts as (
  select
    cast(a8c.get_json_object(eventprops, '$.experiment_variation_id') as bigint) as experiment_variation_id,
    count(distinct userid) as unique_users
  from tracks.etl_events
  where
    eventname = 'wpcom_experiment_variation_assigned' and
    eventprops like '%"experiment_id":"${experiment.experimentId}"%'
  group by experiment_variation_id
)

select
  experiment_variations.name as variation_name,
  unique_users
from tracks_counts
inner join wpcom.experiment_variations using (experiment_variation_id)`}
            </code>
          </pre>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
