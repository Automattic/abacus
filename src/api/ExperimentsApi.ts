import _ from 'lodash'
import * as yup from 'yup'

import {
  ExperimentBare,
  ExperimentFull,
  ExperimentFullNew,
  experimentFullNewOutboundSchema,
  experimentFullNewSchema,
  experimentFullSchema,
  experimentSummaryResponse,
  MetricAssignmentNew,
  metricAssignmentNewOutboundSchema,
  metricAssignmentNewSchema,
  Status,
  yupPick,
} from '@/lib/schemas'
import { isDebugMode } from '@/utils/general'

import { fetchApi } from './utils'

/**
 * Attempts to create a new experiment.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function create(newExperiment: ExperimentFullNew): Promise<ExperimentFull> {
  const validatedNewExperiment = await experimentFullNewSchema.validate(newExperiment, { abortEarly: false })
  const outboundNewExperiment = experimentFullNewOutboundSchema.cast(validatedNewExperiment)
  return await experimentFullSchema.validate(await fetchApi('POST', '/experiments', outboundNewExperiment))
}

/**
 * Attempts to PUT an experiment, overwriting the existing experiment.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function put(experimentId: number, experiment: ExperimentFullNew): Promise<ExperimentFull> {
  const validatedExperiment = await experimentFullNewSchema.validate(experiment, { abortEarly: false })
  const outboundExperiment = experimentFullNewOutboundSchema.cast(validatedExperiment)
  return await experimentFullSchema.validate(await fetchApi('PUT', `/experiments/${experimentId}`, outboundExperiment))
}

/**
 * Attempts to patch an experiment.
 *
 * Doesn't work with nested fields.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function patch(experimentId: number, experimentPatch: Partial<ExperimentFull>): Promise<ExperimentFull> {
  // We dynamically construct a schema for validation, but we do this simply and shallowly
  const dynamicValidationSchema = yupPick(experimentFullSchema, Object.keys(experimentPatch))
  const validatedExperimentPatch = await dynamicValidationSchema.validate(experimentPatch, { abortEarly: false })

  // Similarly we dynamically construct a schema for outbound casting
  const dynamicOutboundCastSchema = yupPick(experimentFullSchema, Object.keys(experimentPatch)).snakeCase()
  const outboundExperimentPatch = dynamicOutboundCastSchema.cast(validatedExperimentPatch)

  return await experimentFullSchema.validate(
    await fetchApi('PATCH', `/experiments/${experimentId}`, outboundExperimentPatch),
  )
}

async function changeStatus(experimentId: number, status: Status): Promise<void> {
  await fetchApi('PUT', `/experiments/${experimentId}/status`, { status })
}

/**
 * Attempts to assign a metric to an experiment.
 *
 * Metric Assignment is a bit funky right now, so we do it here.
 * In particular it require passing in all existing metricAssignments.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @param experiment A full experiment object, needed to fill in the existing metricAssignments, will be removed in the future.
 * @param metricAssignment The new metricAssignment.
 */
async function assignMetric(
  experiment: ExperimentFull,
  metricAssignment: MetricAssignmentNew,
): Promise<ExperimentFull> {
  const validatedMetricAssignment = await metricAssignmentNewSchema.validate(metricAssignment)
  const outboundMetricAssignment = metricAssignmentNewOutboundSchema.cast(validatedMetricAssignment)

  // The backend replaces all the metricAssignments, so we format it as metricAssignmentNewOutbound.
  const outboundExistingMetricAssignments = yup
    .array(metricAssignmentNewOutboundSchema)
    .cast(experiment.metricAssignments.map((metricAssignment) => _.omit(metricAssignment, 'metricAssignmentId')))
  // istanbul ignore next; Shouldn't occur
  if (!outboundExistingMetricAssignments) {
    throw new Error('Something went wrong while transforming existing metricAssignments to outbound form.')
  }

  const metricAssignments = [...outboundExistingMetricAssignments, outboundMetricAssignment]

  return await experimentFullSchema.validate(
    await fetchApi('PATCH', `/experiments/${experiment.experimentId}`, {
      metric_assignments: metricAssignments,
    }),
  )
}

/**
 * Finds all the available experiments.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findAll(): Promise<ExperimentBare[]> {
  // istanbul ignore next; debug only
  const { experiments } = await experimentSummaryResponse.validate(
    await fetchApi('GET', isDebugMode() ? '/experiments?debug=true' : '/experiments'),
    { abortEarly: false },
  )
  return experiments
}

/**
 * Fetches the experiment with full details.
 *
 * @param id - The ID of the experiment to fetch.
 */
async function findById(id: number): Promise<ExperimentFull> {
  return await experimentFullSchema.validate(await fetchApi('GET', `/experiments/${id}`), { abortEarly: false })
}

const ExperimentsApi = {
  create,
  put,
  patch,
  assignMetric,
  changeStatus,
  findAll,
  findById,
}

export default ExperimentsApi
