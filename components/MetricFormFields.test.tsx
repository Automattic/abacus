import { render } from '@testing-library/react'
import { Formik, FormikProps } from 'formik'
import MockDate from 'mockdate'
import React from 'react'

import { MetricParameterType } from '@/lib/schemas'

import MetricFormFields from './MetricFormFields'

MockDate.set('2020-07-21')

test('renders as expected', () => {
  const { container } = render(
    <Formik
      initialValues={{
        metric: {
          name: 'metric_name',
          description: 'metric_description',
          higherIsBetter: true,
          parameterType: MetricParameterType.Conversion,
        },
      }}
      onSubmit={
        /* istanbul ignore next; This is unused */
        () => undefined
      }
    >
      {(formikProps: FormikProps<{ metric: unknown }>) => <MetricFormFields formikProps={formikProps} />}
    </Formik>,
  )
  expect(container).toMatchSnapshot()
})
