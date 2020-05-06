import { Event, MetricRevenueParams } from './index'

export interface Metric {
  /**
   * Globally-unique metric ID.
   */
  readonly metricId: number

  /**
   * Globally-unique metric name.
   */
  name: string

  /**
   * Human-friendly description of what the metric intends to measure.
   */
  description: string

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

  revenueParams: MetricRevenueParams | null
}
