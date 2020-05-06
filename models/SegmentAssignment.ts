import { Segment } from './index'

/**
 * An assignment of a segment to an experiment.
 */
export interface SegmentAssignment {
  /**
   * Globally-unique assignment ID.
   */
  readonly segmentAssignmentId: number

  /**
   * ID of the experiment the segment is assigned to.
   */
  readonly experimentId: number

  /**
   * ID of the segment assigned to the experiment.
   */
  segmentId: number

  segment: Segment

  /**
   * If `true`, users in this segment should be excluded from the experiment.
   */
  isExcluded: boolean
}
