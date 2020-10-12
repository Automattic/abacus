import React from 'react'

import LabelValueTable from './LabelValueTable'

export default { title: 'LabelValueTable' }

const data = [
  { label: 'Label 1', value: 'string' },
  { label: 'Label 2', value: <span>React Element</span> },
]

export const basic = (): JSX.Element => <LabelValueTable data={data} />
