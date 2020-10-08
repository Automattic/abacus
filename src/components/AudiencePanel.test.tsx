import React from 'react'
import RenderErrorBoundary from 'src/components/RenderErrorBoundary'
import Fixtures from 'src/test-helpers/fixtures'
import { render } from 'src/test-helpers/test-utils'

import AudiencePanel from './AudiencePanel'

test('renders as expected with no segment assignments', () => {
  const experiment = Fixtures.createExperimentFull({ segmentAssignments: [] })
  const { container } = render(<AudiencePanel experiment={experiment} segments={[]} />)

  expect(container).toMatchSnapshot()
})

test('renders as expected with existing users allowed', () => {
  const experiment = Fixtures.createExperimentFull({
    segmentAssignments: [],
    existingUsersAllowed: true,
  })
  const { container } = render(<AudiencePanel experiment={experiment} segments={[]} />)

  expect(container).toMatchSnapshot()
})

test('renders as expected with all segments resolvable', () => {
  const segments = Fixtures.createSegments(5)
  const experiment = Fixtures.createExperimentFull({
    segmentAssignments: [
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 1, segmentId: 1 }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 2, segmentId: 2, isExcluded: true }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 3, segmentId: 3, isExcluded: true }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 4, segmentId: 4 }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 5, segmentId: 5 }),
    ],
  })
  const { container } = render(<AudiencePanel experiment={experiment} segments={segments} />)

  expect(container).toMatchSnapshot()
})

test('throws an error when some segments not resolvable', () => {
  const segments = Fixtures.createSegments(5)
  const experiment = Fixtures.createExperimentFull({
    segmentAssignments: [
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 1, segmentId: 1 }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 2, segmentId: 2, isExcluded: true }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 3, segmentId: 3, isExcluded: true }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 4, segmentId: 4 }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 5, segmentId: 10 }),
    ],
  })

  // Note: This console.error spy is mainly used to suppress the output that the
  // `render` function outputs.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const consoleErrorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {})
  try {
    render(
      <RenderErrorBoundary>{() => <AudiencePanel experiment={experiment} segments={segments} />}</RenderErrorBoundary>,
    )
    expect(false).toBe(true) // Should never be reached
  } catch (err) {
    expect(consoleErrorSpy).toHaveBeenCalled()
  } finally {
    consoleErrorSpy.mockRestore()
  }
})

test('Shows exposure events', () => {
  const experiment = Fixtures.createExperimentFull({
    segmentAssignments: [],
    exposureEvents: [
      {
        event: 'test',
        props: {
          prop1: 'value1',
        },
      },
    ],
  })
  const { container } = render(<AudiencePanel experiment={experiment} segments={[]} />)
  expect(container).toMatchSnapshot()
})

test('Empty array shows no exposure events', () => {
  const experiment = Fixtures.createExperimentFull({
    segmentAssignments: [],
    exposureEvents: [],
  })
  const { container } = render(<AudiencePanel experiment={experiment} segments={[]} />)
  expect(container).toMatchSnapshot()
})

test('null shows no exposure events', () => {
  const experiment = Fixtures.createExperimentFull({
    segmentAssignments: [],
    exposureEvents: null,
  })
  const { container } = render(<AudiencePanel experiment={experiment} segments={[]} />)
  expect(container).toMatchSnapshot()
})
