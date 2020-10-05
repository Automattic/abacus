import React from 'react'

import { ExperimentFull, Recommendation } from '@/lib/schemas'

/**
 * Convert a recommendation's endExperiment and chosenVariationId fields to a human-friendly description.
 */
export default function RecommendationString({
  recommendation,
  experiment,
}: {
  recommendation: Recommendation
  experiment: ExperimentFull
}): JSX.Element {
  if (!recommendation.endExperiment) {
    return <>Inconclusive</>
  }

  if (!recommendation.chosenVariationId) {
    return <>Deploy either variation</>
  }

  const chosenVariation = experiment.variations.find(
    (variation) => variation.variationId === recommendation.chosenVariationId,
  )
  /* istanbul ignore next; Typeguard */
  if (!chosenVariation) {
    throw new Error('No match for chosenVariationId among variations in experiment.')
  }

  return <>Deploy {chosenVariation.name}</>
}
