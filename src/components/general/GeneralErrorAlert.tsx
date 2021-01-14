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

export default function GeneralErrorAlert({ error }: { error?: Error }): JSX.Element | null {
  const classes = useStyles()

  if (error instanceof HttpResponseError) {
    return (
      <Alert severity='error' className={classes.root}>
        <AlertTitle>
          Error Response: {error.status} {error.response.statusText}
        </AlertTitle>
        {error.json && typeof error.json === 'object' && (error?.json as Record<string | number, unknown>).message}
      </Alert>
    )
  } else if (error instanceof Error) {
    return (
      <Alert severity='error' className={classes.root}>
        <AlertTitle>{error.name}:</AlertTitle>
        {error.message}
      </Alert>
    )
  }

  return null
}
