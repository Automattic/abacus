import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import RenderErrorBoundary from './RenderErrorBoundary'

const obj = {}

function BadComponent() {
  // Need a component that will fail when React attempts to render but also need
  // something that TypeScript will compile. The type assertion allows TS to
  // compile successfully but because we essentially lied to TS, it will fail as
  // runtime.
  return <>{(obj as { nonExistent: { boom: 'shaka laka' } }).nonExistent.boom}</>
}

test('renders error boundary with declared render prop when render prop does not error', () => {
  const { container } = render(<RenderErrorBoundary>{() => <>A child.</>}</RenderErrorBoundary>)

  expect(container).toHaveTextContent('A child.')
})

test('passes render prop an argument object with a null `renderError` property when render prop does not error', () => {
  const mockRenderProp = jest.fn(() => <>A child.</>)
  const { container } = render(<RenderErrorBoundary>{mockRenderProp}</RenderErrorBoundary>)

  expect(mockRenderProp).toHaveBeenCalledTimes(1)
  expect(mockRenderProp).toHaveBeenCalledWith({ renderError: null })
  expect(container).toHaveTextContent('A child.')
})

test('RenderErrorBoundary called without `onClear` or `onError` passes render prop an argument object with a `renderError` property with an error, info, and a clear function when render prop errors', () => {
  try {
    // Temporarily turn off the error console.
    jest.spyOn(console, 'error')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ;(console.error as jest.Mock).mockImplementation(() => {})

    const mockRenderProp = jest.fn(({ renderError }) => {
      return (
        <>
          {renderError === null ? (
            <BadComponent />
          ) : (
            <>
              <p>Oh no! Not again!</p>
              <button onClick={renderError.clear}>Clear</button>
            </>
          )}
        </>
      )
    })

    const { container, getByText } = render(<RenderErrorBoundary>{mockRenderProp}</RenderErrorBoundary>)

    const error = expect.any(Error)
    const info = expect.any(Object)
    const clear = expect.any(Function)

    // At this point, after rendering, the render prop will have been called with
    // no renderError. Then when the BadComponent is rendered, the error boundary
    // catches the issue and the render prop is called with the renderError and
    // the error notification code is displayed.
    expect(mockRenderProp).toHaveBeenNthCalledWith(1, { renderError: null })
    expect(mockRenderProp).toHaveBeenNthCalledWith(2, { renderError: { clear, error, info } })
    expect(mockRenderProp).toHaveBeenCalledTimes(2)
    expect(container).toHaveTextContent('Oh no! Not again!')

    fireEvent.click(getByText('Clear'))

    // After the user clears the error, an attempt to render BadComponent is made
    // but it will fail again because nothing has changed.
    expect(mockRenderProp).toHaveBeenNthCalledWith(3, { renderError: null })
    expect(mockRenderProp).toHaveBeenNthCalledWith(4, { renderError: { clear, error, info } })
    expect(mockRenderProp).toHaveBeenCalledTimes(4)
  } finally {
    ;(console.error as jest.Mock).mockRestore()
  }
})

test('RenderErrorBoundary called with `onClear` or `onError` passes render prop an argument object with a `renderError` property with an error, info, and a clear function when render prop errors', () => {
  try {
    // Temporarily turn off the error console.
    jest.spyOn(console, 'error')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ;(console.error as jest.Mock).mockImplementation(() => {})

    const mockRenderProp = jest.fn(({ renderError }) => {
      return (
        <>
          {renderError === null ? (
            <BadComponent />
          ) : (
            <>
              <p>Oh no! Not again!</p>
              <button onClick={renderError.clear}>Clear</button>
            </>
          )}
        </>
      )
    })

    const onClear = jest.fn()
    const onError = jest.fn()
    const { container, getByText } = render(
      <RenderErrorBoundary onClear={onClear} onError={onError}>
        {mockRenderProp}
      </RenderErrorBoundary>,
    )

    const error = expect.any(Error)
    const info = expect.any(Object)
    const clear = expect.any(Function)

    expect(onClear).toHaveBeenCalledTimes(0)

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenNthCalledWith(1, { clear, error, info })

    // At this point, after rendering, the render prop will have been called with
    // no renderError. Then when the BadComponent is rendered, the error boundary
    // catches the issue and the render prop is called with the renderError and
    // the error notification code is displayed.
    expect(mockRenderProp).toHaveBeenNthCalledWith(1, { renderError: null })
    expect(mockRenderProp).toHaveBeenNthCalledWith(2, { renderError: { clear, error, info } })
    expect(mockRenderProp).toHaveBeenCalledTimes(2)
    expect(container).toHaveTextContent('Oh no! Not again!')

    fireEvent.click(getByText('Clear'))

    // After the user clicks the Clear button, the onClear callback should have
    // been called.
    expect(onClear).toHaveBeenCalledTimes(1)

    expect(onError).toHaveBeenCalledTimes(2)
    expect(onError).toHaveBeenNthCalledWith(2, { clear, error, info })

    // After the user clears the error, an attempt to render BadComponent is made
    // but it will fail again because nothing has changed.
    expect(mockRenderProp).toHaveBeenNthCalledWith(3, { renderError: null })
    expect(mockRenderProp).toHaveBeenNthCalledWith(4, { renderError: { clear, error, info } })
    expect(mockRenderProp).toHaveBeenCalledTimes(4)
  } finally {
    ;(console.error as jest.Mock).mockRestore()
  }
})
