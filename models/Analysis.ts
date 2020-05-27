import parseISO from 'date-fns/fp/parseISO'

import { ApiData } from '@/api/ApiData'

// TODO: add docs
class Recommendation {
  constructor(
    public readonly endExperiment: boolean,
    public readonly chosenVariationId: number | null,
    public readonly reason: RecommendationReason,
    public readonly warnings: Array<RecommendationWarning>,
  ) {}

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
  constructor(public readonly estimate: number, public readonly bottom: number, public readonly top: number) {}

  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData): MetricEstimate {
    return apiData as MetricEstimate
  }
}

export enum AnalysisStrategy {
  IttPure = 'itt_pure',
  MittNoSpammers = 'mitt_no_spammers',
  MittNoCrossovers = 'mitt_no_crossovers',
  MittNoSpammersNoCrossovers = 'mitt_no_spammers_no_crossovers',
  PpNaive = 'pp_naive',
}

export enum RecommendationReason {
  CiInRope = 'ci_in_rope',
  CiGreaterThanRope = 'ci_greater_than_rope',
  CiLessThanRope = 'ci_less_than_rope',
  CiRopePartlyOverlap = 'ci_rope_partly_overlap',
  RopeInCi = 'rope_in_ci',
}

export enum RecommendationWarning {
  ShortPeriod = 'short_period',
  LongPeriod = 'long_period',
  WideCi = 'wide_ci',
}

export class Analysis {
  constructor(
    public readonly metricAssignmentId: number,
    public readonly analysisStrategy: AnalysisStrategy,
    public readonly participantStats: { [key: string]: number },
    public readonly metricEstimates: { [key: string]: MetricEstimate } | null,
    public readonly recommendation: Recommendation | null,
    public readonly analysisDatetime: Date,
  ) {}

  static fromApiData(apiData: ApiData): Analysis {
    return {
      metricAssignmentId: apiData.metric_assignment_id,
      analysisStrategy: apiData.analysis_strategy as AnalysisStrategy,
      participantStats: apiData.participant_stats,
      metricEstimates: apiData.metric_estimates.map((rawMetricEstimate: ApiData) =>
        MetricEstimate.fromApiData(rawMetricEstimate),
      ),
      recommendation: Recommendation.fromApiData(apiData.recommendation),
      analysisDatetime: parseISO(apiData.analysis_datetime),
    }
  }
}
