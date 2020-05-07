import { render } from '@testing-library/react'
import React from 'react'

import ErrorsBox from './ErrorsBox'

test("renders each error's message", () => {
  const errors = [Error('First error message.'), Error('Second error message.')]
  const { getByText } = render(<ErrorsBox errors={errors} />)

  expect(getByText('First error message.')).toBeInTheDocument()
  expect(getByText('Second error message.')).toBeInTheDocument()
})
