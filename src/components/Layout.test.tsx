import React from 'react'

import { render } from 'src/test-helpers/test-utils'

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
    <header
      class="MuiPaper-root MuiAppBar-root MuiAppBar-positionRelative MuiAppBar-colorPrimary makeStyles-appBar-4 MuiPaper-elevation4"
    >
      <div
        class="makeStyles-appBarTop-6"
      >
        <a
          class="MuiContainer-root makeStyles-appLogotype-8 MuiContainer-maxWidthLg"
          href="/"
        >
          <img
            alt="logo"
            class="makeStyles-appLogo-7"
            src="/img/logo.png"
          />
          <span
            class="makeStyles-appName-9"
          >
            Abacus
          </span>
        </a>
      </div>
      <div
        class="makeStyles-appBarBottom-5"
      >
        <div
          class="MuiContainer-root MuiContainer-maxWidthLg"
        >
          <nav
            class="makeStyles-appNav-10"
          >
            <a
              href="/experiments"
            >
              Experiments
            </a>
            <a
              href="/experiments/new"
            >
              Create Experiment
            </a>
            <a
              href="/metrics"
            >
              Metrics
            </a>
          </nav>
        </div>
      </div>
    </header>
  `)

  const footerElmt = container.querySelector('footer')
  expect(footerElmt).not.toBeNull()
  expect(footerElmt).toMatchInlineSnapshot(`
    <footer
      class="makeStyles-footer-13"
    >
      <div
        class="MuiContainer-root MuiContainer-maxWidthLg"
      >
        <p
          class="MuiTypography-root MuiTypography-body1"
        >
          The Abacus footer. Brought to you by Automattic.
        </p>
      </div>
    </footer>
  `)
})
