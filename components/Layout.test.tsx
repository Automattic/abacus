import { render } from '@testing-library/react'
import React from 'react'

import Layout from './Layout'

test('should render a span by default', () => {
  const { container } = render(<Layout title='atitle'></Layout>)

  const textElmt = container.firstChild
  expect(textElmt.nodeName).toBe('SPAN')
  expect(textElmt).toHaveClass('text')
})
