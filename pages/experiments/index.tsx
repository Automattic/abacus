import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import React from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import ExperimentsTable from '@/components/ExperimentsTable'
import Layout from '@/components/Layout'
import { useDataLoadingError, useDataSource } from '@/utils/data-loading'
import { testDataNamePrefix } from '@/utils/general'

const debug = debugFactory('abacus:pages/experiments/index.tsx')

const ExperimentsIndexPage = function () {
  debug('ExperimentsIndexPage#render')
  const router = useRouter()
  const debugMode = router.query.debug === 'true'

  const { isLoading, data: experiments, error } = useDataSource(async () => {
    const experiments = await ExperimentsApi.findAll()

    // We conditionally filter debug data out here
    if (debugMode) {
      return experiments
    } else {
      return experiments.filter((experiment) => !experiment.name.startsWith(testDataNamePrefix))
    }
  }, [debugMode])

  useDataLoadingError(error, 'Experiment')

  return (
    <Layout title='Experiments'>
      {isLoading ? <LinearProgress /> : <ExperimentsTable experiments={experiments || []} />}
    </Layout>
  )
}

export default ExperimentsIndexPage
