import { createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core'
import React from 'react'

import { Decision, Recommendation } from 'src/lib/recommendations'
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
 * Displays a Recommendation.
 */
export default function RecommendationDisplay({
  recommendation,
  experiment,
}: {
  recommendation: Recommendation
  experiment: ExperimentFull
}): JSX.Element {
  const classes = useStyles()
  switch (recommendation.decision) {
    case Decision.ManualAnalysisRequired:
      return (
        <Tooltip title='Contact @experimentation-review on #a8c-experiments'>
          <span className={classes.tooltipped}>Manual analysis required</span>
        </Tooltip>
      )
    case Decision.MissingAnalysis:
      return <>Not analyzed yet</>
    case Decision.Inconclusive:
      return <>Inconclusive</>
    case Decision.DeployAnyVariation:
      return <>Deploy either variation</>
    case Decision.DeployChosenVariation: {
      const chosenVariation = experiment.variations.find(
        (variation) => variation.variationId === recommendation.chosenVariationId,
      )
      if (!chosenVariation) {
        throw new Error('No match for chosenVariationId among variations in experiment.')
      }

      return <>Deploy {chosenVariation.name}</>
    }
    default:
      throw new Error('Missing Decision.')
  }
}
