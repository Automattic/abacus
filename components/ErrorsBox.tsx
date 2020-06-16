import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles({
  root: {
    background: '#f8d7da',
    border: '1px solid #f5c6cb',
    color: '#721c24',
    padding: '1rem',
  },
})

interface Props {
  errors: Error[]
}

/**
 * Renders an array of error messages.
 */
const ErrorsBox = (props: Props) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      {props.errors.map((err) => (
        <React.Fragment key={err.message}>
          <div className='error-box_js'>
            <span>{err.message}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

export default ErrorsBox
