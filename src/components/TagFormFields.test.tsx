/* eslint-disable @typescript-eslint/require-await */
import { Formik } from 'formik'
import MockDate from 'mockdate'
import React from 'react'

import { tagToFormData } from 'src/lib/form-data'
import Fixtures from 'src/test-helpers/fixtures'
import { render } from 'src/test-helpers/test-utils'

import TagFormFields from './TagFormFields'

MockDate.set('2020-07-21')

test('renders as expected for an existing tag', async () => {
  const tag = Fixtures.createTagFull(1)
  const { container } = render(
    <Formik
      initialValues={{
        tag: tagToFormData(tag),
      }}
      onSubmit={
        /* istanbul ignore next; This is unused */
        () => undefined
      }
    >
      {() => <TagFormFields />}
    </Formik>,
  )

  expect(container).toMatchSnapshot()
})

test('renders as expected for a new tag', () => {
  const { container } = render(
    <Formik
      initialValues={{
        tag: tagToFormData({}),
      }}
      onSubmit={
        /* istanbul ignore next; This is unused */
        () => undefined
      }
    >
      {() => <TagFormFields />}
    </Formik>,
  )

  expect(container).toMatchSnapshot()
})
