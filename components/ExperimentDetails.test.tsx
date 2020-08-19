import MockDate from 'mockdate'
import React from 'react'

import Fixtures from '@/test-helpers/fixtures'
import { createMatchMedia, render } from '@/test-helpers/test-utils'

import ExperimentDetails from './ExperimentDetails'
import { normalizeExperiment, indexMetrics, indexSegments } from '@/lib/normalizers'

MockDate.set('2020-07-21')

const initialJsDomWindowInnerWidth = window.innerWidth
afterEach(() => {
  window.matchMedia = createMatchMedia(initialJsDomWindowInnerWidth)
})

test('renders as expected at large width', () => {
  window.matchMedia = createMatchMedia(1600)

  const metrics = Fixtures.createMetricBares()
  const segments = Fixtures.createSegments(5)
  const indexedMetrics = indexMetrics(metrics)
  const indexedSegments = indexSegments(segments)
  const experiment = Fixtures.createExperimentFull({
    segmentAssignments: [
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 101, segmentId: 1 }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 102, segmentId: 2, isExcluded: true }),
    ],
  })
  const [normalizedExperiment, normalizedExperimentData] = normalizeExperiment(experiment)
  const { container } = render(<ExperimentDetails {...{ experiment, normalizedExperiment, normalizedExperimentData, indexedMetrics, indexedSegments, metrics, segments }} />)

  expect(container).toMatchSnapshot()
})

test('renders as expected at small width', () => {
  window.matchMedia = createMatchMedia(600)
  const metrics = Fixtures.createMetricBares()
  const segments = Fixtures.createSegments(5)
  const indexedMetrics = indexMetrics(metrics)
  const indexedSegments = indexSegments(segments)
  const experiment = Fixtures.createExperimentFull({
    segmentAssignments: [
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 101, segmentId: 1 }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 102, segmentId: 2, isExcluded: true }),
    ],
  })
  const [normalizedExperiment, normalizedExperimentData] = normalizeExperiment(experiment)
  const { container } = render(<ExperimentDetails {...{ experiment, normalizedExperiment, normalizedExperimentData, indexedMetrics, indexedSegments, metrics, segments }} />)

  expect(container).toMatchSnapshot()
})

test('renders as expected with conclusion data', () => {
  const metrics = Fixtures.createMetricBares()
  const segments = Fixtures.createSegments(5)
  const indexedMetrics = indexMetrics(metrics)
  const indexedSegments = indexSegments(segments)
  const experiment = Fixtures.createExperimentFull({
    conclusionUrl: 'https://betterexperiments.wordpress.com/experiment_1/conclusion',
    deployedVariationId: 2,
    endReason: 'Ran its course.',
    segmentAssignments: [
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 101, segmentId: 1 }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 102, segmentId: 2, isExcluded: true }),
    ],
  })
  const [normalizedExperiment, normalizedExperimentData] = normalizeExperiment(experiment)
  const { container } = render(<ExperimentDetails {...{ experiment, normalizedExperiment, normalizedExperimentData, indexedMetrics, indexedSegments, metrics, segments }} />)

  expect(container).toMatchSnapshot()
})

test('renders as expected without conclusion data', () => {
  const metrics = Fixtures.createMetricBares()
  const segments = Fixtures.createSegments(5)
  const indexedMetrics = indexMetrics(metrics)
  const indexedSegments = indexSegments(segments)
  const experiment = Fixtures.createExperimentFull({
    segmentAssignments: [
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 101, segmentId: 1 }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 102, segmentId: 2, isExcluded: true }),
    ],
  })
  const [normalizedExperiment, normalizedExperimentData] = normalizeExperiment(experiment)
  const { container } = render(<ExperimentDetails {...{ experiment, normalizedExperiment, normalizedExperimentData, indexedMetrics, indexedSegments, metrics, segments }} />)

  expect(container).toMatchSnapshot()
})
