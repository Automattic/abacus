import debugFactory from 'debug'
import React, { ReactNode } from 'react'
import { Field } from 'react-final-form'
import { FieldMetaState } from 'react-final-form/typescript'
import ReactSelect, { OptionsType, OptionTypeBase, ValueType } from 'react-select'

import FieldError from './FieldError'

const debug = debugFactory('project:components/ReactSelectField.tsx')

interface Option {
  label: string
  value: string
}

interface Props {
  input: {
    name: string
    options: Option[]
    [attrName: string]: Option[] | string
  }
  label?: ReactNode
  validate?: (
    value?: ValueType<OptionTypeBase> | OptionsType<OptionTypeBase>,
    values?: unknown,
    meta?: FieldMetaState<unknown>,
  ) => Promise<string | undefined> | string | undefined
}

function ReactSelectField(props: Props) {
  debug('ReactSelectField#render')
  const { label: fieldLabel, validate } = props
  return (
    <Field name={props.input.name} validate={validate}>
      {({ input, meta: { error, touched } }) => {
        return (
          <div>
            {fieldLabel !== undefined && <label>{fieldLabel}</label>}
            <ReactSelect {...props.input} {...input} />
            <FieldError error={error} touched={touched} />
          </div>
        )
      }}
    </Field>
  )
}

export default ReactSelectField
