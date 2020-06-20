import { ApiData } from '@/api/ApiData'

import { Segment, SegmentType } from './Segment'

/**
 * An assignment of a segment to an experiment.
 */
export class SegmentAssignment {
  /**
   * Globally-unique assignment ID.
   */
  public readonly segmentAssignmentId?: number

  /**
   * ID of the experiment the segment is assigned to.
   */
  public readonly experimentId?: number

  /**
   * ID of the segment assigned to the experiment.
   */
  public readonly segmentId: number

  /**
   * If `true`, users in this segment should be excluded from the experiment.
   */
  public readonly isExcluded: boolean

  /**
   * Construct a new segment assignment.
   */
  constructor(data: Readonly<SegmentAssignment>) {
    Object.assign(this, data)
  }

  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData) {
    return new SegmentAssignment({
      segmentAssignmentId: apiData.segment_assignment_id,
      experimentId: apiData.experiment_id,
      segmentId: apiData.segment_id,
      isExcluded: apiData.is_excluded,
    })
  }
}

/**
 * An segment assignment with the segment resolved.
 */
export class ResolvedSegmentAssignment {
  /**
   * Globally-unique assignment ID.
   */
  public readonly segmentAssignmentId?: number

  /**
   * ID of the experiment the segment is assigned to.
   */
  public readonly experimentId?: number

  /**
   * The segment assigned to the experiment.
   */
  public readonly segment: Segment

  /**
   * If `true`, users in this segment should be excluded from the experiment.
   */
  public readonly isExcluded: boolean

  /**
   * Construct a new segment assignment.
   */
  constructor(data: Readonly<ResolvedSegmentAssignment>) {
    Object.assign(this, data)
  }

  static resolve(segmentAssignments: SegmentAssignment[], segments: Segment[]) {
    return segmentAssignments
      .map((segmentAssignment) => {
        const segment = segments.find((segment) => segment.segmentId === segmentAssignment.segmentId)
        if (segment) {
          return new ResolvedSegmentAssignment({
            segmentAssignmentId: segmentAssignment.segmentAssignmentId,
            experimentId: segmentAssignment.experimentId,
            segment,
            isExcluded: segmentAssignment.isExcluded,
          })
        } else {
          console.error(`Unable to lookup segment with ID ${segmentAssignment.segmentId}.`)
        }
        return null
      })
      .filter(Boolean)
  }

  static groupByType(resolvedSegmentAssignments: ResolvedSegmentAssignment[]) {
    const resolvedSegmentAssignmentsByType: {
      [SegmentType.Country]: ResolvedSegmentAssignment[]
      [SegmentType.Locale]: ResolvedSegmentAssignment[]
    } = {
      [SegmentType.Country]: [],
      [SegmentType.Locale]: [],
    }
    resolvedSegmentAssignments.forEach((resolvedSegmentAssignment) => {
      resolvedSegmentAssignmentsByType[resolvedSegmentAssignment.segment.type].push(resolvedSegmentAssignment)
    })
    return resolvedSegmentAssignmentsByType
  }
}
