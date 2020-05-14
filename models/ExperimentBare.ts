import parseISO from 'date-fns/fp/parseISO'

import { ApiData } from '@/api/ApiData'

import { toPlatform, toStatus } from '@/models/index'

import { Platform, Status } from './index'

export interface ExperimentBare {
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
}

export function fromApiDataToBare(apiData: ApiData) {
  return {
    endDatetime: parseISO(apiData.end_datetime),
    experimentId: apiData.experiment_id,
    name: apiData.name,
    platform: toPlatform(apiData.platform),
    ownerLogin: apiData.owner_login,
    startDatetime: parseISO(apiData.start_datetime),
    status: toStatus(apiData.status),
  }
}
