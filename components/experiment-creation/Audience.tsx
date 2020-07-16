import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputAdornment,
  MenuItem,
  Radio,
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
import { Field, FieldArray, FormikProps } from 'formik'
import { RadioGroup, Select, TextField as FormikMuiTextField } from 'formik-material-ui'
import { AutocompleteProps, AutocompleteRenderInputParams, fieldToAutocomplete } from 'formik-material-ui-lab'
import React from 'react'

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
    segmentationHelperText: {
      marginBottom: theme.spacing(2),
    },
    segmentationFieldSet: {
      width: '100%',
    },
    variationAllocatedPercentage: {
      width: '7rem',
    },
  }),
)

const segments: Record<number, Segment> = {
  1: { segmentId: 1, name: 'us', type: SegmentType.Country },
  2: { segmentId: 2, name: 'au', type: SegmentType.Country },
  3: { segmentId: 3, name: 'en-US', type: SegmentType.Locale },
  4: { segmentId: 4, name: 'en-AU', type: SegmentType.Locale },
}

const SegmentsAutocomplete = (props: AutocompleteProps<Segment, true, false, false>) => {
  const {
    form: { setFieldValue },
    field: { name, value: outerValue },
  } = props

  // Here we translate SegmentAssignment (outside) <-> Segment (inside)
  const segmentAssignmentToSegment = (segmentAssignment: SegmentAssignmentNew) => {
    const segment = segments[segmentAssignment.segmentId]
    if (!segment) {
      throw new Error('Could not find segment with specified segmentId.')
    }
    return segment
  }
  const segmentToSegmentAssignment = (segment: Segment): SegmentAssignmentNew => ({
    segmentId: segment.segmentId,
    isExcluded: false,
  })
  const onChange = React.useCallback(
    (_event, value: Segment[]) => {
      setFieldValue(name, value.map(segmentToSegmentAssignment))
    },
    [setFieldValue, name],
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
    _key: time,
  }
}

const Audience = ({ formikProps }: { formikProps: FormikProps<{ experiment: Partial<ExperimentFullNew> }> }) => {
  const classes = useStyles()

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
            component={RadioGroup}
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
          <FormLabel htmlFor='segments-select'>Segmentation</FormLabel>
          <FormHelperText className={classes.segmentationHelperText}>
            Who should see this experiment?
            <br />
            Add optional segments to target specific audiences
          </FormHelperText>
          <Field
            name='experiment.segmentAssignments'
            component={SegmentsAutocomplete}
            options={Object.values(segments)}
            // TODO: Error state, see https://stackworx.github.io/formik-material-ui/docs/api/material-ui-lab
            renderInput={(params: AutocompleteRenderInputParams) => (
              <MuiTextField {...params} variant='outlined' placeholder='Search and select to customize' />
            )}
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
                        const isControl = DefaultVariationKey.Control === variation._key
                        return (
                          <TableRow key={variation._key}>
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
