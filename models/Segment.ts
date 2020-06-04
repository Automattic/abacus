import { ApiData } from '@/api/ApiData'

/**
 * A segment of users, e.g., grouped by geolocation. Used to constrain an
 * experiment to one or more segments.
 */
export class Segment {
  /**
   * Globally-unique segment ID.
   */
  public readonly segmentId: number

  /**
   * Globally-unique segment name.
   */
  public readonly name: string

  /**
   * Type of segment.
   */
  public readonly type: SegmentType

  /**
   * Constructs a new segment.
   */
  constructor(data: Readonly<Segment>) {
    Object.assign(this, data)
  }

  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData) {
    return new Segment({
      segmentId: apiData.segment_id,
      name: apiData.name,
      type: apiData.type as SegmentType,
    })
  }
}

export enum SegmentType {
  Country = 'country',
  Locale = 'locale',
}
