import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { toIntOrNull } from 'qc-to_int'
import React from 'react'

import { getUserCompletions } from 'src/api/AutocompleteApi'
import ExperimentsApi from 'src/api/ExperimentsApi'
import MetricsApi from 'src/api/MetricsApi'
import SegmentsApi from 'src/api/SegmentsApi'
import ExperimentForm from 'src/components/experiment-creation/ExperimentForm'
import Layout from 'src/components/Layout'
import { experimentToFormData } from 'src/lib/form-data'
import * as Normalizers from 'src/lib/normalizers'
import { ExperimentFull, ExperimentFullNew } from 'src/lib/schemas'
import { useDataLoadingError, useDataSource } from 'src/utils/data-loading'
import { createUnresolvingPromise, or } from 'src/utils/general'

const debug = debugFactory('abacus:pages/experiments/[id]/results.tsx')

export default function WizardEditPage(): JSX.Element {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id) as number | null
  debug(`ExperimentWizardEdit#render ${experimentId ?? 'null'}`)

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
      await router.push('/experiments/[id]?freshly_wizard_edited', `/experiments/${experimentId}?freshly_wizard_edited`)
    } catch (error) {
      enqueueSnackbar('Failed to update experiment 😨 (Form data logged to console.)', { variant: 'error' })
      console.error(error)
      console.info('Form data:', formData)
    }
  }

  const initialExperiment = experiment && experimentToFormData(experiment)
  const completionBag = {
    userCompletionDataSource: useDataSource(getUserCompletions, []),
  }

  return (
    <Layout title={`Editing Experiment: ${experiment?.name || ''}`}>
      {isLoading && <LinearProgress />}
      {!isLoading && initialExperiment && indexedMetrics && indexedSegments && (
        <ExperimentForm {...{ indexedMetrics, indexedSegments, initialExperiment, onSubmit, completionBag }} />
      )}
    </Layout>
  )
}
