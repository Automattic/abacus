import { Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'

import { Status } from '@/lib/schemas'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontFamily: theme.custom.fonts.monospace,
    },
    completed: {
      backgroundColor: '#4CAF50',
    },
    running: {
      backgroundColor: '#FF9800',
    },
    staging: {
      backgroundColor: '#1E77A5',
    },
    disabled: {
      backgroundColor: '#828282',
    },
    statusDot: {
      display: 'inline-block',
      borderRadius: 100,
      height: '.8em',
      width: '.8em',
      verticalAlign: 'middle',
    },
  }),
)

function ExperimentStatus({ status }: { status: Status }): JSX.Element {
  const classes = useStyles()
  return (
    <span className={classes.root}>
      <span className={clsx(classes.statusDot, classes[status])} /> {status}
    </span>
  )
}

export default ExperimentStatus
