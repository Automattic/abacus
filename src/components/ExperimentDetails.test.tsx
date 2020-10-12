import { noop } from 'lodash'
import MockDate from 'mockdate'
import * as notistack from 'notistack'
import React from 'react'

import { Status } from 'src/lib/schemas'
import Fixtures from 'src/test-helpers/fixtures'
import { createMatchMedia, render } from 'src/test-helpers/test-utils'

import ExperimentDetails from './ExperimentDetails'

MockDate.set('2020-07-21')

jest.mock('notistack')
const mockedNotistack = notistack as jest.Mocked<typeof notistack>
mockedNotistack.useSnackbar.mockImplementation(() => ({
  enqueueSnackbar: jest.fn(),
  closeSnackbar: jest.fn(),
}))

const initialJsDomWindowInnerWidth = window.innerWidth
afterEach(() => {
  window.matchMedia = createMatchMedia(initialJsDomWindowInnerWidth)
})

const experimentReloadRef: React.MutableRefObject<() => void> = { current: noop }

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
  const { container } = render(
    <ExperimentDetails
      experiment={experiment}
      metrics={metrics}
      segments={segments}
      experimentReloadRef={experimentReloadRef}
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
  const { container } = render(
    <ExperimentDetails
      experiment={experiment}
      metrics={metrics}
      segments={segments}
      experimentReloadRef={experimentReloadRef}
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
    status: Status.Disabled,
  })
  const { container } = render(
    <ExperimentDetails
      experiment={experiment}
      metrics={metrics}
      segments={segments}
      experimentReloadRef={experimentReloadRef}
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
  const { container } = render(
    <ExperimentDetails
      experiment={experiment}
      metrics={metrics}
      segments={segments}
      experimentReloadRef={experimentReloadRef}
    />,
  )

  expect(container).toMatchSnapshot()
})
