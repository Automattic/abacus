import SegmentsApi from '@/api/SegmentsApi'
import { SegmentType } from '@/models'

const SEGMENT_TYPES = Object.values(SegmentType)

describe('SegmentsApi.ts module', () => {
  describe('findAll', () => {
    it('should return a set of segments with the expected segment shape', async () => {
      const segments = await SegmentsApi.findAll()
      expect(segments).toBeDefined()
      expect(Array.isArray(segments)).toBe(true)
      expect(segments.length).toBeGreaterThan(0)
      segments.forEach((segment) => {
        expect(typeof segment.segmentId).toBe('number')
        expect(typeof segment.name).toBe('string')
        expect(SEGMENT_TYPES.includes(segment.type)).toBe(true)
      })
    })
  })
})
