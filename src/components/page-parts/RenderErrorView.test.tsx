/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react'

import { render } from 'src/test-helpers/test-utils'

import RenderErrorView from './RenderErrorView'

test('renders error stack when available', () => {
  const renderError = {
    clear: jest.fn(),
    error: Error('The error message.'),
    info: expect.any(Object),
  }
  const { container } = render(<RenderErrorView renderError={renderError} />)

  expect(container).toMatchSnapshot()
})

test(`renders error message when stack isn't available`, () => {
  const renderError = {
    clear: jest.fn(),
    error: { message: 'the error message' } as Error,
    info: expect.any(Object),
  }
  const { container } = render(<RenderErrorView renderError={renderError} />)

  expect(container).toMatchSnapshot()
})
