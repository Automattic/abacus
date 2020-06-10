import { render } from '@testing-library/react'
import React from 'react'

import { ExperimentFull, Platform, Status, Variation } from '@/models'

import ExperimentTabs from './ExperimentTabs'

test('renders nothing when experiment prop is `null`', () => {
  const { container } = render(<ExperimentTabs experiment={null} />)

  expect(container.hasChildNodes()).toBe(false)
})

test('renders expected links', () => {
  // TODO: Get from fixtures.
  const experiment = new ExperimentFull({
    experimentId: 1,
    name: 'experiment_1',
    startDatetime: new Date(Date.UTC(2020, 5, 4)),
    endDatetime: new Date(Date.UTC(2020, 6, 4)),
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
    metricAssignments: [],
    segmentAssignments: [],
  })
  const { getByText } = render(<ExperimentTabs experiment={experiment} />)

  expect(getByText('Details', { selector: 'a' })).toBeInTheDocument()
  expect(getByText('Results', { selector: 'a' })).toBeInTheDocument()
})
