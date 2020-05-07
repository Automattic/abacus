import { render } from '@testing-library/react'
import React from 'react'

import RenderErrorView from './RenderErrorView'

test('renders error boundary with declared render prop when render prop does not error', () => {
  const renderError = {
    clear: jest.fn(),
    error: Error('The error message.'),
    info: expect.any(Object),
  }
  const { getByText } = render(<RenderErrorView renderError={renderError} />)

  // Just assert we are getting the basic structure and test as expected. Nothing
  // too complicated. This will always be tightly coupled with the implementation.
  expect(getByText('Oops!')).toBeInTheDocument()
  expect(getByText('The error message.')).toBeInTheDocument()
  expect(
    getByText('An error occurred. If error persists, please contact the Experiments Platform team.'),
  ).toBeInTheDocument()
  expect(getByText('Clear')).toBeInTheDocument()
})
