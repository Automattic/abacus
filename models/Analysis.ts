export class Analysis {
  /**
   * The metric assignment that this analysis is for.
   * @type {number}
   * @memberof Analysis
   */
  metricAssignmentId: number

  /**
   * The strategy used for the analysis. One of the following:
   *   * `itt_pure`: Pure intention-to-treat &ndash; all participants are
   *     analysed based on their initial variation assignment.
   *   * `mitt_no_spammers`: Modified intention-to-treat &ndash; same as
   *     `itt_pure`, but excluding spammers that were flagged on
   *     `analysis_datetime`.
   *   * `mitt_no_crossovers`: Modified intention-to-treat &ndash; same
   *     as `itt_pure`, but excluding participants that were assigned to
   *     multiple experiment variations before `analysis_datetime` (aka
   *     crossovers).
   *   * `mitt_no_spammers_no_crossovers`: Modified intention-to-treat
   *     &ndash; same as `itt_pure`, but excluding both spammers and
   *     crossovers.
   *   * `pp_naive`: Naive per-protocol &ndash; only participants that
   *     triggered one of the experiment's `exposure_events`, excluding
   *     both spammers and crossovers. This analysis strategy is only
   *     followed if `exposure_events` isn't null, while the other four
   *     strategies are used for every experiment.
   * @type {string}
   * @memberof Analysis
   */
  analysisStrategy: AnalysisStrategy

  /**
   *
   * @type {{ [key: string]: number; }}
   * @memberof Analysis
   */
  participantStats: { [key: string]: number }

  /**
   *
   * @type {{ [key: string]: MetricEstimate & AnyType; }}
   * @memberof Analysis
   */
  metricEstimates?: { [key: string]: MetricEstimate & AnyType } | null

  /**
   *
   * @type {AnalysisRecommendation}
   * @memberof Analysis
   */

  recommendation?: AnalysisRecommendation | null

  /**
   * Timestamp of the analysis. Each metric assignment is expected to have multiple `analysis_datetime` entries, with a new analysis row produced for each metric assignment on a daily basis. For consistency across metrics and analyses, the `analysis_datetime` is set to midnight of the day on which the analysis ran.
   * @type {Date}
   * @memberof Analysis
   */
  analysisDatetime: Date
}

/**
 * @export
 * @enum {string}
 */
export enum AnalysisStrategy {
  IttPure = 'itt_pure',
  MittNoSpammers = 'mitt_no_spammers',
  MittNoCrossovers = 'mitt_no_crossovers',
  MittNoSpammersNoCrossovers = 'mitt_no_spammers_no_crossovers',
  PpNaive = 'pp_naive',
}
