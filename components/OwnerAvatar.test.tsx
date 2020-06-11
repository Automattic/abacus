import { render } from '@testing-library/react'
import React from 'react'

import OwnerAvatar from './OwnerAvatar'

test('renders initials of login', () => {
  const { getByText } = render(<OwnerAvatar ownerLogin='foo_bar' />)

  expect(getByText('FB')).toBeInTheDocument()
})
