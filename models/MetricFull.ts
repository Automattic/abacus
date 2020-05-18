import { ApiData } from '@/api/ApiData'

import { Event, MetricBare, MetricRevenueParams, MetricRevenueParamsTransactionTypesEnum } from './index'

export class MetricFull extends MetricBare {
  /**
   * If `true`, then higher values of the metric are considered better. For
   * example, if the metric event measures signups, this should be `true`. If the
   * event measures refunds, it should be `false`.
   */
  higherIsBetter: boolean

  /**
   * Events that capture metric conversion. If `null`, then `revenue_params` must
   * be given.
   */
  eventParams: Array<Event> | null

  /**
   * Parameters for a revenue query. If `null`, then `event_params` must be given.
   */
  revenueParams: MetricRevenueParams | null

  constructor(apiData: ApiData) {
    super(apiData)
    this.higherIsBetter = apiData.higher_is_better
    if (apiData.event_params) {
      this.eventParams = apiData.event_params.map((eventParam: ApiData) => ({
        event: eventParam.event,
        props: eventParam.props,
      }))
    } else {
      this.eventParams = null
    }
    if (apiData.revenue_params) {
      this.revenueParams = {
        refundDays: apiData.revenue_params.refund_days,
        productSlugs: apiData.revenue_params.product_slugs,
        transactionTypes: apiData.revenue_params.transaction_types.map(
          (transactionType: string) => transactionType as MetricRevenueParamsTransactionTypesEnum,
        ),
      }
    } else {
      this.revenueParams = null
    }
  }
}
