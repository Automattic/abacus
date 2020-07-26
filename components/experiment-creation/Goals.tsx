/* eslint-disable */
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { FieldArray, useField } from 'formik'
import { MetricAssignment, MetricBare, MetricParameterType } from '@/lib/schemas'

const normalizedMetrics: Record<number, MetricBare> = {
  1: {
    metricId: 1,
    name: 'asdf_7d_refund',
    description: 'string',
    parameterType: MetricParameterType.Revenue,
  },
  2: {
    metricId: 1,
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

const Goals = () => {
  const classes = useStyles()

  const [metricAssignmentsField] = useField<MetricAssignment[]>('experiment.metricAssignments')

  const [selectedMetricId, setSelectedMetricId] = useState<string>('')
  const onSelectedMetricChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMetricId(event.target.value as string)
  }
  const onAddMetric = () => {
    setSelectedMetricId('')
  }

  return (
    <div className={classes.root}>
      <Typography variant='h2' gutterBottom>
        Goals
      </Typography>

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
            <Select
              labelId='add-metric-label'
              id='add-metric-select'
              value={selectedMetricId}
              onChange={onSelectedMetricChange}
              displayEmpty
            >
              {Object.values(normalizedMetrics).map((metric) => (
                <MenuItem value={metric.metricId} key={metric.metricId}>
                  {metric.name}
                </MenuItem>
              ))}
            </Select>
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
            <FieldArray
              name='experiment.metricAssignments'
              render={(arrayHelpers) => (
                <>
                  {metricAssignmentsField.value.map((metricAssignment, index) => (
                    <TableRow>
                      <TableCell>{normalizedMetrics[metricAssignment.metricId]}</TableCell>
                      <TableCell>60</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>10%</TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            />
            <TableRow>
              <TableCell colSpan={4}>
                {metricAssignmentsField.value.length === 0 && (
                  <Typography variant='body1' align='center'>
                    {' '}
                    You don't have any metrics yet.
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Goals
