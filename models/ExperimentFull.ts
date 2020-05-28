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

export class ExperimentFull extends ExperimentBare {
  /**
   * Creates an `ExperimentFull` instance from the given API data.
   *
   * @param apiData
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
