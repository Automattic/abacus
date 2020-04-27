import { render } from '@testing-library/react'
import React from 'react'

import Layout from './Layout'

test('renders layout with declared title and children', () => {
  const { container } = render(<Layout title='Some Title'>A child.</Layout>)

  const divElmt = container.firstChild
  if (divElmt) {
    expect(divElmt.nodeName).toBe('DIV')
  } else {
    expect(divElmt).not.toBe(null)
  }
  // TODO: Make expectations more thorough.
})
