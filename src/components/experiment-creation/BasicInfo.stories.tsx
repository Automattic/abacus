import React from 'react'

import { getUserCompletions } from 'src/api/AutocompleteApi'
import { MockFormik } from 'src/test-helpers/test-utils'
import { useDataSource } from 'src/utils/data-loading'

import BasicInfo from './BasicInfo'

export default { title: 'ExperimentCreation.Form Parts.BasicInfo' }

export const FormPart = (): JSX.Element => {
  const completionBag = {
    userCompletionDataSource: useDataSource(getUserCompletions, []),
  }
  return (
    <MockFormik>
      <BasicInfo completionBag={completionBag} />
    </MockFormik>
  )
}
