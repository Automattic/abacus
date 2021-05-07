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
    },
    dialogContent: {
      maxWidth: 562,
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
        <DialogContent className={classes.dialogContent}>
          <img
            src='/img/hippo-with-turtle.jpg'
            alt={`"hippo" by .wilkie is licensed with CC BY-NC-SA 2.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/2.0/`}
          />
          <pre className={classes.pre}>{props.renderError.error.stack || props.renderError.error.message}</pre>
        </DialogContent>
        <DialogActions>
          <Button component={'a'} href='/'>
            Go home
          </Button>
          <Button onClick={props.renderError.clear} color='primary'>
            Try again
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
