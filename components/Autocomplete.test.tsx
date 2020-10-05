/* eslint-disable @typescript-eslint/require-await */
import { InputAdornment, TextField as MuiTextField } from '@material-ui/core'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Field } from 'formik'
import { Autocomplete, AutocompleteRenderInputParams } from 'formik-material-ui-lab'
import React from 'react'

import AbacusAutocomplete, {
  autocompleteAttributes,
  autocompleteInputProps,
  getOptionValue,
} from '@/components/Autocomplete'
import { AutocompleteItem } from '@/lib/schemas'
import { changeFieldByRole, MockFormik } from '@/test-helpers/test-utils'

// Needed for testing the autocomplete popper
document.createRange = () => ({
  setStart: () => undefined,
  setEnd: () => undefined,
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore; This is just for mocking
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
})

test('An autocomplete component can be rendered', async () => {
  const isLoading = false
  const options = [
    {
      value: 'stuff',
      name: 'Stuff',
    },
    {
      value: 'other_stuff',
      name: 'Other Stuff',
    },
  ]

  const { container } = render(
    <MockFormik initialValues={{ name: 'other_stuff' }}>
      <Field
        component={AbacusAutocomplete}
        name='name'
        id='name'
        fullWidth
        options={options}
        loading={isLoading}
        renderInput={(params: AutocompleteRenderInputParams) => {
          return (
            <MuiTextField
              {...params}
              placeholder='wp_username'
              helperText='Use WordPress.com username.'
              variant='outlined'
              required
              label='Owner'
              InputProps={{
                ...autocompleteInputProps(params, isLoading),
                startAdornment: <InputAdornment position='start'>@</InputAdornment>,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )
        }}
      />
    </MockFormik>,
  )
  expect(container).toMatchSnapshot('initial render')

  const textbox = screen.getByRole('textbox')
  expect(textbox).toMatchInlineSnapshot(`
    <input
      aria-autocomplete="list"
      aria-describedby="name-helper-text"
      aria-invalid="false"
      autocapitalize="none"
      autocomplete="off"
      class="MuiInputBase-input MuiOutlinedInput-input MuiAutocomplete-input MuiAutocomplete-inputFocused MuiInputBase-inputAdornedStart MuiOutlinedInput-inputAdornedStart MuiInputBase-inputAdornedEnd MuiOutlinedInput-inputAdornedEnd"
      id="name"
      placeholder="wp_username"
      required=""
      spellcheck="false"
      type="text"
      value="other_stuff"
    />
  `)

  await act(async () => {
    fireEvent.click(textbox)
  })
  expect(container).toMatchSnapshot('clicked textbox')

  await act(async () => {
    await changeFieldByRole('textbox', /Owner/, 'stuff')
  })
  expect(container).toMatchSnapshot('entered value')

  await act(async () => {
    fireEvent.click(screen.getByText('Stuff'))
  })
  expect(container).toMatchSnapshot('clicked result')
  expect(textbox).toMatchInlineSnapshot(`
    <input
      aria-autocomplete="list"
      aria-describedby="name-helper-text"
      aria-invalid="false"
      autocapitalize="none"
      autocomplete="off"
      class="MuiInputBase-input MuiOutlinedInput-input MuiAutocomplete-input MuiAutocomplete-inputFocused MuiInputBase-inputAdornedStart MuiOutlinedInput-inputAdornedStart MuiInputBase-inputAdornedEnd MuiOutlinedInput-inputAdornedEnd"
      id="name"
      placeholder="wp_username"
      required=""
      spellcheck="false"
      type="text"
      value="stuff"
    />
  `)

  await act(async () => {
    fireEvent.click(textbox)
  })
  expect(container).toMatchSnapshot('ensure stuff is selected')
})

test('it shows as loading data', () => {
  const isLoading = true
  const options: AutocompleteItem[] = []

  const { container } = render(
    <MockFormik initialValues={{ name: 'no_name' }}>
      <Field
        component={Autocomplete}
        name='name'
        id='name'
        fullWidth
        options={options}
        loading={isLoading}
        renderInput={(params: AutocompleteRenderInputParams) => {
          return (
            <MuiTextField
              {...params}
              placeholder='wp_username'
              helperText='Use WordPress.com username.'
              variant='outlined'
              required
              label='Owner'
              InputProps={{
                ...autocompleteInputProps(params, isLoading),
                startAdornment: <InputAdornment position='start'>@</InputAdornment>,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )
        }}
      />
    </MockFormik>,
  )
  expect(container).toMatchSnapshot('loading')
})

test('null is a valid value', async () => {
  const isLoading = false
  const options: AutocompleteItem[] = [
    {
      name: 'Hello World',
      value: 'hello_world',
    },
  ]

  const { container } = render(
    <MockFormik initialValues={{ name: null }}>
      <Field
        component={Autocomplete}
        name='name'
        id='name'
        fullWidth
        options={options}
        loading={isLoading}
        renderInput={(params: AutocompleteRenderInputParams) => {
          return (
            <MuiTextField
              {...params}
              placeholder='wp_username'
              helperText='Use WordPress.com username.'
              variant='outlined'
              required
              label='Owner'
              InputProps={{
                ...autocompleteInputProps(params, isLoading),
                startAdornment: <InputAdornment position='start'>@</InputAdornment>,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )
        }}
      />
    </MockFormik>,
  )
  await act(async () => {
    fireEvent.click(screen.getByRole('textbox'))
  })
  expect(container).toMatchSnapshot('selected no value')
})

test('attributes handle labels correctly', () => {
  const attributes = autocompleteAttributes

  expect(attributes.getOptionLabel('opt1')).toStrictEqual('opt1')
  expect(attributes.getOptionLabel({ name: 'Opt1', value: 'opt1' })).toStrictEqual('Opt1')
  expect(attributes.getOptionLabel(null)).toStrictEqual('')
})

test('attributes handle selection correctly', () => {
  const attributes = autocompleteAttributes
  const option = {
    name: 'Hello World',
    value: 'hello_world',
  }
  expect(attributes.getOptionSelected(option, '')).toBe(false)
  expect(attributes.getOptionSelected(option, option)).toBe(true)
})

test('get option value works', () => {
  const option = {
    name: 'Hello World',
    value: 'hello_world',
  }
  expect(getOptionValue(option)).toStrictEqual('hello_world')
  expect(getOptionValue('hello')).toStrictEqual('hello')
  expect(getOptionValue(null)).toStrictEqual('')
})
