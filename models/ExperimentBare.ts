import parseISO from 'date-fns/fp/parseISO'

import { ApiData } from '@/api/ApiData'

import { Platform, Status } from './index'

/**
 * An experiment summary.
 */
export class ExperimentBare {
  /**
   * Unique experiment ID.
   */
  public readonly experimentId: number

  /**
   * Name of the experiment.
   */
  public readonly name: string

  /**
   * Start date of the experiment. For new experiments, the date must be in the
   * future to accommodate forward planning of experiments.
   */
  public readonly startDatetime: Date

  /**
   * End date of the experiment. This value must be greater than `start_datetime`.
   * The server may impose a limited difference between `end_datetime` and
   * `start_datetime` to ensure that experiments don't run for too long.
   */
  public readonly endDatetime: Date

  public readonly status: Status

  public readonly platform: Platform

  /**
   * The login name of the experiment owner.
   */
  public readonly ownerLogin: string

  /**
   * Constructs a new experiment.
   */
  constructor(data: Readonly<ExperimentBare>) {
    Object.assign(this, data)
  }

  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData) {
    return new ExperimentBare({
      experimentId: apiData.experiment_id,
      name: apiData.name,
      startDatetime: parseISO(apiData.start_datetime),
      endDatetime: parseISO(apiData.end_datetime),
      status: apiData.status as Status,
      platform: apiData.platform as Platform,
      ownerLogin: apiData.owner_login,
    })
  }
}
