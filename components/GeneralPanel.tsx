import { Paper, Typography, Toolbar, Button } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { Edit } from '@material-ui/icons'
import { useSnackbar } from 'notistack'
import _ from 'lodash'

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
      flexGrow: 1,
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

  // Edit Modal
  const { enqueueSnackbar } = useSnackbar()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditing, setIsEditing] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const generalEditInitialExperiment = _.pick(experiment, ['description', 'p2Url', 'owner', 'endDatetime'])
  const onEdit = () => setIsEditing(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onCancelEdit = () => {
    setIsEditing(false)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  const onSubmitEdit = async (formData: unknown) => {
    // TODO: Full submission
    enqueueSnackbar('Experiment Updated!', { variant: 'success' })
    setIsEditing(false)
  }


  return (
    <Paper>
      <Toolbar>
        <Typography className={classes.title} color='textPrimary' variant='h3'>
          General
        </Typography>
        <Button onClick={onEdit}>
          <Edit />
           Edit
        </Button>
      </Toolbar>
      <LabelValueTable data={data} />
    </Paper>
  )
}

export default GeneralPanel
