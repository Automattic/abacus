import { InputAdornment, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import * as dateFns from 'date-fns'
import { Field, useField } from 'formik'
import { TextField } from 'formik-material-ui'
import React from 'react'

import {
  MAX_DISTANCE_BETWEEN_NOW_AND_START_DATE_IN_MONTHS,
  MAX_DISTANCE_BETWEEN_START_AND_END_DATE_IN_MONTHS,
} from '@/lib/schemas'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    row: {
      margin: theme.spacing(5, 0),
      display: 'flex',
      alignItems: 'center',
      '&:first-of-type': {
        marginTop: theme.spacing(3),
      },
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

  const [startDateField] = useField('experiment.startDatetime')
  const parseDateFromInput = (dateString: string) => dateFns.parse(dateString, 'yyyy-MM-dd', new Date())
  const minStartDate = new Date()
  const maxStartDate = dateFns.addMonths(new Date(), MAX_DISTANCE_BETWEEN_NOW_AND_START_DATE_IN_MONTHS)
  const minEndDate = startDateField.value && parseDateFromInput(startDateField.value)
  const maxEndDate =
    startDateField.value &&
    dateFns.addMonths(parseDateFromInput(startDateField.value), MAX_DISTANCE_BETWEEN_START_AND_END_DATE_IN_MONTHS)
  const formatDateForInput = (date: Date) => (date ? dateFns.format(date, 'yyyy-MM-dd') : undefined)

  return (
    <div className={classes.root}>
      <Typography variant='h4' gutterBottom>
        Basic Info
      </Typography>

      <div className={classes.row}>
        <Field
          component={TextField}
          name='experiment.name'
          id='experiment.name'
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
          id='experiment.description'
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
          name='experiment.startDatetime'
          id='experiment.startDatetime'
          label='Start date'
          helperText='Use the UTC timezone.'
          type='date'
          variant='outlined'
          required
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: formatDateForInput(minStartDate),
            max: formatDateForInput(maxStartDate),
          }}
        />
        <span className={classes.through}> through </span>
        <Field
          component={TextField}
          className={classes.datePicker}
          name='experiment.endDatetime'
          id='experiment.endDatetime'
          label='End date'
          helperText='Use the UTC timezone.'
          type='date'
          variant='outlined'
          required
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: formatDateForInput(minEndDate),
            max: formatDateForInput(maxEndDate),
          }}
        />
      </div>

      <div className={classes.row}>
        <Field
          component={TextField}
          name='experiment.ownerLogin'
          id='experiment.ownerLogin'
          label='Owner'
          placeholder='wp_username'
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
