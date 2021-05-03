import _ from 'lodash'

import { binomialProbValue } from 'src/utils/math'

import * as Experiments from './experiments'
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

/**
 * Get a participant count set for a specific participant stats key.
 */
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
  Nominal = 'nominal',
  ValueError = 'value error',

  // Probabilistic
  PossibleIssue = 'possible issue',
  ProbableIssue = 'probable issue',

  // Proportional
  VeryLow = 'very low',
  Low = 'low',
  High = 'high',
  VeryHigh = 'very high',
}

export enum HealthIndicationSeverity {
  Ok = 'Ok',
  Warning = 'Warning',
  Error = 'Error',
}

export const healthIndicationSeverityOrder = [
  HealthIndicationSeverity.Ok,
  HealthIndicationSeverity.Warning,
  HealthIndicationSeverity.Error,
]

interface HealthIndication {
  code: HealthIndicationCode
  reason: string
  severity: HealthIndicationSeverity
  recommendation?: string
}

export enum HealthIndicatorUnit {
  Pvalue = 'p-value',
  Ratio = 'ratio',
  Days = 'days',
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

const contactUsRecommendation = 'Contact @experimentation-review-guild'
const highSpammerRecommendation = `Spammers don't affect experiments, but high numbers could indicate other problems.`

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
      recommendation: contactUsRecommendation,
    }
  }

  const previousBracketMax = sortedBracketsMaxAsc[bracketIndex - 1]?.max ?? -Infinity
  const bracket = sortedBracketsMaxAsc[bracketIndex]
  const reason = `${previousBracketMax === -Infinity ? '−∞' : previousBracketMax} < x ≤ ${
    bracket.max === Infinity ? '∞' : bracket.max
  }`

  return {
    ...bracket.indication,
    reason,
  }
}

interface IndicatorDefinition extends Omit<HealthIndicator, 'indication'> {
  indicationBrackets: Array<IndicationBracket>
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
            recommendation: contactUsRecommendation,
          },
        },
        {
          max: 0.05,
          indication: {
            code: HealthIndicationCode.PossibleIssue,
            severity: HealthIndicationSeverity.Warning,
            recommendation: `Check daily ratio patterns for anomalies, contact @experiment-review-guild`,
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
            recommendation: contactUsRecommendation,
          },
        },
        {
          max: 0.05,
          indication: {
            code: HealthIndicationCode.PossibleIssue,
            severity: HealthIndicationSeverity.Warning,
            recommendation: `If not in combination with a "Assignment distribution" issue, contact @experiment-review-guild`,
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
    const biasedExposuresRecommendation = `If not in combination with other distribution issues, exposure event being fired is linked to variation causing bias. Choose a different exposure event or use assignment analysis (contact @experiment-review-guild to do so).`
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
            recommendation: biasedExposuresRecommendation,
          },
        },
        {
          max: 0.05,
          indication: {
            code: HealthIndicationCode.PossibleIssue,
            severity: HealthIndicationSeverity.Warning,
            recommendation: biasedExposuresRecommendation,
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
            recommendation: 'Continue monitoring experiment',
          },
        },
        {
          max: 1,
          indication: {
            code: HealthIndicationCode.VeryHigh,
            severity: HealthIndicationSeverity.Error,
            recommendation: contactUsRecommendation,
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
          max: 0.1,
          indication: {
            code: HealthIndicationCode.Nominal,
            severity: HealthIndicationSeverity.Ok,
          },
        },
        {
          max: 0.4,
          indication: {
            code: HealthIndicationCode.High,
            severity: HealthIndicationSeverity.Warning,
            recommendation: highSpammerRecommendation,
          },
        },
        {
          max: 1,
          indication: {
            code: HealthIndicationCode.VeryHigh,
            severity: HealthIndicationSeverity.Error,
            recommendation: highSpammerRecommendation,
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

/**
 * Get experiment health indicators for an set of analyses.
 * Will be expanded to future cross-strategy indicators.
 *
 * @param strategy The "default" strategy to use when a single strategy is needed.
 */
export function getExperimentAnalysesHealthIndicators(
  experiment: ExperimentFull,
  analysesByStrategy: Record<AnalysisStrategy, Analysis | undefined>,
  strategy: AnalysisStrategy,
): HealthIndicator[] {
  const analysis = analysesByStrategy[strategy]
  if (!analysis) {
    return []
  }
  const metricAssignment = experiment.metricAssignments.find(
    (metricAssignment) => metricAssignment.metricAssignmentId === analysis.metricAssignmentId,
  )
  if (!metricAssignment) {
    throw new Error('Missing metricAssignment')
  }
  if (!analysis.metricEstimates) {
    return []
  }

  const diffCiWidth = Math.abs(analysis.metricEstimates.diff.top - analysis.metricEstimates.diff.bottom)
  const ropeWidth = metricAssignment.minDifference * 2
  const indicatorDefinitions = [
    {
      name: 'Kruschke Precision (CI to ROPE ratio)',
      value: diffCiWidth / ropeWidth,
      unit: HealthIndicatorUnit.Ratio,
      link: 'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#kruschke-precision',
      indicationBrackets: [
        {
          max: 0.8,
          indication: {
            code: HealthIndicationCode.Nominal,
            severity: HealthIndicationSeverity.Ok,
          },
        },
        {
          max: 1.5,
          indication: {
            code: HealthIndicationCode.High,
            severity: HealthIndicationSeverity.Warning,
            recommendation: `Results are imprecise, be careful about drawing conclusions. Extend for more precision`,
          },
        },
        {
          max: Infinity,
          indication: {
            code: HealthIndicationCode.VeryHigh,
            severity: HealthIndicationSeverity.Warning,
            recommendation: `Results are very imprecise, be careful about drawing conclusions. Extend for more precision`,
          },
        },
      ],
    },
  ]

  return indicatorDefinitions.map(({ value, indicationBrackets, ...rest }) => ({
    value,
    indication: getIndicationFromBrackets(indicationBrackets, value),
    ...rest,
  }))
}

/**
 * Get experiment health indicators for a experiment.
 */
export function getExperimentHealthIndicators(experiment: ExperimentFull): HealthIndicator[] {
  const indicatorDefinitions = [
    {
      name: 'Experiment Run Time',
      value: Experiments.getExperimentRunHours(experiment) / 24,
      unit: HealthIndicatorUnit.Days,
      link: 'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#experiment-run-time',
      indicationBrackets: [
        {
          max: 3,
          indication: {
            code: HealthIndicationCode.VeryLow,
            severity: HealthIndicationSeverity.Warning,
            recommendation: 'Experiments should generally run at least 7 days before drawing conclusions.',
          },
        },
        {
          max: 7,
          indication: {
            code: HealthIndicationCode.Low,
            severity: HealthIndicationSeverity.Warning,
            recommendation: 'Experiments should generally run at least 7 days before drawing conclusions.',
          },
        },
        {
          max: 28,
          indication: {
            code: HealthIndicationCode.Nominal,
            severity: HealthIndicationSeverity.Ok,
          },
        },
        {
          max: 31,
          indication: {
            code: HealthIndicationCode.High,
            severity: HealthIndicationSeverity.Warning,
            recommendation: 'Experiment is running long, stop experiment soon.',
          },
        },
        {
          max: Infinity,
          indication: {
            code: HealthIndicationCode.VeryHigh,
            severity: HealthIndicationSeverity.Warning,
            recommendation: 'Experiment is running way too long, stop experiment now.',
          },
        },
      ],
    },
  ]

  return indicatorDefinitions.map(({ value, indicationBrackets, ...rest }) => ({
    value,
    indication: getIndicationFromBrackets(indicationBrackets, value),
    ...rest,
  }))
}
