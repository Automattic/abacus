import React from 'react'

import Fixtures from '@/test-helpers/fixtures'
import { render } from '@/test-helpers/test-utils'

import { ExperimentView } from './ExperimentPageView'
import ExperimentTabs from './ExperimentTabs'

test('renders expected links', () => {
  const experiment = Fixtures.createExperimentFull({
    metricAssignments: [],
    segmentAssignments: [],
  })
  const { getByText } = render(<ExperimentTabs experimentId={experiment.experimentId} tab={ExperimentView.Overview} />)

  expect(getByText('Overview', { selector: '.MuiTab-wrapper' })).toBeInTheDocument()
  expect(getByText('Results', { selector: '.MuiTab-wrapper' })).toBeInTheDocument()
  expect(getByText('Code Setup', { selector: '.MuiTab-wrapper' })).toBeInTheDocument()
})
