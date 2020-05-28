import { ApiData } from './ApiData'

export interface ApiDataSource {
  toApiData: () => ApiData
}
