import { createStyles, Link, makeStyles, Paper, Theme, Typography } from '@material-ui/core'
import React from 'react'

import Code from '@/components/Code'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
  }),
)

export default function ExperimentCodeSetup() {
  const classes = useStyles()
  return (
    <Paper className={classes.root}>
      <Typography variant='h4'>Experiment Code Setup</Typography>
      <Typography variant='subtitle1' gutterBottom>
        Connect this experiment to your code.
      </Typography>
      <br />
      <Typography variant='h5' gutterBottom>
        Using React
      </Typography>
      <Typography variant='body1'>
        <Link href='https://github.com/Automattic/wp-calypso/tree/master/client/components/experiment'>
          See this Readme
        </Link>
      </Typography>
      <br />
      <Typography variant='h5' gutterBottom>
        Using PHP
      </Typography>
      <Typography variant='body1'>
        See <Code>wp-content/lib/wpcom-abtest/wpcom-experiment.php</Code>
      </Typography>
    </Paper>
  )
}
