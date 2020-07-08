import { TextField, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '36rem',
      // TODO: Remove, this is just for the storybook.
      margin: '2rem auto',
    },
    row: {
      margin: theme.spacing(6, 0),
      display: 'flex',
      alignItems: 'center',
    },
    through: {
      margin: theme.spacing(0, 2),
      color: theme.palette.text.hint,
    },
    datePicker: {
      '& input:invalid': {
        // Fix the native date-picker placeholder text colour
        color: theme.palette.text.hint,
      },
    },
  }),
)

const BasicInfo = () => {
  const classes = useStyles()

  // TODO: COMPONENT

  return (
    <div className={classes.root}>
      <Typography variant='h2' gutterBottom>
        Basic Info
      </Typography>

      <div className={classes.row}>
        <TextField
          name='experiment.name'
          label='Experiment Name'
          placeholder='experiment_name'
          helperText='Please use snake_case, all lowercase.'
          variant='outlined'
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>

      <div className={classes.row}>
        <TextField
          name='experiment.description'
          label='Experiment Description'
          placeholder='Monthly vs. yearly pricing'
          helperText='State your hypothesis. It will show up in the list view.'
          variant='outlined'
          required
          multiline
          rows={2}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>

      <div className={classes.row}>
        <TextField
          className={classes.datePicker}
          name='experiment.start_date'
          label='Start date'
          type='date'
          variant='outlined'
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <span className={classes.through}> through </span>
        <TextField
          className={classes.datePicker}
          name='experiment.end_date'
          label='End date'
          type='date'
          variant='outlined'
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>

      <div className={classes.row}>
        <TextField
          name='experiment.ownerLogin'
          label='Owner'
          placeholder='@scjr'
          helperText=''
          variant='outlined'
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    </div>
  )
}

export default BasicInfo
