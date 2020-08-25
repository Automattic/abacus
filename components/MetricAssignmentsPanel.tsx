import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Toolbar } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { Add } from '@material-ui/icons'
import { Formik } from 'formik'
import { useSnackbar } from 'notistack'
import React, { useMemo, useState } from 'react'

import Label from '@/components/Label'
import { AttributionWindowSecondsToHuman } from '@/lib/metric-assignments'
import * as MetricAssignments from '@/lib/metric-assignments'
import { ExperimentFull, MetricAssignment, MetricBare, MetricParameterType } from '@/lib/schemas'
import { formatBoolean, formatUsCurrencyDollar } from '@/utils/formatters'

/**
 * Resolves the metric ID of the metric assignment with the actual metric. If the
 * ID cannot be resolved, then an `Error` will be thrown.
 *
 * @param metricAssignments - The metric assignments to be resolved.
 * @param metrics - The metrics to associate with the assignments.
 * @throws {Error} When unable to resolve a metric ID with one of the supplied
 *   metrics.
 */
function resolveMetricAssignments(metricAssignments: MetricAssignment[], metrics: MetricBare[]) {
  const metricsById: { [metricId: string]: MetricBare } = {}
  metrics.forEach((metric) => (metricsById[metric.metricId] = metric))

  return metricAssignments.map((metricAssignment) => {
    const metric = metricsById[metricAssignment.metricId]

    if (!metric) {
      throw Error(
        `Failed to lookup metric with ID ${metricAssignment.metricId} for assignment with ID ${metricAssignment.metricAssignmentId}.`,
      )
    }

    return { ...metricAssignment, metric }
  })
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    primary: {
      marginLeft: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
    },
  }),
)

/**
 * Renders the assigned metric information of an experiment in a panel component.
 *
 * @param props.experiment - The experiment with the metric assignment information.
 * @param props.metrics - The metrics to look up (aka resolve) the metric IDs of the
 *   experiment's metric assignments.
 */
function MetricAssignmentsPanel({ experiment, metrics }: { experiment: ExperimentFull; metrics: MetricBare[] }) {
  const classes = useStyles()
  const resolvedMetricAssignments = useMemo(
    () => resolveMetricAssignments(MetricAssignments.sort(experiment.metricAssignments), metrics),
    [experiment, metrics],
  )

  // Assign Metric Modal
  const { enqueueSnackbar } = useSnackbar()
  const [isAssigningMetric, setIsAssigningMetric] = useState<boolean>(false)
  const assignMetricInitialAssignMetric = {
    metricId: '',
    attributionWindowSeconds: '',
    changeExpected: 'false',
    isPrimary: 'false',
    minDifference: '',
  }
  const onAssignMetric = () => setIsAssigningMetric(true)
  const onCancelAssignMetric = () => {
    setIsAssigningMetric(false)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  const onSubmitAssignMetric = async (formData: unknown) => {
    // TODO: Full submission
    enqueueSnackbar('Metric Assigned Successfully!', { variant: 'success' })
    setIsAssigningMetric(false)
  }

  return (
    <Paper>
      <Toolbar>
        <Typography className={classes.title} color='textPrimary' variant='h3'>
          Metrics
        </Typography>
        <Button onClick={onAssignMetric} variant='outlined'>
          <Add />
          Assign Metric
        </Button>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component='th' variant='head'>
              Name
            </TableCell>
            <TableCell component='th' variant='head'>
              Attribution Window
            </TableCell>
            <TableCell component='th' variant='head'>
              Changes Expected
            </TableCell>
            <TableCell component='th' variant='head'>
              Minimum Difference
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resolvedMetricAssignments.map((resolvedMetricAssignment) => (
            <TableRow key={resolvedMetricAssignment.metricAssignmentId}>
              <TableCell>
                {resolvedMetricAssignment.metric.name}
                {resolvedMetricAssignment.isPrimary && <Label className={classes.primary} text='Primary' />}
              </TableCell>
              <TableCell>
                {AttributionWindowSecondsToHuman[resolvedMetricAssignment.attributionWindowSeconds]}
              </TableCell>
              <TableCell>{formatBoolean(resolvedMetricAssignment.changeExpected)}</TableCell>
              <TableCell>
                <span>
                  {resolvedMetricAssignment.metric.parameterType === MetricParameterType.Revenue
                    ? formatUsCurrencyDollar(resolvedMetricAssignment.minDifference)
                    : `${resolvedMetricAssignment.minDifference} pp`}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isAssigningMetric} aria-labelledby='assign-metric-form-dialog-title'>
        <DialogTitle id='assign-metric-form-dialog-title'>Add Metric</DialogTitle>
        <Formik initialValues={{ metricAssignment: assignMetricInitialAssignMetric }} onSubmit={onSubmitAssignMetric}>
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit}>
              <DialogContent></DialogContent>
              <DialogActions>
                <Button onClick={onCancelAssignMetric} color='primary'>
                  Cancel
                </Button>
                <Button color='primary' type='submit'>
                  Assign
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </Paper>
  )
}

export default MetricAssignmentsPanel
