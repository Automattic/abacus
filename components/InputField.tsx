import debugFactory from 'debug'
import { toNumOrNull } from 'qc-to_num'
import React, { ReactNode, SyntheticEvent } from 'react'
import { Field } from 'react-final-form'
import { FieldMetaState } from 'react-final-form/typescript'

import FieldError from './FieldError'

const debug = debugFactory('project:components/InputField.tsx')

interface Props {
  input: {
    name: string
    // Note: Decided not to include certain types such as 'hidden' since they will
    // likely require significantly different markup and input properties. Separate
    // field components would be better to handle these special cases.
    type?: 'number' | 'text' | 'url'
    // | 'color'
    // | 'date'
    // | 'datetime-local'
    // | 'email'
    // | 'month'
    // | 'password'
    // | 'range'
    // | 'search'
    // | 'tel'
    // | 'time'
    // | 'week'
    onChange?: (event: SyntheticEvent<HTMLInputElement>) => void
    [attrName: string]: unknown
  }
  label?: ReactNode
  postHelper?: ReactNode
  preHelper?: ReactNode
  validate?: (
    value?: string,
    values?: unknown,
    meta?: FieldMetaState<unknown>,
  ) => Promise<string | undefined> | string | undefined
}

function InputField(props: Props) {
  debug('InputField#render')
  const { label: fieldLabel, postHelper, preHelper, validate } = props
  let parse
  if (props.input.type === 'number') {
    parse = toNumOrNull
  }
  return (
    <Field name={props.input.name} parse={parse} validate={validate}>
      {({ input, meta: { error, touched } }) => {
        let onChange = input.onChange
        if (props.input.onChange) {
          onChange = (event: SyntheticEvent<HTMLInputElement>) => {
            props.input.onChange?.(event)
            input.onChange(event)
          }
        }
        return (
          <div className='field'>
            {fieldLabel !== undefined && <label>{fieldLabel}</label>}
            {preHelper !== undefined && <div>{preHelper}</div>}
            <div className='ui input'>
              <input {...props.input} {...input} onChange={onChange} />
            </div>
            {postHelper !== undefined && <div>{postHelper}</div>}
            <FieldError error={error} touched={touched} />
          </div>
        )
      }}
    </Field>
  )
}

export default InputField
