import * as yup from 'yup'

import { ApiData } from '@/api/ApiData'
import { ApiDataSource } from '@/api/ApiDataSource'
import { ExcludeMethods } from '@/types/ExcludeMethods'
import { formatIsoUtcOffset } from '@/utils/formatters'

import { Event, ExperimentBare, MetricAssignment, SegmentAssignment, Variation } from './index'
import { Platform } from './Platform'
// These are seperate because of an import bug
import { Status } from './Status'

/**
 * An experiment with full data.
 */
export class ExperimentFull implements ApiDataSource {
  /**
   * Unique experiment ID.
   */
  public readonly experimentId: number | null

  /**
   * Name of the experiment.
   */
  public readonly name: string

  /**
   * Start date of the experiment. For new experiments, the date must be in the
   * future to accommodate forward planning of experiments.
   */
  public readonly startDatetime: Date

  /**
   * End date of the experiment. This value must be greater than `start_datetime`.
   * The server may impose a limited difference between `end_datetime` and
   * `start_datetime` to ensure that experiments don't run for too long.
   */
  public readonly endDatetime: Date

  /**
   * The status of the experiment.
   */
  public readonly status: Status

  /**
   * The platform where the experiment is running.
   */
  public readonly platform: Platform

  /**
   * The login name of the experiment owner.
   */
  public readonly ownerLogin: string

  /**
   * Additional context for running the experiment. This may include initial
   * research, experiment background, hypotheses, etc.
   */
  public readonly description: string

  /**
   * If true, include users that signed up before the experiment. Otherwise, run the
   * experiment only on new users.
   */
  public readonly existingUsersAllowed: boolean

  /**
   * Link to the experiment announcement/discussion post.
   */
  public readonly p2Url: string

  /**
   * Events that capture exposure to the experiment. If `null`, only
   * intention-to-treat analysis and its modifications are possible. Otherwise, this
   * field is used for per-protocol analysis of the experiment.
   */
  public readonly exposureEvents?: Array<Event> | null

  /**
   * Variations that experiment participants may see. Constraints:
   * - Each experiment must have exactly two variations.
   * - Exactly one of the experiment variations must have its
   *   `is_default` attribute set to `true`.
   * - The sum of the variations' `allocated_percentage` values
   *   must be between 2 and 100.
   */
  public readonly variations: Array<Variation>

  /**
   * Metrics that are assigned to this experiment. May be empty.
   */
  public readonly metricAssignments: Array<MetricAssignment>

  /**
   * Segments that are assigned to this experiment. May be empty.
   */
  public readonly segmentAssignments: Array<SegmentAssignment>

  /**
   * An explanation or reason why the experiment ended.
   */
  public readonly endReason?: string | null

  /**
   * Link to a comment/post that describes the experiment conclusion and future
   * action items. This should be populated within a reasonable time from
   * `end_datetime`.
   */
  public readonly conclusionUrl?: string | null

  /**
   * The variation ID that was deployed once the experiment concluded.
   */
  public readonly deployedVariationId?: number | null

  /**
   * Constructs a new experiment.
   */
  constructor(data: ExcludeMethods<ExperimentFull>) {
    Object.assign(this, data)
  }

  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData) {
    return new ExperimentFull({
      ...ExperimentBare.fromApiData(apiData),
      conclusionUrl: apiData.conclusion_url || null,
      deployedVariationId: apiData.deployed_variation_id || null,
      description: apiData.description,
      endReason: apiData.end_reason || null,
      existingUsersAllowed: apiData.existing_users_allowed,
      exposureEvents: Array.isArray(apiData.exposure_events)
        ? apiData.exposure_events.map((rawEvent: ApiData) => Event.fromApiData(rawEvent))
        : null,
      metricAssignments: apiData.metric_assignments.map((rawMetricAssignment: ApiData) =>
        MetricAssignment.fromApiData(rawMetricAssignment),
      ),
      p2Url: apiData.p2_url,
      segmentAssignments: apiData.segment_assignments.map((rawSegmentAssignment: ApiData) =>
        SegmentAssignment.fromApiData(rawSegmentAssignment),
      ),
      variations: apiData.variations.map((rawVariation: ApiData) => Variation.fromApiData(rawVariation)),
    })
  }

  /**
   * Converts this instance into the shape expected by the API.
   */
  toApiData(): ApiData {
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
      metric_assignments: this.metricAssignments.map((metricAssignment: MetricAssignment) => ({
        attribution_window_seconds: metricAssignment.attributionWindowSeconds,
        change_expected: metricAssignment.changeExpected,
        experiment_id: metricAssignment.experimentId,
        is_primary: metricAssignment.isPrimary,
        metric_id: metricAssignment.metricId,
        min_difference: metricAssignment.minDifference,
      })),
      segment_assignments: this.segmentAssignments.map((segmentAssignments: SegmentAssignment) => ({
        experiment_id: segmentAssignments.experimentId,
        segment_id: segmentAssignments.segmentId,
        is_excluded: segmentAssignments.isExcluded,
      })),
      variations: this.variations.map((variation: Variation) => ({
        experiment_id: variation.experimentId,
        name: variation.name,
        is_default: variation.isDefault,
        allocated_percentage: variation.allocatedPercentage,
      })),
    }
  }

  /**
   * Return the deployed variation if one has been selected, otherwise `null`.
   *
   * @throws {Error} If a `deployedVariationId` is set but cannot be found in the
   *   variations.
   */
  getDeployedVariation(): null | Variation {
    let deployedVariation = null

    if (typeof this.deployedVariationId === 'number') {
      deployedVariation = this.variations.find((variation) => this.deployedVariationId === variation.variationId)

      if (!deployedVariation) {
        throw Error(
          `Failed to resolve the deployed variation with ID ${this.deployedVariationId} for experiment with ID ${this.experimentId}.`,
        )
      }
    }

    return deployedVariation
  }

  /**
   * Return the primary metric assignment ID for this experiment if one exists.
   */
  getPrimaryMetricAssignmentId(): number | null {
    return this.metricAssignments.find((metricAssignment) => metricAssignment.isPrimary)?.metricAssignmentId ?? null
  }

  /**
   * Determines whether conclusion data has been entered for this experiment.
   */
  hasConclusionData(): boolean {
    return !!this.endReason || !!this.conclusionUrl || typeof this.deployedVariationId === 'number'
  }
}

// Placing these here for now, but they should go in a schema.ts file
//

const idSchema = yup.number().integer().positive()

export const metricAssignmentSchema = yup
  .object({
    attributionWindowSeconds: yup.number().integer().positive().defined(),
    changeExpected: yup.bool().defined(),
    experimentId: idSchema.defined(),
    isPrimary: yup.bool().defined(),
    metricId: idSchema.defined(),
    minDifference: yup.number().defined(),
  })
  .defined()

export const segmentAssignmentSchema = yup
  .object({
    experimentId: idSchema.defined(),
    segmentId: idSchema.defined(),
    isExcluded: yup.bool().defined(),
  })
  .defined()

export const variationSchema = yup
  .object({
    experimentId: idSchema.defined(),
    name: yup.string().max(128).defined(),
    isDefault: yup.bool().defined(),
    allocatedPercentage: yup.number().integer().min(1).max(99).defined(),
  })
  .defined()

export const experimentFullSchema = yup
  .object({
    experimentId: idSchema.defined(),
    name: yup.string().max(128).defined(),
    description: yup.string().defined(),
    startDatetime: yup.date().defined(),
    endDatetime: yup.date().defined(),
    status: yup.string().oneOf([Status.Staging, Status.Running, Status.Completed, Status.Disabled]).defined(),
    platform: yup.string().oneOf([Platform.Wpcom, Platform.Calypso]).defined(),
    ownerLogin: yup.string().defined(),
    existingUsersAllowed: yup.boolean().defined(),
    p2Url: yup.string().url().defined(),
    endReason: yup.string().defined().nullable(),
    conclusionUrl: yup.string().url().defined().nullable(),
    deployedVariationId: idSchema.defined().nullable(),
    metricAssignments: yup.array(metricAssignmentSchema).defined(),
    segmentAssignments: yup.array(segmentAssignmentSchema).defined(),
    variations: yup.array(variationSchema).defined(),
  })
  .defined()
  .camelCase()
