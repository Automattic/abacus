/* eslint-disable @typescript-eslint/require-await,@typescript-eslint/ban-ts-comment */
import { InputAdornment, TextField as MuiTextField } from '@material-ui/core'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Field, Formik } from 'formik'
import { Autocomplete, AutocompleteRenderInputParams } from 'formik-material-ui-lab'
import React from 'react'

import AbacusAutocomplete, { autocompleteInputProps } from 'src/components/Autocomplete'
import { AutocompleteItem } from 'src/lib/schemas'
import { changeFieldByRole, MockFormik } from 'src/test-helpers/test-utils'

// Needed for testing the autocomplete popper
document.createRange = () => ({
  setStart: () => undefined,
  setEnd: () => undefined,
  // @ts-ignore
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

  let formValues = null

  const { container } = render(
    <Formik
      initialValues={{ name: '' }}
      /* istanbul ignore next; This is unused */
      onSubmit={() => undefined}
    >
      {({ values }) => (
        <>
          {((formValues = values), undefined)}
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
        </>
      )}
    </Formik>,
  )
  expect(container).toMatchSnapshot()
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": "",
    }
  `)

  const textbox = screen.getByRole('textbox')
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": "",
    }
  `)

  await act(async () => {
    fireEvent.click(textbox)
  })
  expect(container).toMatchSnapshot('clicked textbox')
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": "",
    }
  `)

  await act(async () => {
    await changeFieldByRole('textbox', /Owner/, 'stuff')
  })
  expect(container).toMatchSnapshot('entered value')
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": "",
    }
  `)

  await act(async () => {
    fireEvent.click(screen.getByText('Stuff'))
  })
  expect(container).toMatchSnapshot('clicked result')
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": "stuff",
    }
  `)

  await act(async () => {
    fireEvent.click(textbox)
  })
  expect(container).toMatchSnapshot('ensure stuff is selected')
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": "stuff",
    }
  `)

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
  })
  expect(container).toMatchSnapshot()
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": "",
    }
  `)
})

test('A multiple entry autocomplete component can be rendered', async () => {
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

  let formValues = null

  const { container } = render(
    <Formik
      initialValues={{ name: '' }}
      /* istanbul ignore next; This is unused */
      onSubmit={() => undefined}
    >
      {({ values }) => (
        <>
          {((formValues = values), undefined)}
          <Field
            component={AbacusAutocomplete}
            name='name'
            id='name'
            fullWidth
            options={options}
            loading={isLoading}
            multiple
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
        </>
      )}
    </Formik>,
  )

  const textbox = screen.getByRole('textbox')

  expect(container).toMatchSnapshot()
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": "",
    }
  `)

  await act(async () => {
    fireEvent.click(textbox)
  })
  expect(container).toMatchSnapshot('clicked textbox')
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": "",
    }
  `)

  await act(async () => {
    await changeFieldByRole('textbox', /Owner/, 'stuff')
  })
  expect(container).toMatchSnapshot('entered value')
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": "",
    }
  `)

  await act(async () => {
    fireEvent.click(screen.getByText('Stuff'))
  })
  expect(container).toMatchSnapshot('clicked result')
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": Array [
        "stuff",
      ],
    }
  `)

  await act(async () => {
    fireEvent.click(textbox)
  })
  expect(container).toMatchSnapshot()
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": Array [
        "stuff",
      ],
    }
  `)

  await act(async () => {
    await changeFieldByRole('textbox', /Owner/, 'stuff')
  })
  expect(container).toMatchSnapshot('entered value')
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": Array [
        "stuff",
      ],
    }
  `)

  await act(async () => {
    fireEvent.click(screen.getByText('Other Stuff'))
  })
  expect(container).toMatchSnapshot()
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": Array [
        "stuff",
        "other_stuff",
      ],
    }
  `)

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
  })
  expect(container).toMatchSnapshot()
  expect(formValues).toMatchInlineSnapshot(`
    Object {
      "name": Array [],
    }
  `)
})

test('it shows as loading data', () => {
  const isLoading = true

  const { container } = render(
    <MockFormik initialValues={{ name: 'no_name' }}>
      <Field
        component={Autocomplete}
        name='name'
        id='name'
        fullWidth
        options={[]}
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
