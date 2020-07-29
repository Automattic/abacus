import MockDate from 'mockdate'
import { normalize } from 'normalizr'
import React from 'react'

import {
  ExperimentFull,
  ExperimentFullNormalizedEntities,
  experimentFullNormalizrSchema,
  MetricBare,
  metricBareNormalizrSchema,
  Segment,
  segmentNormalizrSchema,
} from '@/lib/schemas'
import Fixtures from '@/test-helpers/fixtures'
import { createMatchMedia, render } from '@/test-helpers/test-utils'

import ExperimentDetails from './ExperimentDetails'

MockDate.set('2020-07-21')

const initialJsDomWindowInnerWidth = window.innerWidth
afterEach(() => {
  window.matchMedia = createMatchMedia(initialJsDomWindowInnerWidth)
})

test('renders as expected at large width', () => {
  window.matchMedia = createMatchMedia(1600)

  const metrics = Fixtures.createMetricBares()
  const segments = Fixtures.createSegments(5)
  const experiment = Fixtures.createExperimentFull({
    segmentAssignments: [
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 101, segmentId: 1 }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 102, segmentId: 2, isExcluded: true }),
    ],
  })
  const normalizedExperimentData = normalize<ExperimentFull, ExperimentFullNormalizedEntities>(
    experiment,
    experimentFullNormalizrSchema,
  )
  const normalizedExperiment =
    normalizedExperimentData && normalizedExperimentData.entities.experiments[normalizedExperimentData.result]
  const {
    entities: { metrics: indexedMetrics },
  } = normalize<MetricBare, { metrics: Record<number, MetricBare> }>(metrics, [metricBareNormalizrSchema])
  const {
    entities: { segments: indexedSegments },
  } = normalize<Segment, { segments: Record<number, Segment> }>(segments, [segmentNormalizrSchema])

  const { container } = render(
    <ExperimentDetails
      experiment={experiment}
      indexedMetrics={indexedMetrics}
      indexedSegments={indexedSegments}
      normalizedExperiment={normalizedExperiment}
      normalizedExperimentData={normalizedExperimentData}
    />,
  )

  expect(container).toMatchSnapshot()
})

test('renders as expected at small width', () => {
  window.matchMedia = createMatchMedia(600)
  const metrics = Fixtures.createMetricBares()
  const segments = Fixtures.createSegments(5)
  const experiment = Fixtures.createExperimentFull({
    segmentAssignments: [
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 101, segmentId: 1 }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 102, segmentId: 2, isExcluded: true }),
    ],
  })
  const normalizedExperimentData = normalize<ExperimentFull, ExperimentFullNormalizedEntities>(
    experiment,
    experimentFullNormalizrSchema,
  )
  const normalizedExperiment =
    normalizedExperimentData && normalizedExperimentData.entities.experiments[normalizedExperimentData.result]
  const {
    entities: { metrics: indexedMetrics },
  } = normalize<MetricBare, { metrics: Record<number, MetricBare> }>(metrics, [metricBareNormalizrSchema])
  const {
    entities: { segments: indexedSegments },
  } = normalize<Segment, { segments: Record<number, Segment> }>(segments, [segmentNormalizrSchema])

  const { container } = render(
    <ExperimentDetails
      experiment={experiment}
      indexedMetrics={indexedMetrics}
      indexedSegments={indexedSegments}
      normalizedExperiment={normalizedExperiment}
      normalizedExperimentData={normalizedExperimentData}
    />,
  )

  expect(container).toMatchSnapshot()
})

test('renders as expected with conclusion data', () => {
  const metrics = Fixtures.createMetricBares()
  const segments = Fixtures.createSegments(5)
  const experiment = Fixtures.createExperimentFull({
    conclusionUrl: 'https://betterexperiments.wordpress.com/experiment_1/conclusion',
    deployedVariationId: 2,
    endReason: 'Ran its course.',
    segmentAssignments: [
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 101, segmentId: 1 }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 102, segmentId: 2, isExcluded: true }),
    ],
  })
  const normalizedExperimentData = normalize<ExperimentFull, ExperimentFullNormalizedEntities>(
    experiment,
    experimentFullNormalizrSchema,
  )
  const normalizedExperiment =
    normalizedExperimentData && normalizedExperimentData.entities.experiments[normalizedExperimentData.result]
  const {
    entities: { metrics: indexedMetrics },
  } = normalize<MetricBare, { metrics: Record<number, MetricBare> }>(metrics, [metricBareNormalizrSchema])
  const {
    entities: { segments: indexedSegments },
  } = normalize<Segment, { segments: Record<number, Segment> }>(segments, [segmentNormalizrSchema])

  const { container } = render(
    <ExperimentDetails
      experiment={experiment}
      indexedMetrics={indexedMetrics}
      indexedSegments={indexedSegments}
      normalizedExperiment={normalizedExperiment}
      normalizedExperimentData={normalizedExperimentData}
    />,
  )

  expect(container).toMatchSnapshot()
})

test('renders as expected without conclusion data', () => {
  const metrics = Fixtures.createMetricBares()
  const segments = Fixtures.createSegments(5)
  const experiment = Fixtures.createExperimentFull({
    segmentAssignments: [
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 101, segmentId: 1 }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 102, segmentId: 2, isExcluded: true }),
    ],
  })
  const normalizedExperimentData = normalize<ExperimentFull, ExperimentFullNormalizedEntities>(
    experiment,
    experimentFullNormalizrSchema,
  )
  const normalizedExperiment =
    normalizedExperimentData && normalizedExperimentData.entities.experiments[normalizedExperimentData.result]
  const {
    entities: { metrics: indexedMetrics },
  } = normalize<MetricBare, { metrics: Record<number, MetricBare> }>(metrics, [metricBareNormalizrSchema])
  const {
    entities: { segments: indexedSegments },
  } = normalize<Segment, { segments: Record<number, Segment> }>(segments, [segmentNormalizrSchema])

  const { container } = render(
    <ExperimentDetails
      experiment={experiment}
      indexedMetrics={indexedMetrics}
      indexedSegments={indexedSegments}
      normalizedExperiment={normalizedExperiment}
      normalizedExperimentData={normalizedExperimentData}
    />,
  )

  expect(container).toMatchSnapshot()
})
