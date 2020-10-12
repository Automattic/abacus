/* eslint-disable @typescript-eslint/no-unsafe-return,@typescript-eslint/explicit-module-boundary-types */
import { act, fireEvent, Queries, render as actualRender, RenderOptions, screen } from '@testing-library/react'
import mediaQuery from 'css-mediaquery'
import { Formik, FormikValues } from 'formik'
import React from 'react'
import { ValidationError } from 'yup'

import ThemeProvider from 'src/styles/ThemeProvider'

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
export const MockFormik = ({
  children,
  initialValues = {},
}: {
  children: React.ReactNode
  initialValues?: FormikValues
}) => {
  return (
    <Formik initialValues={initialValues} onSubmit={() => undefined}>
      {children}
    </Formik>
  )
}

/**
 * Validation Error Displayer
 */
export async function validationErrorDisplayer<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise
  } catch (err) {
    if (err instanceof ValidationError) {
      expect(err.errors).toEqual([])
    }
    throw err
  }
}

/**
 * Change the value in a form field.
 */
export async function changeFieldByRole(role: string, name: RegExp, value: string) {
  const field = screen.getByRole(role, { name: name })
  // eslint-disable-next-line @typescript-eslint/require-await
  await act(async () => {
    fireEvent.change(field, { target: { value: value } })
  })
}
