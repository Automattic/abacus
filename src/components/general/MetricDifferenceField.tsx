import { createStyles, InputAdornment, makeStyles, Theme, Tooltip, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
import React from 'react'

import { MetricParameterType } from 'src/lib/schemas'
import { formikFieldTransformer } from 'src/utils/formik'

const ConversionMetricTextField = formikFieldTransformer(
  TextField,
  (outer: string) => String((Number(outer) || 0) * 100),
  (inner: string) => String((Number(inner) || 0) / 100),
)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: '7rem',
    },
    tooltipped: {
      borderBottomWidth: 1,
      borderBottomStyle: 'dashed',
      borderBottomColor: theme.palette.grey[500],
    },
  }),
)

export default function MetricDifferenceField(props: {
  name: string
  id: string
  metricParameterType: MetricParameterType
  className?: string
}): JSX.Element {
  const classes = useStyles()

  // istanbul ignore else; shouldn't occur
  if (props.metricParameterType === MetricParameterType.Conversion) {
    return (
      <Field
        className={clsx(classes.root, props.className)}
        component={ConversionMetricTextField}
        name={props.name}
        id={props.id}
        type='number'
        variant='outlined'
        placeholder='5.4'
        inputProps={{
          'aria-label': 'Minimum Difference',
          min: '0',
          max: '100',
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <Tooltip title='Percentage Points'>
                <Typography variant='body1' color='textSecondary' className={classes.tooltipped}>
                  pp
                </Typography>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    )
  } else if (props.metricParameterType === MetricParameterType.Revenue) {
    return (
      <Field
        className={clsx(classes.root, props.className)}
        component={TextField}
        name={props.name}
        id={props.id}
        type='number'
        variant='outlined'
        placeholder='1.30'
        inputProps={{
          'aria-label': 'Minimum Difference',
          min: '0',
        }}
        InputProps={{
          endAdornment: <InputAdornment position='end'>USD</InputAdornment>,
        }}
      />
    )
  } else {
    throw new Error('Unknown or missing MetricParameterType')
  }
}
