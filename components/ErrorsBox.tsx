import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.error,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.palette.error.main,
      padding: theme.spacing(2),
    },
  }),
)

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
            <Typography color='error'>{err.message}</Typography>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

export default ErrorsBox
