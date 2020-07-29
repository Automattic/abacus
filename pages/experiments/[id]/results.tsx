import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { denormalize, normalize } from 'normalizr'
import { toIntOrNull } from 'qc-to_int'
import React from 'react'

import AnalysesApi from '@/api/AnalysesApi'
import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import ExperimentResults from '@/components/experiment-results/ExperimentResults'
import ExperimentTabs from '@/components/ExperimentTabs'
import Layout from '@/components/Layout'
import {
  Analysis,
  ExperimentFull,
  ExperimentFullNormalizedEntities,
  experimentFullNormalizrSchema,
} from '@/lib/schemas'
import { useDataLoadingError, useDataSource } from '@/utils/data-loading'
import { createUnresolvingPromise, or } from '@/utils/general'

const debug = debugFactory('abacus:pages/experiments/[id]/results.tsx')

export default function ResultsPage() {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
  debug(`ResultPage#render ${experimentId}`)

  const {
    isLoading: experimentIsLoading,
    data: normalizedExperimentData,
    error: experimentError,
  } = useDataSource(async () => {
    if (!experimentId) {
      return createUnresolvingPromise<null>()
    }
    const experiment = await ExperimentsApi.findById(experimentId)
    const normalizedExperiment = normalize<ExperimentFull, ExperimentFullNormalizedEntities>(
      experiment,
      experimentFullNormalizrSchema,
    )
    return normalizedExperiment
  }, [experimentId])
  useDataLoadingError(experimentError, 'Experiment')
  const normalizedExperiment =
    normalizedExperimentData && normalizedExperimentData.entities.experiments[normalizedExperimentData.result]
  // Keeping this denormalized experiment here as temporary scafolding:
  const experiment =
    normalizedExperimentData &&
    denormalize(normalizedExperimentData.result, experimentFullNormalizrSchema, normalizedExperimentData.entities)

  const { isLoading: metricsIsLoading, data: metrics, error: metricsError } = useDataSource(
    () => MetricsApi.findAll(),
    [],
  )
  useDataLoadingError(metricsError, 'Metrics')

  const { isLoading: analysesIsLoading, data: analyses, error: analysesError } = useDataSource(
    () => (experimentId ? AnalysesApi.findByExperimentId(experimentId) : createUnresolvingPromise<Analysis[]>()),
    [experimentId],
  )
  useDataLoadingError(analysesError, 'Analyses')

  const isLoading = or(experimentIsLoading, metricsIsLoading, analysesIsLoading)

  return (
    <Layout title={`Experiment: ${experiment?.name || ''}`}>
      {isLoading ? (
        <LinearProgress />
      ) : (
        normalizedExperiment &&
        experiment &&
        analyses &&
        metrics && (
          <>
            <ExperimentTabs normalizedExperiment={normalizedExperiment} tab='results' />
            <ExperimentResults
              analyses={analyses}
              experiment={experiment}
              metrics={metrics}
              debugMode={router.query.debug === 'true'}
            />
          </>
        )
      )}
    </Layout>
  )
}
