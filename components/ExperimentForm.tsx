import { format, isBefore } from 'date-fns'
import debugFactory from 'debug'
import arrayMutators from 'final-form-arrays'
import pick from 'lodash/pick'
import { toBool } from 'qc-to_bool'
import { toInt } from 'qc-to_int'
import React from 'react'
import { Form } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'

import ExperimentsApi from '@/api/ExperimentsApi'

import { ExperimentFull, Platform } from '@/models/index'

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

import InputField from './InputField'
import RadioInput from './RadioInput'
import RadioFieldGroup from './RadioFieldGroup'
import ReactDatepickerField from './ReactDatepickerField'
import ReactSelectField from './ReactSelectField'
import TextareaField from './TextareaField'

const debug = debugFactory('abacus:components/ExperimentForm.tsx')

const required = createRequired(isRequired)

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
  platform: string
  segment_assignments: object[]
  start_datetime: Date
  status: string
  variations: { name: string; allocatedPercentage: number }[]
}

const ExperimentForm = () => {
  debug('ExperimentForm#render')

  const onSubmit = async (values: FormValues) => {
    console.log('values', values)

    const newExperimentData = {
      ...pick(values, ['description', 'name', 'owner_login', 'p2_url', 'platform']),
      status: 'staging',
      start_datetime: format(values.start_datetime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      end_datetime: format(values.end_datetime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      owner_login: ((values.owner_login as unknown) as StringOption).value,
      platform: ((values.platform as unknown) as StringOption).value,
      existing_users_allowed: toBool(values.existing_users_allowed),
      // TODO: Handle assignments and variations.
      metric_assignments: [],
      segment_assignments: [],
      variations: [
        {
          name: 'aa',
          is_default: true,
          allocated_percentage: 60,
        },
        {
          name: 'bb',
          is_default: false,
          allocated_percentage: 40,
        },
      ],
    }

    // console.log('newExperimentData', newExperimentData)

    const newExperiment = new ExperimentFull(newExperimentData)
    try {
      const response = await ExperimentsApi.create(newExperiment)
      // TODO: Display a success message. Summary of what was creating? Redirect to
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
      render={({ handleSubmit, pristine, submitting, values }) => (
        <form className='ui form' onSubmit={handleSubmit}>
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
            validate={composeValidators(
              required,
              createPattern(mustMatchPattern, { pattern: '^[a-z][a-z0-9_]*[a-z0-9]$' }),
            )}
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
            input={{ instanceId: 'ownerLogin', name: 'owner_login' }}
            label='Owner'
            options={ownerOptions}
            validate={required}
          />

          <ReactSelectField
            input={{ instanceId: 'platform', name: 'platform' }}
            label='Platform'
            options={PLATFORM_OPTIONS}
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
              const totalPercentage = values?.variations?.reduce(
                (acc, field) => acc + toInt(field.allocatedPercentage),
                0,
              )
              return (
                <fieldset>
                  <legend>Variations</legend>
                  <div className='ui grid stackable'>
                    {fields.map((name, index) => (
                      <div key={name} className='row'>
                        <div className='column four wide'>
                          <InputField
                            input={{ name: `${name}.name`, placeholder: 'variation_name' }}
                            validate={composeValidators(
                              required,
                              createPattern(mustMatchPattern, { pattern: '^[a-z][a-z0-9_]*[a-z0-9]$' }),
                              createMaxLength(lengthMustBeLessThan, { maxLength: 128 }),
                            )}
                          />
                        </div>
                        <div className='column four wide'>
                          <InputField
                            input={{ name: `${name}.allocatedPercentage`, type: 'number' }}
                            validate={composeValidators(
                              required,
                              createMax(mustBeLessThanOrEqual, { max: 100 }),
                              createMin(mustBeGreaterThanOrEqual, { min: 1 }),
                            )}
                          />
                        </div>
                        <div className='column three wide'>
                          <RadioInput
                            name={`variationsDefaultIndex`}
                            label='default'
                            value={'' + index}
                            validate={required}
                          />
                        </div>
                        <div className='column two wide'>
                          <button type='button' onClick={() => fields.remove(index)}>
                            -
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className='row'>
                      <div className='column two wide'>
                        <button type='button' onClick={() => fields.push({ name: '', allocatedPercentage: 0 })}>
                          +
                        </button>
                      </div>
                      {totalPercentage !== undefined && <div className='column two wide'>{totalPercentage}%</div>}
                    </div>
                    <div className='row'>
                      <p>TODO: Confirm deletion.</p>
                      <p>TODO: Assert variation names are unique.</p>
                      <p>TODO: Assert only 1 variation is a default.</p>
                      <p>TODO: Assert there are two or more variations.</p>
                      <p>TODO: Assert sum of percentages is greater than 1 and less than or equal to 100.</p>
                    </div>
                  </div>
                </fieldset>
              )
            }}
          </FieldArray>

          <footer>
            <button type='submit' className='ui button large black' disabled={submitting || pristine}>
              Schedule Experiment
            </button>
          </footer>
        </form>
      )}
    />
  )
}

export default ExperimentForm
