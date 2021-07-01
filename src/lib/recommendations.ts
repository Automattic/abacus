import { Analysis, AnalysisStrategy, ExperimentFull, Metric, MetricAssignment, Variation } from './schemas'

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

export enum Decision {
  ManualAnalysisRequired = 'ManualAnalysisRequired',
  MissingAnalysis = 'MissingAnalysis',
  Inconclusive = 'Inconclusive',
  DeployAnyVariation = 'DeployAnyVariation',
  DeployChosenVariation = 'DeployChosenVariation',
}

export interface Recommendation {
  analysisStrategy: AnalysisStrategy
  decision: Decision
  chosenVariationId?: number
  statisticallySignificant?: boolean
  practicallySignificant?: PracticalSignificanceStatus
}

const PracticalSignificanceStatusToDecision: Record<PracticalSignificanceStatus, Decision> = {
  [PracticalSignificanceStatus.No]: Decision.DeployAnyVariation,
  [PracticalSignificanceStatus.Uncertain]: Decision.Inconclusive,
  [PracticalSignificanceStatus.Yes]: Decision.DeployChosenVariation,
}

/**
 * Returns the recommendation for a single analysis.
 *
 * See file-level recommendation documentation.
 */
export function getMetricAssignmentRecommendation(
  experiment: ExperimentFull,
  metric: Metric,
  analysis: Analysis,
): Recommendation {
  const metricAssignment = experiment.metricAssignments.find(
    (metricAssignment) => metricAssignment.metricAssignmentId === analysis.metricAssignmentId,
  )
  const diffCredibleIntervalStats =
    analysis && metricAssignment && getDiffCredibleIntervalStats(analysis, metricAssignment)
  const analysisStrategy = analysis.analysisStrategy
  if (!analysis.metricEstimates || !metricAssignment || !diffCredibleIntervalStats) {
    return {
      analysisStrategy,
      decision: Decision.MissingAnalysis,
    }
  }

  const { practicallySignificant, statisticallySignificant, isPositive } = diffCredibleIntervalStats
  const decision = PracticalSignificanceStatusToDecision[practicallySignificant]
  const defaultVariation = experiment.variations.find((variation) => variation.isDefault) as Variation
  const nonDefaultVariation = experiment.variations.find((variation) => !variation.isDefault) as Variation
  let chosenVariationId = undefined
  if (decision === Decision.DeployChosenVariation) {
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
 * Takes an array of recommendations using different strategies, and returns an recommendation over them.
 * Checks for recommendation conflicts - currently different chosenVariationIds - and returns manual analysis required decision.
 */
export function getAggregateMetricAssignmentRecommendation(
  recommendations: Recommendation[],
  targetAnalysisStrategy: AnalysisStrategy,
): Recommendation {
  const targetAnalysisRecommendation = recommendations.find(
    (recommendation) => recommendation.analysisStrategy === targetAnalysisStrategy,
  )
  if (!targetAnalysisRecommendation) {
    return {
      analysisStrategy: targetAnalysisStrategy,
      decision: Decision.MissingAnalysis,
    }
  }

  // There is a conflict if there are different chosenVariationIds:
  if (1 < new Set(recommendations.map((x) => x.chosenVariationId).filter((x) => x)).size) {
    return {
      ...targetAnalysisRecommendation,
      decision: Decision.ManualAnalysisRequired,
      chosenVariationId: undefined,
    }
  }

  return targetAnalysisRecommendation
}
