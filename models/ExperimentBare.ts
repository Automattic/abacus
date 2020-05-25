import parseISO from 'date-fns/fp/parseISO'

import { ApiData } from '@/api/ApiData'

import { Platform, Status } from './index'

const TIME_AND_TZ_INFO_RE = /T?\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}(?::\d{2})?)?/

function stripTimeAndTzInfo(dateStr: string) {
  return dateStr.replace(TIME_AND_TZ_INFO_RE, '')
}

export class ExperimentBare {
  /**
   * Unique experiment ID.
   */
  readonly experimentId: number

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

  constructor(apiData: ApiData) {
    this.experimentId = apiData.experiment_id
    this.name = apiData.name
    this.startDatetime =
      apiData.start_datetime instanceof Date
        ? apiData.start_datetime
        : parseISO(stripTimeAndTzInfo(apiData.start_datetime))
    this.endDatetime =
      apiData.end_datetime instanceof Date ? apiData.end_datetime : parseISO(stripTimeAndTzInfo(apiData.end_datetime))
    this.status = apiData.status as Status
    this.platform = apiData.platform as Platform
    this.ownerLogin = apiData.owner_login
  }
}
