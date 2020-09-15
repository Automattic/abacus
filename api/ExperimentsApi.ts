import _ from 'lodash'
import * as yup from 'yup'

import {
  ExperimentBare,
  experimentBareSchema,
  ExperimentFull,
  ExperimentFullNew,
  experimentFullNewOutboundSchema,
  experimentFullNewSchema,
  experimentFullSchema,
  MetricAssignmentNew,
  metricAssignmentNewOutboundSchema,
  metricAssignmentNewSchema,
  Status,
  yupPick,
} from '@/lib/schemas'

import { fetchApi } from './utils'

/**
 * Attempts to create a new experiment.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function create(newExperiment: ExperimentFullNew) {
  const validatedNewExperiment = await experimentFullNewSchema.validate(newExperiment, { abortEarly: false })
  const outboundNewExperiment = experimentFullNewOutboundSchema.cast(validatedNewExperiment)
  const returnedExperiment = await fetchApi('POST', '/experiments', outboundNewExperiment)
  return await experimentFullSchema.validate(returnedExperiment)
}

/**
 * Attempts to PUT an experiment, overwriting the existing experiment.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function put(experimentId: number, experiment: ExperimentFullNew) {
  const validatedExperiment = await experimentFullNewSchema.validate(experiment, { abortEarly: false })
  const outboundExperiment = experimentFullNewOutboundSchema.cast(validatedExperiment)
  const returnedExperiment = await fetchApi('PUT', `/experiments/${experimentId}`, outboundExperiment)
  return await experimentFullSchema.validate(returnedExperiment)
}

/**
 * Attempts to patch an experiment.
 *
 * Doesn't work with nested fields.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function patch(experimentId: number, experimentPatch: Partial<ExperimentFull>) {
  // We dynamically construct a schema for validation, but we do this simply and shallowly
  const dynamicValidationSchema = yupPick(experimentFullSchema, Object.keys(experimentPatch))
  const validatedExperimentPatch = await dynamicValidationSchema.validate(experimentPatch, { abortEarly: false })

  // Similarly we dynamically construct a schema for outbound casting
  const dynamicOutboundCastSchema = yupPick(experimentFullSchema, Object.keys(experimentPatch)).snakeCase()
  const outboundExperimentPatch = dynamicOutboundCastSchema.cast(validatedExperimentPatch)

  const returnedExperiment = await fetchApi('PATCH', `/experiments/${experimentId}`, outboundExperimentPatch)
  return await experimentFullSchema.validate(returnedExperiment)
}

async function changeStatus(experimentId: number, status: Status) {
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
async function assignMetric(experiment: ExperimentFull, metricAssignment: MetricAssignmentNew) {
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

  const returnedExperiment = await fetchApi('PATCH', `/experiments/${experiment.experimentId}`, {
    metric_assignments: metricAssignments,
  })
  return await experimentFullSchema.validate(returnedExperiment)
}

/**
 * Finds all the available experiments.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findAll(): Promise<ExperimentBare[]> {
  const { experiments } = await fetchApi('GET', '/experiments')
  return await yup.array(experimentBareSchema).defined().validate(experiments, { abortEarly: false })
}

/**
 * Fetches the experiment with full details.
 *
 * @param id - The ID of the experiment to fetch.
 */
async function findById(id: number): Promise<ExperimentFull> {
  const experiment = await fetchApi('GET', `/experiments/${id}`)
  return await experimentFullSchema.validate(experiment, { abortEarly: false })
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
