import { AnalysisStrategy, RecommendationWarning } from './schemas'

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
