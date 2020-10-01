import { CircularProgress } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { AutocompleteProps, AutocompleteRenderInputParams, fieldToAutocomplete } from 'formik-material-ui-lab'
import React, { useCallback } from 'react'

import { AutocompleteItem } from '@/lib/schemas'

// break out these functions to achieve 100% coverage
export const getOptionValue = (option: AutocompleteItem | string | null) =>
  (typeof option === 'string' ? option : option?.value) ?? ''

export const getOptionLabel = (option: AutocompleteItem | string | null) =>
  (typeof option === 'string' ? option : option?.name) ?? ''

export const getOptionSelected = (option: AutocompleteItem, value: string | AutocompleteItem) =>
  typeof value === 'string' ? value === option.value : value.value === option.value

export const autocompleteAttributes = {
  getOptionLabel: getOptionLabel,
  getOptionSelected: getOptionSelected,
}

export const autocompleteInputProps = (params: AutocompleteRenderInputParams, loading: boolean) => {
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

export default function AbacusAutocomplete(props: AutocompleteProps<AutocompleteItem, false, false, false>) {
  const {
    form: { setFieldValue },
    field: { name },
  } = props

  const onChange = useCallback(
    (ev, option: AutocompleteItem | string | null) => {
      setFieldValue(name, getOptionValue(option))
    },
    [setFieldValue, name],
  )

  return <Autocomplete {...fieldToAutocomplete(props)} {...autocompleteAttributes} onChange={onChange} />
}
