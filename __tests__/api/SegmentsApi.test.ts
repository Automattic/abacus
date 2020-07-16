import SegmentsApi from '@/api/SegmentsApi'
import { validationErrorDisplayer } from '@/helpers/test-utils'

describe('SegmentsApi.ts module', () => {
  describe('findAll', () => {
    it('should return a set of segments with the expected segment shape', async () => {
      const segments = await validationErrorDisplayer(SegmentsApi.findAll())
      expect(segments.length).toBeGreaterThan(0)
    })
  })
})
