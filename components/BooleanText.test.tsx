import { render } from '@testing-library/react'
import React from 'react'

import BooleanText from './BooleanText'

test('renders "no" when value is false', () => {
  const { getByText } = render(<BooleanText value={false} />)

  expect(getByText('No')).toBeInTheDocument()
})

test('renders "yes" when value is true', () => {
  const { getByText } = render(<BooleanText value />)

  expect(getByText('Yes')).toBeInTheDocument()
})
