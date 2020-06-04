import { MetricBare } from '@/models'

import { ApiData } from './ApiData'
import { fetchApi } from './utils'

/**
 * Finds all the available metrics.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findAll(): Promise<MetricBare[]> {
  return (await fetchApi('GET', '/metrics')).metrics.map((apiData: ApiData) => MetricBare.fromApiData(apiData))
}

const MetricsApi = {
  findAll,
}

export default MetricsApi
