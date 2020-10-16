import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select as MuiSelect,
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
import { AutocompleteRenderInputParams } from '@material-ui/lab'
import { Field, FieldArray, useField } from 'formik'
import { Select, Switch, TextField } from 'formik-material-ui'
import React, { useState } from 'react'

import { CompletionBag, getPropNameCompletions } from 'src/api/AutocompleteApi'
import AbacusAutocomplete, { autocompleteInputProps } from 'src/components/Autocomplete'
import MoreMenu from 'src/components/MoreMenu'
import { AttributionWindowSecondsToHuman } from 'src/lib/metric-assignments'
import { EventNew, MetricAssignment, MetricBare, MetricParameterType } from 'src/lib/schemas'
import { useDataSource } from 'src/utils/data-loading'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    addMetricPlaceholder: {
      fontFamily: theme.typography.fontFamily,
    },
    addMetricSelect: {
      minWidth: '10rem',
      marginRight: theme.spacing(1),
    },
    attributionWindowSelect: {
      minWidth: '8rem',
    },
    metricName: {
      fontFamily: theme.custom.fonts.monospace,
      fontWeight: theme.custom.fontWeights.monospaceBold,
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
    exposureEventsTitle: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(4),
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
  completionBag: CompletionBag
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
  completionBag: CompletionBag
}): JSX.Element => {
  const classes = useStyles()
  const metricEditorClasses = useMetricEditorStyles()

  // Metric Assignments
  const [metricAssignmentsField, _metricAssignmentsFieldMetaProps, metricAssignmentsFieldHelperProps] = useField<
    MetricAssignment[]
  >('experiment.metricAssignments')
  const [selectedMetricId, setSelectedMetricId] = useState<string>('')
  const onSelectedMetricChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMetricId(event.target.value as string)
  }

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
            const metricId = parseInt(selectedMetricId, 10)
            const metric = indexedMetrics[metricId]
            if (metricId) {
              const metricAssignment = createMetricAssignment(metric)
              arrayHelpers.push({
                ...metricAssignment,
                isPrimary: metricAssignmentsField.value.length === 0,
              })
            }
            setSelectedMetricId('')
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
                              <span className={classes.metricName}>
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
                            <Field
                              className={classes.minDifferenceField}
                              component={TextField}
                              name={`experiment.metricAssignments[${index}].minDifference`}
                              id={`experiment.metricAssignments[${index}].minDifference`}
                              type='number'
                              variant='outlined'
                              placeholder='1.30'
                              inputProps={{
                                'aria-label': 'Min difference',
                                min: '0',
                              }}
                              InputProps={
                                indexedMetrics[metricAssignment.metricId].parameterType ===
                                MetricParameterType.Conversion
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
                  <MuiSelect
                    labelId='add-metric-label'
                    id='add-metric-select'
                    value={selectedMetricId}
                    onChange={onSelectedMetricChange}
                    displayEmpty
                  >
                    <MenuItem value=''>
                      <span className={classes.addMetricPlaceholder}>Select a Metric</span>
                    </MenuItem>
                    {Object.values(indexedMetrics).map((metric) => (
                      <MenuItem value={metric.metricId} key={metric.metricId}>
                        {metric.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
                <Button variant='contained' disableElevation size='small' onClick={onAddMetric} aria-label='Add metric'>
                  Assign
                </Button>
              </div>
            </>
          )
        }}
      />

      <Typography variant='h4' gutterBottom className={classes.exposureEventsTitle}>
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
    </div>
  )
}

export default Metrics
