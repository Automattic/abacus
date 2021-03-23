import _ from 'lodash'

import { Analysis, AnalysisStrategy, ExperimentFull, RecommendationWarning } from './schemas'

// I can't get stdlib to work as an import...:
// eslint-disable-next-line @typescript-eslint/no-var-requires
const binomialTest = require('@stdlib/stats/binomial-test') as (
  x: number,
  n: number,
  args: { p: number },
) => { pValue: number }

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
  exposedToTotalExposed: number
  assignedToTotalAssigned: number
  assignedSpammersToTotalAssignedSpammers: number
  assignedCrossoversToTotalAssignedCrossovers: number
}

interface VariationProbabilities {
  exposedDistributionMatchingAllocated: number
  assignedDistributionMatchingAllocated: number
  assignedSpammersDistributionMatchingAllocated: number
}

export interface ExperimentHealthStats {
  ratios: {
    overall: {
      exposedToAssigned: number
      assignedSpammersToAssigned: number
      assignedCrossoversToAssigned: number
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
export function getExperimentHealthStats(
  experiment: ExperimentFull,
  analysesByStrategy: AnalysesByStrategy,
): ExperimentHealthStats {
  const participantCounts = getParticipantCounts(experiment, analysesByStrategy)

  const ratios = {
    overall: {
      exposedToAssigned: participantCounts.total.exposed / participantCounts.total.assigned,
      assignedSpammersToAssigned: participantCounts.total.assignedSpammers / participantCounts.total.assigned,
      assignedCrossoversToAssigned: participantCounts.total.assignedCrossovers / participantCounts.total.assigned,
    },
    byVariationId: Object.fromEntries(
      Object.entries(participantCounts.byVariationId).map(([variationId, variationCountsSet]) => {
        return [
          variationId,
          {
            exposedToAssigned: variationCountsSet.exposed / variationCountsSet.assigned,
            assignedSpammersToAssigned: variationCountsSet.assignedSpammers / variationCountsSet.assigned,
            assignedCrossoversToAssigned: variationCountsSet.assignedCrossovers / variationCountsSet.assigned,
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
            exposedDistributionMatchingAllocated: binomialTest(
              variationCountsSet.exposed,
              participantCounts.total.exposed,
              { p: allocatedPercentage / totalAllocatedPercentage },
            ).pValue,
            assignedDistributionMatchingAllocated: binomialTest(
              variationCountsSet.assigned,
              participantCounts.total.assigned,
              { p: allocatedPercentage / totalAllocatedPercentage },
            ).pValue,
            assignedSpammersDistributionMatchingAllocated: binomialTest(
              variationCountsSet.assignedSpammers,
              participantCounts.total.assignedSpammers,
              { p: allocatedPercentage / totalAllocatedPercentage },
            ).pValue,
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

export enum HealthIndication {
  Nominal = 'Nominal',
  PossibleIssue = 'PossibleIssue',
  CertainIssue = 'CertainIssue',
}

export enum HealthIndicatorUnit {
  Pvalue = 'Pvalue',
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

/**
 * Returns indicators from experimentHealthStats.
 */
export function getExperimentHealthIndicators(experimentHealthStats: ExperimentHealthStats): HealthIndicator[] {
  // Getting the min p-values across variations:
  const minVariationProbabilities = Object.values(experimentHealthStats.probabilities.byVariationId).reduce(
    (acc: VariationProbabilities, cur: VariationProbabilities) => ({
      assignedDistributionMatchingAllocated: Math.min(
        acc.assignedDistributionMatchingAllocated,
        cur.assignedDistributionMatchingAllocated,
      ),
      assignedSpammersDistributionMatchingAllocated: Math.min(
        acc.assignedSpammersDistributionMatchingAllocated,
        cur.assignedSpammersDistributionMatchingAllocated,
      ),
      exposedDistributionMatchingAllocated: Math.min(
        acc.exposedDistributionMatchingAllocated,
        cur.exposedDistributionMatchingAllocated,
      ),
    }),
  )

  interface IndicationBracket {
    max: number
    indication: HealthIndication
  }

  interface IndicatorDefinition {
    name: string
    value: number
    unit: HealthIndicatorUnit
    link?: string
    indicationBrackets: Array<IndicationBracket>
  }

  const indicatorDefinitions: IndicatorDefinition[] = [
    {
      name: 'Assignment distribution matching allocated',
      value: minVariationProbabilities.assignedDistributionMatchingAllocated,
      unit: HealthIndicatorUnit.Pvalue,
      link: '',
      indicationBrackets: [
        {
          max: 0.001,
          indication: HealthIndication.CertainIssue,
        },
        {
          max: 0.05,
          indication: HealthIndication.PossibleIssue,
        },
        {
          max: 1,
          indication: HealthIndication.Nominal,
        },
      ],
    },
    {
      name: 'Exposure event distribution matching allocated',
      value: minVariationProbabilities.exposedDistributionMatchingAllocated,
      unit: HealthIndicatorUnit.Pvalue,
      link: '',
      indicationBrackets: [
        {
          max: 0.001,
          indication: HealthIndication.CertainIssue,
        },
        {
          max: 0.05,
          indication: HealthIndication.PossibleIssue,
        },
        {
          max: 1,
          indication: HealthIndication.Nominal,
        },
      ],
    },
    {
      name: 'Spammer distribution matching allocated',
      value: minVariationProbabilities.assignedSpammersDistributionMatchingAllocated,
      unit: HealthIndicatorUnit.Pvalue,
      link: '',
      indicationBrackets: [
        {
          max: 0.001,
          indication: HealthIndication.CertainIssue,
        },
        {
          max: 0.05,
          indication: HealthIndication.PossibleIssue,
        },
        {
          max: 1,
          indication: HealthIndication.Nominal,
        },
      ],
    },
    {
      name: 'Total crossovers',
      value: experimentHealthStats.ratios.overall.assignedCrossoversToAssigned,
      unit: HealthIndicatorUnit.Ratio,
      link: '',
      indicationBrackets: [
        {
          max: 0.01,
          indication: HealthIndication.Nominal,
        },
        {
          max: 0.05,
          indication: HealthIndication.PossibleIssue,
        },
        {
          max: 1,
          indication: HealthIndication.CertainIssue,
        },
      ],
    },
    {
      name: 'Total spammers',
      value: experimentHealthStats.ratios.overall.assignedSpammersToAssigned,
      unit: HealthIndicatorUnit.Ratio,
      link: '',
      indicationBrackets: [
        {
          max: 0.075,
          indication: HealthIndication.Nominal,
        },
        {
          max: 0.3,
          indication: HealthIndication.PossibleIssue,
        },
        {
          max: 1,
          indication: HealthIndication.CertainIssue,
        },
      ],
    },
  ]

  return indicatorDefinitions.map(({ value, indicationBrackets: brackets, ...rest }) => ({
    value,
    indication: (_.sortBy(brackets, 'max').find((bracket) => value <= bracket.max) as IndicationBracket).indication,
    ...rest,
  }))
}
