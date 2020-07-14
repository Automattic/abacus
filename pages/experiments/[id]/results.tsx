import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React from 'react'

import AnalysesApi from '@/api/AnalysesApi'
import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import ExperimentResults from '@/components/experiment-results/ExperimentResults'
import ExperimentTabs from '@/components/ExperimentTabs'
import Layout from '@/components/Layout'
import { Analysis, ExperimentFull } from '@/lib/schemas'
import { useDataLoadingError, useDataSource } from '@/utils/data-loading'
import { createUnresolvingPromise, or } from '@/utils/general'

const debug = debugFactory('abacus:pages/experiments/[id]/results.tsx')

export default function ResultsPage() {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
  debug(`ResultPage#render ${experimentId}`)

  const { isLoading: experimentIsLoading, data: experiment, error: experimentError } = useDataSource(
    () => (experimentId ? ExperimentsApi.findById(experimentId) : createUnresolvingPromise<ExperimentFull>()),
    [experimentId],
  )
  useDataLoadingError(experimentError, 'Experiment')

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
        experiment &&
        analyses &&
        metrics && (
          <>
            <ExperimentTabs experiment={experiment} tab='results' />
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
