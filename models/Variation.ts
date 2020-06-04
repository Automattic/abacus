/**
 * An experiment variation. Unlike segments and metrics, variations can't exist
 * without an associated experiment.
 */
export class Variation {
  /**
   * Globally-unique variation ID.
   */
  public readonly variationId?: number

  /**
   * ID of the experiment this variation is assigned to.
   */
  public readonly experimentId?: number

  /**
   * Globally-unique variation name.
   */
  public readonly name: string

  /**
   * Whether this variation is the default one to fall back to when the experiment
   * is disabled.
   */
  public readonly isDefault: boolean

  /**
   * Percentage of traffic to allocate to this variation.
   */
  public readonly allocatedPercentage: number

  /**
   * Construct a new variation.
   */
  constructor(data: Readonly<Variation>) {
    Object.assign(this, data)
  }
}
