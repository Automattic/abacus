import format from 'date-fns/format'
import { toBool } from 'qc-to_bool'

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
    this.existingUsersAllowed = toBool(apiData.existing_users_allowed)
    this.exposureEvents = Array.isArray(apiData.exposure_events)
      ? apiData.exposure_events.map((exposureEvent: ApiData) => ({
          event: exposureEvent.event,
          props: exposureEvent.props,
        }))
      : null
    this.metricAssignments = apiData.metric_assignments.map((metricAssignment: ApiData) => ({
      attributionWindowSeconds: metricAssignment.attribution_window_seconds as MetricAssignmentAttributionWindowSecondsEnum,
      changeExpected: metricAssignment.change_expected,
      experimentId: metricAssignment.experiment_id,
      isPrimary: metricAssignment.is_primary,
      metricAssignmentId: metricAssignment.metric_assignment_id,
      metricId: metricAssignment.metric_id,
      minDifference: metricAssignment.min_difference,
    }))
    this.p2Url = apiData.p2_url
    this.segmentAssignments = apiData.segment_assignments.map((segmentAssignment: ApiData) => ({
      segmentAssignmentId: segmentAssignment.segment_assignment_id,
      experimentId: segmentAssignment.experiment_id,
      segmentId: segmentAssignment.segment_id,
      isExcluded: segmentAssignment.is_excluded,
    }))
    this.variations = apiData.variations.map((variation: ApiData) => ({
      allocatedPercentage: variation.allocated_percentage,
      experimentId: variation.experiment_id,
      isDefault: variation.is_default,
      name: variation.name,
      variationId: variation.variation_id,
    }))
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  toJSON() {
    return {
      experiment_id: this.experimentId,
      name: this.name,
      description: this.description,
      start_datetime: format(this.startDatetime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      end_datetime: format(this.endDatetime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      status: this.status,
      platform: this.platform,
      owner_login: this.ownerLogin,
      conclusion_url: this.conclusionUrl,
      deployed_variation_id: this.deployedVariationId,
      end_reason: this.endReason,
      existing_users_allowed: this.existingUsersAllowed,
      p2_url: this.p2Url,
      metric_assignments: this.metricAssignments.map((metricAssignment: ApiData) => ({
        attribution_window_seconds: metricAssignment.attributionWindowSeconds,
        change_expected: metricAssignment.changeExpected,
        experiment_id: metricAssignment.experimentId,
        is_primary: metricAssignment.isPrimary,
        metric_assignment_id: metricAssignment.metricAssignmentId,
        metric_id: metricAssignment.metricId,
        min_difference: metricAssignment.minDifference,
      })),
      segment_assignments: this.segmentAssignments.map((segmentAssignments: ApiData) => ({
        segment_assignment_id: segmentAssignments.segmentAssignmentId,
        experiment_id: segmentAssignments.experimentId,
        segment_id: segmentAssignments.segmentId,
        is_excluded: segmentAssignments.isExcluded,
      })),
      variations: this.variations.map((variation: ApiData) => ({
        variation_id: variation.variationId,
        experiment_id: variation.experimentId,
        name: variation.name,
        is_default: variation.isDefault,
        allocated_percentage: variation.allocatedPercentage,
      })),
    }
  }
}
