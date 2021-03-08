import React from 'react'
import { AggregateRecommendation as IAggregateRecommendation, AggregateRecommendationType } from 'src/lib/analyses'

import { ExperimentFull } from 'src/lib/schemas'

/**
 * Displays an AggregateRecommendation.
 */
export default function AggregateRecommendationDisplay({
  aggregateRecommendation,
  experiment,
}: {
  aggregateRecommendation: IAggregateRecommendation
  experiment: ExperimentFull
}): JSX.Element {
  switch (aggregateRecommendation.type) {
    case AggregateRecommendationType.ManualAnalysisRequired:
      return <>Manual Analysis Required</>;
    case AggregateRecommendationType.NotAnalyzedYet:
      return <>Not Analyzed Yet</>
    case AggregateRecommendationType.Inconclusive:
      return <>Inconclusive</>
    case AggregateRecommendationType.DeployEither:
      return <>Deploy Either Variation</>
    case AggregateRecommendationType.Deploy:
      const chosenVariation = experiment.variations.find(
        (variation) => variation.variationId === aggregateRecommendation.variationId,
      )
      // istanbul ignore next; Typeguard
      if (!chosenVariation) {
        throw new Error('No match for chosenVariationId among variations in experiment.')
      }

      return <>Deploy {chosenVariation.name}</>
    default: 
      // istanbul ignore next; Shouldn't occur
      throw new Error('Missing AggregateRecommendationType.')
  }
}
