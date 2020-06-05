/* eslint-disable jsx-a11y/label-has-associated-control */
import debugFactory from 'debug'
import React, { ReactNode } from 'react'
import { Field, useField } from 'react-final-form'
import { FieldMetaState } from 'react-final-form/typescript'

const debug = debugFactory('project:components/RadioFieldGroup.tsx')

import FieldError from './FieldError'

interface Props {
  input: {
    name: string
    [attrName: string]: string
  }
  label?: ReactNode
  options: { label: ReactNode; value: string }[]
  preHelper?: ReactNode
  validate?: (
    value?: string,
    values?: unknown,
    meta?: FieldMetaState<unknown>,
  ) => Promise<string | undefined> | string | undefined
}

function RadioFieldGroup(props: Props) {
  debug('RadioFieldGroup#render')
  const { label: fieldLabel, options, preHelper, validate } = props
  const {
    meta: { error, touched },
  } = useField(props.input.name)
  return (
    <div>
      {fieldLabel !== undefined && <label>{fieldLabel}</label>}
      {preHelper !== undefined && <div>{preHelper}</div>}
      <div>
        {options.map((option) => (
          <label key={option.value}>
            <Field name={props.input.name} component='input' type='radio' validate={validate} value={option.value} />{' '}
            {option.label}
          </label>
        ))}
      </div>
      <FieldError error={error} touched={touched} />
    </div>
  )
}

export default RadioFieldGroup
