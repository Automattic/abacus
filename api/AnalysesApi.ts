import { Analysis, analysisResponseSchema } from '@/lib/schemas'

import { fetchApi } from './utils'

/**
 * Finds all the available analyses for the given experimentId.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findByExperimentId(experimentId: number): Promise<Analysis[]> {
  const { analyses } = await analysisResponseSchema.validate(await fetchApi('GET', `/analyses/${experimentId}`), {
    abortEarly: false,
  })
  return analyses
}

const AnalysesApi = {
  findByExperimentId,
}

export default AnalysesApi
