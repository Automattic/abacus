import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: '.9em',
      fontFamily: theme.custom.fonts.monospace,
      background: theme.palette.grey[100],
      padding: '2px 5px',
    },
  }),
)

export default function Code({ children }: { children: React.ReactNode }): JSX.Element {
  const classes = useStyles()

  return (
    <Typography variant='body1' component='code' className={classes.root}>
      {children}
    </Typography>
  )
}
