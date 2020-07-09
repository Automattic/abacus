import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React from 'react'

import MetricsApi from '@/api/MetricsApi'
import Layout from '@/components/Layout'
import { useDataLoadingError, useDataSource } from '@/utils/data-loading'

const debug = debugFactory('abacus:pages/metrics/[id].tsx')

const MetricsDetailPage = () => {
  const router = useRouter()
  const metricId = toIntOrNull(router.query.id)
  debug('MetricsDetailPage#render')

  const { isLoading, data: metric, error } = useDataSource(() => MetricsApi.findById(metricId), [metricId])

  useDataLoadingError(error)

  return (
    <Layout title='Metrics'>{isLoading ? <LinearProgress /> : <pre> {JSON.stringify(metric, null, 2)} </pre>}</Layout>
  )
}

export default MetricsDetailPage
