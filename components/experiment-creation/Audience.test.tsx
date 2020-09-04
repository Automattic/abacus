import { act, fireEvent, render, screen } from '@testing-library/react'
import { Formik, FormikProps } from 'formik'
import React from 'react'

import { ExperimentFormData, experimentToFormData } from '@/lib/form-data'
import { Segment, SegmentType } from '@/lib/schemas'

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
  const indexedSegments: Record<number, Segment> = {
    1: { segmentId: 1, name: 'us', type: SegmentType.Country },
    2: { segmentId: 2, name: 'au', type: SegmentType.Country },
    3: { segmentId: 3, name: 'en-US', type: SegmentType.Locale },
    4: { segmentId: 4, name: 'en-AU', type: SegmentType.Locale },
  }

  const { container } = render(
    <Formik
      initialValues={{ experiment: experimentToFormData({}) }}
      onSubmit={
        /* istanbul ignore next; This is unused */
        () => undefined
      }
    >
      {(formikProps: FormikProps<{ experiment: ExperimentFormData }>) => (
        <Audience indexedSegments={indexedSegments} formikProps={formikProps} />
      )}
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
