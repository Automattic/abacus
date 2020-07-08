import React from 'react'

import { ExperimentFull, Recommendation, Variation } from '@/models'

/**
 * Convert a recommendation's endExperiment and chosenVariationId fields to a human-friendly description.
 */
export default function RecommendationString({
  recommendation,
  experiment,
}: {
  recommendation: Recommendation
  experiment: ExperimentFull
}) {
  if (recommendation.endExperiment) {
    if (recommendation.chosenVariationId) {
      const chosenVariation = experiment.variations.find(
        (variation) => variation.variationId === recommendation.chosenVariationId,
      ) as Variation
      return (
        <>
          End experiment; deploy <code>{chosenVariation.name}</code>
        </>
      )
    }
    return <>End experiment; deploy either variation</>
  }
  return <>Keep running</>
}
