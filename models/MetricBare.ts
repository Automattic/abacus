import { ApiData } from '@/api/ApiData'

export class MetricBare {
  /**
   * Globally-unique metric ID.
   */
  public readonly metricId: number

  /**
   * Globally-unique metric name.
   */
  public readonly name: string

  /**
   * Human-friendly description of what the metric intends to measure.
   */
  public readonly description: string

  /**
   * Type of parameters of this metric.
   */
  public readonly parameterType: 'conversion' | 'revenue'

  /**
   * Constructs a new metric.
   */
  constructor(data: Readonly<MetricBare>) {
    Object.assign(this, data)
  }

  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData) {
    return new MetricBare({
      metricId: apiData.metric_id,
      name: apiData.name,
      description: apiData.description,
      parameterType: 'revenue', // TODO: Get this from the API. Be sure to update the unit test if necessary.
    })
  }
}
