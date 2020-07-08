import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import React, { useMemo } from 'react'

import Label from '@/components/Label'
import { AttributionWindowSecondsToHuman, ExperimentFull, MetricAssignment, MetricBare } from '@/models'
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
      padding: theme.spacing(1, 2),
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
    () => resolveMetricAssignments(experiment.getSortedMetricAssignments(), metrics),
    [experiment, metrics],
  )

  return (
    <Paper>
      <Typography className={classes.title} color='textPrimary' variant='h3'>
        Metrics
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component='th' variant='head'>
              Name
            </TableCell>
            <TableCell component='th' variant='head'>
              Minimum Difference
            </TableCell>
            <TableCell component='th' variant='head'>
              Attribution Window
            </TableCell>
            <TableCell component='th' variant='head'>
              Changes Expected
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
                <span>
                  {resolvedMetricAssignment.metric.parameterType === 'revenue'
                    ? formatUsCurrencyDollar(resolvedMetricAssignment.minDifference)
                    : `${resolvedMetricAssignment.minDifference} pp`}
                </span>
              </TableCell>
              <TableCell>
                {AttributionWindowSecondsToHuman[resolvedMetricAssignment.attributionWindowSeconds]}
              </TableCell>
              <TableCell>{formatBoolean(resolvedMetricAssignment.changeExpected)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default MetricAssignmentsPanel
