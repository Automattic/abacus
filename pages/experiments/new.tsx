import Container from '@material-ui/core/Container'
import debugFactory from 'debug'
import React from 'react'

import ExperimentForm from '@/components/ExperimentForm'
import Layout from '@/components/Layout'

const debug = debugFactory('abacus:pages/new.tsx')

const NewExperimentPage = function NewExperimentPage() {
  debug('ExperimentsNewRoute#render')

  return (
    <Layout title='Create Experiment'>
      <Container>
        <img alt='logo' src='/img/logo.png' width='100' />
        <h1>Create Experiment</h1>
        <ExperimentForm />
      </Container>
    </Layout>
  )
}

export default NewExperimentPage
