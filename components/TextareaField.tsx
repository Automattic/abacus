import debugFactory from 'debug'
import React, { ReactNode } from 'react'
import { Field } from 'react-final-form'
import { FieldMetaState } from 'react-final-form/typescript'

const debug = debugFactory('project:components/TextareaField.tsx')

import FieldError from './FieldError'

interface Props {
  input: {
    name: string
    [attrName: string]: string
  }
  label?: ReactNode
  validate?: (
    value?: string,
    values?: unknown,
    meta?: FieldMetaState<unknown>,
  ) => Promise<string | undefined> | string | undefined
}

function TextareaField(props: Props) {
  debug('TextareaField#render')
  const { label: fieldLabel, validate } = props
  return (
    <Field name={props.input.name} validate={validate}>
      {({ input, meta: { error, touched } }) => {
        return (
          <div>
            {fieldLabel !== undefined && <label>{fieldLabel}</label>}
            <div>
              <textarea {...props.input} {...input} />
            </div>
            <FieldError error={error} touched={touched} />
          </div>
        )
      }}
    </Field>
  )
}

export default TextareaField
