import { Queries, render as actualRender, RenderOptions } from '@testing-library/react'
import mediaQuery from 'css-mediaquery'
import { Formik } from 'formik'
import React from 'react'

import ThemeProvider from '@/styles/ThemeProvider'

/**
 * A wrapped unit-test react-renderer, useful for adding React Contexts globally.
 */
export const render: typeof actualRender = <Q extends Queries>(ui: React.ReactElement, options?: RenderOptions<Q>) =>
  actualRender((<ThemeProvider>{ui}</ThemeProvider>) as React.ReactElement, options) as ReturnType<typeof actualRender>

/**
 * Create a `matchMedia` function that will match a query based on the specified
 * width.
 *
 *     const initialJsDomWindowInnerWidth = window.innerWidth
 *     afterEach(() => {
 *       // Reset back to initial width for tests that don't explicitly set the width
 *       // themselves.
 *       window.matchMedia = createMatchMedia(initialJsDomWindowInnerWidth)
 *     })
 *
 *     test('...', () => {
 *       window.matchMedia = createMatchMedia(600)
 *       ...
 *     })
 *
 * @param width - The width of the window to simulate.
 */
export function createMatchMedia(width: number) {
  return (query: string) => ({
    matches: mediaQuery.match(query, { width }),
    media: query,
    addEventListener: jest.fn(),
    addListener: jest.fn(),
    dispatchEvent: jest.fn(),
    onchange: jest.fn(),
    removeEventListener: jest.fn(),
    removeListener: jest.fn(),
  })
}

/**
 * Mock Formik for rendering Formik components when you don't care about the formik connection.
 */
export const MockFormik = ({ children }: { children: React.ReactNode }) => {
  return (
    <Formik
      initialValues={{}}
      onSubmit={
        /* istanbul ignore next; This is unused */
        () => undefined
      }
    >
      {children}
    </Formik>
  )
}
