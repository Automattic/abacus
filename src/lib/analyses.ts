import { binomialProbValue } from 'src/utils/math'

import * as Experiments from './experiments'
import {
  Analysis,
  AnalysisStrategy,
  ExperimentFull,
  MetricAssignment,
  MetricBare,
  RecommendationWarning,
  Variation,
} from './schemas'

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

/**
 * # Recommendations
 *
 * > "A difference is a difference only if it makes a difference."
 * > Darrell Huff in “How to Lie with Statistics”
 *
 * ## Definitions
 *
 * - CI: Credible Interval, the bayesian version of a Confidence Interval.
 *   Without otherwise specifying we mean the 95% CI, this means it is an area
 *   which is 95% likely to contain the real value of what we are measuring.
 *
 * - minDifference: Experimenters set this for each MetricAssignment, this
 *   defines what sort of difference is practical.
 *
 * - ROPE: "Region of Practical Equivalance".
 *   The interval of [-minDifference, minDifference].
 *
 * ## Statistical Significance
 *
 * A difference CI is statistically significant if it doesn't contain 0.
 * This is the classical method used in statistics and isn't something we use
 * for recommendations but is included for debugging and better understanding
 * results.
 *
 * ## Practical Significance
 *
 * A difference CI is practically significant if it doesn't contain any part of
 * the ROPE. Practical significance is what we use for recommendations.
 *
 * Benefits of practical significance:
 * - More accurate burden of proof - tailored to the Experimenters specific decision they are making.
 *   For example a diff CI can be better than zero, but cost more to fully implement than any benefit from it.
 *   By using practical significance we can set the point of decision to exactly when the benefit outweighs the cost.
 * - Gives us a way to determine how long an experiment should run for - if the
 *   CI and ROPE only partially overlap the real value could be either within the
 *   ROPE or outside of it, we don't know. It turns out this is an unbiased way of
 *   letting us know that we should collect more data and run the experiment
 *   longer.
 * - Able to make decisions against implementing something.
 *   If the CI is contained in the ROPE we can actually reject the change completely.
 *
 * Practical significance is part of the approach described in
 * https://yanirseroussi.com/2016/06/19/making-bayesian-ab-testing-more-accessible/, which is based on
 * http://doingbayesiandataanalysis.blogspot.com/2013/11/optional-stopping-in-data-collection-p.html.
 *
 * See also some of Kruschke's resources on the topic:
 * * Precision as a goal for data collection: https://www.youtube.com/playlist?list=PL_mlm7M63Y7j641Y7QJG3TfSxeZMGOsQ4
 * * Bayesian estimation supersedes the t test: http://psy-ed.wdfiles.com/local--files/start/Kruschke2012.pdf
 * * Rejecting or accepting parameter values in Bayesian estimation: https://osf.io/s5vdy/download/?format=pdf
 */

/**
 * Whether the CI is outside the ROPE.
 *
 * See file-level documentation.
 */
export enum PracticalSignificanceStatus {
  Yes = 'Yes',
  No = 'No',
  Uncertain = 'Uncertain',
}

interface DiffCredibleIntervalStats {
  practicallySignificant: PracticalSignificanceStatus
  statisticallySignificant: boolean
  isPositive: boolean
}

/**
 * Gets statistics of the diff CI.
 *
 * See the file-level documentation.
 */
export function getDiffCredibleIntervalStats(
  analysis: Analysis | null,
  metricAssignment: MetricAssignment,
): DiffCredibleIntervalStats | null {
  if (!analysis || !analysis.metricEstimates) {
    return null
  }

  if (analysis.metricEstimates.diff.top < analysis.metricEstimates.diff.bottom) {
    throw new Error('Invalid metricEstimates: bottom greater than top.')
  }

  let practicallySignificant = PracticalSignificanceStatus.No
  if (
    // CI is entirely above or below the experimenter set minDifference:
    metricAssignment.minDifference <= analysis.metricEstimates.diff.bottom ||
    analysis.metricEstimates.diff.top <= -metricAssignment.minDifference
  ) {
    practicallySignificant = PracticalSignificanceStatus.Yes
  } else if (
    // CI is partially above or below the experimenter set minDifference:
    metricAssignment.minDifference < analysis.metricEstimates.diff.top ||
    analysis.metricEstimates.diff.bottom < -metricAssignment.minDifference
  ) {
    practicallySignificant = PracticalSignificanceStatus.Uncertain
  }
  const statisticallySignificant = 0 < analysis.metricEstimates.diff.bottom || analysis.metricEstimates.diff.top < 0
  const isPositive = 0 < analysis.metricEstimates.diff.bottom

  return {
    statisticallySignificant,
    practicallySignificant,
    isPositive,
  }
}

export enum AggregateRecommendationDecision {
  ManualAnalysisRequired = 'ManualAnalysisRequired',
  MissingAnalysis = 'MissingAnalysis',
  Inconclusive = 'Inconclusive',
  DeployAnyVariation = 'DeployAnyVariation',
  DeployChosenVariation = 'DeployChosenVariation',
}

export interface AggregateRecommendation {
  analysisStrategy: AnalysisStrategy
  decision: AggregateRecommendationDecision
  chosenVariationId?: number
  statisticallySignificant?: boolean
  practicallySignificant?: PracticalSignificanceStatus
}

const PracticalSignificanceStatusToDecision: Record<PracticalSignificanceStatus, AggregateRecommendationDecision> = {
  [PracticalSignificanceStatus.No]: AggregateRecommendationDecision.DeployAnyVariation,
  [PracticalSignificanceStatus.Uncertain]: AggregateRecommendationDecision.Inconclusive,
  [PracticalSignificanceStatus.Yes]: AggregateRecommendationDecision.DeployChosenVariation,
}

/**
 * Returns the recommendation for a single analysis.
 *
 * See file-level recommendation documentation.
 */
export function getMetricAssignmentRecommendation(
  experiment: ExperimentFull,
  metric: MetricBare,
  analysis: Analysis,
): AggregateRecommendation {
  const metricAssignment = experiment.metricAssignments.find(
    (metricAssignment) => metricAssignment.metricAssignmentId === analysis.metricAssignmentId,
  )
  const diffCredibleIntervalStats =
    analysis && metricAssignment && getDiffCredibleIntervalStats(analysis, metricAssignment)
  const analysisStrategy = analysis.analysisStrategy
  if (!analysis.metricEstimates || !metricAssignment || !diffCredibleIntervalStats) {
    return {
      analysisStrategy,
      decision: AggregateRecommendationDecision.MissingAnalysis,
    }
  }

  const { practicallySignificant, statisticallySignificant, isPositive } = diffCredibleIntervalStats
  const decision = PracticalSignificanceStatusToDecision[practicallySignificant]
  const defaultVariation = experiment.variations.find((variation) => variation.isDefault) as Variation
  const nonDefaultVariation = experiment.variations.find((variation) => !variation.isDefault) as Variation
  let chosenVariationId = undefined
  if (decision === AggregateRecommendationDecision.DeployChosenVariation) {
    chosenVariationId =
      isPositive === metric.higherIsBetter ? nonDefaultVariation.variationId : defaultVariation.variationId
  }

  return {
    analysisStrategy,
    decision,
    chosenVariationId,
    statisticallySignificant,
    practicallySignificant,
  }
}

/**
 * Takes an array of aggregateRecommendations using different strategies, and returns an aggregateRecommendation over them.
 * Checks for recommendation conflicts - currently different chosenVariationIds - and returns manual analysis required decision.
 */
export function getAggregateMetricAssignmentRecommendation(
  aggregateRecommendations: AggregateRecommendation[],
  targetAnalysisStrategy: AnalysisStrategy,
): AggregateRecommendation {
  const targetAnalysisRecommendation = aggregateRecommendations.find(
    (aggregateRecommendation) => aggregateRecommendation.analysisStrategy === targetAnalysisStrategy,
  )
  if (!targetAnalysisRecommendation) {
    return {
      analysisStrategy: targetAnalysisStrategy,
      decision: AggregateRecommendationDecision.MissingAnalysis,
    }
  }

  // There is a conflict if there are different chosenVariationIds:
  if (1 < new Set(aggregateRecommendations.map((x) => x.chosenVariationId).filter((x) => x)).size) {
    return {
      ...targetAnalysisRecommendation,
      decision: AggregateRecommendationDecision.ManualAnalysisRequired,
      chosenVariationId: undefined,
    }
  }

  return targetAnalysisRecommendation
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

const contactUsRecommendation = 'Contact @experiment-review.'
const highSpammerRecommendation =
  'Spammers are filtered out of the displayed metrics, but high numbers may be indicative of problems.'

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
            recommendation: `Check daily ratio patterns for anomalies, contact @experiment-review.`,
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
      value: minVariationProbabilities.assignedNoSpammersNoCrossoversDistributionMatchingAllocated,
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
            recommendation: `If not in combination with a "Assignment distribution" issue, contact @experiment-review.`,
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
    const biasedExposuresRecommendation = `If not in combination with other distribution issues, exposure event being fired is linked to variation causing bias. Choose a different exposure event or use assignment analysis (contact @experiment-review to do so).`
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
            recommendation: 'Continue monitoring experiment.',
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
    // See Kruschke's Precision as a goal for data collection: https://www.youtube.com/playlist?list=PL_mlm7M63Y7j641Y7QJG3TfSxeZMGOsQ4
    {
      name: 'Kruschke uncertainty (CI to ROPE ratio)',
      value: diffCiWidth / ropeWidth,
      unit: HealthIndicatorUnit.Ratio,
      link: 'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#kruschke-uncertainty',
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
            recommendation: `High uncertainty. Be careful about drawing conclusions. Collect more data to reduce uncertainty.`,
          },
        },
        {
          max: Infinity,
          indication: {
            code: HealthIndicationCode.VeryHigh,
            severity: HealthIndicationSeverity.Warning,
            recommendation: `Very high uncertainty. Be careful about drawing conclusions. Collect more data to reduce uncertainty.`,
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
      name: 'Experiment run time',
      value: Experiments.getExperimentRunHours(experiment) / 24,
      unit: HealthIndicatorUnit.Days,
      link: 'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#experiment-run-time',
      indicationBrackets: [
        {
          max: 3,
          indication: {
            code: HealthIndicationCode.VeryLow,
            severity: HealthIndicationSeverity.Warning,
            recommendation: 'Experiments should generally run for at least a week before drawing conclusions.',
          },
        },
        {
          max: 7,
          indication: {
            code: HealthIndicationCode.Low,
            severity: HealthIndicationSeverity.Warning,
            recommendation: 'Experiments should generally run for at least a week before drawing conclusions.',
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
          max: 42,
          indication: {
            code: HealthIndicationCode.High,
            severity: HealthIndicationSeverity.Warning,
            recommendation: 'Experiment has been running for a long time. Consider stopping it soon.',
          },
        },
        {
          max: Infinity,
          indication: {
            code: HealthIndicationCode.VeryHigh,
            severity: HealthIndicationSeverity.Warning,
            recommendation: 'Experiment has been running for way too long. Stopping it now is highly recommended.',
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
 * Takes an B/A ratio and returns the difference ratio: (B-A)/A
 */
export function ratioToDifferenceRatio(ratio: number): number {
  return ratio - 1
}
