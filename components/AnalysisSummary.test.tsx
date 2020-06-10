import { render } from '@testing-library/react'
import React from 'react'

import {
  Analysis,
  AnalysisStrategy,
  AttributionWindowSeconds,
  ExperimentFull,
  MetricAssignment,
  Platform,
  RecommendationReason,
  Status,
  Variation,
} from '@/models'

import AnalysisSummary from './AnalysisSummary'

const experiment: ExperimentFull = new ExperimentFull({
  experimentId: 1,
  name: 'experiment_1',
  startDatetime: new Date(2020, 5, 4),
  endDatetime: new Date(2020, 6, 4),
  status: Status.Completed,
  platform: Platform.Calypso,
  ownerLogin: 'test_a11n',
  description: 'Experiment with things. Change stuff. Profit.',
  existingUsersAllowed: false,
  p2Url: 'https://wordpress.com/experiment_1',
  exposureEvents: null,
  variations: [
    new Variation({
      variationId: 2,
      name: 'test',
      isDefault: false,
      allocatedPercentage: 40,
    }),
    new Variation({
      variationId: 1,
      name: 'control',
      isDefault: true,
      allocatedPercentage: 60,
    }),
  ],
  metricAssignments: [
    new MetricAssignment({
      metricAssignmentId: 123,
      metricId: 1,
      experimentId: 1,
      attributionWindowSeconds: AttributionWindowSeconds.OneWeek,
      changeExpected: true,
      isPrimary: true,
      minDifference: 0.1,
    }),
  ],
  segmentAssignments: [],
})
const analyses: Analysis[] = [
  new Analysis({
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
      warnings: [],
    },
    analysisDatetime: new Date(2020, 4, 10),
  }),
  new Analysis({
    metricAssignmentId: 123,
    analysisStrategy: AnalysisStrategy.MittNoCrossovers,
    participantStats: {
      total: 900,
      not_final: 90,
      variation_1: 540,
      variation_2: 360,
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
      warnings: [],
    },
    analysisDatetime: new Date(2020, 4, 10),
  }),
  new Analysis({
    metricAssignmentId: 123,
    analysisStrategy: AnalysisStrategy.MittNoSpammers,
    participantStats: {
      total: 850,
      not_final: 85,
      variation_1: 510,
      variation_2: 340,
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
      warnings: [],
    },
    analysisDatetime: new Date(2020, 4, 10),
  }),
  new Analysis({
    metricAssignmentId: 123,
    analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
    participantStats: {
      total: 800,
      not_final: 80,
      variation_1: 480,
      variation_2: 320,
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
      warnings: [],
    },
    analysisDatetime: new Date(2020, 4, 10),
  }),
  new Analysis({
    metricAssignmentId: 123,
    analysisStrategy: AnalysisStrategy.PpNaive,
    participantStats: {
      total: 700,
      not_final: 70,
      variation_1: 420,
      variation_2: 280,
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
      warnings: [],
    },
    analysisDatetime: new Date(2020, 4, 10),
  }),
]

test('renders an appropriate message with no analyses', () => {
  const { container } = render(<AnalysisSummary analyses={[]} experiment={experiment} metrics={[]} />)
  expect(container).toHaveTextContent('No analyses yet for experiment_1.')
})

test('renders an appropriate message with some analyses', () => {
  const { container } = render(<AnalysisSummary analyses={analyses} experiment={experiment} metrics={[]} />)
  expect(container).toHaveTextContent('Found 5 analysis objects in total. There are 0 metrics in the system.')
})

test('shows the analyses JSON in debug mode', () => {
  const { container } = render(
    <AnalysisSummary analyses={analyses} experiment={experiment} metrics={[]} debugMode={true} />,
  )
  expect(container.querySelector('pre')).not.toBeNull()
})
