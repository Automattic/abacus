import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React, { useEffect, useState } from 'react'

import MetricsApi from '@/api/MetricsApi'
import Layout from '@/components/Layout'
import { MetricFull } from '@/models'
import { useDataLoadingError } from '@/utils/data-loading'

const debug = debugFactory('abacus:pages/metrics/[id].tsx')

const MetricsDetailPage = () => {
  const router = useRouter()
  const metricId = toIntOrNull(router.query.id)
  debug('MetricsDetailPage#render')

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [metric, setMetric] = useState<MetricFull | null>(null)

  useEffect(() => {
    setIsLoading(true)
    MetricsApi.findById(metricId)
      .then(setMetric)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [metricId])

  useDataLoadingError(error)

  return (
    <Layout title='Metrics'>{isLoading ? <LinearProgress /> : <pre> {JSON.stringify(metric, null, 2)} </pre>}</Layout>
  )
}

export default MetricsDetailPage
