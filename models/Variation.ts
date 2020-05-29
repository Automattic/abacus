/**
 * An experiment variation. Unlike segments and metrics, variations can't exist
 * without an associated experiment.
 */
export interface Variation {
  /**
   * Globally-unique variation ID.
   */
  readonly variationId?: number

  /**
   * ID of the experiment this variation is assigned to.
   */
  readonly experimentId?: number

  /**
   * Globally-unique variation name.
   */
  name: string

  /**
   * Whether this variation is the default one to fall back to when the experiment
   * is disabled.
   */
  isDefault: boolean

  /**
   * Percentage of traffic to allocate to this variation.
   */
  allocatedPercentage: number
}
