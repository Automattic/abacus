import * as yup from 'yup'

import {
  ExperimentBare,
  experimentBareSchema,
  ExperimentFull,
  ExperimentFullNew,
  experimentFullNewOutboundSchema,
  experimentFullNewSchema,
  experimentFullSchema,
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
 * Attempts to patch an experiment.
 *
 * Doesn't work with nested fields.
 *
 * TODO: Implement Patching Metric Assignments
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
  patch,
  findAll,
  findById,
}

export default ExperimentsApi
