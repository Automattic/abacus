import { CircularProgress, InputProps } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { AutocompleteProps, AutocompleteRenderInputParams, fieldToAutocomplete } from 'formik-material-ui-lab'
import React, { useCallback } from 'react'

import { AutocompleteItem } from 'src/lib/schemas'

// We need to handle the cases where the form is initialized with a string, or when we have a specific value selected.
// Also, it's possible that the option is null, though typescript asserts that it isn't possible.
export const getOptionValue = (option: AutocompleteItem | string | null): string =>
  (typeof option === 'string' ? option : option?.value) ?? ''

export const getOptionLabel = (option: AutocompleteItem | string | null): string =>
  (typeof option === 'string' ? option : option?.name) ?? ''

export const getOptionSelected = (option: AutocompleteItem, value: string | AutocompleteItem): boolean =>
  typeof value === 'string' ? value === option.value : value.value === option.value

export const autocompleteAttributes = {
  getOptionLabel: getOptionLabel,
  getOptionSelected: getOptionSelected,
}

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

export default function AbacusAutocomplete(
  props: AutocompleteProps<AutocompleteItem, false, false, false>,
): JSX.Element {
  const {
    form: { setFieldValue },
    field: { name },
  } = props

  // Can't destructure this as it is of type any
  const value = props.field.value as unknown

  const onChange = useCallback(
    (ev, option: AutocompleteItem | string | null) => {
      setFieldValue(name, getOptionValue(option))
    },
    [setFieldValue, name],
  )

  // Autocomplete doesn't like it when it is set to a value which isn't available as a option.
  // So we add it here like this and it works well enough.
  const options =
    value === null || value === '' ? [{ name: 'Select an Option', value: '' }, ...props.options] : props.options

  return (
    <Autocomplete {...fieldToAutocomplete({ ...props, options })} {...autocompleteAttributes} onChange={onChange} />
  )
}
