import _ from 'lodash'

import * as Experiments from './experiments'
import {
  Analysis,
  AnalysisStrategy,
  ExperimentFull,
  MetricAssignment,
  MetricBare,
  RecommendationWarning,
  Status,
} from './schemas'

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
  MoreDataNeeded = 'MoreDataNeeded',
  Inconclusive = 'Inconclusive',
  DeployAnyVariation = 'DeployAnyVariation',
  DeployChosenVariation = 'DeployChosenVariation',
}

export interface AggregateRecommendation {
  decision: AggregateRecommendationDecision
  chosenVariationId?: number
  shouldStop: boolean
}

/**
 * Returns the aggregate recommendation over analyses of different analysis strategies.
 *
 * @param analyses Analyses of different strategies for the same day.
 * @param defaultStrategy Default strategy in the context of an aggregateRecommendation..
 */
export function getAggregateRecommendation({
  experiment,
  analyses,
  defaultStrategy,
}: {
  experiment: ExperimentFull
  metric: MetricBare
  metricAssignment: MetricAssignment
  analyses: Analysis[]
  defaultStrategy: AnalysisStrategy
}): AggregateRecommendation {
  const recommendationChosenVariationIds = analyses
    .map((analysis) => analysis.recommendation)
    .filter((x) => x)
    .map((recommendation) => recommendation?.chosenVariationId)
  const recommendationConflict = [...new Set(recommendationChosenVariationIds)].length > 1

  const recommendation = analyses.find((analysis) => analysis.analysisStrategy === defaultStrategy)?.recommendation
  if (!recommendation) {
    return {
      decision: AggregateRecommendationDecision.MissingAnalysis,
      shouldStop: false,
    }
  }

  const shouldStop =
    [Status.Running, Status.Completed].includes(experiment.status) &&
    recommendation.warnings.includes(RecommendationWarning.LongPeriod)

  if (recommendationConflict) {
    return {
      decision: AggregateRecommendationDecision.ManualAnalysisRequired,
      shouldStop,
    }
  }

  // Following the endExperiment+warnings description in experiments/recommender.py:Recommendation:
  // In the future we will move the recommendation logic here.
  if (
    !recommendation.endExperiment ||
    (recommendation.warnings.includes(RecommendationWarning.ShortPeriod) &&
      !Experiments.isExperimentAssignedUpfront(experiment)) ||
    recommendation.warnings.includes(RecommendationWarning.WideCi)
  ) {
    if (experiment.status === Status.Running) {
      return {
        decision: AggregateRecommendationDecision.MoreDataNeeded,
        shouldStop,
      }
    } else {
      return {
        decision: AggregateRecommendationDecision.Inconclusive,
        shouldStop,
      }
    }
  }

  if (!recommendation.chosenVariationId) {
    return {
      decision: AggregateRecommendationDecision.DeployAnyVariation,
      shouldStop,
    }
  }

  return {
    decision: AggregateRecommendationDecision.DeployChosenVariation,
    chosenVariationId: recommendation.chosenVariationId,
    shouldStop,
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
  ProbableIssue = 'ProbableIssue',
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
      link:
        'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#assignment-distribution-matching-allocated',
      indicationBrackets: [
        {
          max: 0.001,
          indication: HealthIndication.ProbableIssue,
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
      link:
        'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#exposure-event-distribution-matching-allocated-sample-ratio-mismatch',
      indicationBrackets: [
        {
          max: 0.001,
          indication: HealthIndication.ProbableIssue,
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
      link:
        'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#spammer-distribution-matching-allocated',
      indicationBrackets: [
        {
          max: 0.001,
          indication: HealthIndication.ProbableIssue,
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
      link: 'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#total-crossovers',
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
          indication: HealthIndication.ProbableIssue,
        },
      ],
    },
    {
      name: 'Total spammers',
      value: experimentHealthStats.ratios.overall.assignedSpammersToAssigned,
      unit: HealthIndicatorUnit.Ratio,
      link: 'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#total-spammers',
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
          indication: HealthIndication.ProbableIssue,
        },
      ],
    },
  ]

  return indicatorDefinitions.map(({ value, indicationBrackets, ...rest }) => ({
    value,
    indication: (_.sortBy(indicationBrackets, 'max').find((bracket) => value <= bracket.max) as IndicationBracket)
      .indication,
    ...rest,
  }))
}
