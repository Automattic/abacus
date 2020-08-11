import noop from 'lodash/noop'
import MockDate from 'mockdate'
import * as notistack from 'notistack'
import React from 'react'

import { createInitialExperiment } from '@/lib/experiments'
import * as Normalizers from '@/lib/normalizers'
import Fixtures from '@/test-helpers/fixtures'
import { render } from '@/test-helpers/test-utils'

import ExperimentForm from './ExperimentForm'

jest.mock('notistack')
const mockedNotistack = notistack as jest.Mocked<typeof notistack>
mockedNotistack.useSnackbar.mockImplementation(() => ({
  enqueueSnackbar: jest.fn(),
  closeSnackbar: jest.fn(),
}))

// As jest doesn't include scrollIntoView
window.HTMLElement.prototype.scrollIntoView = noop

test('renders as expected', () => {
  MockDate.set('2020-07-21')

  // eslint-disable-next-line @typescript-eslint/require-await
  const onSubmit = async () => undefined

  const { container } = render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={createInitialExperiment()}
      onSubmit={onSubmit}
    />,
  )
  expect(container).toMatchSnapshot()
})

test.todo('form works as expected')
