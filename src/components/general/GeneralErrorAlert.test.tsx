import { StatusCodes } from 'http-status-codes'
import React from 'react'

import HttpResponseError from 'src/api/HttpResponseError'
import { render } from 'src/test-helpers/test-utils'

import GeneralErrorAlert from './GeneralErrorAlert'

test('renders nothing for no error', () => {
  const { container } = render(<GeneralErrorAlert />)
  expect(container).toMatchSnapshot()
})

test('renders an HttpResponseError with server message in JSON', () => {
  const error = new HttpResponseError(StatusCodes.BAD_REQUEST)
  error.response = new Response(
    '{"code":"invalid_name","message":"The experiment name is already taken","data":{"status":400}}',
  )
  error.json = { code: 'invalid_name', message: 'The experiment name is already taken', data: { status: 400 } }
  const { container } = render(<GeneralErrorAlert error={error} />)
  expect(container).toMatchSnapshot()
})

test('renders an HttpResponseError without server message in JSON', () => {
  const error = new HttpResponseError(StatusCodes.BAD_REQUEST)
  const { container } = render(<GeneralErrorAlert error={error} />)
  expect(container).toMatchSnapshot()
})

test('renders an generic Error', () => {
  const error = new Error('This is a generic error')
  const { container } = render(<GeneralErrorAlert error={error} />)
  expect(container).toMatchSnapshot()
})
