import { createStyles, makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.grey[500],
      fontWeight: 'normal',
    },
  }),
)

/**
 * Attribute is a UI element to indicate another element has a certain state.
 * Similar to chips but low profile.
 *
 * e.g. "default", "primary", "excluded"
 */
export default function Attribute({
  name,
  className,
}: {
  /**
   * Name of the attribute.
   */
  name: string
  className?: string
}): JSX.Element {
  const classes = useStyles()

  return <span className={clsx(classes.root, className)}>{name}</span>
}
