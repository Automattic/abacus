import React from 'react'

import { render } from 'src/test-helpers/test-utils'

import ExperimentCodeSetup from './ExperimentCodeSetup'

test('renders as expected', () => {
  const { container } = render(<ExperimentCodeSetup />)

  expect(container).toMatchSnapshot()
})
