import _ from 'lodash'
import MockDate from 'mockdate'
import React from 'react'

import { createNewExperiment } from '@/lib/experiments'
import * as Normalizers from '@/lib/normalizers'
import Fixtures from '@/test-helpers/fixtures'
import { render } from '@/test-helpers/test-utils'

import ExperimentForm from './ExperimentForm'

// As jest doesn't include scrollIntoView
// eslint-disable-next-line @typescript-eslint/unbound-method
window.HTMLElement.prototype.scrollIntoView = _.noop

test('renders as expected', () => {
  MockDate.set('2020-07-21')
  const { container } = render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={createNewExperiment()}
    />,
  )
  expect(container).toMatchSnapshot()
})

test.todo('form works as expected')
