import React from 'react'

import { render } from '@/test-helpers/test-utils'

import ExperimentCodeSetup from './ExperimentCodeSetup'

test('renders as expected', () => {
  const { container } = render(<ExperimentCodeSetup />)

  expect(container).toMatchSnapshot()
})
