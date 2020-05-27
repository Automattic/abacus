import '@/styles/main.scss'

import React from 'react'
import Container from 'semantic-ui-react/dist/commonjs/elements/Container'

import ExperimentForm from './ExperimentForm'

export default { title: 'ExperimentForm' }

export const create = () => (
  <Container>
    <h1>New experiment</h1>
    <ExperimentForm />
  </Container>
)
