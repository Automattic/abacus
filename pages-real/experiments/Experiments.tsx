import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import React from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import ExperimentsTable from '@/components/ExperimentsTable'
import Layout from '@/components/Layout'
import { useDataLoadingError, useDataSource } from '@/utils/data-loading'


const debug = debugFactory('abacus:pages/experiments/index.tsx')

const Experiments = function (): JSX.Element {
  debug('ExperimentsIndexPage#render')

  const { isLoading, data: experiments, error } = useDataSource(() => ExperimentsApi.findAll(), [])

  useDataLoadingError(error, 'Experiment')

  return (
    <Layout title='Experiments'>
      {isLoading ? <LinearProgress /> : <ExperimentsTable experiments={experiments || []} />}
    </Layout>
  )
}

export default Experiments
