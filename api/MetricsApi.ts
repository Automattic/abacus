import _ from 'lodash'

import { MetricBare, MetricFull } from '@/models'

import { ApiData } from './ApiData'
import { fetchApi } from './utils'

interface MetricCacheEntry {
  cachedAt: Date
  metric: MetricFull
}

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000

class MetricsCache {
  private cacheById: { [key: number]: MetricCacheEntry } = {}

  get(metricId: number) {
    let metric = null
    const entry = this.cacheById[metricId]
    if (entry) {
      const { cachedAt } = entry
      const age = Date.now() - cachedAt.getTime()
      /* istanbul ignore else; not going to wait for expiration of cache during automated testing */
      if (age < FIVE_MINUTES_IN_MS) {
        metric = entry.metric
      }
    }

    return metric
  }

  // invalidate(metricId?: number) {
  //   if (typeof metricId === 'number') {
  //     delete this.cacheById[metricId]
  //   } else {
  //     this.cacheById = {}
  //   }
  // }

  put(metric: MetricFull) {
    this.cacheById[metric.metricId] = { cachedAt: new Date(), metric }
  }
}

const cache = new MetricsCache()

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
 * Finds all the metrics by ID.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findById(metricIds: number[]): Promise<MetricFull[]> {
  const cachedMetrics = metricIds.map((metricId) => cache.get(metricId)).filter(Boolean) as MetricFull[]
  const cachedMetricIds = cachedMetrics.map((metric) => metric.metricId).filter(Boolean)
  const toFetchMetricIds = _.difference(metricIds, cachedMetricIds)

  const metrics = await Promise.all(
    toFetchMetricIds.map((metricId) =>
      fetchApi('GET', `/metrics/${metricId}`).then((apiData) => MetricFull.fromApiData(apiData)),
    ),
  )

  metrics.forEach((metric) => cache.put(metric))

  return [...metrics, ...cachedMetrics]
}

const MetricsApi = {
  findAll,
  findById,
}

export default MetricsApi
