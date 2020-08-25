import { FormControl, FormControlLabel, FormLabel, Radio } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Field, FormikProps } from 'formik'
import { RadioGroup, Switch, TextField } from 'formik-material-ui'
import React from 'react'

import { MetricParameterType } from '@/lib/schemas'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    row: {
      margin: theme.spacing(3, 0),
      display: 'flex',
      alignItems: 'center',
      '&:first-of-type': {
        marginTop: 0,
      },
    },
  }),
)

const MetricFormFields = ({ formikProps }: { formikProps: FormikProps<{ metric: unknown }> }) => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.row}>
        <Field
          component={TextField}
          name='metric.name'
          id='metric.name'
          label='Metric name'
          placeholder='metric_name'
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
          name='metric.description'
          id='metric.description'
          label='Metric description'
          placeholder='Put your Metric description here!'
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
        <FormControlLabel
          label='Higher is better'
          control={
            <Field
              component={Switch}
              name='metric.higherIsBetter'
              id='metric.higherIsBetter'
              label='Higher is better'
              type='checkbox'
              aria-label='Higher is better'
              variant='outlined'
            />
          }
        />
      </div>
      <div className={classes.row}>
        <FormControl component='fieldset'>
          <FormLabel required>Metric Type</FormLabel>
          <Field component={RadioGroup} name='metric.parameterType' required>
            <FormControlLabel
              value={MetricParameterType.Conversion}
              label='Conversion'
              control={<Radio disabled={formikProps.isSubmitting} />}
              disabled={formikProps.isSubmitting}
            />
            <FormControlLabel
              value={MetricParameterType.Revenue}
              label='Revenue'
              control={<Radio disabled={formikProps.isSubmitting} />}
              disabled={formikProps.isSubmitting}
            />
          </Field>
        </FormControl>
      </div>
    </>
  )
}

export default MetricFormFields
