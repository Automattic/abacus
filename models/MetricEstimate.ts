/**
 * Probabilistic estimate of a metric value.
 */
export interface MetricEstimate {
  /**
   * Point estimate for the metric value.
   */
  estimate: number

  /**
   * Bottom bound of the 95% credible interval.
   */
  bottom: number

  /**
   * Top bound of the 95% credible interval.
   */
  top: number
}
