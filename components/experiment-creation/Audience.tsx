import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup as MuiRadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField as MuiTextField,
  Typography,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Field, FieldArray, FormikProps, useField } from 'formik'
import { RadioGroup as FormikMuiRadioGroup, Select, TextField as FormikMuiTextField } from 'formik-material-ui'
import { AutocompleteProps, AutocompleteRenderInputParams, fieldToAutocomplete } from 'formik-material-ui-lab'
import React, { useCallback, useState } from 'react'

import { PlatformToHuman } from '@/lib/experiments'
import {
  DefaultVariationKey,
  ExperimentFullNew,
  Platform,
  Segment,
  SegmentAssignmentNew,
  SegmentType,
  VariationNew,
} from '@/lib/schemas'
import { SegmentTypeToHuman } from '@/lib/segments'

// TODO: Add to feature flag object
const ALLOW_ADDITIONAL_VARIATIONS = false

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '36rem',
      // TODO: Remove, this is just for the storybook.
      margin: '2rem auto',
    },
    row: {
      margin: theme.spacing(6, 0),
      display: 'flex',
      alignItems: 'center',
    },
    segmentationHelperText: {},
    segmentationFieldSet: {
      width: '100%',
    },
    segmentationExclusionState: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: theme.spacing(1),
    },
    variationAllocatedPercentage: {
      width: '7rem',
    },
  }),
)

enum SegmentExclusionState {
  Exclude = 'exclude',
  Include = 'include',
}

const segments: Record<number, Segment> = {
  1: { segmentId: 1, name: 'us', type: SegmentType.Country },
  2: { segmentId: 2, name: 'au', type: SegmentType.Country },
  3: { segmentId: 3, name: 'en-US', type: SegmentType.Locale },
  4: { segmentId: 4, name: 'en-AU', type: SegmentType.Locale },
}

const SegmentsAutocomplete = (
  props: AutocompleteProps<Segment, true, false, false> & { segmentExclusionState: SegmentExclusionState },
) => {
  const {
    form: { setFieldValue },
    field: { name, value: outerValue },
    segmentExclusionState,
  } = props

  // Here we translate SegmentAssignment (outside) <-> Segment (inside)
  const segmentAssignmentToSegment = (segmentAssignment: SegmentAssignmentNew) => {
    const segment = segments[segmentAssignment.segmentId]
    if (!segment) {
      throw new Error('Could not find segment with specified segmentId.')
    }
    return segment
  }
  const segmentToSegmentAssignment = useCallback(
    (segment: Segment): SegmentAssignmentNew => ({
      segmentId: segment.segmentId,
      isExcluded: segmentExclusionState === SegmentExclusionState.Exclude,
    }),
    [segmentExclusionState],
  )
  const onChange = useCallback(
    (_event, value: Segment[]) => {
      setFieldValue(name, value.map(segmentToSegmentAssignment))
    },
    [setFieldValue, name, segmentToSegmentAssignment],
  )
  const value = outerValue && (outerValue as SegmentAssignmentNew[]).map(segmentAssignmentToSegment)

  return (
    <Autocomplete
      {...fieldToAutocomplete(props)}
      multiple={true}
      onChange={onChange}
      value={value}
      getOptionLabel={({ name, type }: Segment) => `${SegmentTypeToHuman[type]}: ${name}`}
    />
  )
}

const newVariation = (): VariationNew => {
  const time = new Date().getTime()
  return {
    name: `treatment_${time}`,
    isDefault: false,
    allocatedPercentage: 0,
    key_: time,
  }
}

const Audience = ({ formikProps }: { formikProps: FormikProps<{ experiment: Partial<ExperimentFullNew> }> }) => {
  const classes = useStyles()

  // The segmentExclusion code is currently split between here and SegmentAutocomplete
  // An improvement might be to have SegmentAutocomplete only handle Segment[] and for code here
  // to translate Segment <-> SegmentAssignment
  const [segmentAssignmentsField, _segmentAssignmentsFieldMeta, segmentAssignmentsFieldHelper] = useField(
    'experiment.segmentAssignments',
  )
  const [segmentExclusionState, setSegmentExclusionState] = useState<SegmentExclusionState>(
    SegmentExclusionState.Include,
  )
  const onChangeSegmentExclusionState = (event: React.SyntheticEvent<HTMLInputElement>, value: string) => {
    setSegmentExclusionState(value as SegmentExclusionState)
    segmentAssignmentsFieldHelper.setValue(
      (segmentAssignmentsField.value as SegmentAssignmentNew[]).map((segmentAssignment: SegmentAssignmentNew) => {
        return {
          ...segmentAssignment,
          isExcluded: value === SegmentExclusionState.Exclude,
        }
      }),
    )
  }

  return (
    <div className={classes.root}>
      <Typography variant='h2' gutterBottom>
        Audience
      </Typography>

      <div className={classes.row}>
        <FormControl component='fieldset'>
          <FormLabel required>Platform</FormLabel>
          <Field component={Select} name='experiment.platform'>
            {Object.values(Platform).map((platform) => (
              <MenuItem key={platform} value={platform}>
                {PlatformToHuman[platform]}
              </MenuItem>
            ))}
          </Field>
        </FormControl>
      </div>

      <div className={classes.row}>
        <FormControl component='fieldset'>
          <FormLabel required>User types</FormLabel>
          <FormHelperText>Types of users to include in experiment</FormHelperText>

          <Field
            component={FormikMuiRadioGroup}
            name='experiment.existingUsersAllowed'
            required
            InputLabelProps={{
              shrink: true,
            }}
          >
            <FormControlLabel
              value='false'
              label='New users only'
              control={<Radio disabled={formikProps.isSubmitting} />}
              disabled={formikProps.isSubmitting}
            />
            <FormControlLabel
              value='true'
              label='All users (new + existing)'
              control={<Radio disabled={formikProps.isSubmitting} />}
              disabled={formikProps.isSubmitting}
            />
          </Field>
        </FormControl>
      </div>
      <div className={classes.row}>
        <FormControl component='fieldset' className={classes.segmentationFieldSet}>
          <FormLabel htmlFor='segments-select'>Targeting</FormLabel>
          <FormHelperText className={classes.segmentationHelperText}>
            Who should see this experiment?
            <br />
            Add optional filters to include or exclude specific target audience segments.
          </FormHelperText>
          <MuiRadioGroup
            aria-label='include-or-exclude-segments'
            className={classes.segmentationExclusionState}
            value={segmentExclusionState}
            onChange={onChangeSegmentExclusionState}
          >
            <FormControlLabel value={SegmentExclusionState.Include} control={<Radio />} label='Include' />
            <FormControlLabel value={SegmentExclusionState.Exclude} control={<Radio />} label='Exclude' />
          </MuiRadioGroup>
          <Field
            name='experiment.segmentAssignments'
            component={SegmentsAutocomplete}
            options={Object.values(segments)}
            // TODO: Error state, see https://stackworx.github.io/formik-material-ui/docs/api/material-ui-lab
            renderInput={(params: AutocompleteRenderInputParams) => (
              <MuiTextField {...params} variant='outlined' placeholder='Search and select to customize' />
            )}
            segmentExclusionState={segmentExclusionState}
            fullWidth
            id='segments-select'
          />
        </FormControl>
      </div>
      <div className={classes.row}>
        <FormControl component='fieldset' className={classes.segmentationFieldSet}>
          <FormLabel htmlFor='variations-select'>Variations</FormLabel>
          <FormHelperText className={classes.segmentationHelperText}>
            Define the percentages to include in the experiment.
            <br />
            Use &ldquo;control&rdquo; for the default (fallback) experience.
          </FormHelperText>
          <FieldArray
            name='experiment.variations'
            render={(arrayHelpers) => {
              if (!formikProps.values.experiment.variations) {
                throw new Error('New experiment must have a variations array.')
              }

              return (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell> Name </TableCell>
                        <TableCell> Allocated Percentage </TableCell>
                        {ALLOW_ADDITIONAL_VARIATIONS && <TableCell></TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formikProps.values.experiment.variations.map((variation, idx) => {
                        const isControl = DefaultVariationKey.Control === variation.key_
                        return (
                          <TableRow key={variation.key_}>
                            <TableCell>
                              {!isControl && ALLOW_ADDITIONAL_VARIATIONS ? (
                                <Field
                                  component={FormikMuiTextField}
                                  name={`experiment.variations[${idx}].name`}
                                  size='small'
                                  variant='outlined'
                                  required
                                />
                              ) : (
                                variation.name
                              )}
                            </TableCell>
                            <TableCell>
                              <Field
                                className={classes.variationAllocatedPercentage}
                                component={FormikMuiTextField}
                                name={`experiment.variations[${idx}].allocatedPercentage`}
                                type='number'
                                size='small'
                                variant='outlined'
                                inputProps={{ min: 1, max: 99 }}
                                required
                                InputProps={{
                                  endAdornment: <InputAdornment position='end'>%</InputAdornment>,
                                }}
                              />
                            </TableCell>
                            {ALLOW_ADDITIONAL_VARIATIONS && (
                              <TableCell>
                                {isControl && <Button onClick={() => arrayHelpers.remove(idx)}>Remove</Button>}
                              </TableCell>
                            )}
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  {ALLOW_ADDITIONAL_VARIATIONS && (
                    <Button onClick={() => arrayHelpers.push(newVariation())}>Add Variation</Button>
                  )}
                </TableContainer>
              )
            }}
          />
        </FormControl>
      </div>
    </div>
  )
}

export default Audience
