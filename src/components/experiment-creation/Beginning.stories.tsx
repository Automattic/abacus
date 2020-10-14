import React from 'react'

import { MockFormik } from 'src/test-helpers/test-utils'

import Beginning from './Beginning'

export default { title: 'ExperimentCreation.Form Parts.Beginning' }

export const FormPart = (): JSX.Element => (
  <MockFormik>
    <Beginning />
  </MockFormik>
)
