import * as yup from 'yup'

import {
  ExperimentBare,
  experimentBareSchema,
  ExperimentFull,
  ExperimentFullNew,
  experimentFullNewSchema,
  experimentFullSchema,
} from '@/lib/schemas'

import { fetchApi } from './utils'

/**
 * Attempts to create a new experiment.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function create(newExperiment: ExperimentFullNew) {
  const validatedNewExperiment = await experimentFullNewSchema.validate(newExperiment, { abortEarly: false })
  const experiment = await fetchApi('POST', '/experiments', validatedNewExperiment)
  return await experimentFullSchema.validate(experiment)
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
  findAll,
  findById,
}

export default ExperimentsApi
