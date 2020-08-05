import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import React from 'react'

import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import ExperimentForm from '@/components/experiment-creation/ExperimentForm'
import Layout from '@/components/Layout'
import { createInitialExperiment } from '@/lib/experiments'
import * as Normalizers from '@/lib/normalizers'
import { useDataLoadingError, useDataSource } from '@/utils/data-loading'
import { or } from '@/utils/general'

const debug = debugFactory('abacus:pages/experiments/new.tsx')

const ExperimentsNewPage = function () {
  debug('ExperimentsNewPage#render')
  const initialExperiment = createInitialExperiment()

  const { isLoading: metricsIsLoading, data: indexedMetrics, error: metricsError } = useDataSource(
    async () => Normalizers.indexMetrics(await MetricsApi.findAll()),
    [],
  )
  useDataLoadingError(metricsError, 'Metrics')

  const { isLoading: segmentsIsLoading, data: indexedSegments, error: segmentsError } = useDataSource(
    async () => Normalizers.indexSegments(await SegmentsApi.findAll()),
    [],
  )
  useDataLoadingError(segmentsError, 'Segments')

  const isLoading = or(metricsIsLoading, segmentsIsLoading)

  return (
    <Layout title='Create an Experiment'>
      {isLoading && <LinearProgress />}
      {!isLoading && indexedMetrics && indexedSegments && (
        <ExperimentForm
          indexedMetrics={indexedMetrics}
          indexedSegments={indexedSegments}
          initialExperiment={initialExperiment}
        />
      )}
    </Layout>
  )
}

export default ExperimentsNewPage
