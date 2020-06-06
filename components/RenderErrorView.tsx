import React from 'react'

import type { RenderError } from '@/components/RenderErrorBoundary'

const RenderErrorView = (props: { renderError: RenderError }) => {
  return (
    <>
      <strong>Oops!</strong>
      <p>{props.renderError.error.message}</p>
      <p>An error occurred. If error persists, please contact the Experiments Platform team.</p>
      <button onClick={props.renderError.clear}>Clear</button>
    </>
  )
}

export default RenderErrorView
