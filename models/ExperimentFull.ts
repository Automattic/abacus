import { ApiData } from '@/api/ApiData'

import {
  ExperimentBare,
  Event,
  MetricAssignment,
  MetricAssignmentAttributionWindowSecondsEnum,
  SegmentAssignment,
  Variation,
} from './index'

export class ExperimentFull extends ExperimentBare {
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

  constructor(apiData: ApiData) {
    super(apiData)
    this.conclusionUrl = apiData.conclusion_url || null
    this.deployedVariationId = apiData.deployed_variation_id || null
    this.description = apiData.description
    this.endReason = apiData.end_reason || null
    this.existingUsersAllowed = apiData.existing_users_allowed
    this.exposureEvents = Array.isArray(apiData.exposure_events)
      ? apiData.exposure_events.map((exposureEvent: ApiData) => ({
          event: exposureEvent.event,
          props: exposureEvent.props,
        }))
      : null
    this.metricAssignments = apiData.metric_assignments.map((metricAssignments: ApiData) => ({
      attributionWindowSeconds: metricAssignments.attribution_window_seconds as MetricAssignmentAttributionWindowSecondsEnum,
      changeExpected: metricAssignments.change_expected,
      experimentId: metricAssignments.experiment_id,
      isPrimary: metricAssignments.is_primary,
      metricAssignmentId: metricAssignments.metric_assignment_id,
      metricId: metricAssignments.metric_id,
      minDifference: metricAssignments.min_difference,
    }))
    this.p2Url = apiData.p2_url
    this.segmentAssignments = apiData.segment_assignments.map((segmentAssignments: ApiData) => ({
      segmentAssignmentId: segmentAssignments.segment_assignment_id,
      experimentId: segmentAssignments.experiment_id,
      segmentId: segmentAssignments.segment_id,
      isExcluded: segmentAssignments.is_excluded,
    }))
    this.variations = apiData.variations.map((variation: ApiData) => ({
      allocatedPercentage: variation.allocated_percentage,
      experimentId: variation.experiment_id,
      isDefault: variation.is_default,
      name: variation.name,
      variationId: variation.variation_id,
    }))
  }
}
