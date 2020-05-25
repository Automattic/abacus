import cn from 'classnames'
import { format, isAfter, isBefore, startOfToday } from 'date-fns'
import debugFactory from 'debug'
import pick from 'lodash/pick'
import { toBool } from 'qc-to_bool'
import { toInt } from 'qc-to_int'
import React from 'react'
import ReactDatePicker from 'react-datepicker'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import ReactSelect from 'react-select'

import ExperimentsApi from '@/api/ExperimentsApi'

import { ExperimentFull, Platform } from '@/models/index'

const SNAKE_CASE_RE = /^[a-z][a-z0-9_]*[a-z0-9]$/

const debug = debugFactory('abacus:components/ExperimentForm.tsx')

interface StringOption {
  value: string
}

type ExperimentFormValues = {
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
  variations: object[]
}

const PLATFORM_OPTIONS = [
  { label: 'Calypso', value: Platform.Calypso },
  { label: 'WordPress.com', value: Platform.Wpcom },
]

const VariationFieldset = ({
  control,
  errors,
  register,
  setValue,
  watch,
}: {
  control: any
  errors: any
  register: any
  setValue: any
  watch: any
}) => {
  console.log('VariationFieldset#render')
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variations',
  })
  watch('variations')

  const hasIsDefault = fields.some((field) => field.isDefault === 'true')
  const accumPercentage = fields.reduce((acc, field) => acc + toInt(field.allocatedPercentage), 0)
  const setIsDefault = (index: number) => {
    const variations = fields.map((variation, idx) => ({
      isDefault: idx === index ? 'true' : 'false',
    }))
    const shouldValidate = false
    setValue('variations', variations, shouldValidate)
  }
  return (
    <fieldset>
      <legend>Variations</legend>
      <div className='ui grid stackable'>
        {fields.map((item, index) => {
          console.log('field:', item, index)
          const fieldNamePrefix = `variations[${index}]`
          const allocatedPercentageError = errors?.variations?.[index]?.allocatedPercentage
          const nameError = errors?.variations?.[index]?.name

          return (
            <div key={item.id} className='row'>
              <div className='column four wide'>
                <div className={cn('field', 'required', { error: nameError })}>
                  <input
                    ref={register({
                      required: 'Variation name is required.',
                      maxLength: { message: 'Length must not exceed 128 characters.', value: 128 },
                      validate: {
                        pattern: (value: string) =>
                          SNAKE_CASE_RE.test(value) ||
                          'The Variation name must be a lower_snake_case string that starts with a letter and ends with a letter or number.',
                      },
                    })}
                    className='ui input'
                    id={`${fieldNamePrefix}.name`}
                    name={`${fieldNamePrefix}.name`}
                    defaultValue={item.name}
                    placeholder='variation_name'
                  />
                  {nameError && (
                    <div className='prompt label' role='alert' aria-atomic='true'>
                      {nameError.message}
                    </div>
                  )}
                </div>
              </div>
              <div className='column four wide'>
                <div className={cn('field', 'required', { error: allocatedPercentageError })}>
                  <div className='ui right labeled input'>
                    <input
                      ref={register({
                        required: 'Allocated percentage is required.',
                        max: { message: 'Must not be greater than 100.', value: 100 },
                        min: { message: 'Must not be less than 1.', value: 1 },
                      })}
                      type='number'
                      className='ui input'
                      id={`${fieldNamePrefix}.allocatedPercentage`}
                      name={`${fieldNamePrefix}.allocatedPercentage`}
                      defaultValue={item.allocatedPercentage}
                    />
                    <div className='ui label'>%</div>
                  </div>
                  {allocatedPercentageError && (
                    <div className='prompt label' role='alert' aria-atomic='true'>
                      {allocatedPercentageError.message}
                    </div>
                  )}
                </div>
              </div>
              <div className='column three wide'>
                <button onClick={() => void setIsDefault(index)}>default</button>
                <input
                  ref={register()}
                  type='hidden'
                  name={`${fieldNamePrefix}.isDefault`}
                  defaultValue={item.isDefault}
                />
                {item.isDefault === 'true' ? 'checked' : 'not'}
              </div>
              <div className='column two wide'>
                <button
                  type='button'
                  className='ui button'
                  onClick={() => {
                    remove(index)
                  }}
                >
                  -
                </button>
              </div>
            </div>
          )
        })}
        <div className='row'>
          <div className='column two wide'>
            <button
              type='button'
              className='ui button'
              onClick={() => {
                append({
                  name: '',
                  allocatedPercentage: Math.min(50, 100 - accumPercentage),
                  isDefault: hasIsDefault ? 'false' : 'true',
                })
              }}
            >
              +
            </button>
          </div>
          <div className='column two wide'>{accumPercentage}%</div>
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
}

const ExperimentForm = () => {
  debug('ExperimentForm#render')
  const {
    control,
    errors,
    formState,
    getValues,
    handleSubmit,
    register,
    setError,
    setValue,
    triggerValidation,
    watch,
  } = useForm<ExperimentFormValues>({
    defaultValues: {
      description: '',
      metric_assignments: [],
      name: '',
      segment_assignments: [],
      start_datetime: new Date(),
      variations: [],
    },
    mode: 'onBlur',
  })
  const { isSubmitting, touched } = formState

  watch()

  const onSubmit = async (values: ExperimentFormValues) => {
    console.log('values', values)

    const newExperimentData = {
      ...pick(values, ['description', 'name', 'owner_login', 'p2_url', 'platform', 'status']),
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

    console.log('newExperimentData', newExperimentData)

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

  const ownerOptions = [
    { label: 'Aaron M Yan', value: 'aaronmyan' },
    { label: 'Rob Landers', value: 'withinboredom' },
    { label: 'Yanir Seroussi', value: 'yanirseroussi' },
  ]

  return (
    <form className='ui form experiment' onSubmit={handleSubmit(onSubmit)}>
      <div className={cn('field', 'required', { error: errors.p2_url })}>
        <label htmlFor='experimentP2Url'>P2 link</label>
        <p>Once you&apos;ve designed and documented your experiment, enter the p2 post URL</p>
        <input
          ref={register({
            required: 'P2 link is required.',
            maxLength: { message: 'Length must not exceed 512 characters.', value: 512 },
          })}
          type='url'
          className='ui input'
          id='experimentP2Url'
          name='p2_url'
        />
        {errors.p2_url && (
          <div className='prompt label' role='alert' aria-atomic='true'>
            {errors.p2_url.message}
          </div>
        )}
      </div>

      <div className='field required'>
        <input
          ref={register({ required: true })}
          type='hidden'
          className='ui input'
          name='status'
          defaultValue='staging'
        />
      </div>
      <div className={cn('field', 'required', { error: errors.name })}>
        <label htmlFor='experimentName'>Experiment name</label>
        <input
          ref={register({
            required: 'Experiment name is required.',
            maxLength: { message: 'Length must not exceed 128 characters.', value: 128 },
            validate: {
              pattern: (value) =>
                SNAKE_CASE_RE.test(value) ||
                'The Experiment name must be a lower_snake_case string that starts with a letter and ends with a letter or number.',
              // snakeCase: (value) => isSnakeCase(value) || 'Experiment name must be in snake_case.',
            },
          })}
          className='ui input'
          id='experimentName'
          name='name'
          placeholder='experiment_name'
        />
        <small className='form-text'>Please use snake_case, all lowercase</small>
        {errors.name && (
          <div className='prompt label' role='alert' aria-atomic='true'>
            {errors.name.message}
          </div>
        )}
      </div>
      <div className={cn('field', 'required', { error: errors.description })}>
        <label htmlFor='experimentDescription'>Description</label>
        <textarea
          ref={register({
            required: 'Description is required.',
            maxLength: 'Length must not exceed 5000 characters.',
          })}
          className='ui input'
          id='experimentDescription'
          name='description'
          placeholder='Monthly vs. yearly pricing'
        />
        <small className='form-text'>State your hypothesis. It will show up in the list view.</small>
        {errors.description && (
          <div className='prompt label' role='alert' aria-atomic='true'>
            {errors.description.message}
          </div>
        )}
      </div>
      <div className={cn('field', 'required', { error: errors.start_datetime })}>
        <label htmlFor='experimentStartDatetime'>Start date</label>
        <Controller
          as={ReactDatePicker}
          control={control}
          onChange={([selected]) => {
            // Note: The onBlur of the date picker seems to be very unreliable. So, forcing
            // validation to be run. But we need to wait until after the new date has been
            // selected. Hence the need for `setTimeout`.
            setTimeout(
              () =>
                // Don't trigger validation on end_datetime until it's been touched.
                // Otherwise, its "is required" error is displayed after selecting a start date.
                void triggerValidation(['start_datetime', (touched.end_datetime && 'end_datetime') || '']),
              0,
            )
            return selected
          }}
          rules={{
            required: 'Start date is required.',
            validate: {
              isInFuture: (value) => {
                return !isBefore(value, startOfToday()) || 'Start date must be today or in the future.'
              },
            },
          }}
          valueName='selected'
          wrapperClassName='w-100'
          id='experimentStartDatetime'
          minDate={new Date()}
          name='start_datetime'
          todayButton='Today'
        />
        {errors.start_datetime && (
          <div className='prompt label' role='alert' aria-atomic='true'>
            {errors.start_datetime.message}
          </div>
        )}
      </div>
      <div className={cn('field', 'required', { error: errors.end_datetime })}>
        <label htmlFor='experimentEndDatetime'>End date</label>
        <Controller
          as={ReactDatePicker}
          control={control}
          onBlur={(event) => console.log('blurred end date', event)}
          onChange={([selected]) => {
            setTimeout(() => void triggerValidation(['end_datetime']), 0)
            return selected
          }}
          rules={{
            required: 'End date is required.',
            validate: {
              isAfterStartDate: (value) => {
                const startDate = getValues('start_datetime')
                console.log('startDate', startDate)
                if (startDate instanceof Date) {
                  return isAfter(value, startDate) || 'End date must be after start date.'
                }
                setError('start_datetime', 'required', 'Start date is required.')

                document.getElementById('experimentStartDatetime')?.focus()

                return true
              },
            },
          }}
          valueName='selected'
          wrapperClassName='w-100'
          id='experimentEndDatetime'
          name='end_datetime'
        />
        {errors.end_datetime && (
          <div className='prompt label' role='alert' aria-atomic='true'>
            {errors.end_datetime.message}
          </div>
        )}
      </div>
      <div className={cn('field', 'required', { error: errors.owner_login })}>
        <label htmlFor='experimentOwner'>Owner</label>
        <Controller
          as={ReactSelect}
          control={control}
          inputId='experimentOwner'
          name='owner_login'
          options={ownerOptions}
        />
        {errors.owner_login && (
          <div className='prompt label' role='alert' aria-atomic='true'>
            {errors.owner_login.value?.message}
          </div>
        )}
      </div>

      <div className={cn('field', 'required', { error: errors.platform })}>
        <label htmlFor='experimentPlatform'>Platform</label>
        <Controller
          as={ReactSelect}
          control={control}
          rules={{ required: 'Platform is required.' }}
          inputId='experimentPlatform'
          isClearable
          name='platform'
          options={PLATFORM_OPTIONS}
        />
        {errors.platform && (
          <div className='prompt label' role='alert' aria-atomic='true'>
            {errors.platform.message}
          </div>
        )}
      </div>

      <div className={cn('field', 'required', { error: errors.existing_users_allowed })}>
        <label htmlFor='experimentExistingUsersAllowed'>User types</label>
        <p>Types of users to include in experiment</p>
        <label>
          <input
            ref={register}
            type='radio'
            className='ui radio checkbox'
            name='existing_users_allowed'
            defaultChecked
            value='false'
          />{' '}
          New users only
        </label>
        <label>
          <input
            ref={register}
            type='radio'
            className='ui radio checkbox'
            name='existing_users_allowed'
            defaultChecked
            value='true'
          />{' '}
          All users (new + existing)
        </label>
        {errors.existing_users_allowed && (
          <div className='prompt label' role='alert' aria-atomic='true'>
            {errors.existing_users_allowed.message}
          </div>
        )}
      </div>

      <VariationFieldset control={control} errors={errors} register={register} setValue={setValue} watch={watch} />

      <footer>
        <button type='submit' className='ui button large black' disabled={isSubmitting}>
          Schedule Experiment
        </button>
      </footer>
    </form>
  )
}

export default ExperimentForm
