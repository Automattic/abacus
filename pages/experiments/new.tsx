import { LinearProgress, Paper, Typography } from '@material-ui/core'
import debugFactory from 'debug'
import React, { useEffect, useState } from 'react'

import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import Layout from '@/components/Layout'
import { createNewExperiment, MetricBare, Segment } from '@/models'

const debug = debugFactory('abacus:pages/experiments/new.tsx')

const ExperimentsNewPage = function () {
  debug('ExperimentsNewPage#render')
  const initialExperiment = createNewExperiment()

  // TODO: Create a component from this point to allow editing as
  //       well as creation.
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [metrics, setMetrics] = useState<MetricBare[] | null>(null)
  const [segments, setSegments] = useState<Segment[] | null>(null)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([MetricsApi.findAll(), SegmentsApi.findAll()])
      .then(([metrics, segments]) => {
        setMetrics(metrics)
        setSegments(segments)
        return
      })
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Layout title='Create an Experiment' error={error}>
      <Paper>
        <Typography variant='h5'>initialExperiment</Typography>
        <pre>{JSON.stringify(initialExperiment, null, 2)}</pre>
        {isLoading ? (
          <LinearProgress />
        ) : (
          <>
            <Typography variant='h5'>metrics</Typography>
            <pre>{JSON.stringify(metrics, null, 2)}</pre>
            <Typography variant='h5'>segments</Typography>
            <pre>{JSON.stringify(segments, null, 2)}</pre>
          </>
        )}
      </Paper>
    </Layout>
  )
}

export default ExperimentsNewPage
