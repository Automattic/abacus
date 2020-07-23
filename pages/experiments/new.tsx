import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import React from 'react'

import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import DebugOutput from '@/components/DebugOutput'
import ExperimentForm from '@/components/experiment-creation/ExperimentForm'
import Layout from '@/components/Layout'
import { createNewExperiment } from '@/lib/experiments'
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
      {isLoading && <LinearProgress />}
      {!isLoading && metrics && segments && (
        <ExperimentForm metrics={metrics} segments={segments} initialExperiment={initialExperiment} />
      )}
      <DebugOutput label='Initial Experiment' content={initialExperiment} />
      <DebugOutput label='Metrics' content={metrics} />
      <DebugOutput label='Segments' content={segments} />
    </Layout>
  )
}

export default ExperimentsNewPage
