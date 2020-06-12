import '@/styles/main.scss'

import React from 'react'

import { Status } from '@/models'

import StatusText from './StatusText'

export default { title: 'Experiment Status' }

export const all = () => (
  <div className='d-flex justify-around'>
    <StatusText status={Status.Completed} />
    <StatusText status={Status.Disabled} />
    <StatusText status={Status.Running} />
    <StatusText status={Status.Staging} />
  </div>
)
