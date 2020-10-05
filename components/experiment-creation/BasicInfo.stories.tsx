import React from 'react'

import { getEventNameCompletions, getUserCompletions } from '@/api/AutocompleteApi'
import { MockFormik } from '@/test-helpers/test-utils'
import { useDataSource } from '@/utils/data-loading'

import BasicInfo from './BasicInfo'

export default { title: 'ExperimentCreation.Form Parts.BasicInfo' }

export const FormPart = (): JSX.Element => {
  const completionBag = {
    userCompletionDataSource: useDataSource(getUserCompletions, []),
    eventCompletionDataSource: useDataSource(getEventNameCompletions, []),
  }
  return (
    <MockFormik>
      <BasicInfo completionBag={completionBag} />
    </MockFormik>
  )
}
