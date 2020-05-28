import parseISO from 'date-fns/fp/parseISO'

import { ApiData } from '@/api/ApiData'

import { Platform, Status } from './index'

export interface ExperimentBareData {
  experimentId?: number
  name: string
  startDatetime: Date
  endDatetime: Date
  status: Status
  platform: Platform
  ownerLogin: string
}

export class ExperimentBare {
  static fromApiData(apiData: ApiData) {
    return new this({
      experimentId: apiData.experiment_id,
      name: apiData.name,
      startDatetime: parseISO(apiData.start_datetime),
      endDatetime: parseISO(apiData.end_datetime),
      status: apiData.status as Status,
      platform: apiData.platform as Platform,
      ownerLogin: apiData.owner_login,
    })
  }

  /**
   * Unique experiment ID.
   */
  readonly experimentId?: number

  /**
   * Name of the experiment.
   */
  name: string

  /**
   * Start date of the experiment. For new experiments, the date must be in the
   * future to accommodate forward planning of experiments.
   */
  startDatetime: Date

  /**
   * End date of the experiment. This value must be greater than `start_datetime`.
   * The server may impose a limited difference between `end_datetime` and
   * `start_datetime` to ensure that experiments don't run for too long.
   */
  endDatetime: Date

  status: Status

  platform: Platform

  /**
   * The login name of the experiment owner.
   */
  ownerLogin: string

  constructor(data: ExperimentBareData) {
    this.experimentId = data.experimentId
    this.name = data.name
    this.startDatetime = data.startDatetime
    this.endDatetime = data.endDatetime
    this.status = data.status
    this.platform = data.platform
    this.ownerLogin = data.ownerLogin
  }
}
