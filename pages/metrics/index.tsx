import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import React from 'react'

import MetricsApi from '@/api/MetricsApi'
import Layout from '@/components/Layout'
import MetricsTable from '@/components/MetricsTable'
import { useDataLoadingError, useDataSource } from '@/utils/data-loading'
import { useRouter } from 'next/router'

const debug = debugFactory('abacus:pages/metrics/index.tsx')

const MetricsIndexPage = () => {
  debug('MetricsIndexPage#render')
  const { isLoading, data: metrics, error } = useDataSource(() => MetricsApi.findAll(), [])
  const router = useRouter()
  const debugMode = router.query.debug === 'true'

  useDataLoadingError(error, 'Metrics')

  const onEditMetric = (metricId: number) => alert(metricId)

  return (
    <Layout title='Metrics'>
      {isLoading
        ? <LinearProgress />
        : <MetricsTable
          canEditMetrics={debugMode}
          metrics={metrics || []}
          onEditMetric={onEditMetric}
        />}
    </Layout>
  )
}

export default MetricsIndexPage
