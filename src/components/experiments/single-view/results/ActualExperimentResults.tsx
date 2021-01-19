import {
  Chip,
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Theme,
  useTheme,
} from '@material-ui/core'
import _ from 'lodash'
import MaterialTable from 'material-table'
import { PlotData } from 'plotly.js'
import React, { useState } from 'react'
import Plot from 'react-plotly.js'

import { AnalysisStrategyToHuman } from 'src/lib/analyses'
import * as Experiments from 'src/lib/experiments'
import { AttributionWindowSecondsToHuman } from 'src/lib/metric-assignments'
import {
  Analysis,
  AnalysisStrategy,
  ExperimentFull,
  MetricAssignment,
  MetricBare,
  Recommendation,
} from 'src/lib/schemas'
import * as Visualizations from 'src/lib/visualizations'
import { isDebugMode } from 'src/utils/general'
import { createStaticTableOptions } from 'src/utils/material-table'

import { MetricAssignmentAnalysesData } from './ExperimentResults'
import MetricAssignmentResults from './MetricAssignmentResults'
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
    advancedControls: {
      margin: theme.spacing(2, 0),
      padding: theme.spacing(2),
      display: 'inline-flex',
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
        strategy,
        metricAssignment,
        metric,
        analysesByStrategyDateAsc,
        latestDefaultAnalysis: _.last(analysesByStrategyDateAsc[strategy]),
        recommendationConflict,
      }
    },
  )

  // ### Result Summary Visualizations

  const primaryMetricAssignmentAnalysesData = allMetricAssignmentAnalysesData.find(
    ({ metricAssignment: { isPrimary } }) => isPrimary,
  ) as MetricAssignmentAnalysesData
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
      strategy,
      analysesByStrategyDateAsc,
      latestDefaultAnalysis,
      metricAssignment,
      metric,
      recommendationConflict,
    }: {
      strategy: AnalysisStrategy
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
            <MetricAssignmentResults
              {...{ strategy, analysesByStrategyDateAsc, metricAssignment, metric, experiment }}
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
                    {AnalysisStrategyToHuman[strat]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        )
      }
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
