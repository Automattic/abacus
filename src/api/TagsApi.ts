import _ from 'lodash'
import * as yup from 'yup'

import { Tag, TagNew, tagNewOutboundSchema, tagNewSchema, tagSchema } from 'src/lib/schemas'
import { isDebugMode } from 'src/utils/general'

import { fetchApi } from './utils'

/**
 * Attempts to create a new tag.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function create(newTag: TagNew): Promise<Tag> {
  const validatedNewTag = await tagNewSchema.validate(newTag, { abortEarly: false })
  const outboundNewTag = tagNewOutboundSchema.cast(validatedNewTag)
  return await tagSchema.validate(await fetchApi('POST', '/tags', outboundNewTag))
}

/**
 * Attempts to put a new tag.
 *
 * Note: Be sure to handle any errors that may be thrown.
 */
async function put(tagId: number, newTag: TagNew): Promise<Tag> {
  // istanbul ignore next; Shouldn't happen
  if (!_.isNumber(tagId)) {
    throw new Error('Invalid tagId.')
  }
  const validatedNewTag = await tagNewSchema.validate(newTag, { abortEarly: false })
  const outboundNewTag = tagNewOutboundSchema.cast(validatedNewTag)
  return await tagSchema.validate(await fetchApi('PUT', `/tags/${tagId}`, outboundNewTag))
}

/**
 * Finds all the available tags.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findAll(): Promise<Tag[]> {
  // istanbul ignore next; debug only
  const { tags } = await yup
    .object({ tags: yup.array(tagSchema).defined() })
    .defined()
    .validate(await fetchApi('GET', isDebugMode() ? '/tags?debug=true' : '/tags'), {
      abortEarly: false,
    })
  return tags
}

/**
 * Find the tag by ID.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findById(tagId: number): Promise<Tag> {
  return await tagSchema.validate(await fetchApi('GET', `/tags/${tagId}`), { abortEarly: false })
}

const TagsApi = {
  create,
  put,
  findAll,
  findById,
}

export default TagsApi
