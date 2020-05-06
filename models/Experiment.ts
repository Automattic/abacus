import { Event, MetricAssignment, Platform, SegmentAssignment, Status, Variation } from './index'

export interface Experiment {
  /**
   * Unique experiment ID.
   */
  readonly experimentId: number

  /**
   * Name of the experiment.
   */
  name: string

  /**
   * Start date of the experiment. For new experiments, the date must be in the
   * future to accommodate forward planning of experiments.
   */
  startDatetime: Date

  /**
   * End date of the experiment. This value must be greater than `start_datetime`.
   * The server may impose a limited difference between `end_datetime` and
   * `start_datetime` to ensure that experiments don't run for too long.
   */
  endDatetime: Date

  status: Status

  platform: Platform

  /**
   * The login name of the experiment owner.
   */
  ownerLogin: string

  /**
   * Additional context for running the experiment. This may include initial
   * research, experiment background, hypotheses, etc.
   */
  description: string

  /**
   * If true, include users that signed up before the experiment. Otherwise, run the
   * experiment only on new users.
   */
  existingUsersAllowed: boolean

  /**
   * Link to the experiment announcement/discussion post.
   */
  p2Url: string

  /**
   * Events that capture exposure to the experiment. If `null`, only
   * intention-to-treat analysis and its modifications are possible. Otherwise, this
   * field is used for per-protocol analysis of the experiment.
   */
  exposureEvents?: Array<Event> | null

  /**
   * Variations that experiment participants may see. Constraints:
   * - Each experiment must have exactly two variations.
   * - Exactly one of the experiment variations must have its
   *   `is_default` attribute set to `true`.
   * - The sum of the variations' `allocated_percentage` values
   *   must be between 2 and 100.
   */
  variations: Array<Variation>

  /**
   * Metrics that are assigned to this experiment. May be empty.
   */
  metricAssignments: Array<MetricAssignment>

  /**
   * Segments that are assigned to this experiment. May be empty.
   */
  segmentAssignments: Array<SegmentAssignment>

  /**
   * An explanation or reason why the experiment ended.
   */
  endReason?: string | null

  /**
   * Link to a comment/post that describes the experiment conclusion and future
   * action items. This should be populated within a reasonable time from
   * `end_datetime`.
   */
  conclusionUrl?: string | null

  /**
   * The variation ID that was deployed once the experiment concluded.
   */
  deployedVariationId?: number | null
}
