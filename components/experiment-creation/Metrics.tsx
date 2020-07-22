/* eslint-disable */
import {
  InputAdornment,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { FieldArray, useField, Field } from 'formik'
import { MetricAssignment } from '@/lib/schemas'
import { TextField } from 'formik-material-ui'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '36rem',
      // TODO: Remove, this is just for the storybook.
      margin: '2rem auto',
    },
  }),
)

const Metrics = () => {
  const classes = useStyles()

  const [metricAssignmentsField] = useField<MetricAssignment[]>('experiment.metricAssignments')

  return (
    <div className={classes.root}>
      <Typography variant='h2' gutterBottom>
        Metrics
      </Typography>
      <Typography variant='body2'>Quantify the impact you're trying to measure.</Typography>

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
            <TableRow>
              <TableCell>~Metric Name~</TableCell>
              <TableCell>60</TableCell>
              <TableCell>Yes</TableCell>
              <TableCell>10%</TableCell>
            </TableRow>
            <FieldArray
              name='experiment.metricAssignments'
              render={(arrayHelpers) => (
                <>
                  {metricAssignmentsField.value.map((metricAssignment, index) => (
                    <TableRow>
                      <TableCell>~Metric Name~</TableCell>
                      <TableCell>60</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>10%</TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Metrics
