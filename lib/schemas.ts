// Schema documentation lives at:
// https://app.swaggerhub.com/apis/yanir/experiments/0.1.0

import * as yup from 'yup'

const idSchema = yup.number().integer().positive()
const nameSchema = yup.string().max(128)

export const eventSchema = yup
  .object({
    event: yup.string().defined(),
    props: yup.mixed().notRequired(),
  })
  .defined()
  .camelCase()
export type Event = yup.InferType<typeof eventSchema>

export enum TransactionTypes {
  NewPurchase = 'new purchase',
  Recurring = 'recurring',
  Cancellation = 'cancellation',
  StopRecurring = 'stop recurring',
  UpdateCard = 'update card',
  Refund = 'refund',
  StartTrial = 'start trial',
  StartRecurring = 'start recurring',
  TransferOut = 'transfer out',
  TransferIn = 'transfer in',
  Reactivation = 'reactivation',
}

export const metricRevenueParamsSchema = yup
  .object({
    refundDays: yup.number().integer().positive().defined(),
    productSlugs: yup.array(yup.string().defined()).defined(),
    transactionTypes: yup.array(yup.string().oneOf(Object.values(TransactionTypes)).defined()),
  })
  .defined()
  .camelCase()

export type MetricRevenueParams = yup.InferType<typeof metricRevenueParamsSchema>

export enum MetricParameterType {
  Conversion = 'conversion',
  Revenue = 'revenue',
}

export const metricBareSchema = yup
  .object({
    metricId: idSchema.defined(),
    name: nameSchema.defined(),
    description: yup.string().defined(),
    parameterType: yup.string().oneOf(Object.values(MetricParameterType)).defined(),
  })
  .defined()
  .camelCase()
export type MetricBare = yup.InferType<typeof metricBareSchema>

export const metricFullSchema = metricBareSchema
  .shape({
    higherIsBetter: yup.boolean().defined(),
    eventParams: yup.array(eventSchema),
    revenueParams: metricRevenueParamsSchema.notRequired(),
  })
  .defined()
  .camelCase()
export type MetricFull = yup.InferType<typeof metricFullSchema>

export enum AttributionWindowSeconds {
  OneHour = 3600,
  SixHours = 21600,
  TwelveHours = 43200,
  TwentyFourHours = 86400,
  ThreeDays = 259200,
  OneWeek = 604800,
  TwoWeeks = 1209600,
  ThreeWeeks = 1814400,
  FourWeeks = 2419200,
}

export const metricAssignmentSchema = yup
  .object({
    metricAssignmentId: idSchema.defined(),
    attributionWindowSeconds: yup
      .number()
      .integer()
      .positive()
      .oneOf(Object.values(AttributionWindowSeconds) as number[])
      .defined() as yup.Schema<AttributionWindowSeconds>,
    changeExpected: yup.bool().defined(),
    experimentId: idSchema.defined(),
    isPrimary: yup.bool().defined(),
    metricId: idSchema.defined(),
    minDifference: yup.number().defined(),
  })
  .defined()
  .camelCase()
export type MetricAssignment = yup.InferType<typeof metricAssignmentSchema>

export enum SegmentType {
  Country = 'country',
  Locale = 'locale',
}

export const segmentSchema = yup
  .object({
    segmentId: idSchema.defined(),
    name: nameSchema.defined(),
    type: yup.string().oneOf(Object.values(SegmentType)).defined(),
  })
  .defined()
  .camelCase()
export type Segment = yup.InferType<typeof segmentSchema>

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
    name: nameSchema.defined(),
    isDefault: yup.bool().defined(),
    allocatedPercentage: yup.number().integer().min(1).max(99).defined(),
  })
  .defined()
  .camelCase()
export type Variation = yup.InferType<typeof variationSchema>

export enum Platform {
  Calypso = 'calypso',
  Wpcom = 'wpcom',
}

export enum Status {
  Staging = 'staging',
  Running = 'running',
  Completed = 'completed',
  Disabled = 'disabled',
}

export const experimentBareSchema = yup
  .object({
    experimentId: idSchema.defined(),
    name: nameSchema.defined(),
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
    endReason: yup.string().nullable(),
    conclusionUrl: yup.string().url().nullable(),
    deployedVariationId: idSchema.nullable().notRequired(),
    exposureEvents: yup.array<Event>(eventSchema).nullable(),
    metricAssignments: yup.array(metricAssignmentSchema).defined(),
    segmentAssignments: yup.array(segmentAssignmentSchema).defined(),
    variations: yup.array(variationSchema).defined(),
  })
  .defined()
  .camelCase()
export type ExperimentFull = yup.InferType<typeof experimentFullSchema>

// Just a stub for now
export const experimentCreateSchema = experimentFullSchema.shape({
  experimentId: idSchema.nullable(),
})
export type ExperimentFullCreate = yup.InferType<typeof experimentCreateSchema>

export enum RecommendationReason {
  CiInRope = 'ci_in_rope',
  CiGreaterThanRope = 'ci_greater_than_rope',
  CiLessThanRope = 'ci_less_than_rope',
  CiRopePartlyOverlap = 'ci_rope_partly_overlap',
  RopeInCi = 'rope_in_ci',
}

export enum RecommendationWarning {
  ShortPeriod = 'short_period',
  LongPeriod = 'long_period',
  WideCi = 'wide_ci',
}

export const recommendationSchema = yup
  .object({
    endExperiment: yup.boolean().defined(),
    chosenVariationId: yup.number().nullable().defined(),
    reason: yup.string().oneOf(Object.values(RecommendationReason)).defined(),
    warnings: yup.array(yup.string().oneOf(Object.values(RecommendationWarning)).defined()).defined(),
  })
  .defined()
  .camelCase()
export type Recommendation = yup.InferType<typeof recommendationSchema>

export const metricEstimateSchema = yup
  .object({
    estimate: yup.number().defined(),
    top: yup.number().defined(),
    bottom: yup.number().defined(),
  })
  .defined()
  .camelCase()
export type MetricEstimate = yup.InferType<typeof metricEstimateSchema>

export enum AnalysisStrategy {
  IttPure = 'itt_pure',
  MittNoSpammers = 'mitt_no_spammers',
  MittNoCrossovers = 'mitt_no_crossovers',
  MittNoSpammersNoCrossovers = 'mitt_no_spammers_no_crossovers',
  PpNaive = 'pp_naive',
}

export const analysisSchema = yup
  .object({
    metricAssignmentId: idSchema.defined(),
    analysisDatetime: yup.date().defined(),
    analysisStrategy: yup.string().oneOf(Object.values(AnalysisStrategy)).defined(),
    // TODO: Provide better validation for these
    participantStats: yup.object().defined() as yup.Schema<Record<string, number>>,
    metricEstimates: yup.object().nullable().defined() as yup.Schema<Record<string, MetricEstimate> | null>,
    recommendation: recommendationSchema.nullable().defined(),
  })
  .defined()
  .camelCase()
export type Analysis = yup.InferType<typeof analysisSchema>
