import NotFoundError from 'src/api/NotFoundError'
import TagsApi from 'src/api/TagsApi'
import { tagFullNewOutboundSchema } from 'src/lib/schemas'
import Fixtures from 'src/test-helpers/fixtures'
import { validationErrorDisplayer } from 'src/test-helpers/test-utils'

describe('TagsApi.ts module', () => {
  describe('outbound form', () => {
    it(`should transform a tag into an outbound form`, () => {
      expect(tagFullNewOutboundSchema.cast(Fixtures.createTagFull(1))).toEqual({
        description: 'This is tag 1',
        tag_id: 1,
        name: 'tag_1',
        namespace: 'tag_namespace_1',
      })

      expect(tagFullNewOutboundSchema.cast(Fixtures.createTagFull(2))).toEqual({
        description: 'This is tag 2',
        tag_id: 2,
        name: 'tag_2',
        namespace: 'tag_namespace_2',
      })
    })
  })

  describe('create', () => {
    it(`should create a new tag`, async () => {
      const returnedTag = await validationErrorDisplayer(TagsApi.create(Fixtures.createTagFull(1)))
      expect(returnedTag.tagId).toBeGreaterThan(0)
    })
  })

  describe('put', () => {
    it(`should put a tag`, async () => {
      const returnedTag = await validationErrorDisplayer(TagsApi.put(1, Fixtures.createTagFull(1)))
      expect(returnedTag.tagId).toBeGreaterThan(0)
    })
  })

  describe('findAll', () => {
    it('should return a set of tags with the expected tag shape', async () => {
      const tags = await validationErrorDisplayer(TagsApi.findAll())
      expect(tags.length).toBeGreaterThan(0)
    })
  })

  describe('findById', () => {
    it('should return the tag with the expected tag shape', async () => {
      const tag = await validationErrorDisplayer(TagsApi.findById(31))
      expect(tag.tagId).toBeGreaterThan(0)
    })

    // TODO: Unskip this once the mock API stops returning the mock tag regardless
    // of the given ID. Also, remove the `instanbul ignore` comment from NotFoundError
    // and in `api/utils.ts` above the `if (response.status === 404)`.
    it.skip('called with an unknown tag ID should throw a NotFoundError', async () => {
      try {
        await TagsApi.findById(0)
        expect(false).toBe(true) // This should never be reached.
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError)
      }
    })
  })
})
