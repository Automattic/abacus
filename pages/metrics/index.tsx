import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import React, { useEffect, useState } from 'react'

import MetricsApi from '@/api/MetricsApi'
import Layout from '@/components/Layout'
import { MetricBare } from '@/models'

const debug = debugFactory('abacus:pages/metrics/index.tsx')

const MetricsIndexPage = () => {
  debug('MetricsIndexPage#render')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [metrics, setMetrics] = useState<MetricBare[] | null>(null)

  useEffect(() => {
    setIsLoading(true)
    // eslint bug: promise/catch-or-return doesn't work with finally
    // eslint-disable-next-line promise/catch-or-return
    MetricsApi.findAll()
      .then(setMetrics)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Layout title='Metrics' error={error}>
      {isLoading ? <LinearProgress /> : <pre> {JSON.stringify(metrics, null, 2)} </pre>}
    </Layout>
  )
}

export default MetricsIndexPage
