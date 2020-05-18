import { ApiData } from '@/api/ApiData'

export class MetricBare {
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

  constructor(apiData: ApiData) {
    this.metricId = apiData.metric_id
    this.name = apiData.name
    this.description = apiData.description
  }
}
