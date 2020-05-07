import React from 'react'

interface RenderError {
  clear: () => void
  error: Error
  info: React.ErrorInfo
}

type ChildrenParam0 = {
  renderError: RenderError | null
}

type Props = {
  children: (arg0: ChildrenParam0) => React.ReactNode
  onClear?: () => void
  onError?: (renderError: RenderError) => void
}

type State = {
  error: Error | null
  info: React.ErrorInfo | null
}

/**
 * A render error boundary component.
 *
 * Renders its render prop with an optional `renderError` prop. If `renderError`
 * is not `null`, then the render prop should handle appropriately for the best UX.
 *
 *     import RenderErrorBoundary from '.../RenderErrorBoundary'
 *
 *     const MyComponent = () => {
 *       const handleRenderError = (renderError) => {
 *         const { error, info } = renderError
 *         console.error('Render Error:\n\n', error, info)
 *       }
 *
 *       return (
 *         <RenderErrorBoundary onError={handleRenderError}>
 *           {({ renderError }) => (
 *             <React.Fragment>
 *               {renderError
 *                 ? <RenderErrorNotification renderError={renderError} />
 *                 : <Etc />
 *               }
 *             </React.Fragment>
 *           )}
 *         </RenderErrorBoundary>
 *       )
 *     }
 *
 * A `renderError` has a `clear` function that can be used to clear the error.
 *
 *     const RenderErrorNotification = ({ renderError }) => {
 *       return (
 *         <div>
 *           <h1>An error occurred!</h1>
 *           <p>{renderError.error.message}</p>
 *           <button onClick={renderError.clear}>Clear</button>
 *         </div>
 *       )
 *     }
 *
 * @see https://reactjs.org/docs/error-boundaries.htm
 */
class RenderErrorBoundary extends React.PureComponent<Props, State> {
  state = { error: null, info: null }

  clear = () => {
    this.setState(
      {
        error: null,
        info: null,
      },
      () => {
        if (this.props.onClear) {
          this.props.onClear()
        }
      },
    )
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error, info })
    if (this.props.onError) {
      const renderError = {
        clear: this.clear,
        error,
        info,
      }
      this.props.onError(renderError)
    }
  }

  render() {
    const { error, info } = this.state
    const childrenArg = {
      renderError: (error && info
        ? {
            clear: this.clear,
            error,
            info,
          }
        : null) as RenderError | null,
    }
    return this.props.children(childrenArg)
  }
}

export type { RenderError }

export default RenderErrorBoundary
