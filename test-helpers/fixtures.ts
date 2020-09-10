/**
 * Data fixtures to use in tests.
 *
 * Functions in this file return new objects populated with dummy values, which may potentially be overridden in
 * functions that accept Partial<T> as an argument.
 */
import _ from 'lodash'

import {
  Analysis,
  AnalysisStrategy,
  AttributionWindowSeconds,
  ExperimentFull,
  ExperimentFullNew,
  MetricAssignment,
  MetricBare,
  MetricFull,
  MetricParameterType,
  Platform,
  RecommendationReason,
  RecommendationWarning,
  Segment,
  SegmentAssignment,
  SegmentType,
  Status,
  TransactionTypes,
} from '@/lib/schemas'

function createAnalysis(fieldOverrides: Partial<Analysis>): Analysis {
  return {
    metricAssignmentId: 123,
    analysisStrategy: AnalysisStrategy.IttPure,
    participantStats: {
      total: 1000,
      not_final: 100,
      variation_1: 600,
      variation_2: 400,
    },
    metricEstimates: {
      diff: { estimate: 0.0, bottom: -0.01, top: 0.01 },
      variation_1: { estimate: 0.12, bottom: 0, top: 10.0 },
      variation_2: { estimate: -0.12, bottom: -1.123, top: 1.0 },
    },
    recommendation: {
      endExperiment: true,
      chosenVariationId: 2,
      reason: RecommendationReason.CiInRope,
      warnings: [RecommendationWarning.ShortPeriod, RecommendationWarning.WideCi],
    },
    analysisDatetime: new Date(Date.UTC(2020, 4, 10)),
    ...fieldOverrides,
  }
}

function createAnalyses() {
  return [
    // Full set of "latest" analyses for the default metric assignment.
    createAnalysis({
      analysisStrategy: AnalysisStrategy.IttPure,
      participantStats: {
        total: 1000,
        not_final: 100,
        variation_1: 600,
        variation_2: 400,
      },
    }),
    createAnalysis({
      analysisStrategy: AnalysisStrategy.MittNoCrossovers,
      participantStats: {
        total: 900,
        not_final: 90,
        variation_1: 540,
        variation_2: 360,
      },
      recommendation: {
        endExperiment: false,
        chosenVariationId: null,
        reason: RecommendationReason.RopeInCi,
        warnings: [],
      },
    }),
    createAnalysis({
      analysisStrategy: AnalysisStrategy.MittNoSpammers,
      participantStats: {
        total: 850,
        not_final: 85,
        variation_1: 510,
        variation_2: 340,
      },
      recommendation: {
        endExperiment: true,
        chosenVariationId: null,
        reason: RecommendationReason.CiInRope,
        warnings: [],
      },
    }),
    createAnalysis({
      analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
      participantStats: {
        total: 800,
        not_final: 80,
        variation_1: 480,
        variation_2: 320,
      },
    }),
    createAnalysis({
      analysisStrategy: AnalysisStrategy.PpNaive,
      participantStats: {
        total: 700,
        not_final: 70,
        variation_1: 420,
        variation_2: 280,
      },
    }),

    // Another set of analyses for the default metric assignment with an earlier date.
    createAnalysis({
      analysisStrategy: AnalysisStrategy.IttPure,
      participantStats: {
        total: 100,
        not_final: 10,
        variation_1: 60,
        variation_2: 40,
      },
      analysisDatetime: new Date(Date.UTC(2020, 4, 9)),
    }),
    createAnalysis({
      analysisStrategy: AnalysisStrategy.MittNoCrossovers,
      participantStats: {
        total: 90,
        not_final: 9,
        variation_1: 54,
        variation_2: 36,
      },
      recommendation: {
        endExperiment: false,
        chosenVariationId: null,
        reason: RecommendationReason.RopeInCi,
        warnings: [],
      },
      analysisDatetime: new Date(Date.UTC(2020, 4, 9)),
    }),
    createAnalysis({
      analysisStrategy: AnalysisStrategy.MittNoSpammers,
      participantStats: {
        total: 85,
        not_final: 8,
        variation_1: 51,
        variation_2: 34,
      },
      recommendation: {
        endExperiment: true,
        chosenVariationId: null,
        reason: RecommendationReason.CiInRope,
        warnings: [],
      },
      analysisDatetime: new Date(Date.UTC(2020, 4, 9)),
    }),
    createAnalysis({
      analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
      participantStats: {
        total: 80,
        not_final: 8,
        variation_1: 48,
        variation_2: 32,
      },
      analysisDatetime: new Date(Date.UTC(2020, 4, 9)),
    }),
    createAnalysis({
      analysisStrategy: AnalysisStrategy.PpNaive,
      participantStats: {
        total: 70,
        not_final: 7,
        variation_1: 42,
        variation_2: 28,
      },
      analysisDatetime: new Date(Date.UTC(2020, 4, 9)),
    }),

    // One example of a metric assignment with no data on one variation.
    createAnalysis({
      metricAssignmentId: 124,
      analysisStrategy: AnalysisStrategy.IttPure,
      participantStats: {
        total: 10,
        not_final: 10,
        variation_1: 10,
      },
      metricEstimates: null,
      recommendation: null,
    }),

    // Similar to the set of "latest" analyses for the default metric assignment, but with consistent recommendations.
    createAnalysis({
      metricAssignmentId: 126,
      analysisStrategy: AnalysisStrategy.IttPure,
      participantStats: {
        total: 2000,
        not_final: 200,
        variation_1: 1200,
        variation_2: 800,
      },
    }),
    createAnalysis({
      metricAssignmentId: 126,
      analysisStrategy: AnalysisStrategy.MittNoCrossovers,
      participantStats: {
        total: 1800,
        not_final: 180,
        variation_1: 1080,
        variation_2: 720,
      },
    }),
    createAnalysis({
      metricAssignmentId: 126,
      analysisStrategy: AnalysisStrategy.MittNoSpammers,
      participantStats: {
        total: 1700,
        not_final: 170,
        variation_1: 920,
        variation_2: 780,
      },
    }),
    createAnalysis({
      metricAssignmentId: 126,
      analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
      participantStats: {
        total: 1600,
        not_final: 160,
        variation_1: 960,
        variation_2: 640,
      },
    }),
    createAnalysis({
      metricAssignmentId: 126,
      analysisStrategy: AnalysisStrategy.PpNaive,
      participantStats: {
        total: 1400,
        not_final: 140,
        variation_1: 840,
        variation_2: 560,
      },
    }),
  ]
}

function createMetricAssignment(fieldOverrides: Partial<MetricAssignment>): MetricAssignment {
  return {
    metricAssignmentId: 123,
    metricId: 1,
    attributionWindowSeconds: AttributionWindowSeconds.OneWeek,
    changeExpected: true,
    isPrimary: true,
    minDifference: 0.1,
    ...fieldOverrides,
  }
}

/* istanbul ignore next; All coverage to be removed, see https://github.com/Automattic/abacus/issues/231 */
function createExperimentFullNew(fieldOverrides: Partial<ExperimentFullNew> = {}): ExperimentFullNew {
  const now = new Date()
  // This is a bit funky as we want to work in UTC but DateFns only does local time
  // and we want to avoid DST problems.
  const startDatetime = new Date(new Date(new Date().setMonth(now.getMonth() + 2)).setUTCHours(0, 0, 0, 0))
  const endDatetime = new Date(new Date(new Date().setMonth(now.getMonth() + 4)).setUTCHours(0, 0, 0, 0))
  return {
    name: 'experiment_1',
    startDatetime,
    endDatetime,
    platform: Platform.Calypso,
    ownerLogin: 'test_a11n',
    description: 'Experiment with things. Change stuff. Profit.',
    existingUsersAllowed: false,
    p2Url: 'https://wordpress.com/experiment_1',
    variations: [
      {
        name: 'test',
        isDefault: false,
        allocatedPercentage: 40,
      },
      {
        name: 'control',
        isDefault: true,
        allocatedPercentage: 60,
      },
    ],
    metricAssignments: [
      createMetricAssignment({
        metricAssignmentId: 123,
        metricId: 1,
        attributionWindowSeconds: AttributionWindowSeconds.OneWeek,
        changeExpected: true,
        isPrimary: true,
        minDifference: 0.1,
      }),
      createMetricAssignment({
        metricAssignmentId: 124,
        metricId: 2,
        attributionWindowSeconds: AttributionWindowSeconds.FourWeeks,
        changeExpected: false,
        isPrimary: false,
        minDifference: 10.5,
      }),
      createMetricAssignment({
        metricAssignmentId: 125,
        metricId: 2,
        attributionWindowSeconds: AttributionWindowSeconds.OneHour,
        changeExpected: true,
        isPrimary: false,
        minDifference: 0.5,
      }),
      createMetricAssignment({
        metricAssignmentId: 126,
        metricId: 3,
        attributionWindowSeconds: AttributionWindowSeconds.SixHours,
        changeExpected: true,
        isPrimary: false,
        minDifference: 12,
      }),
    ],
    segmentAssignments: [],
    ...fieldOverrides,
  }
}

function createExperimentFull(fieldOverrides: Partial<ExperimentFull> = {}): ExperimentFull {
  const fieldsOnlyForExistingExperiments = [
    'experimentId',
    'endReason',
    'conclusionUrl',
    'deployedVariationId',
    'status',
    'variations',
    'metricAssignments',
    'segmentAssignments',
    'exposureEvents',
  ]
  const newExperimentFieldOverrides = {
    ..._.omit(fieldOverrides, fieldsOnlyForExistingExperiments),
    exposureEvents: undefined,
    status: undefined,
  }
  const existingExperimentFieldOverrides = _.pick(fieldOverrides, fieldsOnlyForExistingExperiments)

  return {
    ...createExperimentFullNew(newExperimentFieldOverrides),
    experimentId: 1,
    status: Status.Staging,
    endReason: null,
    conclusionUrl: null,
    deployedVariationId: null,
    variations: [
      {
        variationId: 2,
        name: 'test',
        isDefault: false,
        allocatedPercentage: 40,
      },
      {
        variationId: 1,
        name: 'control',
        isDefault: true,
        allocatedPercentage: 60,
      },
    ],
    metricAssignments: [
      createMetricAssignment({
        metricAssignmentId: 123,
        metricId: 1,
        attributionWindowSeconds: AttributionWindowSeconds.OneWeek,
        changeExpected: true,
        isPrimary: true,
        minDifference: 0.1,
      }),
      createMetricAssignment({
        metricAssignmentId: 124,
        metricId: 2,
        attributionWindowSeconds: AttributionWindowSeconds.FourWeeks,
        changeExpected: false,
        isPrimary: false,
        minDifference: 10.5,
      }),
      createMetricAssignment({
        metricAssignmentId: 125,
        metricId: 2,
        attributionWindowSeconds: AttributionWindowSeconds.OneHour,
        changeExpected: true,
        isPrimary: false,
        minDifference: 0.5,
      }),
      createMetricAssignment({
        metricAssignmentId: 126,
        metricId: 3,
        attributionWindowSeconds: AttributionWindowSeconds.SixHours,
        changeExpected: true,
        isPrimary: false,
        minDifference: 12,
      }),
    ],
    segmentAssignments: [],
    ...existingExperimentFieldOverrides,
  }
}

function createMetricBare(id: number): MetricBare {
  return {
    metricId: id,
    name: `metric_${id}`,
    description: `This is metric ${id}`,
    parameterType: id % 2 === 0 ? MetricParameterType.Revenue : MetricParameterType.Conversion,
  }
}

function createMetricBares(numMetrics = 3) {
  return _.range(1, numMetrics + 1).map(createMetricBare)
}

function createMetricFull(id: number): MetricFull {
  // Note: It is hard to reuse createMetricBare here as it is boxed
  //       Currently we only unbox it into an ApiData format which is different from this
  const parameterType = id % 2 === 0 ? MetricParameterType.Revenue : MetricParameterType.Conversion
  const eventParams = [{ event: 'event_name', props: { has_blocks: 'true' } }]
  const revenueParams = {
    refundDays: id * 2,
    productSlugs: ['xx-bundles'],
    transactionTypes: [TransactionTypes.NewPurchase],
  }
  return {
    metricId: id,
    name: `metric_${id}`,
    description: `This is metric ${id}`,
    parameterType,
    higherIsBetter: id % 3 === 0,
    eventParams: parameterType === MetricParameterType.Conversion ? eventParams : undefined,
    revenueParams: parameterType === MetricParameterType.Revenue ? revenueParams : undefined,
  }
}

function createSegment(id: number): Segment {
  return {
    segmentId: id,
    name: `segment_${id}`,
    type: id % 2 === 0 ? SegmentType.Country : SegmentType.Locale,
  }
}

/**
 * Creates an array of segments.
 */
function createSegments(numSegments = 2) {
  return _.range(1, numSegments + 1).map(createSegment)
}

function createSegmentAssignment(fieldOverrides: Partial<SegmentAssignment>): SegmentAssignment {
  return {
    segmentAssignmentId: 123,
    segmentId: 1,
    isExcluded: false,
    ...fieldOverrides,
  }
}

const Fixtures = {
  createAnalyses,
  createExperimentFull,
  createExperimentFullNew,
  createMetricAssignment,
  createMetricBares,
  createMetricFull,
  createSegmentAssignment,
  createSegments,
}

export default Fixtures
