import { act, fireEvent, render, screen } from '@testing-library/react'
import { Formik, FormikProps } from 'formik'
import React from 'react'

import { createNewExperiment } from '@/lib/experiments'
import { ExperimentFullNew } from '@/lib/schemas'

import Audience from './Audience'

// Needed for testing the MuiCombobox
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

test('renders as expected', async () => {
  const { container } = render(
    <Formik
      initialValues={{ experiment: createNewExperiment() }}
      onSubmit={
        /* istanbul ignore next; This is unused */
        () => undefined
      }
    >
      {(formikProps: FormikProps<{ experiment: Partial<ExperimentFullNew> }>) => <Audience formikProps={formikProps} />}
    </Formik>,
  )
  expect(container).toMatchSnapshot()

  const segmentComboboxInput = screen.getByPlaceholderText(/Search and select to customize/)

  fireEvent.change(segmentComboboxInput, { target: { value: 'AU' } })

  const segmentOption = await screen.findByRole('option', { name: /Locale: en-AU/ })
  fireEvent.click(segmentOption)

  // eslint-disable-next-line @typescript-eslint/require-await
  await act(async () => {
    fireEvent.click(screen.getByLabelText(/Exclude/))
  })

  expect(container).toMatchSnapshot()
})
