import { render } from '@testing-library/react'
import React from 'react'

import BadComponent from '@/helpers/BadComponent'

import Layout from './Layout'

test('renders layout with declared title and children', () => {
  const { container } = render(<Layout title='Some Title'>A child.</Layout>)

  // Note: Did not find a nice way to test that the document title is being set.
  // Found https://spectrum.chat/next-js/general/testing-head-in-jest-with-react-testing-library~7957fa45-be54-4673-9f8e-8caa70a48e15
  // but document.title continued to be empty. So, deferring this test to e2e tests.

  expect(container).toHaveTextContent('A child.')

  const headerElmt = container.querySelector('header')
  expect(headerElmt).not.toBeNull()
  // Note: Using snapshots instead of selective expects so that additions, such as
  // new links, are being tested.
  expect(headerElmt).toMatchInlineSnapshot(`
    <header>
      <div
        class="MuiContainer-root MuiContainer-maxWidthLg"
      >
        <nav>
          <a
            href="/"
          >
            Experiments
          </a>
          <span>
            |
          </span>
          <a
            href="/metrics"
          >
            Metrics
          </a>
        </nav>
      </div>
    </header>
  `)

  const footerElmt = container.querySelector('footer')
  expect(footerElmt).not.toBeNull()
  expect(footerElmt).toMatchInlineSnapshot(`
    <footer>
      <hr />
      <div
        class="MuiContainer-root MuiContainer-maxWidthLg"
      >
        <span>
          The Abacus footer, brought to you by Automattic
        </span>
      </div>
    </footer>
  `)
})

test('renders RenderErrorView when has bad children', () => {
  try {
    // Temporarily turn off the error console.
    jest.spyOn(console, 'error')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ;(console.error as jest.Mock).mockImplementation(() => {})

    const { getByText } = render(
      <Layout title='Some Title'>
        <BadComponent />
      </Layout>,
    )

    // Just checking if it appears the RenderErrorView component was rendered and
    // not testing every little detail. That's what RenderErrorView.text.tsx is for.
    expect(getByText('Oops!')).toBeInTheDocument()
    expect(console.error).toHaveBeenCalled()
  } finally {
    ;(console.error as jest.Mock).mockRestore()
  }
})

test('renders an error when it is passed in', () => {
  const err: Error = { name: 'testError', message: 'An error occurred' }
  const { container } = render(
    <Layout title='Some Title' error={err}>
      A child.
    </Layout>,
  )

  expect(container.querySelector('.error-box')).toHaveTextContent('An error occurred')
})
