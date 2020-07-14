import * as yup from 'yup'

import {
  ExperimentBare,
  experimentBareSchema,
  experimentCreateSchema,
  ExperimentFull,
  experimentFullSchema,
} from '@/lib/schemas'

import { fetchApi } from './utils'

/**
 * Attempts to create a new experiment.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function create(experiment: Partial<ExperimentFull>) {
  return await experimentFullSchema.validate(
    await fetchApi('POST', '/experiments', await experimentCreateSchema.validate(experiment)),
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
  const { experiments } = await fetchApi('GET', '/experiments')
  return await yup.array(experimentBareSchema).defined().validate(experiments)
}

/**
 * Fetches the experiment with full details.
 *
 * @param id - The ID of the experiment to fetch.
 */
async function findById(id: number): Promise<ExperimentFull> {
  return await experimentFullSchema.validate(await fetchApi('GET', `/experiments/${id}`))
}

const ExperimentsApi = {
  create,
  findAll,
  findById,
}

export default ExperimentsApi
