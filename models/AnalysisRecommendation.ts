import { ApiData } from '@/api/ApiData'

export class AnalysisRecommendation {
  // /**
  //  * A boolean value indicating whether the experiment should end (based only on the raw data and ignoring any
  //  * warnings).
  //  */
  // endExperiment: boolean;
  //
  // /**
  //  * The ID of the variation that should be implemented if the experiment should end. This field is `null` if the
  //  * experiment should continue running.
  //  */
  // chosenVariationId: number | null;
  //
  // /**
  //  * The reason for the recommendation as a string that describes the relationship between the credible interval (CI)
  //  * and the region of practical equivalence to zero (ROPE).
  //  */
  // reason: AnalysisRecommendationReason;
  //
  // /**
  //  * An array of warnings (may be empty).
  //  */
  // warnings: Array<AnalysisRecommendationWarning>;

  constructor(
    public readonly endExperiment: boolean,
    public readonly chosenVariationId: number | null,
    public readonly reason: AnalysisRecommendationReason,
    public readonly warnings: Array<AnalysisRecommendationWarning>,
  ) {}

  static fromApiData(apiData: ApiData) {
    return new this(apiData.end_experiment, apiData.chosen_variation_id, apiData.reason, apiData.warnings)
  }
}

export enum AnalysisRecommendationReason {
  CiInRope = 'ci_in_rope',
  CiGreaterThanRope = 'ci_greater_than_rope',
  CiLessThanRope = 'ci_less_than_rope',
  CiRopePartlyOverlap = 'ci_rope_partly_overlap',
  RopeInCi = 'rope_in_ci',
}

export enum AnalysisRecommendationWarning {
  /**
   * The experiment period is too short to draw a conclusion.
   */
  ShortPeriod = 'short_period',

  /**
   * The experiment period is too long. It may be time to stop it.
   */
  LongPeriod = 'long_period',

  /**
   * The CI is too wide in comparison to the ROPE. If possible, it's best to collect more data.
   */
  WideCi = 'wide_ci',
}
