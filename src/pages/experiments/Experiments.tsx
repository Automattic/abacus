import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import React from 'react'

import ExperimentsApi from 'src/api/ExperimentsApi'
import ExperimentsTable from 'src/components/ExperimentsTable'
import Layout from 'src/components/Layout'
import { useDataLoadingError, useDataSource } from 'src/utils/data-loading'

const debug = debugFactory('abacus:pages/experiments/Experiments.tsx')

const Experiments = function (): JSX.Element {
  debug('ExperimentsPage#render')

  const { isLoading, data: experiments, error } = useDataSource(() => ExperimentsApi.findAll(), [])

  useDataLoadingError(error, 'Experiment')

  return (
    <Layout title='Experiments'>
      {isLoading ? <LinearProgress /> : <ExperimentsTable experiments={experiments || []} />}
    </Layout>
  )
}

export default Experiments
