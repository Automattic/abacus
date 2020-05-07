import React from 'react'

interface Props {
  errors: Error[]
}

const ErrorsBox = (props: Props) => {
  return (
    <div className='errors-box'>
      {props.errors.map((err) => (
        <React.Fragment key={err.message}>
          <div className='error-box'>
            <span className='error'>
              <span className='error__msg'>{err.message}</span>
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

export default ErrorsBox
