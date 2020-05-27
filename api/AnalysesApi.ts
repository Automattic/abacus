import { Analysis } from '@/models'

import { ApiData } from './ApiData'
import { fetchApi } from './utils'

/**
 * Finds all the available analyses for the given experimentId.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findByExperimentId(experimentId: number): Promise<Analysis[]> {
  const apiResults = await fetchApi('GET', '/analyses/' + experimentId)
  return apiResults.analyses.map((apiData: ApiData) => Analysis.fromApiData(apiData))
}

const AnalysesApi = {
  findByExperimentId,
}

export default AnalysesApi
