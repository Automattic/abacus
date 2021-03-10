import React from 'react'

import { AggregateRecommendation, AggregateRecommendationDecision } from 'src/lib/analyses'
import { ExperimentFull } from 'src/lib/schemas'

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
  switch (aggregateRecommendation.decision) {
    case AggregateRecommendationDecision.ManualAnalysisRequired:
      return <>Manual analysis required</>
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
