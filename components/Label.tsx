import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { ReactNode } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#eee',
      borderRadius: theme.spacing(2),
      padding: theme.spacing(1, 1.5),
    },
  }),
)

/**
 * A simple component for rendering and styling labeled text.
 *
 * Note: Don't confuse this with a label for an input control.
 */
function Label({ className, text }: { className?: string; text: ReactNode }) {
  const classes = useStyles()
  return <span className={clsx(className, classes.root)}>{text}</span>
}

export default Label
