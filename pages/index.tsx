import debugFactory from 'debug'
import React, { useEffect, useState } from 'react'
import Container from 'semantic-ui-react/dist/commonjs/elements/Container'

import ExperimentsApi from '@/api/ExperimentsApi'

import ErrorsBox from '@/components/ErrorsBox'
import ExperimentsTable from '@/components/ExperimentsTable'
import Layout from '@/components/Layout'

import { ExperimentBare } from '@/models/index'

const debug = debugFactory('abacus:pages/index.tsx')

const IndexPage = function IndexPage() {
  debug('IndexPage#render')
  const [error, setError] = useState<Error | null>(null)
  const [experiments, setExperiments] = useState<ExperimentBare[] | null>(null)

  useEffect(() => {
    ExperimentsApi.findAll()
      .then((experiments) => setExperiments(experiments))
      .catch(setError)
  }, [])

  return (
    <Layout title='Experiments'>
      <Container>
        <img src='/img/logo.png' width='100' />
        <h1>Experiments</h1>
        {error && <ErrorsBox errors={[error]} />}
        {experiments && (
          <>{experiments.length === 0 ? <p>No experiments yet.</p> : <ExperimentsTable experiments={experiments} />}</>
        )}
      </Container>
    </Layout>
  )
}

export default IndexPage
