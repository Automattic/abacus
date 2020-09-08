import { fireEvent, getByLabelText, render } from '@testing-library/react'
import MockDate from 'mockdate'
import React from 'react'

import { MockFormik } from '@/test-helpers/test-utils'

import BasicInfo from './BasicInfo'

MockDate.set('2020-07-21')

test('renders as expected', () => {
  const { container } = render(
    <MockFormik>
      <BasicInfo />
    </MockFormik>,
  )
  expect(container).toMatchSnapshot()
})

test('renders sensible dates as expected', () => {
  MockDate.set('2020-07-21')
  const { container } = render(
    <MockFormik initialValues={{ experiment: { startDatetime: '', endDatetime: '' } }}>
      <BasicInfo />
    </MockFormik>,
  )
  const startDateInput = getByLabelText(container, /Start date/)
  const endDateInput = getByLabelText(container, /End date/)

  fireEvent.change(startDateInput, { target: { value: '2020-07-28' } })
  fireEvent.change(endDateInput, { target: { value: '2020-10-28' } })
  expect(container).toMatchSnapshot()
})

test('renders date validation errors as expected', () => {
  MockDate.set('2020-07-21')
  const { container } = render(
    <MockFormik initialValues={{ experiment: { startDatetime: '', endDatetime: '' } }}>
      <BasicInfo />
    </MockFormik>,
  )
  const startDateInput = getByLabelText(container, /Start date/)
  const endDateInput = getByLabelText(container, /End date/)

  // Start date before today
  fireEvent.change(startDateInput, { target: { value: '2020-07-20' } })
  expect(container).toMatchSnapshot()

  // Start date too far into the future
  fireEvent.change(startDateInput, { target: { value: '2025-07-20' } })
  expect(container).toMatchSnapshot()

  // End date before start date
  fireEvent.change(startDateInput, { target: { value: '2020-07-28' } })
  fireEvent.change(endDateInput, { target: { value: '2020-07-20' } })
  expect(container).toMatchSnapshot()

  // End date too far into the future
  fireEvent.change(endDateInput, { target: { value: '2025-07-21' } })
  expect(container).toMatchSnapshot()
})
