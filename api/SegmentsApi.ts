import { Segment } from '@/models/index'

import { ApiData } from './ApiData'
import { fetchApi } from './utils'

/**
 * Finds all the available segments.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findAll(): Promise<Segment[]> {
  return (await fetchApi('GET', '/segments')).segments.map((apiData: ApiData) => Segment.fromApiData(apiData))
}

const SegmentsApi = {
  findAll,
}

export default SegmentsApi
