import parseISO from 'date-fns/fp/parseISO'

import { ApiData } from '@/api/ApiData'

class Recommendation {
  constructor(
    public readonly endExperiment: boolean,
    public readonly chosenVariationId: number | null,
    public readonly reason: RecommendationReason,
    public readonly warnings: Array<RecommendationWarning>,
  ) {}

  static fromApiData(apiData: ApiData) {
    return new this(
      apiData.end_experiment,
      apiData.chosen_variation_id,
      apiData.reason as RecommendationReason,
      apiData.warnings.map((warning: string) => warning as RecommendationWarning),
    )
  }
}

class MetricEstimate {
  constructor(public readonly estimate: number, public readonly bottom: number, public readonly top: number) {}

  static fromApiData(apiData: ApiData) {
    return new this(apiData.estimate, apiData.bottom, apiData.top)
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
    public readonly analysisDatetime: Date,
    public readonly participantStats: { [key: string]: number },
    public readonly metricEstimates?: { [key: string]: MetricEstimate } | null,
    public readonly recommendation?: Recommendation | null,
  ) {}

  static fromApiData(apiData: ApiData) {
    return new this(
      apiData.metric_assignment_id,
      apiData.analysis_strategy as AnalysisStrategy,
      parseISO(apiData.analysis_datetime),
      apiData.participant_stats,
      apiData.metric_estimates.map((rawMetricEstimate: ApiData) => MetricEstimate.fromApiData(rawMetricEstimate)),
      Recommendation.fromApiData(apiData.recommendation),
    )
  }
}
