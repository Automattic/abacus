import { createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core'
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
  switch (aggregateRecommendation.decision) {
    case AggregateRecommendationDecision.ManualAnalysisRequired:
      return (
        <Tooltip title='Contact @experimentation-review on #a8c-experiments'>
          <span className={classes.tooltipped}>Manual analysis required</span>
        </Tooltip>
      )
    case AggregateRecommendationDecision.MissingAnalysis:
      return <>Not analyzed yet</>
    case AggregateRecommendationDecision.Inconclusive:
      return <>Inconclusive</>
    case AggregateRecommendationDecision.DeployAnyVariation:
      return <>Deploy either variation</>
    case AggregateRecommendationDecision.DeployChosenVariation: {
      const chosenVariation = experiment.variations.find(
        (variation) => variation.variationId === aggregateRecommendation.chosenVariationId,
      )
      if (!chosenVariation) {
        throw new Error('No match for chosenVariationId among variations in experiment.')
      }

      return <>Deploy {chosenVariation.name}</>
    }
    default:
      throw new Error('Missing AggregateRecommendationDecision.')
  }
}
