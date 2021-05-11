import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import React from 'react'

import ExperimentsApi from 'src/api/ExperimentsApi'
import ExperimentsTableAgGrid from 'src/components/experiments/multi-view/ExperimentsTableAgGrid'
import Layout from 'src/components/page-parts/Layout'
import { useDataLoadingError, useDataSource } from 'src/utils/data-loading'

const debug = debugFactory('abacus:pages/experiments/Experiments.tsx')

const Experiments = function (): JSX.Element {
  debug('ExperimentsPage#render')

  const { isLoading, data: experiments, error } = useDataSource(() => ExperimentsApi.findAll(), [])

  useDataLoadingError(error, 'Experiment')

  return (
    <Layout headTitle='Experiments' flexContent>
      {isLoading ? <LinearProgress /> : <ExperimentsTableAgGrid experiments={experiments || []} />}
    </Layout>
  )
}

export default Experiments
