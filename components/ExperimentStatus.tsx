import { Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'

import { Status } from '@/models'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: '3px 5px',
      borderRadius: 3,
      textTransform: 'uppercase',
    },
    completed: {
      color: '#4CAF50',
      background: 'rgba(76, 175, 80, 0.08)',
    },
    running: {
      color: '#FF9800',
      background: 'rgba(255, 152, 0, 0.08)',
    },
    staging: {
      color: '#1E77A5',
      background: 'rgba(30, 119, 165, 0.08)',
    },
    disabled: {
      color: '#828282',
      background: 'rgba(130, 130, 130, 0.08)',
    },
  }),
)

function ExperimentStatus({ status }: { status: Status }) {
  const classes = useStyles()
  return (
    <Typography className={clsx(classes.root, classes[status])} variant='caption'>
      {status}
    </Typography>
  )
}

export default ExperimentStatus
