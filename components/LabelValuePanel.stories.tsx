import React from 'react'

import LabelValuePanel from './LabelValuePanel'

export default { title: 'LabelValue Panel' }

const data = [
  { label: 'Label 1', value: 'string' },
  { label: 'Label 2', value: <span>React Element</span> },
]

export const basic = () => <LabelValuePanel data={data} title='The Title' />
