import React from 'react'

import { getUserCompletions } from '@/api/AutocompleteApi'
import { MockFormik } from '@/test-helpers/test-utils'
import { useDataSource } from '@/utils/data-loading'

import BasicInfo from './BasicInfo'

export default { title: 'ExperimentCreation.Form Parts.BasicInfo' }

export const FormPart = () => {
  const userCompletions = useDataSource(getUserCompletions, [])
  return (
    <MockFormik>
      <BasicInfo userCompletions={userCompletions} />
    </MockFormik>
  )
}
