import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import { isBefore } from 'date-fns'
import debugFactory from 'debug'
import { FormApi, ValidationErrors } from 'final-form'
import arrayMutators from 'final-form-arrays'
import pick from 'lodash/pick'
import { toBool } from 'qc-to_bool'
import { toInt, toIntOrNull } from 'qc-to_int'
import React, { useState } from 'react'
import { Form } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'

import ExperimentsApi from '@/api/ExperimentsApi'

import { ExperimentFull, Platform, Status } from '@/models/index'

import { hasDuplicateStrings } from '@/utils/array'

import {
  isRequired,
  lengthMustBeLessThan,
  mustBeGreaterThanOrEqual,
  mustBeLessThanOrEqual,
  mustMatchPattern,
} from '@/utils/messages'
import {
  composeValidators,
  createMax,
  createMaxLength,
  createMin,
  createPattern,
  createRequired,
} from '@/utils/validators'

import FieldError from './FieldError'
import InputField from './InputField'
import RadioInput from './RadioInput'
import RadioFieldGroup from './RadioFieldGroup'
import ReactDatepickerField from './ReactDatepickerField'
import ReactSelectField from './ReactSelectField'
import TextareaField from './TextareaField'

const debug = debugFactory('abacus:components/ExperimentForm.tsx')

const required = createRequired(isRequired)

const SNAKE_CASE_PATTERN = '[a-z][a-z0-9_]*[a-z0-9]'

const PLATFORM_OPTIONS = [
  { label: 'Calypso', value: Platform.Calypso },
  { label: 'WordPress.com', value: Platform.Wpcom },
]

interface StringOption {
  value: string
}

interface FormValues {
  description: string
  end_datetime: Date
  existing_users_allowed: boolean
  metric_assignments: object[]
  name: string
  owner_login: { label: string; value: string }
  p2_url: string
  platform: { label: string; value: string }
  segment_assignments: object[]
  start_datetime: Date
  status: string
  variations: { allocatedPercentage: number; name: string }[]
  variationsDefaultIndex: string
}

// TODO: Look into using camelCase field names. May simplify things.
const ExperimentForm = () => {
  debug('ExperimentForm#render')
  const [showDeleteVariationConfirm, setShowDeleteVariationConfirm] = useState<boolean>(false)
  const [showVariationNamesDuplicateError, setShowVariationNamesDuplicateError] = useState<boolean>(false)
  const [showVariationsDefaultError, setShowVariationsDefaultError] = useState<boolean>(false)
  const [showVariationsLengthError, setShowVariationsLengthError] = useState<boolean>(false)
  const [showVariationsTotalPercentageError, setShowVariationsTotalPercentageError] = useState<boolean>(false)

  const handleAddVariationButtonClick = (
    form: FormApi<FormValues>,
    errors: ValidationErrors,
    fields: { push: (item: object) => void },
    values: FormValues,
  ) => {
    const variations = values.variations || []
    const totalPercentage = variations.reduce((acc, variation) => acc + toInt(variation.allocatedPercentage, 0), 0) || 0

    if (!errors.variations) {
      fields.push({ name: '', allocatedPercentage: Math.min(100 - Math.min(totalPercentage, 100), 50) })
      setShowVariationsDefaultError(false)
      setShowVariationsLengthError(false)
    } else {
      // Blur all variation fields to make them all touched so if they have any
      // errors, then they will be displayed.
      form.blur('variations')
      variations.forEach((variation, idx) => {
        form.blur(`variations[${idx}].name`)
        form.blur(`variations[${idx}].allocatedPercentage`)
      })
    }
  }

  const handleDeleteVariationButtonClick = () => {
    setShowDeleteVariationConfirm(true)
  }

  const hideDeleteVariationConfirm = () => setShowDeleteVariationConfirm(false)

  const handleVariationAllocatedPercentageChange = () => {
    setShowVariationsTotalPercentageError(true)
  }

  const handleVariationNameChange = () => {
    setShowVariationNamesDuplicateError(true)
  }

  const handleSubmitButtonClick = () => {
    setShowVariationNamesDuplicateError(true)
    setShowVariationsDefaultError(true)
    setShowVariationsLengthError(true)
    setShowVariationsTotalPercentageError(true)
  }

  const onSubmit = async (values: FormValues) => {
    debug('ExperimentForm#onSubmit')
    // console.log('values', values)

    const variations = values.variations || []

    const newExperimentData = {
      ...pick(values, ['description', 'name']),
      experimentId: null,
      p2Url: values.p2_url,
      status: 'staging' as Status,
      startDatetime: values.start_datetime,
      endDatetime: values.end_datetime,
      ownerLogin: values.owner_login.value,
      platform: values.platform.value as Platform,
      existingUsersAllowed: toBool(values.existing_users_allowed),
      // TODO: Handle assignments.
      metricAssignments: [],
      segmentAssignments: [],
      variations: variations.map((variation, idx) => {
        return {
          name: variation.name,
          allocatedPercentage: variation.allocatedPercentage,
          isDefault: toIntOrNull(values.variationsDefaultIndex) === idx,
        }
      }),
    }

    // console.log('newExperimentData', newExperimentData)

    const newExperiment = new ExperimentFull(newExperimentData)
    try {
      const response = await ExperimentsApi.create(newExperiment)
      // TODO: Display a success message. Summary of what was created? Redirect to
      // experiment details?
      // TODO: Handle and display any error messages.
      console.log(response)
    } catch (err) {
      console.error(err)
    }
  }

  function validate(values: FormValues) {
    debug('ExperimentForm#validate', values)
    const errors: { [key: string]: string } = {}

    const endDate = values.end_datetime
    const startDate = values.start_datetime
    if (endDate instanceof Date) {
      if (startDate instanceof Date) {
        if (!isBefore(startDate, endDate)) {
          errors.end_datetime = 'End date must be after start date.'
        }
      } else {
        errors.start_datetime = 'Required.'
      }
    }

    const variations = values.variations || []

    if (variations.length < 2) {
      errors.variations_length = 'Must have 2 or more variations.'
    } else {
      if (hasDuplicateStrings(variations.map((variation) => variation.name.trim()))) {
        errors.variation_names_duplicate = 'Names must be unique.'
      }

      const varIdx = toIntOrNull(values.variationsDefaultIndex)
      if (varIdx === null || varIdx >= variations.length) {
        errors.variations_default = 'Must pick one variation to be the default.'
      }

      const totalPercentage = variations.reduce((acc, variation) => acc + toInt(variation.allocatedPercentage, 0), 0)
      if (totalPercentage > 100 || totalPercentage < variations.length) {
        errors.variations_total_percentage = `Total allocated percentage must be between 100 and ${variations.length}.`
      }
    }

    return errors
  }

  const ownerOptions = [
    { label: 'Aaron M Yan', value: 'aaronmyan' },
    { label: 'Rob Landers', value: 'withinboredom' },
    { label: 'Yanir Seroussi', value: 'yanirseroussi' },
  ]

  return (
    <Form
      mutators={{
        // `arrayMutators has the following mutators:
        // `concat`, `insert`, `move`, `pop`, `push`, `remove`, `removeBatch`, `shift`,
        // `swap`, `unshift`, `update`.
        ...arrayMutators,
      }}
      onSubmit={onSubmit}
      validate={validate}
      render={({ form, errors, handleSubmit, pristine, submitting, touched, values }) => (
        <form onSubmit={handleSubmit}>
          <InputField
            input={{ name: 'p2_url', type: 'url' }}
            label='P2 link'
            preHelper={<p>Once you&apos;ve designed and documented your experiment, enter the p2 post URL</p>}
            validate={composeValidators(
              required,
              createMaxLength(lengthMustBeLessThan, { maxLength: 512, label: 'P2 link' }),
            )}
          />

          <InputField
            input={{ name: 'name', placeholder: 'experiment_name' }}
            label='Experiment name'
            validate={composeValidators(required, createPattern(mustMatchPattern, { pattern: SNAKE_CASE_PATTERN }))}
            postHelper={<small className='form-text'>Please use snake_case, all lowercase</small>}
          />

          <TextareaField
            input={{ name: 'description' }}
            label='Description'
            validate={composeValidators(required, createMaxLength(lengthMustBeLessThan, { maxLength: 5000 }))}
          />

          <ReactDatepickerField
            input={{
              minDate: new Date(),
              name: 'start_datetime',
              todayButton: 'Today',
            }}
            label='Start date'
            validate={required}
          />

          <ReactDatepickerField
            input={{
              name: 'end_datetime',
            }}
            label='End date'
            validate={required}
          />

          <ReactSelectField
            input={{ instanceId: 'ownerLogin', name: 'owner_login', options: ownerOptions }}
            label='Owner'
            validate={required}
          />

          <ReactSelectField
            input={{ instanceId: 'platform', name: 'platform', options: PLATFORM_OPTIONS }}
            label='Platform'
            validate={required}
          />

          <RadioFieldGroup
            input={{ name: 'existing_users_allowed' }}
            label='User types'
            options={[
              { label: 'New users only', value: 'false' },
              { label: 'All users (new + existing)', value: 'true' },
            ]}
            validate={required}
          />

          <FieldArray name='variations'>
            {({ fields }) => {
              const totalPercentage =
                values.variations?.reduce((acc, variation) => acc + toInt(variation.allocatedPercentage, 0), 0) || 0
              return (
                <fieldset>
                  <legend>Variations</legend>
                  {!errors.variations &&
                    ((showVariationsLengthError && errors.variations_length) ||
                      (showVariationNamesDuplicateError && errors.variation_names_duplicate) ||
                      (showVariationsTotalPercentageError && errors.variations_total_percentage) ||
                      (showVariationsDefaultError && errors.variations_default)) && (
                      <Grid container>
                        <Grid item xs={12} sm={5}>
                          <FieldError error={errors.variations_length} touched={showVariationsLengthError} />
                          <FieldError
                            error={errors.variation_names_duplicate}
                            touched={showVariationNamesDuplicateError}
                          />
                        </Grid>
                        <Grid item xs={4} sm={2}>
                          <FieldError
                            error={errors.variations_total_percentage}
                            touched={showVariationsTotalPercentageError}
                          />
                        </Grid>
                        <Grid item xs={4} sm={2}>
                          <FieldError error={errors.variations_default} touched={showVariationsDefaultError} />
                        </Grid>
                      </Grid>
                    )}
                  {fields.map((name, index) => (
                    <Grid key={name} container>
                      <Grid item xs={12} sm={5}>
                        <InputField
                          input={{
                            name: `${name}.name`,
                            onChange: handleVariationNameChange,
                            placeholder: 'variation_name',
                          }}
                          validate={composeValidators(
                            required,
                            createPattern(mustMatchPattern, { pattern: SNAKE_CASE_PATTERN }),
                            createMaxLength(lengthMustBeLessThan, { maxLength: 128 }),
                          )}
                        />
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <InputField
                          input={{
                            max: 100,
                            min: 1,
                            name: `${name}.allocatedPercentage`,
                            onChange: handleVariationAllocatedPercentageChange,
                            type: 'number',
                          }}
                          validate={composeValidators(
                            required,
                            createMax(mustBeLessThanOrEqual, { max: 100 }),
                            createMin(mustBeGreaterThanOrEqual, { min: 1 }),
                          )}
                        />
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <RadioInput
                          name={`variationsDefaultIndex`}
                          label='default'
                          value={'' + index}
                          validate={required}
                        />
                      </Grid>
                      <Grid item xs={2} sm={1}>
                        <button type='button' onClick={handleDeleteVariationButtonClick}>
                          -
                        </button>
                        <Dialog onClose={hideDeleteVariationConfirm} open={showDeleteVariationConfirm}>
                          <DialogTitle>Delete variation?</DialogTitle>
                          <DialogActions>
                            <Button color='primary' onClick={hideDeleteVariationConfirm}>
                              No
                            </Button>
                            <Button
                              color='secondary'
                              onClick={() => {
                                fields.remove(index)
                                hideDeleteVariationConfirm()
                              }}
                            >
                              Yes
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </Grid>
                    </Grid>
                  ))}
                  {(fields.length || 0) > 0 && (
                    <Grid container>
                      <Grid item xs={12} sm={5}>
                        <Hidden smUp>{totalPercentage}%</Hidden>
                      </Grid>
                      <Grid item xs={12} sm={7}>
                        <Hidden xsDown>{totalPercentage}%</Hidden>
                      </Grid>
                    </Grid>
                  )}
                  <div>
                    <button type='button' onClick={() => handleAddVariationButtonClick(form, errors, fields, values)}>
                      +
                    </button>
                  </div>
                </fieldset>
              )
            }}
          </FieldArray>

          <footer>
            <button type='submit' onClick={handleSubmitButtonClick} disabled={submitting || pristine}>
              Schedule Experiment
            </button>
          </footer>
          <pre>{JSON.stringify(errors, null, 2)}</pre>
          <pre>{JSON.stringify(values, null, 2)}</pre>
          <pre>{JSON.stringify(touched, null, 2)}</pre>
        </form>
      )}
    />
  )
}

export default ExperimentForm
