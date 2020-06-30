import { render } from '@testing-library/react'
import React from 'react'

import Fixtures from '@/helpers/fixtures'
import { createMatchMedia } from '@/helpers/test-utils'

import ExperimentDetails from './ExperimentDetails'

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
  const { container } = render(<ExperimentDetails experiment={experiment} metrics={metrics} segments={segments} />)

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
  const { container } = render(<ExperimentDetails experiment={experiment} metrics={metrics} segments={segments} />)

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
  const { container } = render(<ExperimentDetails experiment={experiment} metrics={metrics} segments={segments} />)

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
  const { container } = render(<ExperimentDetails experiment={experiment} metrics={metrics} segments={segments} />)

  expect(container).toMatchSnapshot()
})
