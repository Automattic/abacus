import _ from 'lodash'

import { binomialProbValue } from 'src/utils/math'

import { Analysis, AnalysisStrategy, ExperimentFull, RecommendationWarning } from './schemas'

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

export enum AggregateRecommendationDecision {
  ManualAnalysisRequired = 'ManualAnalysisRequired',
  MissingAnalysis = 'MissingAnalysis',
  Inconclusive = 'Inconclusive',
  DeployAnyVariation = 'DeployAnyVariation',
  DeployChosenVariation = 'DeployChosenVariation',
}

export interface AggregateRecommendation {
  decision: AggregateRecommendationDecision
  chosenVariationId?: number
}

/**
 * Returns the aggregate recommendation over analyses of different analysis strategies.
 *
 * @param analyses Analyses of different strategies for the same day.
 * @param defaultStrategy Default strategy in the context of an aggregateRecommendation..
 */
export function getAggregateRecommendation(
  analyses: Analysis[],
  defaultStrategy: AnalysisStrategy,
): AggregateRecommendation {
  const recommendationChosenVariationIds = analyses
    .map((analysis) => analysis.recommendation)
    .filter((x) => x)
    .map((recommendation) => recommendation?.chosenVariationId)
  const recommendationConflict = [...new Set(recommendationChosenVariationIds)].length > 1
  if (recommendationConflict) {
    return {
      decision: AggregateRecommendationDecision.ManualAnalysisRequired,
    }
  }

  const recommendation = analyses.find((analysis) => analysis.analysisStrategy === defaultStrategy)?.recommendation
  if (!recommendation) {
    return {
      decision: AggregateRecommendationDecision.MissingAnalysis,
    }
  }

  if (!recommendation.endExperiment) {
    return {
      decision: AggregateRecommendationDecision.Inconclusive,
    }
  }

  if (!recommendation.chosenVariationId) {
    return {
      decision: AggregateRecommendationDecision.DeployAnyVariation,
    }
  }

  return {
    decision: AggregateRecommendationDecision.DeployChosenVariation,
    chosenVariationId: recommendation.chosenVariationId,
  }
}

interface AnalysesByStrategy {
  [AnalysisStrategy.IttPure]?: Analysis
  [AnalysisStrategy.MittNoCrossovers]?: Analysis
  [AnalysisStrategy.MittNoSpammers]?: Analysis
  [AnalysisStrategy.MittNoSpammersNoCrossovers]?: Analysis
  [AnalysisStrategy.PpNaive]?: Analysis
}

interface CountsSet {
  assigned: number
  assignedCrossovers: number
  assignedSpammers: number
  assignedNoSpammersNoCrossovers: number
  exposed: number
}

function getParticipantCountsSetForParticipantStatsKey(
  participantStatsKey: string,
  analysesByStrategy: AnalysesByStrategy,
): CountsSet {
  const assigned = analysesByStrategy[AnalysisStrategy.IttPure]?.participantStats[participantStatsKey] ?? 0
  return {
    assigned: assigned,
    assignedCrossovers:
      assigned - (analysesByStrategy[AnalysisStrategy.MittNoCrossovers]?.participantStats[participantStatsKey] ?? 0),
    assignedSpammers:
      assigned - (analysesByStrategy[AnalysisStrategy.MittNoSpammers]?.participantStats[participantStatsKey] ?? 0),
    assignedNoSpammersNoCrossovers:
      analysesByStrategy[AnalysisStrategy.MittNoSpammersNoCrossovers]?.participantStats[participantStatsKey] ?? 0,
    exposed: analysesByStrategy[AnalysisStrategy.PpNaive]?.participantStats[participantStatsKey] ?? 0,
  }
}

/**
 * Gets participant counts for an Experiment
 */
export function getParticipantCounts(
  experiment: ExperimentFull,
  analysesByStrategy: AnalysesByStrategy,
): { total: CountsSet; byVariationId: Record<number, CountsSet> } {
  return {
    total: getParticipantCountsSetForParticipantStatsKey('total', analysesByStrategy),
    byVariationId: Object.fromEntries(
      experiment.variations.map(({ variationId }) => [
        variationId,
        getParticipantCountsSetForParticipantStatsKey(`variation_${variationId}`, analysesByStrategy),
      ]),
    ),
  }
}

interface VariationRatios {
  exposedToAssigned: number
  assignedSpammersToAssigned: number
  assignedCrossoversToAssigned: number
  assignedNoSpammersNoCrossoversToAssigned: number
  exposedToTotalExposed: number
  assignedToTotalAssigned: number
  assignedSpammersToTotalAssignedSpammers: number
  assignedCrossoversToTotalAssignedCrossovers: number
}

interface VariationProbabilities {
  exposedDistributionMatchingAllocated: number
  assignedDistributionMatchingAllocated: number
  assignedSpammersDistributionMatchingAllocated: number
  assignedNoSpammersNoCrossoversDistributionMatchingAllocated: number
}

export interface ExperimentParticipantStats {
  ratios: {
    overall: {
      exposedToAssigned: number
      assignedSpammersToAssigned: number
      assignedCrossoversToAssigned: number
      assignedNoSpammersNoCrossoversToAssigned: number
    }
    byVariationId: Record<number, VariationRatios>
  }
  probabilities: {
    byVariationId: Record<number, VariationProbabilities>
  }
}

/**
 * Gets Experiment Health Stats for an experiment
 */
export function getExperimentParticipantStats(
  experiment: ExperimentFull,
  analysesByStrategy: AnalysesByStrategy,
): ExperimentParticipantStats {
  const participantCounts = getParticipantCounts(experiment, analysesByStrategy)

  const ratios = {
    overall: {
      exposedToAssigned: participantCounts.total.exposed / participantCounts.total.assigned,
      assignedSpammersToAssigned: participantCounts.total.assignedSpammers / participantCounts.total.assigned,
      assignedCrossoversToAssigned: participantCounts.total.assignedCrossovers / participantCounts.total.assigned,
      assignedNoSpammersNoCrossoversToAssigned:
        participantCounts.total.assignedNoSpammersNoCrossovers / participantCounts.total.assigned,
    },
    byVariationId: Object.fromEntries(
      Object.entries(participantCounts.byVariationId).map(([variationId, variationCountsSet]) => {
        return [
          variationId,
          {
            exposedToAssigned: variationCountsSet.exposed / variationCountsSet.assigned,
            assignedSpammersToAssigned: variationCountsSet.assignedSpammers / variationCountsSet.assigned,
            assignedCrossoversToAssigned: variationCountsSet.assignedCrossovers / variationCountsSet.assigned,
            assignedNoSpammersNoCrossoversToAssigned:
              variationCountsSet.assignedNoSpammersNoCrossovers / variationCountsSet.assigned,
            exposedToTotalExposed: variationCountsSet.exposed / participantCounts.total.exposed,
            assignedToTotalAssigned: variationCountsSet.assigned / participantCounts.total.assigned,
            assignedSpammersToTotalAssignedSpammers:
              variationCountsSet.assignedSpammers / participantCounts.total.assignedSpammers,
            assignedCrossoversToTotalAssignedCrossovers:
              variationCountsSet.assignedCrossovers / participantCounts.total.assignedCrossovers,
          },
        ]
      }),
    ),
  }

  const totalAllocatedPercentage = experiment.variations
    .map(({ allocatedPercentage }) => allocatedPercentage)
    .reduce((acc, cur) => acc + cur)
  // The probability of an equal or a more extreme outcome occuring.
  const probabilities = {
    byVariationId: Object.fromEntries(
      experiment.variations.map(({ variationId, allocatedPercentage }) => {
        const variationCountsSet = participantCounts.byVariationId[variationId]
        return [
          variationId,
          {
            exposedDistributionMatchingAllocated: binomialProbValue({
              successfulTrials: variationCountsSet.exposed,
              totalTrials: participantCounts.total.exposed,
              probabilityOfSuccess: allocatedPercentage / totalAllocatedPercentage,
            }),
            assignedDistributionMatchingAllocated: binomialProbValue({
              successfulTrials: variationCountsSet.assigned,
              totalTrials: participantCounts.total.assigned,
              probabilityOfSuccess: allocatedPercentage / totalAllocatedPercentage,
            }),
            assignedSpammersDistributionMatchingAllocated: binomialProbValue({
              successfulTrials: variationCountsSet.assignedSpammers,
              totalTrials: participantCounts.total.assignedSpammers,
              probabilityOfSuccess: allocatedPercentage / totalAllocatedPercentage,
            }),
            assignedNoSpammersNoCrossoversDistributionMatchingAllocated: binomialProbValue({
              successfulTrials: variationCountsSet.assignedNoSpammersNoCrossovers,
              totalTrials: participantCounts.total.assignedNoSpammersNoCrossovers,
              probabilityOfSuccess: allocatedPercentage / totalAllocatedPercentage,
            }),
          },
        ]
      }),
    ),
  }

  return {
    ratios,
    probabilities,
  }
}

export enum HealthIndicationCode {
  Nominal = 'Nominal',
  ValueError = 'ValueError',

  // Probabilistic
  PossibleIssue = 'PossibleIssue',
  ProbableIssue = 'ProbableIssue',

  // Proportional
  VeryLow = 'VeryLow',
  Low = 'Low',
  High = 'High',
  VeryHigh = 'VeryHigh',
}

export enum HealthIndicationSeverity {
  Ok = 'Ok',
  Warning = 'Warning',
  Error = 'Error',
}

interface HealthIndication {
  code: HealthIndicationCode
  reason: string
  severity: HealthIndicationSeverity
}

export enum HealthIndicatorUnit {
  Pvalue = 'P-Value',
  Ratio = 'Ratio',
}

/**
 * Indicators are the important stats that give us clear direction on how an experiment is going.
 */
export interface HealthIndicator {
  name: string
  value: number
  unit: HealthIndicatorUnit
  link?: string
  indication: HealthIndication
}

interface IndicationBracket {
  max: number
  indication: Omit<HealthIndication, 'reason'>
}

/**
 * Get indication from set of IndicatorBrackets, adding a reason string.
 * Expects brackets to be sorted.
 */
function getIndicationFromBrackets(sortedBracketsMaxAsc: IndicationBracket[], value: number): HealthIndication {
  const bracketIndex = sortedBracketsMaxAsc.findIndex((bracket) => value <= bracket.max)

  if (bracketIndex === -1) {
    return {
      code: HealthIndicationCode.ValueError,
      severity: HealthIndicationSeverity.Error,
      reason: 'Unexpected value',
    }
  }

  const previousBracketMax = sortedBracketsMaxAsc[bracketIndex - 1]?.max ?? -Infinity
  const bracket = sortedBracketsMaxAsc[bracketIndex]
  const reason = `${previousBracketMax === -Infinity ? '−∞' : previousBracketMax} < x ≤ ${bracket.max}`

  return {
    ...bracket.indication,
    reason,
  }
}

/**
 * Returns indicators from experimentParticipantStats.
 */
export function getExperimentParticipantHealthIndicators(
  experimentParticipantStats: ExperimentParticipantStats,
): HealthIndicator[] {
  // Getting the min p-values across variations:
  const minVariationProbabilities = Object.values(experimentParticipantStats.probabilities.byVariationId).reduce(
    (acc: VariationProbabilities, cur: VariationProbabilities) => ({
      assignedDistributionMatchingAllocated: Math.min(
        acc.assignedDistributionMatchingAllocated,
        cur.assignedDistributionMatchingAllocated,
      ),
      assignedSpammersDistributionMatchingAllocated: Math.min(
        acc.assignedSpammersDistributionMatchingAllocated,
        cur.assignedSpammersDistributionMatchingAllocated,
      ),
      assignedNoSpammersNoCrossoversDistributionMatchingAllocated: Math.min(
        acc.assignedNoSpammersNoCrossoversDistributionMatchingAllocated,
        cur.assignedNoSpammersNoCrossoversDistributionMatchingAllocated,
      ),
      exposedDistributionMatchingAllocated: Math.min(
        acc.exposedDistributionMatchingAllocated,
        cur.exposedDistributionMatchingAllocated,
      ),
    }),
  )

  interface IndicatorDefinition extends Omit<HealthIndicator, 'indication'> {
    indicationBrackets: Array<IndicationBracket>
  }

  const indicatorDefinitions: IndicatorDefinition[] = []

  indicatorDefinitions.push(
    {
      name: 'Assignment distribution',
      value: minVariationProbabilities.assignedDistributionMatchingAllocated,
      unit: HealthIndicatorUnit.Pvalue,
      link:
        'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#assignment-distribution-matching-allocated',
      indicationBrackets: [
        {
          max: 0.001,
          indication: {
            code: HealthIndicationCode.ProbableIssue,
            severity: HealthIndicationSeverity.Error,
          },
        },
        {
          max: 0.05,
          indication: {
            code: HealthIndicationCode.PossibleIssue,
            severity: HealthIndicationSeverity.Warning,
          },
        },
        {
          max: 1,
          indication: {
            code: HealthIndicationCode.Nominal,
            severity: HealthIndicationSeverity.Ok,
          },
        },
      ],
    },
    {
      name: 'Assignment distribution without crossovers and spammers',
      value: minVariationProbabilities.assignedDistributionMatchingAllocated,
      unit: HealthIndicatorUnit.Pvalue,
      link:
        'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#assigned-no-spammers-no-crossovers-distribution-matching-allocated',
      indicationBrackets: [
        {
          max: 0.001,
          indication: {
            code: HealthIndicationCode.ProbableIssue,
            severity: HealthIndicationSeverity.Error,
          },
        },
        {
          max: 0.05,
          indication: {
            code: HealthIndicationCode.PossibleIssue,
            severity: HealthIndicationSeverity.Warning,
          },
        },
        {
          max: 1,
          indication: {
            code: HealthIndicationCode.Nominal,
            severity: HealthIndicationSeverity.Ok,
          },
        },
      ],
    },
  )

  if (experimentParticipantStats.ratios.overall.exposedToAssigned) {
    indicatorDefinitions.push({
      name: 'Assignment distribution of exposed participants',
      value: minVariationProbabilities.exposedDistributionMatchingAllocated,
      unit: HealthIndicatorUnit.Pvalue,
      link:
        'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#exposure-event-distribution-matching-allocated-sample-ratio-mismatch',
      indicationBrackets: [
        {
          max: 0.001,
          indication: {
            code: HealthIndicationCode.ProbableIssue,
            severity: HealthIndicationSeverity.Error,
          },
        },
        {
          max: 0.05,
          indication: {
            code: HealthIndicationCode.PossibleIssue,
            severity: HealthIndicationSeverity.Warning,
          },
        },
        {
          max: 1,
          indication: {
            code: HealthIndicationCode.Nominal,
            severity: HealthIndicationSeverity.Ok,
          },
        },
      ],
    })
  }

  indicatorDefinitions.push(
    {
      name: 'Ratio of crossovers to assigned',
      value: experimentParticipantStats.ratios.overall.assignedCrossoversToAssigned,
      unit: HealthIndicatorUnit.Ratio,
      link: 'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#total-crossovers',
      indicationBrackets: [
        {
          max: 0.01,
          indication: {
            code: HealthIndicationCode.Nominal,
            severity: HealthIndicationSeverity.Ok,
          },
        },
        {
          max: 0.05,
          indication: {
            code: HealthIndicationCode.High,
            severity: HealthIndicationSeverity.Warning,
          },
        },
        {
          max: 1,
          indication: {
            code: HealthIndicationCode.VeryHigh,
            severity: HealthIndicationSeverity.Error,
          },
        },
      ],
    },
    {
      name: 'Ratio of spammers to assigned',
      value: experimentParticipantStats.ratios.overall.assignedSpammersToAssigned,
      unit: HealthIndicatorUnit.Ratio,
      link: 'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#total-spammers',
      indicationBrackets: [
        {
          max: 0.075,
          indication: {
            code: HealthIndicationCode.Nominal,
            severity: HealthIndicationSeverity.Ok,
          },
        },
        {
          max: 0.3,
          indication: {
            code: HealthIndicationCode.High,
            severity: HealthIndicationSeverity.Warning,
          },
        },
        {
          max: 1,
          indication: {
            code: HealthIndicationCode.VeryHigh,
            severity: HealthIndicationSeverity.Error,
          },
        },
      ],
    },
  )

  return indicatorDefinitions.map(({ value, indicationBrackets, ...rest }) => ({
    value,
    indication: getIndicationFromBrackets(indicationBrackets, value),
    ...rest,
  }))
}
