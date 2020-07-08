import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import React, { useEffect, useState } from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import ExperimentsTable from '@/components/ExperimentsTable'
import Layout from '@/components/Layout'
import { ExperimentBare } from '@/models'
import { useDataLoadingError } from '@/utils/data-loading'

const debug = debugFactory('abacus:pages/experiments/index.tsx')

const ExperimentsIndexPage = function () {
  debug('ExperimentsIndexPage#render')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [experiments, setExperiments] = useState<ExperimentBare[] | null>(null)

  useEffect(() => {
    setIsLoading(true)
    ExperimentsApi.findAll()
      .then(setExperiments)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  useDataLoadingError(error)

  return (
    <Layout title='Experiments'>
      {isLoading ? <LinearProgress /> : <ExperimentsTable experiments={experiments || []} />}
    </Layout>
  )
}

export default ExperimentsIndexPage
