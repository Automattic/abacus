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
  Tooltip,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { FieldArray, useField, Field } from 'formik'
import { MetricAssignment, MetricBare, MetricParameterType, AttributionWindowSeconds } from '@/lib/schemas'
import { TextField, Select, Switch } from 'formik-material-ui'

import { AttributionWindowSecondsToHuman } from '@/lib/metric-assignments'
import MoreMenu from '@/components/MoreMenu'
import { Add } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) =>
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

const Metrics = ({ indexedMetrics }: { indexedMetrics: Record<number, MetricBare> }) => {
  const classes = useStyles()

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
                      <TableCell></TableCell>
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
                              placeholder='-'
                              inputProps={{
                                'aria-label': 'Min difference',
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
                            You don't have any metrics yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className={classes.addMetric}>
                <Add className={classes.addMetricAddSymbol} />
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
    </div>
  )
}

export default Metrics
