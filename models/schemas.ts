import * as yup from 'yup'

import { Platform, Status } from './index'

const idSchema = yup.number().integer().min(0)

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
  .camelCase()

export const segmentAssignmentSchema = yup
  .object({
    experimentId: idSchema.defined(),
    segmentId: idSchema.defined(),
    isExcluded: yup.bool().defined(),
  })
  .defined()
  .camelCase()

export const variationSchema = yup
  .object({
    experimentId: idSchema.defined(),
    name: yup.string().max(128).defined(),
    isDefault: yup.bool().defined(),
    // allocatedPercentage: yup.number().integer().min(1).max(99).defined(),
    // TODO: revert to the above definition after the mock API issue is resolved.
    allocatedPercentage: yup.number().integer().min(0).max(99).defined(),
  })
  .defined()
  .camelCase()

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
    // p2Url: yup.string().url().defined(),
    // TODO: revert to the above definition after the mock API issue is resolved.
    p2Url: yup.string().defined(),
    endReason: yup.string().defined().nullable(),
    // conclusionUrl: yup.string().url().defined().nullable(),
    // TODO: revert to the above definition after the mock API issue is resolved.
    conclusionUrl: yup.string().defined().nullable(),
    deployedVariationId: idSchema.defined().nullable(),
    metricAssignments: yup.array(metricAssignmentSchema).defined(),
    segmentAssignments: yup.array(segmentAssignmentSchema).defined(),
    variations: yup.array(variationSchema).defined(),
  })
  .defined()
  .camelCase()
