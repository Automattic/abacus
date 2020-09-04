import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React from 'react'
import _ from 'lodash'

import { useDataSource, useDataLoadingError } from '@/utils/data-loading'
import ExperimentsApi from '@/api/ExperimentsApi'
import { createUnresolvingPromise, or } from '@/utils/general'
import { ExperimentFull, MetricAssignment, SegmentAssignment, Variation, Event } from '@/lib/schemas'
import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import Layout from '@/components/Layout'
import { LinearProgress } from '@material-ui/core'
import ExperimentForm from '@/components/experiment-creation/ExperimentForm'
import { useSnackbar } from 'notistack'
import * as Normalizers from '@/lib/normalizers'
import { format } from 'date-fns'

const debug = debugFactory('abacus:pages/experiments/[id]/results.tsx')


function metricAssignmentToFormData(metricAssignment: MetricAssignment) {
  return {
    metricId: String(metricAssignment.metricId),
    attributionWindowSeconds: String(metricAssignment.attributionWindowSeconds),
    isPrimary: metricAssignment.isPrimary,
    changeExpected: metricAssignment.changeExpected,
    minDifference: String(metricAssignment.minDifference),
  }
}

function segmentAssignmentToFormData(segmentAssignment: SegmentAssignment) {
  return {
    segmentId: segmentAssignment.segmentId,
    isExcluded: segmentAssignment.isExcluded,
  }
}

function variationToFormData(variation: Variation) {
  return {
    name: variation.name,
    isDefault: variation.isDefault,
    allocatedPercentage: String(variation.allocatedPercentage),
  }
}

function exposureEventToFormData(exposureEvent: Event) {
  return {
    event: exposureEvent.event,
    props: Object.entries(exposureEvent.props as object).map(([key, value]) => ({ key, value }))
  }
}

function experimentToExperimentFormData(experiment: ExperimentFull) {
  return {
    p2Url: experiment.p2Url,
    name: experiment.name,
    description: experiment.description,
    startDatetime: format(experiment.startDatetime, 'yyyy-MM-dd'),
    endDatetime: format(experiment.endDatetime, 'yyyy-MM-dd'),
    ownerLogin: experiment.ownerLogin,
    existingUsersAllowed: String(experiment.existingUsersAllowed),
    platform: experiment.platform,
    metricAssignments: experiment.metricAssignments.map(metricAssignmentToFormData),
    segmentAssignments: experiment.segmentAssignments.map(segmentAssignmentToFormData),
    variations: experiment.variations.map(variationToFormData),
    exposureEvents: (experiment.exposureEvents || []).map(exposureEventToFormData),
  }
}

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
      // TODO: submission
      // const { experiment } = formData as { experiment: ExperimentFullNew }
      // const receivedExperiment = await ExperimentsApi.put(experiment)
      // TEMPORARY:
      await new Promise(resolve => setTimeout(resolve, 500))
      enqueueSnackbar('Experiment Updated!', { variant: 'success' })
      router.push(
        '/experiments/[id]?freshly_wizard_edited',
        `/experiments/${experimentId}?freshly_wizard_edited`,
      )
    } catch (error) {
      enqueueSnackbar('Failed to update experiment 😨 (Form data logged to console.)', { variant: 'error' })
      console.error(error)
      console.info('Form data:', formData)
    }
  }

  const initialExperiment = experiment && experimentToExperimentFormData(experiment)

  return (
    <Layout title={`Editing Experiment: ${experiment?.name || ''}`}>
      {isLoading && <LinearProgress />}
      {!isLoading && initialExperiment && indexedMetrics && indexedSegments && (
        // @ts-ignore; initialExperiment type doesn't quite fit, I would leave this as a reasonable compromise
        <ExperimentForm {...{ indexedMetrics, indexedSegments, initialExperiment, onSubmit }} />
      )}
    </Layout>
  )
}
