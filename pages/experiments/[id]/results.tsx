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
import { combineIsLoading, useDataSource } from '@/utils/data-loading'

const debug = debugFactory('abacus:pages/experiments/[id]/results.tsx')

export default function ResultsPage() {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
  debug(`ResultPage#render ${experimentId}`)

  const { isLoading: experimentIsLoading, data: experiment, error: experimentError } = useDataSource(
    () => ExperimentsApi.findById(experimentId),
    [experimentId],
  )
  const { isLoading: metricsIsLoading, data: metrics, error: metricsError } = useDataSource(
    () => MetricsApi.findAll(),
    [],
  )
  const { isLoading: analysesIsLoading, data: analyses, error: analysesError } = useDataSource(
    () => AnalysesApi.findByExperimentId(experimentId),
    [experimentId],
  )

  const isLoading = combineIsLoading([experimentIsLoading, metricsIsLoading, analysesIsLoading])

  const error = [experimentError, metricsError, analysesError].filter((x) => !!x)[0]

  return (
    <Layout title={`Experiment: ${experiment?.name || ''}`} error={error}>
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
