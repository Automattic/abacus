import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import React from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import ExperimentForm from '@/components/experiment-creation/ExperimentForm'
import Layout from '@/components/Layout'
import { createInitialExperiment } from '@/lib/experiments'
import * as Normalizers from '@/lib/normalizers'
import { ExperimentFullNew } from '@/lib/schemas'
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

  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const onSubmit = async (formData: unknown) => {
    try {
      const { experiment } = formData as { experiment: ExperimentFullNew }
      const receivedExperiment = await ExperimentsApi.create(experiment)
      enqueueSnackbar('Experiment Created!', { variant: 'success' })
      router.push(
        '/experiments/[id]/code-setup?freshly_created',
        `/experiments/${receivedExperiment.experimentId}/code-setup?freshly_created`,
      )
    } catch (error) {
      enqueueSnackbar('Failed to create experiment 😨 (Form data logged to console.)', { variant: 'error' })
      console.error(error)
      console.info('Form data:', formData)
    }
  }

  return (
    <Layout title='Create an Experiment'>
      {isLoading && <LinearProgress />}
      {!isLoading && indexedMetrics && indexedSegments && (
        <ExperimentForm {...{ indexedMetrics, indexedSegments, initialExperiment, onSubmit }} />
      )}
    </Layout>
  )
}

export default ExperimentsNewPage
