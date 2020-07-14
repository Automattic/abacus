import * as yup from 'yup'

import { Analysis, analysisSchema } from '@/lib/schemas'

import { fetchApi } from './utils'

/**
 * Finds all the available analyses for the given experimentId.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findByExperimentId(experimentId: number): Promise<Analysis[]> {
  const { analyses } = await fetchApi('GET', `/analyses/${experimentId}`)
  return await yup.array(analysisSchema).defined().validate(analyses, { abortEarly: false })
}

const AnalysesApi = {
  findByExperimentId,
}

export default AnalysesApi
