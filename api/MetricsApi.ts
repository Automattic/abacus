import { MetricBare, MetricFull } from '@/models'

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

/**
 * Find the metric by ID.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findById(metricId: number): Promise<MetricFull> {
  return MetricFull.fromApiData(await fetchApi('GET', `/metrics/${metricId}`))
}

const MetricsApi = {
  findAll,
  findById,
}

export default MetricsApi
