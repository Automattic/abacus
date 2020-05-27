import debugFactory from 'debug'
import React, { ReactNode } from 'react'
import { Field } from 'react-final-form'
import { FieldMetaState } from 'react-final-form/typescript'
import ReactDatepicker from 'react-datepicker'

import FieldError from './FieldError'

const debug = debugFactory('project:components/ReactDatepickerField.tsx')

interface Props {
  input: {
    minDate?: Date
    name: string
    [attrName: string]: Date | string | undefined
  }
  label?: ReactNode
  validate?: (
    value?: Date | null | undefined,
    values?: unknown,
    meta?: FieldMetaState<unknown>,
  ) => Promise<string | undefined> | string | undefined
}

function ReactDatepickerField(props: Props) {
  debug('ReactDatepickerField#render')
  const { label: fieldLabel, validate } = props
  return (
    <Field name={props.input.name} validate={validate}>
      {({ input: { onBlur, onChange, value }, meta: { error, touched } }) => {
        return (
          <div className='field'>
            {fieldLabel !== undefined && <label>{fieldLabel}</label>}
            <ReactDatepicker
              {...props.input}
              onBlur={onBlur}
              onChange={(date) => {
                onChange(date)
                // Blur does not occur when the change happens due to the user selecting a date
                // from the calendar. It only happens when the user has focus in the input area
                // and tabs or does something else to cause a blur. So, we are explicitly calling
                // it here to cause the validation to run after a date change.
                onBlur()
              }}
              selected={value}
            />
            <FieldError error={error} touched={touched} />
          </div>
        )
      }}
    </Field>
  )
}

export default ReactDatepickerField
