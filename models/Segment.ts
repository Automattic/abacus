/**
 * A segment of users, e.g., grouped by geolocation. Used to constrain an
 * experiment to one or more segments.
 */
export interface Segment {
  /**
   * Globally-unique segment ID.
   */
  readonly segmentId: number

  /**
   * Globally-unique segment name.
   */
  name: string

  /**
   * Type of segment.
   */
  type: SegmentTypeEnum
}

export enum SegmentTypeEnum {
  Country = 'country',
  Locale = 'locale',
}
