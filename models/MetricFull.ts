import { ApiData } from '@/api/ApiData'

import { Event, MetricBare, MetricRevenueParams } from './index'

export class MetricFull extends MetricBare {
  /**
   * If `true`, then higher values of the metric are considered better. For
   * example, if the metric event measures signups, this should be `true`. If the
   * event measures refunds, it should be `false`.
   */
  public readonly higherIsBetter: boolean

  /**
   * Events that capture metric conversion. If `null`, then `revenue_params` must
   * be given.
   */
  public readonly eventParams: Array<Event> | null

  /**
   * Parameters for a revenue query. If `null`, then `event_params` must be given.
   */
  public readonly revenueParams: MetricRevenueParams | null

  /**
   * Constructs a new metric.
   */
  constructor(data: Readonly<MetricFull>) {
    super(data)
  }

  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData) {
    return new MetricFull({
      metricId: apiData.metric_id,
      name: apiData.name,
      description: apiData.description,
      higherIsBetter: apiData.higher_is_better,
      eventParams: apiData.event_params
        ? apiData.event_params.map((rawEvent: ApiData) => Event.fromApiData(rawEvent))
        : null,
      revenueParams: apiData.revenue_params ? MetricRevenueParams.fromApiData(apiData.revenue_params) : null,
      // TODO: Once MetricBare API is extended to include `parameterType`, determine
      // whether to calculate or use data from API (assuming `parameterType` is added
      // to MetricFull too).
      parameterType: apiData.revenue_params ? 'revenue' : 'conversion',
    })
  }
}
