import '@/styles/main.scss'

import Container from '@material-ui/core/Container'
import React from 'react'

import ExperimentForm from './ExperimentForm'

export default { title: 'ExperimentForm' }

export const create = () => (
  <Container>
    <h1>New experiment</h1>
    <ExperimentForm />
  </Container>
)
