import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import React from 'react'

import type { RenderError } from 'src/components/page-parts/RenderErrorBoundary'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    pre: {
      overflow: 'scroll',
      maxHeight: '10rem',
      background: '#f5f5f5',
      padding: theme.spacing(2),
      marginTop: 0,
    },
  }),
)

export default function (props: { renderError: RenderError }): JSX.Element {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Dialog open={true} maxWidth={false}>
        <DialogTitle disableTypography>
          <Typography variant='h5'>Oops! Something went wrong...</Typography>
        </DialogTitle>
        <DialogContent>
          <pre className={classes.pre}>{props.renderError.error.stack || props.renderError.error.message}</pre>
          <Typography>If error persists, please contact the Experiments Platform team.</Typography>
        </DialogContent>
        <DialogActions>
          <Button component={'a'} href='/'>
            Go to home
          </Button>
          <Button onClick={props.renderError.clear} color='primary'>
            Try again
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
