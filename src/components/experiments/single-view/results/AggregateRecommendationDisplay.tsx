import { createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'

import { AggregateRecommendation, AggregateRecommendationDecision } from 'src/lib/analyses'
import { ExperimentFull } from 'src/lib/schemas'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tooltipped: {
      borderBottomWidth: 1,
      borderBottomStyle: 'dashed',
      borderBottomColor: theme.palette.grey[500],
    },
    shouldStop: {
      color: theme.palette.error.main,
    },
  }),
)

/**
 * Displays an AggregateRecommendation.
 */
export default function AggregateRecommendationDisplay({
  aggregateRecommendation,
  experiment,
}: {
  aggregateRecommendation: AggregateRecommendation
  experiment: ExperimentFull
}): JSX.Element {
  const classes = useStyles()

  const maybeShouldStopAsterisk = aggregateRecommendation.shouldStop && (
    <>
      <br />
      <Tooltip title='This experiment has run for too long.'>
        <span className={clsx(classes.shouldStop, classes.tooltipped)}>Stop Experiment</span>
      </Tooltip>
    </>
  )

  switch (aggregateRecommendation.decision) {
    case AggregateRecommendationDecision.ManualAnalysisRequired:
      return (
        <Tooltip title='Contact @experimentation-review on #a8c-experiments'>
          <span className={classes.tooltipped}>Manual analysis required</span>
        </Tooltip>
      )
    case AggregateRecommendationDecision.MissingAnalysis:
      return (
        <Tooltip title='It takes 24-48 hours for data to be analyzed.'>
          <span className={classes.tooltipped}> Not analyzed yet </span>
        </Tooltip>
      )
    case AggregateRecommendationDecision.TooShort:
      return <>More data needed</>
    case AggregateRecommendationDecision.DeployAnyVariation:
      return <>Deploy either variation{maybeShouldStopAsterisk}</>
    case AggregateRecommendationDecision.DeployChosenVariation: {
      const chosenVariation = experiment.variations.find(
        (variation) => variation.variationId === aggregateRecommendation.chosenVariationId,
      )
      if (!chosenVariation) {
        throw new Error('No match for chosenVariationId among variations in experiment.')
      }

      return (
        <>
          Deploy {chosenVariation.name}
          {maybeShouldStopAsterisk}
        </>
      )
    }
    default:
      throw new Error(`Missing AggregateRecommendationDecision: ${aggregateRecommendation.decision}.`)
  }
}
