import React from 'react'

import { MockFormik } from '@/helpers/test-utils'

import Beginning from './Beginning'

export default { title: 'ExperimentCreation.Form Parts.Beginning' }

export const FormPart = () => (
  <MockFormik>
    <Beginning />
  </MockFormik>
)
