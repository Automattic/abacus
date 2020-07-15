import * as yup from 'yup'

import { MetricBare, metricBareSchema, MetricFull, metricFullSchema } from '@/lib/schemas'

import { fetchApi } from './utils'

/**
 * Finds all the available metrics.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findAll(): Promise<MetricBare[]> {
  const { metrics } = await fetchApi('GET', '/metrics')
  return await yup.array(metricBareSchema).defined().validate(metrics, { abortEarly: false })
}

/**
 * Find the metric by ID.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findById(metricId: number): Promise<MetricFull> {
  const metric = await fetchApi('GET', `/metrics/${metricId}`)
  return await metricFullSchema.validate(metric, { abortEarly: false })
}

const MetricsApi = {
  findAll,
  findById,
}

export default MetricsApi
