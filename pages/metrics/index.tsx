import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import React from 'react'

import MetricsApi from '@/api/MetricsApi'
import Layout from '@/components/Layout'
import MetricsTable from '@/components/MetricsTable'
import { useDataSource } from '@/utils/data-loading'

const debug = debugFactory('abacus:pages/metrics/index.tsx')

const MetricsIndexPage = () => {
  debug('MetricsIndexPage#render')
  const { isLoading, data: metrics, error } = useDataSource(() => MetricsApi.findAll(), [])

  return (
    <Layout title='Metrics' error={error}>
      {isLoading ? <LinearProgress /> : <MetricsTable metrics={metrics || []} />}
    </Layout>
  )
}

export default MetricsIndexPage
