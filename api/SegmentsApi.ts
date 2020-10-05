import { Segment, segmentResponseSchema } from '@/lib/schemas'

import { fetchApi } from './utils'

/**
 * Finds all the available segments.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findAll(): Promise<Segment[]> {
  const { segments } = await segmentResponseSchema.validate(await fetchApi('GET', '/segments'), { abortEarly: false })
  return segments
}

const SegmentsApi = {
  findAll,
}

export default SegmentsApi
