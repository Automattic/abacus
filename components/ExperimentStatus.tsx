import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'

import { Status } from '@/models'

const useStatusStyles = makeStyles({
  root: {
    borderRadius: 1,
    padding: '0.5rem',
  },
  completed: {
    background: '#4caf5014',
    color: '#4caf50',
  },
  disabled: {
    background: '#82828214',
    color: '#828282',
  },
  running: {
    background: '#ff980014',
    color: '#ff9800',
  },
  staging: {
    background: '#82828214',
    color: '#828282',
  },
})

function ExperimentStatus({ status }: { status: Status }) {
  const classes = useStatusStyles()
  return <span className={clsx(classes.root, classes[status])}>{status}</span>
}

export default ExperimentStatus
