import parseISO from 'date-fns/fp/parseISO'

import { ApiData } from '@/api/ApiData'

import { Platform, Status } from './index'

export class ExperimentBare {
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
