import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Alert, AlertTitle } from '@material-ui/lab'
import React from 'react'

import HttpResponseError from 'src/api/HttpResponseError'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2, 0),
    },
  }),
)

export default function ServerErrorAlert({ error }: { error?: Error }): JSX.Element {
  const classes = useStyles()
  return (
    <>
      {error && error instanceof HttpResponseError && (
        <Alert severity='error' className={classes.root}>
          <AlertTitle>
            Server Error: {error.status} {error.response.statusText}
          </AlertTitle>
          {error.json && typeof error.json === 'object' && (error?.json as Record<string | number, unknown>).message}
        </Alert>
      )}
    </>
  )
}
