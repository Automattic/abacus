import debugFactory from 'debug'
import React, { ReactNode } from 'react'
import { Field } from 'react-final-form'

const debug = debugFactory('project:components/RadioInput.tsx')

interface Props {
  label?: ReactNode
  name: string
  value: unknown
  [attrName: string]: unknown
}

function RadioInput(props: Props) {
  debug('RadioInput#render')
  return (
    <label>
      <Field name={props.name} component='input' type='radio' value={props.value} /> {props.label}
    </label>
  )
}

export default RadioInput
