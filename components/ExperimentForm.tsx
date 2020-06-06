import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import cn from 'classnames'
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

const STEP0_FIELD_NAMES = ['p2_url']
const STEP1_FIELD_NAMES = ['description', 'end_datetime', 'name', 'owner_login', 'start_datetime']
const STEP2_FIELD_NAMES = ['existing_users_allowed', 'platform', 'segment_assignments', 'variations']

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
  const [step, setStep] = useState(0)
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
      setShowVariationsDefaultError(true)
      setShowVariationsLengthError(true)
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
      render={({ form, errors, handleSubmit, pristine, submitting, touched, values }) => {
        const step0HasErrors = !!errors.p2_url
        const step1ErrorCount = STEP1_FIELD_NAMES.reduce((acc, fieldName) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          return (errors[fieldName] ? 1 : 0) + acc
        }, 0)
        const step1HasErrors = step1ErrorCount > 0

        const step2ErrorCount = [
          ...STEP2_FIELD_NAMES,
          'variation_names_duplicate',
          'variations_default',
          'variations_length',
          'variations_total_percentage',
        ].reduce((acc, fieldName) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          return (errors[fieldName] ? 1 : 0) + acc
        }, 0)
        const step2HasErrors = step2ErrorCount > 0

        function handleStep0Next() {
          STEP0_FIELD_NAMES.forEach((fieldName) => form.blur(fieldName))
          if (!step0HasErrors) {
            setStep(1)
          }
        }

        function handleStep1Next() {
          STEP1_FIELD_NAMES.forEach((fieldName) => form.blur(fieldName))
          // If step 1 is valid, then allow to move to step 2.
          if (!step1HasErrors) {
            setStep(2)
          }
        }

        function handleStep2Next(values: FormValues) {
          STEP2_FIELD_NAMES.forEach((fieldName) => form.blur(fieldName))
          const variations = values.variations || []
          variations.forEach((_variation, idx: number) => {
            form.blur(`variations[${idx}].name`)
            form.blur(`variations[${idx}].allocatedPercentage`)
          })
          setShowVariationNamesDuplicateError(true)
          setShowVariationsDefaultError(true)
          setShowVariationsLengthError(true)
          setShowVariationsTotalPercentageError(true)
          // If step 2 is valid, then allow to move to step 3.
          if (!step2HasErrors) {
            setStep(3)
          }
        }

        return (
          <form className='form experiment' onSubmit={handleSubmit}>
            <section className={cn({ 'd-none': step !== 0 })}>
              <p>
                To create a new experiment, please first{' '}
                <a
                  className='underline'
                  href='https://betterexperiments.wordpress.com/'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  post on this p2.
                </a>{' '}
                We think one of the best ways to prevent a failed experiment is by documenting what you hope to learn.
              </p>

              <InputField
                input={{ name: 'p2_url', type: 'url' }}
                label='P2 link'
                preHelper={<p>Once you&apos;ve designed and documented your experiment, enter the p2 post URL</p>}
                validate={composeValidators(
                  required,
                  createMaxLength(lengthMustBeLessThan, { maxLength: 512, label: 'P2 link' }),
                )}
              />

              <button type='button' onClick={handleStep0Next}>
                Begin
              </button>
            </section>

            <section className={cn({ 'd-none': step < 1 })}>
              <header className={cn({ active: step === 1 })}>
                <div>
                  <h2>Basic Info</h2>
                  <p>Step 1 of 3</p>
                </div>
                {step > 1 && (
                  <button type='button' className='relative' onClick={() => setStep(1)}>
                    Edit
                    {step1HasErrors && <div>{step1ErrorCount}</div>}
                  </button>
                )}
              </header>
              <div className={cn('content', { active: step === 1 })}>
                <Grid container>
                  <Grid item xs={12} sm={8}>
                    <InputField
                      input={{ name: 'name', placeholder: 'experiment_name' }}
                      label='Experiment name'
                      validate={composeValidators(
                        required,
                        createPattern(mustMatchPattern, { pattern: SNAKE_CASE_PATTERN }),
                      )}
                      postHelper={<small className='form-text'>Please use snake_case, all lowercase</small>}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextareaField
                      input={{ name: 'description' }}
                      label='Description'
                      validate={composeValidators(required, createMaxLength(lengthMustBeLessThan, { maxLength: 5000 }))}
                    />
                  </Grid>
                  <Grid container item xs={12} sm={8}>
                    <Grid item xs={12} sm>
                      <ReactDatepickerField
                        input={{
                          minDate: new Date(),
                          name: 'start_datetime',
                          todayButton: 'Today',
                        }}
                        label='Start date'
                        validate={required}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <span>through</span>
                    </Grid>
                    <Grid item xs={12} sm>
                      <ReactDatepickerField
                        input={{
                          name: 'end_datetime',
                        }}
                        label='End date'
                        validate={required}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <ReactSelectField
                      input={{ instanceId: 'ownerLogin', name: 'owner_login', options: ownerOptions }}
                      label='Owner'
                      validate={required}
                    />
                  </Grid>
                </Grid>
              </div>
              <footer className={cn({ active: step === 1 })}>
                <button type='button' onClick={handleStep1Next}>
                  Next
                </button>
              </footer>

              <header className={cn({ active: step === 2 })}>
                <div>
                  <h2>Audience</h2>
                  <p>Step 2 of 3</p>
                </div>
                {step > 2 && (
                  <button type='button' onClick={() => setStep(2)}>
                    Edit
                    {step2HasErrors && <div>{step2ErrorCount}</div>}
                  </button>
                )}
              </header>
              <div className={cn('content', { active: step === 2 })}>
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
                      values.variations?.reduce((acc, variation) => acc + toInt(variation.allocatedPercentage, 0), 0) ||
                      0
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
                              <Grid item xs={4} sm>
                                <FieldError error={errors.variations_default} touched={showVariationsDefaultError} />
                              </Grid>
                              <Grid item xs={2} sm={1}></Grid>
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
                            <Grid item xs={4} sm>
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
                          <button
                            type='button'
                            onClick={() => handleAddVariationButtonClick(form, errors, fields, values)}
                          >
                            +
                          </button>
                        </div>
                      </fieldset>
                    )
                  }}
                </FieldArray>

                <fieldset>
                  <legend>Segmentation</legend>
                  <p>Optionally, add segmentation to your experiment</p>
                  <button type='button' onClick={() => alert('TODO: Allow to add segmentation.')}>
                    + Add segmentation
                  </button>
                </fieldset>
              </div>
              <footer className={cn({ active: step === 2 })}>
                <button type='button' onClick={() => handleStep2Next(values)}>
                  Next
                </button>
              </footer>

              <header className={cn({ active: step === 3 })}>
                <div>
                  <h2>User details &amp; metrics</h2>
                  <p>Step 3 of 3</p>
                </div>
              </header>
              <div className={cn('content', { active: step === 3 })}>
                <h4>User set</h4>
                <p>
                  New {'{platform}'} users located in {'{place[0]}'}, {'{place[1]}'} with their site language set to{' '}
                  <span>en</span>.
                </p>

                <fieldset>
                  <legend>Metrics</legend>
                  <p>Quantify the impact you&apos;re trying to measure.</p>
                  <p>TODO: Add metric assignments.</p>
                  <small className='form-text'>If it doesn&apos;t exist, add a new metric.</small>
                </fieldset>
              </div>
              <footer className={cn({ active: step === 3 })}>
                <button type='submit' disabled={submitting || pristine}>
                  Schedule Experiment
                </button>
              </footer>
            </section>

            <pre>{JSON.stringify(errors, null, 2)}</pre>
            <pre>{JSON.stringify(values, null, 2)}</pre>
            <pre>{JSON.stringify(touched, null, 2)}</pre>
          </form>
        )
      }}
    />
  )
}

export default ExperimentForm
