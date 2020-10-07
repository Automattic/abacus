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
import { isDebugMode } from '@/utils/general'

import { fetchApi } from './utils'

/**
 * Attempts to create a new metric.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function create(newMetric: MetricFullNew): Promise<MetricFull> {
  const validatedNewMetric = await metricFullNewSchema.validate(newMetric, { abortEarly: false })
  const outboundNewMetric = metricFullNewOutboundSchema.cast(validatedNewMetric)
  return await metricFullSchema.validate(await fetchApi('POST', '/metrics', outboundNewMetric))
}

/**
 * Attempts to put a new metric.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function put(metricId: number, newMetric: MetricFullNew): Promise<MetricFull> {
  // istanbul ignore next; Shouldn't happen
  if (!_.isNumber(metricId)) {
    throw new Error('Invalid metricId.')
  }
  const validatedNewMetric = await metricFullNewSchema.validate(newMetric, { abortEarly: false })
  const outboundNewMetric = metricFullNewOutboundSchema.cast(validatedNewMetric)
  return await metricFullSchema.validate(await fetchApi('PUT', `/metrics/${metricId}`, outboundNewMetric))
}

/**
 * Finds all the available metrics.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findAll(): Promise<MetricBare[]> {
  // istanbul ignore next; debug only
  const { metrics } = await yup
    .object({ metrics: yup.array(metricBareSchema).defined() })
    .defined()
    .validate(await fetchApi('GET', isDebugMode() ? '/metrics?debug=true' : '/metrics'), {
      abortEarly: false,
    })
  return metrics
}

/**
 * Find the metric by ID.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findById(metricId: number): Promise<MetricFull> {
  return await metricFullSchema.validate(await fetchApi('GET', `/metrics/${metricId}`), { abortEarly: false })
}

const MetricsApi = {
  create,
  put,
  findAll,
  findById,
}

export default MetricsApi
