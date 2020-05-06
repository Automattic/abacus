import debugFactory from 'debug'
import React, { useEffect, useState } from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'

import Layout from '@/components/Layout'

import { Experiment } from '@/models/index'

const debug = debugFactory('abacus:pages/index.tsx')

const IndexPage = function IndexPage() {
  debug('IndexPage#render')
  const [experiments, setExperiments] = useState<Experiment[] | null>(null)

  useEffect(() => {
    ExperimentsApi.findAll().then((es) => setExperiments(es))
  }, [])

  return (
    <Layout title='Experiments'>
      <img src='/img/logo.png' width='100' />
      <h1>Experiments</h1>
      <p>Table of experiments to go here.</p>
      <p>Some change to test pre-commit hooks are running.</p>
      {experiments && (
        <>
          {experiments.length === 0 ? (
            <p>No experiments yet.</p>
          ) : (
            <>
              <p>{experiments.length}</p>
              <p>TODO: Display experiments.</p>
            </>
          )}
        </>
      )}
    </Layout>
  )
}

export default IndexPage
