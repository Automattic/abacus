import _ from 'lodash'

import { Analysis, AnalysisStrategy, RecommendationWarning } from './schemas'

/**
 * Mapping from AnalysisStrategy to human-friendly descriptions.
 */
export const AnalysisStrategyToHuman = {
  [AnalysisStrategy.IttPure]: 'All participants',
  [AnalysisStrategy.MittNoCrossovers]: 'Without crossovers',
  [AnalysisStrategy.MittNoSpammers]: 'Without spammers',
  [AnalysisStrategy.MittNoSpammersNoCrossovers]: 'Without crossovers and spammers',
  [AnalysisStrategy.PpNaive]: 'Exposed without crossovers and spammers',
}

/**
 * Mapping from RecommendationWarning to human-friendly descriptions.
 */
export const RecommendationWarningToHuman = {
  [RecommendationWarning.ShortPeriod]: 'Experiment period is too short. Wait a few days to be safer.',
  [RecommendationWarning.LongPeriod]: 'Experiment period is too long. Consider stopping it.',
  [RecommendationWarning.WideCi]: 'The CI is too wide in comparison to the ROPE. Collect more data to be safer.',
}

export enum AggregateRecommendationType {
  ManualAnalysisRequired = 'ManualAnalysisRequired',
  NotAnalyzedYet = 'NotAnalyzedYet',
  Inconclusive = 'Inconclusive',
  DeployEither = 'DeployEither',
  Deploy = 'Deploy',
}

export interface AggregateRecommendation {
  type: AggregateRecommendationType
  variationId?: number
}

/**
 * Returns the aggregate recommendation over analyses of different analysis strategies.
 * @param analyses Analyses of different strategies for the same day.
 */
export function getAggregateRecommendation(analyses: Analysis[]): AggregateRecommendation {
  const recommendationChosenVariationIds = analyses
    .map((analysis) => analysis.recommendation?.chosenVariationId)
    .filter(Number)
  const recommendationConflict = _.uniq(recommendationChosenVariationIds).length > 1
  if (recommendationConflict) {
    return {
      type: AggregateRecommendationType.ManualAnalysisRequired,
    }
  }

  let recommendation = analyses.find((analysis) => analysis.recommendation?.chosenVariationId)?.recommendation
  if (!recommendation) {
    recommendation = analyses.find((analysis) => analysis.recommendation)?.recommendation
  }
  if (!recommendation) {
    return {
      type: AggregateRecommendationType.NotAnalyzedYet,
    }
  }

  if (!recommendation.endExperiment) {
    return {
      type: AggregateRecommendationType.Inconclusive,
    }
  }

  if (!recommendation.chosenVariationId) {
    return {
      type: AggregateRecommendationType.DeployEither,
    }
  }

  return {
    type: AggregateRecommendationType.Deploy,
    variationId: recommendation.chosenVariationId,
  }
}
