import React from 'react'

import { AggregateRecommendation, AggregateRecommendationType } from 'src/lib/analyses'
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
  switch (aggregateRecommendation.type) {
    case AggregateRecommendationType.ManualAnalysisRequired:
      return <>Manual analysis required</>
    case AggregateRecommendationType.NotAnalyzedYet:
      return <>Not analyzed yet</>
    case AggregateRecommendationType.Inconclusive:
      return <>Inconclusive</>
    case AggregateRecommendationType.DeployEither:
      return <>Deploy either variation</>
    case AggregateRecommendationType.Deploy: {
      const chosenVariation = experiment.variations.find(
        (variation) => variation.variationId === aggregateRecommendation.variationId,
      )
      // istanbul ignore next; Typeguard
      if (!chosenVariation) {
        throw new Error('No match for chosenVariationId among variations in experiment.')
      }

      return <>Deploy {chosenVariation.name}</>
    }
    // istanbul ignore next; Shouldn't occur
    default:
      throw new Error('Missing AggregateRecommendationType.')
  }
}
