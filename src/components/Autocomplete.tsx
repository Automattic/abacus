import { CircularProgress, InputProps } from '@material-ui/core'
import { Autocomplete, Value } from '@material-ui/lab'
import { AutocompleteProps, AutocompleteRenderInputParams, fieldToAutocomplete } from 'formik-material-ui-lab'
import _ from 'lodash'
import React, { useCallback } from 'react'

import { AutocompleteItem } from 'src/lib/schemas'

export const autocompleteInputProps = (params: AutocompleteRenderInputParams, loading: boolean): InputProps => {
  return {
    ...params.InputProps,
    endAdornment: (
      <>
        {loading ? <CircularProgress color='inherit' size={20} /> : null}
        {params.InputProps.endAdornment}
      </>
    ),
  }
}

type InnerValueSingle = AutocompleteItem
type OuterValueSingle = string | number

const emptyInnerValue = { name: '', value: '' }

export default function AbacusAutocomplete<Multiple extends boolean>(
  props: AutocompleteProps<AutocompleteItem, Multiple, false, false>,
): JSX.Element {
  const {
    form: { setFieldValue },
    field: { name },
    multiple,
  } = props

  // ## Translating OuterValues (value | value[]) <-> InnerValues (AutocompleteItem | AutocompleteItem[])
  //
  // Typescript and esline make this look much more complicated than it is, we are just keeping the form value type
  // in the form (string | number, and array version for multiple), and inside here we are using Autocomplete.
  //
  // We transform on the way in and on the way out.

  type InnerValue = Multiple extends true ? InnerValueSingle[] : InnerValueSingle
  type OuterValue = Multiple extends true ? OuterValueSingle[] : OuterValueSingle

  const outerSingleToInnerSingle = (value: OuterValueSingle): InnerValueSingle => {
    // istanbul ignore next; the ?? shouldn't occur
    return props.options.find((autocompleteItem) => autocompleteItem.value === value) ?? emptyInnerValue
  }
  const innerSingleToOuterSingle = useCallback(
    (autocompleteItem: InnerValueSingle): OuterValueSingle => autocompleteItem.value,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- React strangely thinks the types should be dependecies, smh...
    [],
  )

  const outerValue = props.field.value as OuterValue
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore; Typescript can't quite work this:
  const innerValue: InnerValue = multiple
    ? outerValue
      ? (outerValue as OuterValueSingle[]).map(outerSingleToInnerSingle)
      : []
    : outerValue
    ? outerSingleToInnerSingle(outerValue as OuterValueSingle)
    : emptyInnerValue
  const onChange = useCallback(
    (_event, newInnerValue: AutocompleteItem | AutocompleteItem[] | null) => {
      if (newInnerValue === null) {
        // This happens on clear, it should never occur on multiple as we receive a []
        setFieldValue(name, '')
      } else if (_.isArray(newInnerValue)) {
        setFieldValue(name, newInnerValue.map(innerSingleToOuterSingle))
      } else {
        setFieldValue(name, innerSingleToOuterSingle(newInnerValue))
      }
    },
    [setFieldValue, name, innerSingleToOuterSingle],
  )

  // Autocomplete doesn't like it when it is set to a value which isn't available as a option.
  // So we add it here like this and it works well enough.
  const options =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore; Typescript can't quite work this:
    !multiple && innerValue.value === emptyInnerValue.value ? [emptyInnerValue, ...props.options] : props.options

  return (
    <Autocomplete
      {...fieldToAutocomplete({
        ...props,
        options,
        field: {
          ...props.field,
          // This just disables a warning, we actually handle it below
          value: multiple ? [] : undefined,
        },
      })}
      getOptionLabel={(option) => option.name}
      getOptionSelected={(optionA, optionB) => optionA.value === optionB.value}
      value={(innerValue as unknown) as Value<AutocompleteItem, Multiple, false, false>}
      onChange={onChange}
    />
  )
}
