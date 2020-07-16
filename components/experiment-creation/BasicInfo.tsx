import { InputAdornment, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
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
      flex: 0,
      margin: theme.spacing(0, 2),
      color: theme.palette.text.hint,
    },
    datePicker: {
      flex: 1,
      '& input:invalid': {
        // Fix the native date-picker placeholder text colour
        color: theme.palette.text.hint,
      },
    },
  }),
)

const BasicInfo = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant='h2' gutterBottom>
        Basic Info
      </Typography>

      <div className={classes.row}>
        <Field
          component={TextField}
          name='experiment.name'
          label='Experiment name'
          placeholder='experiment_name'
          helperText='Use snake_case.'
          variant='outlined'
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>

      <div className={classes.row}>
        <Field
          component={TextField}
          name='experiment.description'
          label='Experiment description'
          placeholder='Monthly vs. yearly pricing'
          helperText='State your hypothesis.'
          variant='outlined'
          fullWidth
          required
          multiline
          rows={4}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>

      <div className={classes.row}>
        <Field
          component={TextField}
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
        <Field
          component={TextField}
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
        <Field
          component={TextField}
          name='experiment.ownerLogin'
          label='Owner'
          placeholder='scjr'
          helperText='Use WordPress.com username.'
          variant='outlined'
          fullWidth
          required
          InputProps={{
            startAdornment: <InputAdornment position='start'>@</InputAdornment>,
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    </div>
  )
}

export default BasicInfo
