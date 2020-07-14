import SegmentsApi from '@/api/SegmentsApi'

describe('SegmentsApi.ts module', () => {
  describe('findAll', () => {
    it('should return a set of segments with the expected segment shape', async () => {
      await SegmentsApi.findAll()
    })
  })
})
