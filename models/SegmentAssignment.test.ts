import Fixtures from '@/helpers/fixtures'

import { Segment, SegmentType } from './Segment'
import { ResolvedSegmentAssignment, SegmentAssignment } from './SegmentAssignment'

describe('models/SegmentAssignment.ts module', () => {
  describe('ResolvedSegmentAssignment', () => {
    describe('resolve', () => {
      beforeEach(() => {
        console.error = jest.fn()
      })

      it('called with a resolvable segment assignment will be resolved', () => {
        const segmentAssignments = [
          new SegmentAssignment({
            segmentAssignmentId: 20,
            experimentId: 10,
            segmentId: 1,
            isExcluded: false,
          }),
        ]
        const segments = Fixtures.createSegments(5)
        const resolvedSegmentAssignments = ResolvedSegmentAssignment.resolve(segmentAssignments, segments)
        expect(resolvedSegmentAssignments).toEqual([
          new ResolvedSegmentAssignment({
            segmentAssignmentId: 20,
            experimentId: 10,
            segment: new Segment({ segmentId: 1, name: 'segment_1', type: SegmentType.Locale }),
            isExcluded: false,
          }),
        ])
      })

      it('called without a resolvable segment assignment will not be resolved', () => {
        const segmentAssignments = [
          new SegmentAssignment({
            segmentAssignmentId: 20,
            experimentId: 10,
            segmentId: 6,
            isExcluded: false,
          }),
        ]
        const segments = Fixtures.createSegments(5)
        const resolvedSegmentAssignments = ResolvedSegmentAssignment.resolve(segmentAssignments, segments)
        expect(resolvedSegmentAssignments).toEqual([])
        expect(console.error).toBeCalled()
      })
    })

    describe('groupByType', () => {
      const segments = Fixtures.createSegments(5)
      const resolvedSegmentAssignment1 = new ResolvedSegmentAssignment({
        segmentAssignmentId: 1,
        experimentId: 10,
        segment: segments[0],
        isExcluded: false,
      })
      const resolvedSegmentAssignment2 = new ResolvedSegmentAssignment({
        segmentAssignmentId: 2,
        experimentId: 10,
        segment: segments[1],
        isExcluded: false,
      })
      const resolvedSegmentAssignment3 = new ResolvedSegmentAssignment({
        segmentAssignmentId: 3,
        experimentId: 10,
        segment: segments[2],
        isExcluded: false,
      })
      const resolvedSegmentAssignment4 = new ResolvedSegmentAssignment({
        segmentAssignmentId: 4,
        experimentId: 10,
        segment: segments[3],
        isExcluded: true,
      })
      const resolvedSegmentAssignment5 = new ResolvedSegmentAssignment({
        segmentAssignmentId: 5,
        experimentId: 10,
        segment: segments[4],
        isExcluded: true,
      })

      const resolvedSegmentAssignments = [
        resolvedSegmentAssignment1,
        resolvedSegmentAssignment2,
        resolvedSegmentAssignment3,
        resolvedSegmentAssignment4,
        resolvedSegmentAssignment5,
      ]
      const groupedByType = ResolvedSegmentAssignment.groupByType(resolvedSegmentAssignments)
      const groupedByCountry = groupedByType[SegmentType.Country]
      expect(groupedByCountry).toEqual([
        resolvedSegmentAssignment1,
        resolvedSegmentAssignment3,
        resolvedSegmentAssignment5,
      ])
      const groupedByLocale = groupedByType[SegmentType.Locale]
      expect(groupedByLocale).toEqual([resolvedSegmentAssignment2, resolvedSegmentAssignment4])
    })
  })
})
