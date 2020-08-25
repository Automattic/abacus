import { Paper, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'

import DatetimeText from '@/components/DatetimeText'
import LabelValueTable from '@/components/LabelValueTable'
import { ExperimentFull } from '@/lib/schemas'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    to: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    title: {
      padding: theme.spacing(1, 2),
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(1),
      },
    },
  }),
)

/**
 * Renders the general information of an experiment in a panel component.
 *
 * @param props.experiment - The experiment with the general information.
 */
function GeneralPanel({ experiment }: { experiment: ExperimentFull }) {
  const classes = useStyles()
  const data = [
    { label: 'Description', value: experiment.description },
    {
      label: 'P2 Link',
      value: (
        <a href={experiment.p2Url} rel='noopener noreferrer' target='_blank'>
          {experiment.p2Url}
        </a>
      ),
    },
    {
      label: 'Dates',
      value: (
        <>
          <DatetimeText datetime={experiment.startDatetime} excludeTime />
          <span className={classes.to}>to</span>
          <DatetimeText datetime={experiment.endDatetime} excludeTime />
        </>
      ),
    },
    { label: 'Owner', value: experiment.ownerLogin },
  ]

  return (
    <Paper>
      <Typography className={classes.title} color='textPrimary' variant='h3'>
        General
      </Typography>
      <LabelValueTable data={data} />
    </Paper>
  )
}

export default GeneralPanel
