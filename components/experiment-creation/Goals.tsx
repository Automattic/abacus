/* eslint-disable */
import _ from 'lodash'
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select as MuiSelect,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  InputAdornment,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { FieldArray, useField, Field } from 'formik'
import { MetricAssignment, MetricBare, MetricParameterType, AttributionWindowSeconds } from '@/lib/schemas'
import { TextField } from 'formik-material-ui'

const normalizedMetrics: Record<number, MetricBare> = {
  1: {
    metricId: 1,
    name: 'asdf_7d_refund',
    description: 'string',
    parameterType: MetricParameterType.Revenue,
  },
  2: {
    metricId: 2,
    name: 'registration_start',
    description: 'string',
    parameterType: MetricParameterType.Conversion,
  },
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    addMetric: {
      display: 'flex',
      flexDirection: 'column',
      margin: theme.spacing(5, 0),
    },
    addMetricSelect: {
      minWidth: '10rem',
      marginRight: theme.spacing(2),
    },
    addMetricControls: {
      display: 'flex',
      alignItems: 'flex-end',
    },
  }),
)

const createMetricAssignment = (metric: MetricBare) => {
  return {
    metricId: metric.metricId,
    attributionWindowSeconds: AttributionWindowSeconds.TwentyFourHours,
    isPrimary: false,
    changeExpected: null,
    minDifference: null,
  }
}

const Goals = () => {
  const classes = useStyles()

  const [metricAssignmentsField] = useField<MetricAssignment[]>('experiment.metricAssignments')
  const [selectedMetricId, setSelectedMetricId] = useState<string>('')
  const onSelectedMetricChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMetricId(event.target.value as string)
  }

  const usedMetricIds = metricAssignmentsField.value.map((metricAssignment) => metricAssignment.metricId)
  const avaliableMetricIds = _.difference(
    Object.keys(normalizedMetrics).map((id) => parseInt(id, 10)),
    usedMetricIds,
  )

  return (
    <div className={classes.root}>
      <Typography variant='h2' gutterBottom>
        Goals
      </Typography>

      <FieldArray
        name='experiment.metricAssignments'
        render={(arrayHelpers) => {
          const onAddMetric = () => {
            const metricId = parseInt(selectedMetricId, 10)
            const metric = normalizedMetrics[metricId]
            if (metricId) {
              arrayHelpers.push(createMetricAssignment(metric))
            }
            setSelectedMetricId('')
          }

          return (
            <>
              <div className={classes.addMetric}>
                <Typography variant='h5' gutterBottom>
                  Assign a Metric
                </Typography>
                <Typography variant='subtitle2' gutterBottom>
                  Quantify the impact you're trying to measure
                </Typography>
                <div className={classes.addMetricControls}>
                  <FormControl className={classes.addMetricSelect}>
                    <InputLabel id='add-metric-label'>Search Metrics</InputLabel>
                    <MuiSelect
                      labelId='add-metric-label'
                      id='add-metric-select'
                      value={selectedMetricId}
                      onChange={onSelectedMetricChange}
                      displayEmpty
                    >
                      {avaliableMetricIds
                        .map((metricId) => normalizedMetrics[metricId])
                        .map((metric) => (
                          <MenuItem value={metric.metricId} key={metric.metricId}>
                            {metric.name}
                          </MenuItem>
                        ))}
                    </MuiSelect>
                  </FormControl>
                  <Button variant='outlined' size='small' onClick={onAddMetric}>
                    Add
                  </Button>
                </div>
              </div>

              <Typography variant='h5' gutterBottom>
                Assigned Metrics
              </Typography>
              <Typography variant='subtitle2' gutterBottom>
                Configure your metrics
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell>Attribution Window (Seconds)</TableCell>
                      <TableCell>Change Expected</TableCell>
                      <TableCell>Minimum Difference</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metricAssignmentsField.value.map((metricAssignment, index) => (
                      <TableRow key={metricAssignment.metricId}>
                        <TableCell>{normalizedMetrics[metricAssignment.metricId].name}</TableCell>
                        <TableCell></TableCell>
                        <TableCell>Yes</TableCell>
                        <TableCell>
                          <Field
                            component={TextField}
                            name={`experiment.metricAssigments[${index}].minDifference`}
                            type='number'
                            size='small'
                            variant='outlined'
                            InputProps={{
                              endAdornment: <InputAdornment position='end'>%</InputAdornment>,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {metricAssignmentsField.value.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography variant='body1' align='center'>
                            {' '}
                            You don't have any metrics yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )
        }}
      />
    </div>
  )
}

export default Goals
