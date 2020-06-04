import { ApiData } from '@/api/ApiData'

import { Event, MetricBare, MetricRevenueParams, MetricRevenueParamsTransactionTypesEnum } from './index'

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
    let eventParams = null
    if (apiData.event_params) {
      eventParams = apiData.event_params.map((eventParam: ApiData) => ({
        event: eventParam.event,
        props: eventParam.props,
      }))
    }

    let revenueParams = null
    if (apiData.revenue_params) {
      revenueParams = {
        refundDays: apiData.revenue_params.refund_days,
        productSlugs: apiData.revenue_params.product_slugs,
        transactionTypes: apiData.revenue_params.transaction_types.map(
          (transactionType: string) => transactionType as MetricRevenueParamsTransactionTypesEnum,
        ),
      }
    }

    return new MetricFull({
      metricId: apiData.metric_id,
      name: apiData.name,
      description: apiData.description,
      higherIsBetter: apiData.higher_is_better,
      eventParams,
      revenueParams,
    })
  }
}
