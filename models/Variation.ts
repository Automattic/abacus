import { ApiData } from '@/api/ApiData'

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

  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData) {
    return new Variation({
      allocatedPercentage: apiData.allocated_percentage,
      experimentId: apiData.experiment_id,
      isDefault: apiData.is_default,
      name: apiData.name,
      variationId: apiData.variation_id,
    })
  }
}
