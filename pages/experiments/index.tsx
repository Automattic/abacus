import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import React from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import ExperimentsTable from '@/components/ExperimentsTable'
import Layout from '@/components/Layout'
import { useDataSource } from '@/utils/data-loading'

const debug = debugFactory('abacus:pages/experiments/index.tsx')

const ExperimentsIndexPage = function () {
  debug('ExperimentsIndexPage#render')

  const { isLoading, data: experiments, error } = useDataSource(() => ExperimentsApi.findAll(), [])

  return (
    <Layout title='Experiments' error={error}>
      {isLoading ? <LinearProgress /> : <ExperimentsTable experiments={experiments || []} />}
    </Layout>
  )
}

export default ExperimentsIndexPage
