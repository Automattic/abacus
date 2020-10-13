import { CircularProgress } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: theme.spacing(2),
      '& .MuiButton-root': {
        marginLeft: 0,
      },
      position: 'relative',
    },
    progress: {
      color: theme.palette.secondary.main,
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
)

const LoadingButtonContainer = ({
  isLoading,
  children,
}: {
  isLoading: boolean
  children: React.ReactNode
}): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {children}
      {isLoading && <CircularProgress size={24} className={classes.progress} />}
    </div>
  )
}

export default LoadingButtonContainer
