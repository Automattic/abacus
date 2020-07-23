/* eslint-disable no-irregular-whitespace */
import { render } from '@testing-library/react'
import MockDate from 'mockdate'
import React from 'react'

import Fixtures from '@/test-helpers/fixtures'

import ExperimentForm from './ExperimentForm'

test('renders as expected', () => {
  MockDate.set('2020-07-21')
  const { container } = render(
    <ExperimentForm
      metrics={Fixtures.createMetricBares(20)}
      segments={Fixtures.createSegments(20)}
      initialExperiment={{}}
    />,
  )
  expect(container).toMatchSnapshot()
})

test.todo('form works as expected')
