import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import _ from 'lodash'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import * as yup from 'yup'

import { getEventNameCompletions, getUserCompletions } from 'src/api/AutocompleteApi'
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
  const history = useHistory()
  const { experimentId: experimentIdRaw } = useParams<{ experimentId: string }>()
  const experimentId = yup.number().integer().defined().validateSync(experimentIdRaw)
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
      history.push(`/experiments/${experimentId}?freshly_wizard_edited`)
    } catch (error) {
      enqueueSnackbar('Failed to update experiment 😨 (Form data logged to console.)', { variant: 'error' })
      console.error(error)
      console.info('Form data:', formData)
    }
  }

  const initialExperiment = experiment && experimentToFormData(experiment)
  const completionBag = {
    userCompletionDataSource: useDataSource(getUserCompletions, []),
    eventCompletionDataSource: useDataSource(getEventNameCompletions, []),
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
