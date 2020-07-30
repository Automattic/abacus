import { act, fireEvent, screen } from '@testing-library/react'
import { Formik } from 'formik'
import React from 'react'

import { createNewExperiment } from '@/lib/experiments'
import { render } from '@/test-helpers/test-utils'

import Metrics from './Metrics'

test('renders as expected', () => {
  const { container } = render(
    <Formik
      initialValues={{ experiment: createNewExperiment() }}
      onSubmit={
        /* istanbul ignore next; This is unused */
        () => undefined
      }
    >
      {() => <Metrics />}
    </Formik>,
  )
  expect(container).toMatchSnapshot()
})

test('allows adding, editing and removing a Metric Assignment', async () => {
  const { container } = render(
    <Formik
      initialValues={{ experiment: createNewExperiment() }}
      onSubmit={
        /* istanbul ignore next; This is unused */
        () => undefined
      }
    >
      {() => <Metrics />}
    </Formik>,
  )
  expect(container).toMatchSnapshot()

  const metricSearchField = screen.getByRole('button', { name: /Select a Metric/ })
  const metricAddButton = screen.getByRole('button', { name: 'Add metric' })

  fireEvent.click(metricAddButton)

  expect(container).toMatchSnapshot()

  fireEvent.click(metricSearchField)
  fireEvent.keyDown(metricSearchField, { key: 'Enter' })
  fireEvent.click(await screen.findByRole('option', { name: /asdf_7d_refund/ }))
  fireEvent.click(metricAddButton)

  expect(container).toMatchSnapshot()

  const changeExpectedSwitch = screen.getByLabelText(/Change Expected/)

  // eslint-disable-next-line @typescript-eslint/require-await
  await act(async () => {
    fireEvent.click(changeExpectedSwitch)
  })

  const moreMenu = screen.getByRole('button', { name: /more/ })
  fireEvent.click(moreMenu)

  expect(container).toMatchSnapshot()

  const setAsPrimary = screen.getByRole('menuitem', { name: /Set as Primary/ })
  // eslint-disable-next-line @typescript-eslint/require-await
  await act(async () => {
    fireEvent.click(setAsPrimary)
  })

  expect(container).toMatchSnapshot()

  fireEvent.click(moreMenu)
  const remove = screen.getByRole('menuitem', { name: /Remove/ })
  // eslint-disable-next-line @typescript-eslint/require-await
  await act(async () => {
    fireEvent.click(remove)
  })

  expect(container).toMatchSnapshot()

  fireEvent.click(metricSearchField)
  fireEvent.keyDown(metricSearchField, { key: 'Enter' })
  fireEvent.click(await screen.findByRole('option', { name: /registration_start/ }))
  fireEvent.click(metricAddButton)

  expect(container).toMatchSnapshot()
})
