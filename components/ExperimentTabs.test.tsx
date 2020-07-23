import React from 'react'

import Fixtures from '@/test-helpers/fixtures'
import { render } from '@/test-helpers/test-utils'

import ExperimentTabs from './ExperimentTabs'

test('renders expected links', () => {
  const experiment = Fixtures.createExperimentFull({
    metricAssignments: [],
    segmentAssignments: [],
  })
  const { getByText } = render(<ExperimentTabs experiment={experiment} tab='details' />)

  expect(getByText('Details', { selector: '.MuiTab-wrapper' })).toBeInTheDocument()
  expect(getByText('Results', { selector: '.MuiTab-wrapper' })).toBeInTheDocument()
  expect(getByText('Snippets', { selector: '.MuiTab-wrapper' })).toBeInTheDocument()
})
