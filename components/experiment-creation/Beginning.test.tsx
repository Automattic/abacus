import { render } from '@testing-library/react'
import React from 'react'

import Beginning from './Beginning'

test('renders without crashing', () => {
  render(<Beginning />)
})
