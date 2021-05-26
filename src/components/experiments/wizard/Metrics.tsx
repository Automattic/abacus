import {
  Button,
  FormControl,
  IconButton,
  Link,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField as MuiTextField,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Add, Clear } from '@material-ui/icons'
import { Alert, Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab'
import clsx from 'clsx'
import { Field, FieldArray, useField } from 'formik'
import { Select, Switch, TextField } from 'formik-material-ui'
import React, { useState } from 'react'

import { getPropNameCompletions } from 'src/api/AutocompleteApi'
import AbacusAutocomplete, { autocompleteInputProps } from 'src/components/general/Autocomplete'
import MetricDifferenceField from 'src/components/general/MetricDifferenceField'
import MoreMenu from 'src/components/general/MoreMenu'
import { AttributionWindowSecondsToHuman } from 'src/lib/metric-assignments'
import { EventNew, MetricAssignment, MetricBare } from 'src/lib/schemas'
import { useDataSource } from 'src/utils/data-loading'

import { ExperimentFormCompletionBag } from './ExperimentForm'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    addMetricPlaceholder: {
      fontFamily: theme.typography.fontFamily,
    },
    addMetricSelect: {
      flex: 1,
      marginRight: theme.spacing(1),
    },
    attributionWindowSelect: {
      minWidth: '8rem',
    },
    metricName: {
      fontFamily: theme.custom.fonts.monospace,
      fontWeight: theme.custom.fontWeights.monospaceBold,
    },
    tooltipped: {
      borderBottomWidth: 1,
      borderBottomStyle: 'dashed',
      borderBottomColor: theme.palette.grey[500],
    },
    primary: {
      fontFamily: theme.custom.fonts.monospace,
      opacity: 0.5,
    },
    minDifferenceField: {
      maxWidth: '14rem',
    },
    changeExpected: {
      textAlign: 'center',
    },
    metricsInfo: {
      marginTop: theme.spacing(4),
    },
    exposureEventsTitle: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(4),
    },
    exposureEventsInfo: {
      marginTop: theme.spacing(4),
    },
  }),
)

const useMetricEditorStyles = makeStyles((theme) =>
  createStyles({
    root: {},
    addMetric: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      margin: theme.spacing(3, 0, 2),
    },
    addMetricAddSymbol: {
      position: 'relative',
      top: -3,
      marginRight: theme.spacing(2),
      color: theme.palette.text.disabled,
    },
  }),
)

const useEventEditorStyles = makeStyles((theme) =>
  createStyles({
    root: {},
    exposureEventsEventNameCell: {
      display: 'flex',
      alignItems: 'center',
    },
    exposureEventsEventName: {
      flexGrow: 1,
    },
    exposureEventsEventRemoveButton: {
      marginLeft: theme.spacing(1),
    },
    exposureEventsEventPropertiesRow: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(3),
    },
    exposureEventsEventPropertiesKey: {
      marginRight: theme.spacing(1),
    },
    exposureEventsEventPropertiesKeyAutoComplete: {
      display: 'inline-flex',
      minWidth: '40%',
    },
  }),
)

const createMetricAssignment = (metric: MetricBare) => {
  return {
    metricId: metric.metricId,
    attributionWindowSeconds: '',
    isPrimary: false,
    changeExpected: false,
    minDifference: '',
  }
}

const EventEditor = ({
  index,
  completionBag: { eventCompletionDataSource },
  exposureEvent: { event: name, props: propList },
  onRemoveExposureEvent,
}: {
  index: number
  completionBag: ExperimentFormCompletionBag
  exposureEvent: EventNew
  onRemoveExposureEvent: () => void
}) => {
  const classes = useEventEditorStyles()
  const metricClasses = useMetricEditorStyles()
  const { isLoading, data: propCompletions } = useDataSource(async () => name && getPropNameCompletions(name), [name])

  return (
    <TableRow>
      <TableCell>
        <div className={classes.exposureEventsEventNameCell}>
          <Field
            component={AbacusAutocomplete}
            name={`experiment.exposureEvents[${index}].event`}
            className={classes.exposureEventsEventName}
            id={`experiment.exposureEvents[${index}].event`}
            options={eventCompletionDataSource.data}
            loading={eventCompletionDataSource.isLoading}
            renderInput={(params: AutocompleteRenderInputParams) => (
              <MuiTextField
                {...params}
                label='Event Name'
                placeholder='event_name'
                variant='outlined'
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  ...autocompleteInputProps(params, eventCompletionDataSource.isLoading),
                  'aria-label': 'Event Name',
                }}
              />
            )}
          />
          <IconButton
            className={classes.exposureEventsEventRemoveButton}
            onClick={onRemoveExposureEvent}
            aria-label='Remove exposure event'
          >
            <Clear />
          </IconButton>
        </div>
        <FieldArray
          name={`experiment.exposureEvents[${index}].props`}
          render={(arrayHelpers) => {
            const onAddExposureEventProperty = () => {
              arrayHelpers.push({
                key: '',
                value: '',
              })
            }

            return (
              <div>
                <div>
                  {propList &&
                    propList.map((_prop: unknown, propIndex: number) => {
                      const onRemoveExposureEventProperty = () => {
                        arrayHelpers.remove(propIndex)
                      }

                      return (
                        <div className={classes.exposureEventsEventPropertiesRow} key={propIndex}>
                          <Field
                            component={AbacusAutocomplete}
                            name={`experiment.exposureEvents[${index}].props[${propIndex}].key`}
                            id={`experiment.exposureEvents[${index}].props[${propIndex}].key`}
                            options={propCompletions || []}
                            loading={isLoading}
                            freeSolo={true}
                            className={classes.exposureEventsEventPropertiesKeyAutoComplete}
                            renderInput={(params: AutocompleteRenderInputParams) => (
                              <MuiTextField
                                {...params}
                                className={classes.exposureEventsEventPropertiesKey}
                                label='Key'
                                placeholder='key'
                                variant='outlined'
                                size='small'
                                InputProps={{
                                  ...autocompleteInputProps(params, isLoading),
                                  'aria-label': 'Property Key',
                                }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            )}
                          />
                          <Field
                            component={TextField}
                            name={`experiment.exposureEvents[${index}].props[${propIndex}].value`}
                            id={`experiment.exposureEvents[${index}].props[${propIndex}].value`}
                            type='text'
                            variant='outlined'
                            placeholder='value'
                            label='Value'
                            size='small'
                            inputProps={{
                              'aria-label': 'Property Value',
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <IconButton
                            className={classes.exposureEventsEventRemoveButton}
                            onClick={onRemoveExposureEventProperty}
                            aria-label='Remove exposure event property'
                          >
                            <Clear />
                          </IconButton>
                        </div>
                      )
                    })}
                </div>
                <div className={metricClasses.addMetric}>
                  <Add className={metricClasses.addMetricAddSymbol} />
                  <Button
                    variant='contained'
                    onClick={onAddExposureEventProperty}
                    disableElevation
                    size='small'
                    aria-label='Add Property'
                  >
                    Add Property
                  </Button>
                </div>
              </div>
            )
          }}
        />
      </TableCell>
    </TableRow>
  )
}

const Metrics = ({
  indexedMetrics,
  completionBag,
}: {
  indexedMetrics: Record<number, MetricBare>
  completionBag: ExperimentFormCompletionBag
}): JSX.Element => {
  const classes = useStyles()
  const metricEditorClasses = useMetricEditorStyles()

  // Metric Assignments
  const [metricAssignmentsField, _metricAssignmentsFieldMetaProps, metricAssignmentsFieldHelperProps] = useField<
    MetricAssignment[]
  >('experiment.metricAssignments')
  const [selectedMetric, setSelectedMetric] = useState<MetricBare | null>(null)
  const onChangeSelectedMetricOption = (_event: unknown, value: MetricBare | null) => setSelectedMetric(value)

  const makeMetricAssignmentPrimary = (indexToSet: number) => {
    metricAssignmentsFieldHelperProps.setValue(
      metricAssignmentsField.value.map((metricAssignment, index) => ({
        ...metricAssignment,
        isPrimary: index === indexToSet,
      })),
    )
  }

  // ### Exposure Events
  const [exposureEventsField, _exposureEventsFieldMetaProps, _exposureEventsFieldHelperProps] = useField<EventNew[]>(
    'experiment.exposureEvents',
  )

  return (
    <div className={classes.root}>
      <Typography variant='h4' gutterBottom>
        Assign Metrics
      </Typography>

      <FieldArray
        name='experiment.metricAssignments'
        render={(arrayHelpers) => {
          const onAddMetric = () => {
            if (selectedMetric) {
              const metricAssignment = createMetricAssignment(selectedMetric)
              arrayHelpers.push({
                ...metricAssignment,
                isPrimary: metricAssignmentsField.value.length === 0,
              })
            }
            setSelectedMetric(null)
          }

          return (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell>Attribution Window</TableCell>
                      <TableCell>Change Expected?</TableCell>
                      <TableCell>Minimum Difference</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metricAssignmentsField.value.map((metricAssignment, index) => {
                      const onRemoveMetricAssignment = () => {
                        arrayHelpers.remove(index)
                      }

                      const onMakePrimary = () => {
                        makeMetricAssignmentPrimary(index)
                      }

                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Tooltip arrow title={indexedMetrics[metricAssignment.metricId].description}>
                              <span className={clsx(classes.metricName, classes.tooltipped)}>
                                {indexedMetrics[metricAssignment.metricId].name}
                              </span>
                            </Tooltip>
                            <br />
                            {metricAssignment.isPrimary && <span className={classes.primary}>Primary</span>}
                          </TableCell>
                          <TableCell>
                            <Field
                              className={classes.attributionWindowSelect}
                              component={Select}
                              name={`experiment.metricAssignments[${index}].attributionWindowSeconds`}
                              labelId={`experiment.metricAssignments[${index}].attributionWindowSeconds`}
                              size='small'
                              variant='outlined'
                              autoWidth
                              displayEmpty
                              SelectDisplayProps={{
                                'aria-label': 'Attribution Window',
                              }}
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
                          </TableCell>
                          <TableCell className={classes.changeExpected}>
                            <Field
                              component={Switch}
                              name={`experiment.metricAssignments[${index}].changeExpected`}
                              id={`experiment.metricAssignments[${index}].changeExpected`}
                              type='checkbox'
                              aria-label='Change Expected'
                              variant='outlined'
                            />
                          </TableCell>
                          <TableCell>
                            <MetricDifferenceField
                              className={classes.minDifferenceField}
                              name={`experiment.metricAssignments[${index}].minDifference`}
                              id={`experiment.metricAssignments[${index}].minDifference`}
                              metricParameterType={indexedMetrics[metricAssignment.metricId].parameterType}
                            />
                          </TableCell>
                          <TableCell>
                            <MoreMenu>
                              <MenuItem onClick={onMakePrimary}>Set as Primary</MenuItem>
                              <MenuItem onClick={onRemoveMetricAssignment}>Remove</MenuItem>
                            </MoreMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {metricAssignmentsField.value.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Typography variant='body1' align='center'>
                            You don&apos;t have any metrics yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className={metricEditorClasses.addMetric}>
                <Add className={metricEditorClasses.addMetricAddSymbol} />
                <FormControl className={classes.addMetricSelect}>
                  <Autocomplete
                    id='add-metric-select'
                    aria-label='Select a metric'
                    value={selectedMetric}
                    onChange={onChangeSelectedMetricOption}
                    fullWidth
                    options={Object.values(indexedMetrics)}
                    noOptionsText='No metrics found'
                    getOptionLabel={(metric: MetricBare) => metric.name}
                    renderOption={(option) => (
                      <div>
                        <Typography variant='body1'>
                          <strong>{option.name}</strong>
                        </Typography>
                        <Typography variant='body1'>
                          <small>{option.description}</small>
                        </Typography>
                      </div>
                    )}
                    renderInput={(params: AutocompleteRenderInputParams) => (
                      <MuiTextField
                        {...params}
                        placeholder='Select a metric'
                        // variant='outlined'
                        required
                        InputProps={{
                          ...autocompleteInputProps(params, false),
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                </FormControl>
                <Button variant='contained' disableElevation size='small' onClick={onAddMetric} aria-label='Add metric'>
                  Assign
                </Button>
              </div>
            </>
          )
        }}
      />

      <Alert severity='info' className={classes.metricsInfo}>
        <Link
          underline='always'
          href="https://github.com/Automattic/experimentation-platform/wiki/Experimenter's-Guide#how-do-i-choose-a-primary-metric"
          target='_blank'
        >
          How do I choose a Primary Metric?
        </Link>
        &nbsp;
        <Link
          underline='always'
          href="https://github.com/Automattic/experimentation-platform/wiki/Experimenter's-Guide#how-do-i-choose-a-minimum-difference-practically-equivalent-value-for-my-metrics"
          target='_blank'
        >
          How do I choose a Minimum Difference?
        </Link>
        <br />
        <Link
          underline='always'
          href="https://github.com/Automattic/experimentation-platform/wiki/Experimenter's-Guide#what-does-change-expected-mean-for-a-metric"
          target='_blank'
        >
          What is Change Expected?
        </Link>
        &nbsp;
        <Link
          underline='always'
          href="https://github.com/Automattic/experimentation-platform/wiki/Experimenter's-Guide#what-is-an-attribution-window-for-a-metric"
          target='_blank'
        >
          What is an Attribution Window?
        </Link>
      </Alert>

      <Typography variant='h4' className={classes.exposureEventsTitle}>
        Exposure Events (Optional)
      </Typography>

      <FieldArray
        name='experiment.exposureEvents'
        render={(arrayHelpers) => {
          const onAddExposureEvent = () => {
            arrayHelpers.push({
              event: '',
              props: [],
            })
          }
          return (
            <>
              <TableContainer>
                <Table>
                  <TableBody>
                    {exposureEventsField.value.map((exposureEvent, index) => (
                      <EventEditor
                        key={index}
                        {...{ arrayHelpers, index, classes, completionBag, exposureEvent }}
                        onRemoveExposureEvent={() => arrayHelpers.remove(index)}
                      />
                    ))}
                    {exposureEventsField.value.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={1}>
                          <Typography variant='body1' align='center'>
                            You don&apos;t have any exposure events.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className={metricEditorClasses.addMetric}>
                <Add className={metricEditorClasses.addMetricAddSymbol} />
                <Button
                  variant='contained'
                  disableElevation
                  size='small'
                  onClick={onAddExposureEvent}
                  aria-label='Add exposure event'
                >
                  Add Event
                </Button>
              </div>
            </>
          )
        }}
      />

      <Alert severity='info' className={classes.exposureEventsInfo}>
        <Link
          underline='always'
          href="https://github.com/Automattic/experimentation-platform/wiki/Experimenter's-Guide#what-is-an-exposure-event-and-when-do-i-need-it"
          target='_blank'
        >
          What is an Exposure Event? And when do I need it?
        </Link>
      </Alert>
    </div>
  )
}

export default Metrics
