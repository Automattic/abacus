import { ApiData } from './ApiData'

/**
 * An object/class that implements this interface indicates that it is a source
 * of API data.
 */
export interface ApiDataSource {
  toApiData: () => ApiData
}
