/* eslint-disable @typescript-eslint/ban-ts-ignore */
// This is temporary for the WIP,

import { ExperimentBare, ExperimentFull, experimentFullSchema } from '@/models'

import { ApiData } from './ApiData'
import { fetchApi } from './utils'

/**
 * Attempts to create a new experiment.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function create(experiment: ExperimentFull) {
  return ExperimentFull.fromApiData(await fetchApi('POST', '/experiments', experiment))
}

/**
 * Finds all the available experiments.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findAll(): Promise<ExperimentBare[]> {
  return (await fetchApi('GET', '/experiments')).experiments.map((apiData: ApiData) =>
    ExperimentBare.fromApiData(apiData),
  )
}

/**
 * Fetches the experiment with full details.
 *
 * @param id - The ID of the experiment to fetch.
 */
async function findById(id: number): Promise<ExperimentFull> {
  // @ts-ignore: Temporary for the WIP PR, the inferred type perfectly matches the Interface except for the methods
  return await experimentFullSchema.validate(await fetchApi('GET', `/experiments/${id}`))
}

const ExperimentsApi = {
  create,
  findAll,
  findById,
}

export default ExperimentsApi
