import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import React, { useEffect, useState } from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import ExperimentsTable from '@/components/ExperimentsTable'
import Layout from '@/components/Layout'
import { ExperimentBare } from '@/models'

const debug = debugFactory('abacus:pages/experiments/index.tsx')

const ExperimentsIndexPage = function () {
  debug('ExperimentsIndexPage#render')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [experiments, setExperiments] = useState<ExperimentBare[] | null>(null)

  useEffect(() => {
    setIsLoading(true)
    ExperimentsApi.findAll()
      .then((experiments) => setExperiments(experiments))
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Layout title='Experiments' error={error}>
      {isLoading ? <LinearProgress /> : <ExperimentsTable experiments={experiments || []} />}
    </Layout>
  )
}

export default ExperimentsIndexPage
