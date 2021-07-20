import { TextField, Typography } from '@material-ui/core'
import { Autocomplete, AutocompleteProps, AutocompleteRenderInputParams } from '@material-ui/lab'
import _ from 'lodash'
import React from 'react'

import { autocompleteInputProps } from 'src/components/general/Autocomplete'
import { Metric } from 'src/lib/schemas'

/**
 * An Autocomplete just for Metrics
 */
export default function MetricAutocomplete<
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  props: Omit<AutocompleteProps<Metric, Multiple, DisableClearable, FreeSolo>, 'renderInput'> & {
    error?: string | false
  },
): ReturnType<typeof Autocomplete> {
  const processedOptions = props.options
    .filter((a) => !a.name.startsWith('archived_'))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
  return (
    <Autocomplete<Metric, Multiple, DisableClearable, FreeSolo>
      aria-label='Select a metric'
      fullWidth
      options={processedOptions}
      noOptionsText='No metrics found'
      getOptionLabel={(metric: Metric) => metric.name}
      getOptionSelected={(metricA: Metric, metricB: Metric) => metricA.metricId === metricB.metricId}
      renderOption={(option: Metric) => (
        <div>
          <Typography variant='body1'>
            <strong>{option.name}</strong>
          </Typography>
          <Typography variant='body1'>
            <small>{option.description}</small>
          </Typography>
        </div>
      )}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          placeholder='Select a metric'
          error={!!props.error}
          helperText={_.isString(props.error) ? props.error : undefined}
          required
          InputProps={{
            ...autocompleteInputProps(params, false),
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
      {..._.omit(props, 'options')}
    />
  )
}
