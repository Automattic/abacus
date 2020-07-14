import * as yup from 'yup'

import { Segment, segmentSchema } from '@/lib/schemas'

import { fetchApi } from './utils'

/**
 * Finds all the available segments.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findAll(): Promise<Segment[]> {
  const { segments } = await fetchApi('GET', '/segments')
  return await yup.array(segmentSchema).defined().validate(segments, { abortEarly: false })
}

const SegmentsApi = {
  findAll,
}

export default SegmentsApi
