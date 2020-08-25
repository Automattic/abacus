import { createStyles, makeStyles, Paper, Theme, Typography } from '@material-ui/core'
import React from 'react'

import LabelValueTable from '@/components/LabelValueTable'
import * as Experiments from '@/lib/experiments'
import { ExperimentFull } from '@/lib/schemas'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      padding: theme.spacing(1, 2),
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(1),
      },
    },
  }),
)

/**
 * Renders the conclusion information of an experiment in a panel component.
 *
 * @param props.experiment - The experiment with the conclusion information.
 */
function ConclusionsPanel({ experiment }: { experiment: ExperimentFull }) {
  const classes = useStyles()

  const deployedVariation = Experiments.getDeployedVariation(experiment)
  const data = [
    { label: 'Reason the experiment ended', value: experiment.endReason },
    {
      label: 'Conclusion URL',
      value: !!experiment.conclusionUrl && (
        <a href={experiment.conclusionUrl} rel='noopener noreferrer' target='_blank'>
          {experiment.conclusionUrl}
        </a>
      ),
    },
    { label: 'Deployed variation', value: deployedVariation?.name },
  ]

  return (
    <Paper>
      <Typography className={classes.title} color='textPrimary' variant='h3'>
        Conclusions
      </Typography>
      <LabelValueTable data={data} />
    </Paper>
  )
}

export default ConclusionsPanel
