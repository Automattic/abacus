import React from 'react'

import type { RenderError } from '@/components/RenderErrorBoundary'

type Props = {
  renderError: RenderError
}

const RenderErrorView = (props: Props) => {
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
