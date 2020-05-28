import { ApiData } from '@/api/ApiData'
import { formatIsoUtcOffset } from '@/utils/date'

import {
  ExperimentBare,
  Event,
  MetricAssignment,
  MetricAssignmentAttributionWindowSecondsEnum,
  Platform,
  SegmentAssignment,
  Status,
  Variation,
} from './index'

/**
 * An experiment with full data.
 */
export class ExperimentFull extends ExperimentBare {
  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData) {
    return {
      ...ExperimentBare.fromApiData(apiData),
      conclusionUrl: apiData.conclusion_url || null,
      deployedVariationId: apiData.deployed_variation_id || null,
      description: apiData.description,
      endReason: apiData.end_reason || null,
      existingUsersAllowed: apiData.existing_users_allowed,
      exposureEvents: Array.isArray(apiData.exposure_events)
        ? apiData.exposure_events.map((exposureEvent: ApiData) => ({
            event: exposureEvent.event,
            props: exposureEvent.props,
          }))
        : null,
      metricAssignments: apiData.metric_assignments.map((metricAssignment: ApiData) => ({
        attributionWindowSeconds: metricAssignment.attribution_window_seconds as MetricAssignmentAttributionWindowSecondsEnum,
        changeExpected: metricAssignment.change_expected,
        experimentId: metricAssignment.experiment_id,
        isPrimary: metricAssignment.is_primary,
        metricAssignmentId: metricAssignment.metric_assignment_id,
        metricId: metricAssignment.metric_id,
        minDifference: metricAssignment.min_difference,
      })),
      p2Url: apiData.p2_url,
      segmentAssignments: apiData.segment_assignments.map((segmentAssignment: ApiData) => ({
        segmentAssignmentId: segmentAssignment.segment_assignment_id,
        experimentId: segmentAssignment.experiment_id,
        segmentId: segmentAssignment.segment_id,
        isExcluded: segmentAssignment.is_excluded,
      })),
      variations: apiData.variations.map((variation: ApiData) => ({
        allocatedPercentage: variation.allocated_percentage,
        experimentId: variation.experiment_id,
        isDefault: variation.is_default,
        name: variation.name,
        variationId: variation.variation_id,
      })),
    }
  }

  /**
   * @param experimentId - Unique experiment ID.
   * @param name - Name of the experiment.
   * @param startDatetime - Start date of the experiment. For new experiments, the
   *   date must be in the future to accommodate forward planning of experiments.
   * @param endDatetime - End date of the experiment. This value must be greater than
   *   `start_datetime`. The server may impose a limited difference between
   *   `end_datetime` and `start_datetime` to ensure that experiments don't run for
   *   too long.
   * @param status -
   * @param platform -
   * @param ownerLogin - The login name of the experiment owner.
   * @param description - Additional context for running the experiment. This may
   *   include initial research, experiment background, hypotheses, etc.
   * @param existingUsersAllowed - If true, include users that signed up before the
   *   experiment. Otherwise, run the experiment only on new users.
   * @param p2Url - Link to the experiment announcement/discussion post.
   * @param variations - Variations that experiment participants may see.
   *   Constraints:
   *   - Each experiment must have exactly two variations.
   *   - Exactly one of the experiment variations must have its
   *     `is_default` attribute set to `true`.
   *   - The sum of the variations' `allocated_percentage` values
   *     must be between 2 and 100.
   * @param segmentAssignments - Segments that are assigned to this experiment. May be
   *   empty.
   * @param metricAssignments - Metrics that are assigned to this experiment. May be
   *   empty.
   * @param exposureEvents - Events that capture exposure to the experiment. If `null`,
   *   only intention-to-treat analysis and its modifications are possible. Otherwise,
   *   this field is used for per-protocol analysis of the experiment.
   * @param endReason - An explanation or reason why the experiment ended.
   * @param conclusionUrl - Link to a comment/post that describes the experiment
   *   conclusion and future action items. This should be populated within a reasonable
   *   time from `end_datetime`.
   * @param deployedVariationId - The variation ID that was deployed once the experiment
   *   concluded.
   */
  // istanbul ignore next (skip coverage for auto-generated constructor)
  constructor(
    experimentId: number | null,
    name: string,
    startDatetime: Date,
    endDatetime: Date,
    status: Status,
    platform: Platform,
    ownerLogin: string,
    public readonly description: string,
    public readonly existingUsersAllowed: boolean,
    public readonly p2Url: string,
    public readonly variations: Array<Variation>,
    public readonly segmentAssignments: Array<SegmentAssignment>,
    public readonly metricAssignments: Array<MetricAssignment>,
    public readonly exposureEvents: Array<Event> | null = null,
    public readonly endReason: string | null = null,
    public readonly conclusionUrl: string | null = null,
    public readonly deployedVariationId: number | null = null,
  ) {
    super(experimentId, name, startDatetime, endDatetime, status, platform, ownerLogin)
  }

  toApiData() {
    return {
      experiment_id: this.experimentId,
      name: this.name,
      description: this.description,
      start_datetime: formatIsoUtcOffset(this.startDatetime),
      end_datetime: formatIsoUtcOffset(this.endDatetime),
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
        metric_id: metricAssignment.metricId,
        min_difference: metricAssignment.minDifference,
      })),
      segment_assignments: this.segmentAssignments.map((segmentAssignments: ApiData) => ({
        experiment_id: segmentAssignments.experimentId,
        segment_id: segmentAssignments.segmentId,
        is_excluded: segmentAssignments.isExcluded,
      })),
      variations: this.variations.map((variation: ApiData) => ({
        experiment_id: variation.experimentId,
        name: variation.name,
        is_default: variation.isDefault,
        allocated_percentage: variation.allocatedPercentage,
      })),
    }
  }
}
