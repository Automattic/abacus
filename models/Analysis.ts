import parseISO from 'date-fns/fp/parseISO'

import { ApiData } from '@/api/ApiData'

/**
 * An analysis recommendation.
 */
class Recommendation {
  /**
   * @param endExperiment A boolean value indicating whether the experiment should end (based only on the raw data and
   *        ignoring any warnings).
   * @param chosenVariationId The ID of the variation that should be implemented if the experiment should end.
   *        This field is `null` if the experiment should continue running.
   * @param reason The reason for the recommendation. See `RecommendationReason`.
   * @param warnings An array of string warnings. See `RecommendationWarning`.
   */
  // istanbul ignore next (skip coverage for auto-generated constructor)
  constructor(
    public readonly endExperiment: boolean,
    public readonly chosenVariationId: number | null,
    public readonly reason: RecommendationReason,
    public readonly warnings: Array<RecommendationWarning>,
  ) {}

  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData): Recommendation {
    return {
      endExperiment: apiData.end_experiment,
      chosenVariationId: apiData.chosen_variation_id,
      reason: apiData.reason as RecommendationReason,
      warnings: apiData.warnings.map((warning: string) => warning as RecommendationWarning),
    }
  }
}

/**
 * Probabilistic estimate of a metric value.
 */
class MetricEstimate {
  /**
   * @param estimate Point estimate for the metric value.
   * @param bottom Bottom bound of the 95% credible interval.
   * @param top Top bound of the 95% credible interval.
   */
  // istanbul ignore next (skip coverage for auto-generated constructor)
  constructor(public readonly estimate: number, public readonly bottom: number, public readonly top: number) {}
}

/**
 * The strategy used for the analysis. One of the following:
 *  - `itt_pure`: Pure intention-to-treat -- all participants are analysed based on their initial variation assignment.
 *  - `mitt_no_spammers`: Modified intention-to-treat -- same as `itt_pure`, but excluding spammers that were
 *     flagged on the analysis datetime.
 *  - `mitt_no_crossovers`: Modified intention-to-treat -- same as `itt_pure`, but excluding participants that were
 *     assigned to multiple experiment variations before `analysis_datetime` (aka crossovers).
 *  - `mitt_no_spammers_no_crossovers`: Modified intention-to-treat -- same as `itt_pure`, but excluding both spammers
 *     and crossovers.
 *  - `pp_naive`: Naive per-protocol -- only participants that triggered one of the experiment's exposure events,
 *     excluding both spammers and crossovers.
 */
export enum AnalysisStrategy {
  IttPure = 'itt_pure',
  MittNoSpammers = 'mitt_no_spammers',
  MittNoCrossovers = 'mitt_no_crossovers',
  MittNoSpammersNoCrossovers = 'mitt_no_spammers_no_crossovers',
  PpNaive = 'pp_naive',
}

/**
 * The reason for the recommendation, describing the relationship between the credible interval (CI) and the region of
 * practical equivalence to zero (ROPE).
 */
export enum RecommendationReason {
  CiInRope = 'ci_in_rope',
  CiGreaterThanRope = 'ci_greater_than_rope',
  CiLessThanRope = 'ci_less_than_rope',
  CiRopePartlyOverlap = 'ci_rope_partly_overlap',
  RopeInCi = 'rope_in_ci',
}

/**
 * Warnings that may be added to a recommendation.
 *  - `short_period`: The experiment period is too short to draw a conclusion.
 *  - `long_period`: The experiment period is too long. It may be time to stop it.
 *  - `wide_ci`: The CI is too wide in comparison to the ROPE. If possible, it's best to collect more data.
 */
export enum RecommendationWarning {
  ShortPeriod = 'short_period',
  LongPeriod = 'long_period',
  WideCi = 'wide_ci',
}

/**
 * A single analysis instance. Typically, an experiment will have multiple analyses: One for each metric assignment,
 * analysis strategy, and analysis day.
 */
export class Analysis {
  /**
   * @param metricAssignmentId The metric assignment that this analysis is for.
   * @param analysisStrategy The strategy used for the analysis. See `AnalysisStrategy`.
   * @param participantStats Mapping from 'total', 'not_final', and 'variation_<id>' value to participant counts.
   * @param metricEstimates Mapping from 'diff' and 'variation_<id>' values to `MetricEstimate` objects.
   * @param recommendation Recommendation how to proceed based on the analysis. See `Recommendation`.
   * @param analysisDatetime Timestamp of the analysis.
   */
  // istanbul ignore next (skip coverage for auto-generated constructor)
  constructor(
    public readonly metricAssignmentId: number,
    public readonly analysisStrategy: AnalysisStrategy,
    public readonly participantStats: { [key: string]: number },
    public readonly metricEstimates: { [key: string]: MetricEstimate } | null,
    public readonly recommendation: Recommendation | null,
    public readonly analysisDatetime: Date,
  ) {}

  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData): Analysis {
    return {
      metricAssignmentId: apiData.metric_assignment_id,
      analysisStrategy: apiData.analysis_strategy as AnalysisStrategy,
      participantStats: apiData.participant_stats,
      // No need to use fromApiData() on the metric estimates since they're already in camelCase (single word keys).
      metricEstimates: apiData.metric_estimates,
      recommendation: apiData.recommendation ? Recommendation.fromApiData(apiData.recommendation) : null,
      analysisDatetime: parseISO(apiData.analysis_datetime),
    }
  }
}
