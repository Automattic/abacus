import { ValidationError } from 'yup'

import SegmentsApi from '@/api/SegmentsApi'

describe('SegmentsApi.ts module', () => {
  describe('findAll', () => {
    it('should return a set of segments with the expected segment shape', async () => {
      try {
        const segments = await SegmentsApi.findAll()
        expect(segments.length).toBeGreaterThan(0)
      } catch (e) {
        if (e instanceof ValidationError) {
          expect(e.errors).toEqual([])
        }
        throw e
      }
    })
  })
})
