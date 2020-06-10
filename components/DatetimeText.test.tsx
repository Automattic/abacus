import { render } from '@testing-library/react'
import React from 'react'

import DatetimeText from './DatetimeText'

test('renders as ISO 8601 UTC', () => {
  const input = new Date(Date.UTC(2020, 4, 2))
  const { getByText, getByTitle } = render(<DatetimeText value={input} />)

  expect(getByText('2020-05-02T00:00:00.000Z')).toBeInTheDocument()
  // The following test is locale dependent.
  expect(getByTitle(input.toLocaleString())).toBeInTheDocument()
})

test('renders as ISO 8601 UTC without time', () => {
  const input = new Date(Date.UTC(2020, 4, 2))
  const { getByText, getByTitle } = render(<DatetimeText time={false} value={input} />)

  expect(getByText('2020-05-02')).toBeInTheDocument()
  // The following test is locale dependent.
  expect(getByTitle(input.toLocaleString())).toBeInTheDocument()
})
