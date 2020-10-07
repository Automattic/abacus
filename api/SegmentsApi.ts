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
  const { segments } = await yup
    .object({ segments: yup.array(segmentSchema).defined() })
    .defined()
    .validate(await fetchApi('GET', '/segments'), { abortEarly: false })
  return segments
}

const SegmentsApi = {
  findAll,
}

export default SegmentsApi
