import _ from 'lodash'
import * as yup from 'yup'

import {
  MetricBare,
  metricBareSchema,
  MetricFull,
  MetricFullNew,
  metricFullNewOutboundSchema,
  metricFullNewSchema,
  metricFullSchema,
} from '@/lib/schemas'

import { fetchApi } from './utils'

/**
 * Attempts to create a new metric.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function create(newMetric: MetricFullNew) {
  const validatedNewMetric = await metricFullNewSchema.validate(newMetric, { abortEarly: false })
  const outboundNewMetric = metricFullNewOutboundSchema.cast(validatedNewMetric)
  const returnedMetric = await fetchApi('POST', '/metrics', outboundNewMetric)
  return await metricFullSchema.validate(returnedMetric)
}

/**
 * Attempts to put a new metric.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function put(metricId: number, newMetric: MetricFullNew) {
  // istanbul ignore next; Shouldn't happen
  if (!_.isNumber(metricId)) {
    throw new Error('Invalid metricId.')
  }
  const validatedNewMetric = await metricFullNewSchema.validate(newMetric, { abortEarly: false })
  const outboundNewMetric = metricFullNewOutboundSchema.cast(validatedNewMetric)
  const returnedMetric = await fetchApi('PUT', `/metrics/${metricId}`, outboundNewMetric)
  return await metricFullSchema.validate(returnedMetric)
}

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
  create,
  put,
  findAll,
  findById,
}

export default MetricsApi
