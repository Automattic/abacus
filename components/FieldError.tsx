import debugFactory from 'debug'
import React from 'react'

const debug = debugFactory('project:components/FieldError.tsx')

interface Props {
  error?: string
  touched: boolean | undefined
}

function FieldError(props: Props) {
  debug('FieldError#render')
  return (
    (props.touched && props.error && (
      <div className='prompt label' role='alert' aria-atomic='true'>
        {props.error}
      </div>
    )) ||
    null
  )
}

export default FieldError
