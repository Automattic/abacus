/* eslint-disable @typescript-eslint/require-await */
import { act, fireEvent, screen } from '@testing-library/react'
import { Formik, FormikProps } from 'formik'
import MockDate from 'mockdate'
import React from 'react'

import { MetricFormData, metricToFormData } from '@/lib/form-data'
import Fixtures from '@/test-helpers/fixtures'
import { render } from '@/test-helpers/test-utils'

import MetricFormFields from './MetricFormFields'

MockDate.set('2020-07-21')

test('renders as expected for conversion metric', async () => {
  const metric = Fixtures.createMetricFull(1)
  const { container } = render(
    <Formik
      initialValues={{
        metric: metricToFormData(metric),
      }}
      onSubmit={
        /* istanbul ignore next; This is unused */
        () => undefined
      }
    >
      {(formikProps: FormikProps<{ metric: MetricFormData }>) => <MetricFormFields formikProps={formikProps} />}
    </Formik>,
  )

  expect(container).toMatchSnapshot()

  await act(async () => {
    fireEvent.click(screen.getByRole('radio', { name: 'Revenue' }))
  })
})

test('renders as expected for revenue metric', async () => {
  const metric = Fixtures.createMetricFull(2)
  const { container } = render(
    <Formik
      initialValues={{
        metric: metricToFormData(metric),
      }}
      onSubmit={
        /* istanbul ignore next; This is unused */
        () => undefined
      }
    >
      {(formikProps: FormikProps<{ metric: MetricFormData }>) => <MetricFormFields formikProps={formikProps} />}
    </Formik>,
  )

  expect(container).toMatchSnapshot()

  await act(async () => {
    fireEvent.click(screen.getByRole('radio', { name: 'Conversion' }))
  })
})

test('renders as expected for new metric', () => {
  const { container } = render(
    <Formik
      initialValues={{
        metric: metricToFormData({}),
      }}
      onSubmit={
        /* istanbul ignore next; This is unused */
        () => undefined
      }
    >
      {(formikProps: FormikProps<{ metric: MetricFormData }>) => <MetricFormFields formikProps={formikProps} />}
    </Formik>,
  )

  expect(container).toMatchSnapshot()
})
