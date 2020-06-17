import { ApiData } from '@/api/ApiData'

/**
 * An assignment of a metric to an experiment.
 */
export class MetricAssignment {
  /**
   * Globally-unique assignment ID.
   */
  public readonly metricAssignmentId?: number

  /**
   * ID of the experiment the metric is assigned to.
   */
  public readonly experimentId?: number

  /**
   * ID of the metric assigned to the experiment.
   */
  public readonly metricId: number

  /**
   * `true` if this metric is the primary metric for `experiment_id`. An experiment
   * must have exactly one primary metric before it is allowed to run.
   */
  public readonly isPrimary: boolean

  /**
   * The minimum difference in the metric value between experiment variations that is
   * considered non-negligible for the purposes of the experiment.
   */
  public readonly minDifference: number

  /**
   * The maximum time in seconds a participant has between the start and end of the
   * attribution window. The start of the attribution window depends on the analysis
   * strategy – it may either be the time the participant was assigned to the
   * experiment or the time of one of the experiment's `exposure_events`. The end of
   * the attribution window is `attribution_window_seconds` after the start of the
   * window. For conversion metrics (`event_params` isn't `null`), only conversion
   * events that occur within the attribution window are considered. For revenue
   * metrics (`revenue_params` isn't `null`), only transactions that occur within the
   * attribution window are counted.
   */
  public readonly attributionWindowSeconds: AttributionWindowSeconds

  /**
   * If true, the experimenter expects changes to the metric value with respect to experiment variations. There may be cases where we do not expect the metric value to change. For example, an A/A experiment will have `change_expected` set to `false` for all the assigned metrics. Even when metrics like revenue are better when higher, this property may be set to false because we do not expect the revenue to change between the experiment variations.
   */
  public readonly changeExpected: boolean

  /**
   * Construct a new metric assignment.
   */
  constructor(data: Readonly<MetricAssignment>) {
    Object.assign(this, data)
  }

  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData) {
    return new MetricAssignment({
      attributionWindowSeconds: apiData.attribution_window_seconds as AttributionWindowSeconds,
      changeExpected: apiData.change_expected,
      experimentId: apiData.experiment_id,
      isPrimary: apiData.is_primary,
      metricAssignmentId: apiData.metric_assignment_id,
      metricId: apiData.metric_id,
      minDifference: apiData.min_difference,
    })
  }
}

export enum AttributionWindowSeconds {
  OneHour = 3600,
  SixHours = 21600,
  TwelveHours = 43200,
  TwentyFourHours = 86400,
  ThreeDays = 259200,
  OneWeek = 604800,
  TwoWeeks = 1209600,
  ThreeWeeks = 1814400,
  FourWeeks = 2419200,
}

/**
 * Mapping from AttributionWindowSeconds to human-friendly descriptions.
 */
export const AttributionWindowSecondsToHuman = {
  [AttributionWindowSeconds.OneHour]: '1 hour',
  [AttributionWindowSeconds.SixHours]: '6 hours',
  [AttributionWindowSeconds.TwelveHours]: '12 hours',
  [AttributionWindowSeconds.TwentyFourHours]: '24 hours',
  [AttributionWindowSeconds.ThreeDays]: '3 days',
  [AttributionWindowSeconds.OneWeek]: '1 week',
  [AttributionWindowSeconds.TwoWeeks]: '2 weeks',
  [AttributionWindowSeconds.ThreeWeeks]: '3 weeks',
  [AttributionWindowSeconds.FourWeeks]: '4 weeks',
}
