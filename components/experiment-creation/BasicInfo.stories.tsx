import React from 'react'

import { MockFormik } from '@/test-helpers/test-utils'

import BasicInfo from './BasicInfo'

export default { title: 'ExperimentCreation.Form Parts.BasicInfo' }

export const FormPart = () => (
  <MockFormik>
    <BasicInfo />
  </MockFormik>
)
