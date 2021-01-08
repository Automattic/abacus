import React from 'react'

import HttpResponseError from 'src/api/HttpResponseError'
import { render } from 'src/test-helpers/test-utils'

import ServerErrorAlert from './ServerErrorAlert'

test('renders nothing for no error', () => {
  const { container } = render(<ServerErrorAlert />)
  expect(container).toMatchSnapshot()
})

test('renders an HttpResponseError with server message in JSON', () => {
  const error = new HttpResponseError(400)
  error.response = new Response(
    '{"code":"invalid_name","message":"The experiment name is already taken","data":{"status":400}}',
  )
  error.json = { code: 'invalid_name', message: 'The experiment name is already taken', data: { status: 400 } }
  const { container } = render(<ServerErrorAlert error={error} />)
  expect(container).toMatchSnapshot()
})

test('renders an HttpResponseError without server message in JSON', () => {
  const error = new HttpResponseError(400)
  const { container } = render(<ServerErrorAlert error={error} />)
  expect(container).toMatchSnapshot()
})
