/* istanbul ignore file; for dev use only */

import { Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block',
      padding: theme.spacing(2),
      margin: theme.spacing(2, 0),
      background: '#ffeecf',
      color: '#333',
      maxWidth: '80rem',
    },
    pre: {
      fontFamily: theme.custom.fonts.monospace,
      background: '#fff',
      padding: theme.spacing(2),
      whiteSpace: 'pre',
      overflow: 'auto',
    },
    label: {
      fontFamily: theme.custom.fonts.monospace,
      fontWeight: 'bold',
      fontSize: '1.2rem',
      marginBottom: theme.spacing(2),
      whiteSpace: 'pre',
      overflow: 'auto',
    },
  }),
)

const DebugOutput = ({
  label,
  content,
  className = undefined,
}: {
  label?: string
  content: unknown
  className?: string
}): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={clsx(classes.root, className)}>
      <Typography variant='body1' className={classes.label}>
        {label}
      </Typography>
      <Typography variant='body1' className={classes.pre}>
        {JSON.stringify(content, null, 2)}
      </Typography>
    </div>
  )
}

export default DebugOutput
