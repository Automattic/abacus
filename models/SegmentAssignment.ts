import { ApiData } from '@/api/ApiData'

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
