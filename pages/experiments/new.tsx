import { LinearProgress, Paper, Typography } from '@material-ui/core'
import debugFactory from 'debug'
import React from 'react'

import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import Layout from '@/components/Layout'
import { createNewExperiment } from '@/models'
import { useDataLoadingError, useDataSource } from '@/utils/data-loading'
import { or } from '@/utils/general'

const debug = debugFactory('abacus:pages/experiments/new.tsx')

const ExperimentsNewPage = function () {
  debug('ExperimentsNewPage#render')
  const initialExperiment = createNewExperiment()

  // TODO: Create a component from this point to allow editing as
  //       well as creation.
  const { isLoading: metricsIsLoading, data: metrics, error: metricsError } = useDataSource(
    () => MetricsApi.findAll(),
    [],
  )
  useDataLoadingError(metricsError, 'Metrics')

  const { isLoading: segmentsIsLoading, data: segments, error: segmentsError } = useDataSource(
    () => SegmentsApi.findAll(),
    [],
  )
  useDataLoadingError(segmentsError, 'Segments')

  const isLoading = or(metricsIsLoading, segmentsIsLoading)

  return (
    <Layout title='Create an Experiment'>
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
