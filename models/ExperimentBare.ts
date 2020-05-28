import parseISO from 'date-fns/fp/parseISO'

import { ApiData } from '@/api/ApiData'

import { Platform, Status } from './index'

/**
 * An experiment with select data.
 */
export class ExperimentBare {
  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData) {
    return {
      experimentId: apiData.experiment_id,
      name: apiData.name,
      startDatetime: parseISO(apiData.start_datetime),
      endDatetime: parseISO(apiData.end_datetime),
      status: apiData.status as Status,
      platform: apiData.platform as Platform,
      ownerLogin: apiData.owner_login,
    }
  }

  /**
   * @param experimentId - Unique experiment ID.
   * @param name - Name of the experiment.
   * @param startDatetime - Start date of the experiment. For new experiments, the
   *   date must be in the future to accommodate forward planning of experiments.
   * @param endDatetime - End date of the experiment. This value must be greater than
   *   `start_datetime`. The server may impose a limited difference between\
   *   `end_datetime` and `start_datetime` to ensure that experiments don't run for
   *   too long.
   * @param status -
   * @param platform -
   * @param ownerLogin - The login name of the experiment owner.
   */
  constructor(
    public readonly experimentId: number | null,
    public readonly name: string,
    public readonly startDatetime: Date,
    public readonly endDatetime: Date,
    public readonly status: Status,
    public readonly platform: Platform,
    public readonly ownerLogin: string,
  ) {}
}
