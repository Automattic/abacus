import {
  Chip,
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
import { Field, FormikProps, useField } from 'formik'
import { RadioGroup as FormikMuiRadioGroup, Select, TextField as FormikMuiTextField } from 'formik-material-ui'
import { AutocompleteProps, AutocompleteRenderInputParams, fieldToAutocomplete } from 'formik-material-ui-lab'
import _ from 'lodash'
import React, { useCallback, useState } from 'react'

import { PlatformToHuman } from 'src/lib/experiments'
import { ExperimentFormData } from 'src/lib/form-data'
import { AutocompleteItem, Platform, Segment, SegmentAssignmentNew } from 'src/lib/schemas'
import { SegmentTypeToHuman } from 'src/lib/segments'
import { isDebugMode } from 'src/utils/general'

import AbacusAutocomplete, { autocompleteInputProps } from '../Autocomplete'
import { ExperimentFormCompletionBag } from './ExperimentForm'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    row: {
      margin: theme.spacing(5, 0),
      display: 'flex',
      alignItems: 'center',
      '&:first-of-type': {
        marginTop: theme.spacing(3),
      },
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
    variants: {
      width: 'auto',
    },
  }),
)

enum SegmentExclusionState {
  Exclude = 'exclude',
  Include = 'include',
}

const SegmentsAutocomplete = (
  props: AutocompleteProps<Segment, true, false, false> & {
    indexedSegments: Record<number, Segment>
    segmentExclusionState: SegmentExclusionState
  },
) => {
  const {
    form: { setFieldValue },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    field: { name, value: outerValue },
    segmentExclusionState,
  } = props

  // Here we translate SegmentAssignment (outside) <-> Segment (inside)
  const segmentAssignmentToSegment = (segmentAssignment: SegmentAssignmentNew) => {
    const segment = props.indexedSegments[segmentAssignment.segmentId]
    /* istanbul ignore next; Should never happen */
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
      {...fieldToAutocomplete(_.omit(props, 'segmentExclusionState', 'indexedSegments'))}
      multiple={true}
      onChange={onChange}
      value={value}
      getOptionLabel={({ name, type }: Segment) => `${SegmentTypeToHuman[type]}: ${name}`}
    />
  )
}

const Audience = ({
  indexedSegments,
  formikProps,
  completionBag,
}: {
  indexedSegments: Record<number, Segment>
  formikProps: FormikProps<{ experiment: ExperimentFormData }>
  completionBag: ExperimentFormCompletionBag
}): JSX.Element => {
  const classes = useStyles()

  // The segmentExclusion code is currently split between here and SegmentAutocomplete
  // An improvement might be to have SegmentAutocomplete only handle Segment[] and for code here
  // to translate Segment <-> SegmentAssignment
  const [segmentAssignmentsField, _segmentAssignmentsFieldMeta, segmentAssignmentsFieldHelper] = useField(
    'experiment.segmentAssignments',
  )
  const [segmentExclusionState, setSegmentExclusionState] = useState<SegmentExclusionState>(() => {
    // We initialize the segmentExclusionState from existing data if there is any
    const firstSegmentAssignment = (segmentAssignmentsField.value as SegmentAssignmentNew[])[0]
    return firstSegmentAssignment && firstSegmentAssignment.isExcluded
      ? SegmentExclusionState.Exclude
      : SegmentExclusionState.Include
  })
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
      <Typography variant='h4' gutterBottom>
        Define Your Audience
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

          <Field component={FormikMuiRadioGroup} name='experiment.existingUsersAllowed' required>
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
            Who should see this experiment? <br /> Add optional filters to include or exclude specific target audience
            segments.
          </FormHelperText>
          <MuiRadioGroup
            aria-label='include-or-exclude-segments'
            className={classes.segmentationExclusionState}
            value={segmentExclusionState}
            onChange={onChangeSegmentExclusionState}
          >
            <FormControlLabel
              value={SegmentExclusionState.Include}
              control={<Radio />}
              label='Include'
              name='non-formik-segment-exclusion-state-include'
            />
            <FormControlLabel
              value={SegmentExclusionState.Exclude}
              control={<Radio />}
              label='Exclude'
              name='non-formik-segment-exclusion-state-exclude'
            />
          </MuiRadioGroup>
          <Field
            name='experiment.segmentAssignments'
            component={SegmentsAutocomplete}
            options={Object.values(indexedSegments)}
            // TODO: Error state, see https://stackworx.github.io/formik-material-ui/docs/api/material-ui-lab
            renderInput={(params: AutocompleteRenderInputParams) => (
              /* eslint-disable @typescript-eslint/no-unsafe-member-access */
              <MuiTextField
                {...params}
                variant='outlined'
                placeholder={segmentAssignmentsField.value.length === 0 ? 'Search and select to customize' : undefined}
              />
              /* eslint-enable @typescript-eslint/no-unsafe-member-access */
            )}
            segmentExclusionState={segmentExclusionState}
            indexedSegments={indexedSegments}
            fullWidth
            id='segments-select'
          />
        </FormControl>
      </div>
      <div className={classes.row}>
        <FormControl component='fieldset' className={classes.segmentationFieldSet}>
          <FormLabel htmlFor='variations-select'>Variations</FormLabel>
          <FormHelperText className={classes.segmentationHelperText}>
            Define the percentages to include in the experiment. <br /> Use &ldquo;control&rdquo; for the default
            (fallback) experience.
          </FormHelperText>
          <TableContainer>
            <Table className={classes.variants}>
              <TableHead>
                <TableRow>
                  <TableCell> Name </TableCell>
                  <TableCell> Allocated Percentage </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formikProps.values.experiment.variations.map((variation, index) => {
                  return (
                    // The key here needs to be changed for variable variations
                    <TableRow key={variation.name}>
                      <TableCell>{variation.name}</TableCell>
                      <TableCell>
                        <Field
                          className={classes.variationAllocatedPercentage}
                          component={FormikMuiTextField}
                          name={`experiment.variations[${index}].allocatedPercentage`}
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
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </FormControl>
      </div>
      {isDebugMode() && (
        <div className={classes.row}>
          <FormControl component='fieldset'>
            <FormLabel htmlFor='experiment.exclusionGroupTagIds'>Exclusion Groups</FormLabel>
            <FormHelperText>Optionally add this experiment to a mutually exclusive experiment group.</FormHelperText>
            <br />
            <Field
              component={AbacusAutocomplete}
              name='experiment.exclusionGroupTagIds'
              id='experiment.exclusionGroupTagIds'
              fullWidth
              options={
                // istanbul ignore next; trivial
                completionBag.exclusionGroupCompletionDataSource.data ?? []
              }
              loading={completionBag.exclusionGroupCompletionDataSource.isLoading}
              multiple
              renderOption={(option: AutocompleteItem) => <Chip label={option.name} />}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <MuiTextField
                  {...params}
                  variant='outlined'
                  InputProps={{
                    ...autocompleteInputProps(params, completionBag.exclusionGroupCompletionDataSource.isLoading),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </FormControl>
        </div>
      )}
    </div>
  )
}

export default Audience
