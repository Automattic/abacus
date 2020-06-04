import { Segment, SegmentType } from './Segment'

describe('models/Segment.ts module', () => {
  describe('Segment', () => {
    describe('fromApiData', () => {
      it('called with valid API data should create a new `Segment` instance', () => {
        const segment = Segment.fromApiData({
          segment_id: 123,
          name: 'Example Segment',
          type: 'country',
        })
        expect(segment).toEqual({
          segmentId: 123,
          name: 'Example Segment',
          type: SegmentType.Country,
        })
      })
    })
  })
})
