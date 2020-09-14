import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { toIntOrNull } from 'qc-to_int'
import React from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import ExperimentForm from '@/components/experiment-creation/ExperimentForm'
import Layout from '@/components/Layout'
import { experimentToFormData } from '@/lib/form-data'
import * as Normalizers from '@/lib/normalizers'
import { ExperimentFull, ExperimentFullNew } from '@/lib/schemas'
import { useDataLoadingError, useDataSource } from '@/utils/data-loading'
import { createUnresolvingPromise, or } from '@/utils/general'

const debug = debugFactory('abacus:pages/experiments/[id]/results.tsx')

export default function WizardEditPage() {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
  debug(`ExperimentWizardEdit#render ${experimentId}`)

  const { isLoading: experimentIsLoading, data: experiment, error: experimentError } = useDataSource(
    () => (experimentId ? ExperimentsApi.findById(experimentId) : createUnresolvingPromise<ExperimentFull>()),
    [experimentId],
  )
  useDataLoadingError(experimentError, 'Experiment')

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

  const isLoading = or(experimentIsLoading, metricsIsLoading, segmentsIsLoading)

  const { enqueueSnackbar } = useSnackbar()
  const onSubmit = async (formData: unknown) => {
    try {
      if (!_.isNumber(experimentId)) {
        throw Error('This should never occur: Missing experimentId')
      }
      const { experiment } = formData as { experiment: ExperimentFullNew }
      await ExperimentsApi.put(experimentId, experiment)
      enqueueSnackbar('Experiment Updated!', { variant: 'success' })
      router.push('/experiments/[id]?freshly_wizard_edited', `/experiments/${experimentId}?freshly_wizard_edited`)
    } catch (error) {
      enqueueSnackbar('Failed to update experiment 😨 (Form data logged to console.)', { variant: 'error' })
      console.error(error)
      console.info('Form data:', formData)
    }
  }

  const initialExperiment = experiment && experimentToFormData(experiment)

  return (
    <Layout title={`Editing Experiment: ${experiment?.name || ''}`}>
      {isLoading && <LinearProgress />}
      {!isLoading && initialExperiment && indexedMetrics && indexedSegments && (
        <ExperimentForm {...{ indexedMetrics, indexedSegments, initialExperiment, onSubmit }} />
      )}
    </Layout>
  )
}
