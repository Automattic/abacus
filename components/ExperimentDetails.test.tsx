import { render } from '@testing-library/react'
import React from 'react'

import Fixtures from '@/helpers/fixtures'

import ExperimentDetails from './ExperimentDetails'

test('renders as expected', () => {
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
