// Schema documentation lives at:
// https://app.swaggerhub.com/apis/yanir/experiments/0.1.0

import * as yup from 'yup'

const idSchema = yup.number().integer().positive()

export const metricAssignmentSchema = yup
  .object({
    metricAssignmentId: idSchema.defined(),
    attributionWindowSeconds: yup.number().integer().positive().defined(),
    changeExpected: yup.bool().defined(),
    experimentId: idSchema.defined(),
    isPrimary: yup.bool().defined(),
    metricId: idSchema.defined(),
    minDifference: yup.number().defined(),
  })
  .defined()
  .camelCase()

export type MetricAssignment = yup.InferType<typeof metricAssignmentSchema>

export const segmentAssignmentSchema = yup
  .object({
    segmentAssignmentId: idSchema.defined(),
    experimentId: idSchema.defined(),
    segmentId: idSchema.defined(),
    isExcluded: yup.bool().defined(),
  })
  .defined()
  .camelCase()

export type SegmentAssignment = yup.InferType<typeof segmentAssignmentSchema>

export const variationSchema = yup
  .object({
    variationId: idSchema.defined(),
    experimentId: idSchema.defined(),
    name: yup.string().max(128).defined(),
    isDefault: yup.bool().defined(),
    allocatedPercentage: yup.number().integer().min(1).max(99).defined(),
  })
  .defined()
  .camelCase()

export type Variation = yup.InferType<typeof variationSchema>

/**
 * The platform where the experiment is running.
 * - `calypso`: The experiment is being run on the front-end Calypso interface,
 *   WordPress.com. Account sign-up and site management design experiments are
 *   likely run here.
 * - `wpcom`: The experiment is being run on the back-end, like APIs which are
 *   usually written in PHP. Email and landing pages experiments are likely run here.
 */
export enum Platform {
  Calypso = 'calypso',
  Wpcom = 'wpcom',
}

/**
 * The status of an experiment.
 */
export enum Status {
  Staging = 'staging',
  Running = 'running',
  Completed = 'completed',
  Disabled = 'disabled',
}

export const experimentBareSchema = yup
  .object({
    experimentId: idSchema.defined(),
    name: yup.string().max(128).defined(),
    startDatetime: yup.date().defined(),
    endDatetime: yup.date().defined(),
    status: yup.string().oneOf(Object.values(Status)).defined(),
    platform: yup.string().oneOf(Object.values(Platform)).defined(),
    ownerLogin: yup.string().defined(),
  })
  .defined()
  .camelCase()

export type ExperimentBare = yup.InferType<typeof experimentBareSchema>

export const experimentFullSchema = experimentBareSchema
  .shape({
    description: yup.string().defined(),
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

export type ExperimentFull = yup.InferType<typeof experimentFullSchema>
