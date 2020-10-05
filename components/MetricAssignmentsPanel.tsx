import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  InputAdornment,
  MenuItem,
  Toolbar,
  Tooltip,
} from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { Add } from '@material-ui/icons'
import { ErrorMessage, Field, Formik } from 'formik'
import { Select, Switch, TextField } from 'formik-material-ui'
import { useSnackbar } from 'notistack'
import React, { useMemo, useState } from 'react'
import * as yup from 'yup'

import ExperimentsApi from '@/api/ExperimentsApi'
import { AttributionWindowSecondsToHuman } from '@/lib/metric-assignments'
import * as MetricAssignments from '@/lib/metric-assignments'
import { indexMetrics } from '@/lib/normalizers'
import {
  ExperimentFull,
  MetricAssignment,
  MetricAssignmentNew,
  metricAssignmentNewSchema,
  MetricBare,
  MetricParameterType,
  Status,
} from '@/lib/schemas'
import { formatBoolean, formatUsCurrencyDollar } from '@/utils/formatters'

import LoadingButtonContainer from './LoadingButtonContainer'

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
      color: theme.palette.grey[500],
    },
    monospace: {
      fontFamily: theme.custom.fonts.monospace,
    },
    title: {
      flexGrow: 1,
    },
    addMetricPlaceholder: {
      fontFamily: theme.typography.fontFamily,
    },
    row: {
      minWidth: 400,
      marginTop: theme.spacing(3),
      display: 'flex',
      alignItems: 'center',
      '&:first-of-type': {
        marginTop: theme.spacing(0),
      },
    },
    label: {
      marginBottom: theme.spacing(1),
    },
    primaryChip: {
      marginTop: theme.spacing(1),
    },
  }),
)

/**
 * Renders the assigned metric information of an experiment in a panel component.
 *
 * @param experiment - The experiment with the metric assignment information.
 * @param experimentReloadRef - Trigger a reload of the experiment.
 * @param metrics - The metrics to look up (aka resolve) the metric IDs of the
 *   experiment's metric assignments.
 */
function MetricAssignmentsPanel({
  experiment,
  experimentReloadRef,
  metrics,
}: {
  experiment: ExperimentFull
  experimentReloadRef: React.MutableRefObject<() => void>
  metrics: MetricBare[]
}): JSX.Element {
  const classes = useStyles()
  const resolvedMetricAssignments = useMemo(
    () => resolveMetricAssignments(MetricAssignments.sort(experiment.metricAssignments), metrics),
    [experiment, metrics],
  )

  // TODO: Normalize this higher up
  const indexedMetrics = indexMetrics(metrics)

  // Assign Metric Modal
  const { enqueueSnackbar } = useSnackbar()
  const canAssignMetric = experiment.status !== Status.Staging
  const [isAssigningMetric, setIsAssigningMetric] = useState<boolean>(false)
  const assignMetricInitialAssignMetric = {
    metricId: '',
    attributionWindowSeconds: '',
    changeExpected: false,
    isPrimary: false,
    minDifference: '',
  }
  const onAssignMetric = () => setIsAssigningMetric(true)
  const onCancelAssignMetric = () => {
    setIsAssigningMetric(false)
  }
  const onSubmitAssignMetric = async (formData: { metricAssignment: typeof assignMetricInitialAssignMetric }) => {
    try {
      await ExperimentsApi.assignMetric(experiment, (formData.metricAssignment as unknown) as MetricAssignmentNew)
      enqueueSnackbar('Metric Assigned Successfully!', { variant: 'success' })
      experimentReloadRef.current()
      setIsAssigningMetric(false)
    } catch (e) /* istanbul ignore next; Shouldn't happen */ {
      console.error(e)
      enqueueSnackbar('Oops! Something went wrong while trying to assign a metric to your experiment.', {
        variant: 'error',
      })
    }
  }

  return (
    <Paper>
      <Toolbar>
        <Typography className={classes.title} color='textPrimary' variant='h3'>
          Metrics
        </Typography>
        <Tooltip title={canAssignMetric ? '' : 'Use "Edit in Wizard" for staging experiments.'}>
          <div>
            <Button onClick={onAssignMetric} variant='outlined' disabled={!canAssignMetric}>
              <Add />
              Assign Metric
            </Button>
          </div>
        </Tooltip>
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
              <TableCell className={classes.monospace}>
                {resolvedMetricAssignment.metric.name}
                <br />
                {resolvedMetricAssignment.isPrimary && (
                  <Chip label='Primary' variant='outlined' disabled className={classes.primaryChip} />
                )}
              </TableCell>
              <TableCell className={classes.monospace}>
                {AttributionWindowSecondsToHuman[resolvedMetricAssignment.attributionWindowSeconds]}
              </TableCell>
              <TableCell className={classes.monospace}>
                {formatBoolean(resolvedMetricAssignment.changeExpected)}
              </TableCell>
              <TableCell className={classes.monospace}>
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
        <DialogTitle id='assign-metric-form-dialog-title'>Assign Metric</DialogTitle>
        <Formik
          initialValues={{ metricAssignment: assignMetricInitialAssignMetric }}
          onSubmit={onSubmitAssignMetric}
          validationSchema={yup.object({ metricAssignment: metricAssignmentNewSchema })}
        >
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit} noValidate>
              <DialogContent>
                <div className={classes.row}>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel required className={classes.label} htmlFor={`metricAssignment.metricId`}>
                      Metric
                    </FormLabel>
                    <Field
                      component={Select}
                      name={`metricAssignment.metricId`}
                      id={`metricAssignment.metricId`}
                      variant='outlined'
                      fullWidth
                      displayEmpty
                      error={
                        // istanbul ignore next; trivial, not-critical, pain to test.
                        !!formikProps.errors.metricAssignment?.metricId &&
                        !!formikProps.touched.metricAssignment?.metricId
                      }
                    >
                      <MenuItem value=''>
                        <span className={classes.addMetricPlaceholder}>Select a Metric</span>
                      </MenuItem>
                      {Object.values(indexedMetrics).map((metric) => (
                        <MenuItem value={metric.metricId} key={metric.metricId}>
                          {metric.name}
                        </MenuItem>
                      ))}
                    </Field>
                    {formikProps.errors.metricAssignment?.metricId && (
                      <FormHelperText error={true}>
                        <ErrorMessage name={`metricAssignment.metricId`} />
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className={classes.row}>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel
                      required
                      className={classes.label}
                      id={`metricAssignment.attributionWindowSeconds-label`}
                    >
                      Attribution Window
                    </FormLabel>
                    <Field
                      component={Select}
                      name={`metricAssignment.attributionWindowSeconds`}
                      labelId={`metricAssignment.attributionWindowSeconds-label`}
                      id={`metricAssignment.attributionWindowSeconds`}
                      variant='outlined'
                      error={
                        // istanbul ignore next; trivial, not-critical, pain to test.
                        !!formikProps.errors.metricAssignment?.attributionWindowSeconds &&
                        !!formikProps.touched.metricAssignment?.attributionWindowSeconds
                      }
                      displayEmpty
                    >
                      <MenuItem value=''>-</MenuItem>
                      {Object.entries(AttributionWindowSecondsToHuman).map(
                        ([attributionWindowSeconds, attributionWindowSecondsHuman]) => (
                          <MenuItem value={attributionWindowSeconds} key={attributionWindowSeconds}>
                            {attributionWindowSecondsHuman}
                          </MenuItem>
                        ),
                      )}
                    </Field>
                    {formikProps.errors.metricAssignment?.attributionWindowSeconds && (
                      <FormHelperText error={true}>
                        <ErrorMessage name={`metricAssignment.attributionWindowSeconds`} />
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className={classes.row}>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel required className={classes.label}>
                      Change Expected
                    </FormLabel>
                    <Field
                      component={Switch}
                      label='Change Expected'
                      name={`metricAssignment.changeExpected`}
                      id={`metricAssignment.changeExpected`}
                      inputProps={{
                        'aria-label': 'Change Expected',
                      }}
                      variant='outlined'
                      type='checkbox'
                    />
                  </FormControl>
                </div>
                <div className={classes.row}>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel required className={classes.label} id={`metricAssignment.minDifference-label`}>
                      Minimum Difference
                    </FormLabel>
                    <Field
                      component={TextField}
                      name={`metricAssignment.minDifference`}
                      id={`metricAssignment.minDifference`}
                      type='number'
                      variant='outlined'
                      placeholder='1.30'
                      inputProps={{
                        'aria-label': 'Minimum Difference',
                        min: '0',
                      }}
                      InputProps={
                        formikProps.values.metricAssignment.metricId &&
                        indexedMetrics[(formikProps.values.metricAssignment.metricId as unknown) as number]
                          .parameterType === MetricParameterType.Conversion
                          ? {
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <Tooltip title='Percentage Points'>
                                    <Typography variant='body1' color='textSecondary'>
                                      pp
                                    </Typography>
                                  </Tooltip>
                                </InputAdornment>
                              ),
                            }
                          : {
                              startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                            }
                      }
                    />
                  </FormControl>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={onCancelAssignMetric} color='primary'>
                  Cancel
                </Button>
                <LoadingButtonContainer isLoading={formikProps.isSubmitting}>
                  <Button
                    type='submit'
                    variant='contained'
                    color='secondary'
                    disabled={formikProps.isSubmitting || !formikProps.isValid}
                  >
                    Assign
                  </Button>
                </LoadingButtonContainer>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </Paper>
  )
}

export default MetricAssignmentsPanel
