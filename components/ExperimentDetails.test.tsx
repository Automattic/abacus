import React from 'react'

import Fixtures from '@/helpers/fixtures'
import { render } from '@/helpers/test-utils'

import ExperimentDetails from './ExperimentDetails'

test('renders as expected', () => {
  const segments = Fixtures.createSegments(5)
  const experiment = Fixtures.createExperimentFull({
    segmentAssignments: [
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 101, segmentId: 1 }),
      Fixtures.createSegmentAssignment({ segmentAssignmentId: 102, segmentId: 2, isExcluded: true }),
    ],
  })
  const { container } = render(<ExperimentDetails experiment={experiment} segments={segments} />)

  expect(container).toMatchSnapshot()
})
