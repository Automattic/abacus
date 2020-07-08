import { LinearProgress } from '@material-ui/core'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React, { useEffect, useState } from 'react'

import AnalysesApi from '@/api/AnalysesApi'
import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import ExperimentResults from '@/components/experiment-results/ExperimentResults'
import ExperimentTabs from '@/components/ExperimentTabs'
import Layout from '@/components/Layout'
import { Analysis, ExperimentFull, MetricBare } from '@/models'

const debug = debugFactory('abacus:pages/experiments/[id]/results.tsx')

export default function ResultsPage() {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
  debug(`ResultPage#render ${experimentId}`)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [analyses, setAnalyses] = useState<Analysis[] | null>(null)
  const [experiment, setExperiment] = useState<ExperimentFull | null>(null)
  const [metrics, setMetrics] = useState<MetricBare[] | null>(null)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      AnalysesApi.findByExperimentId(experimentId),
      ExperimentsApi.findById(experimentId),
      MetricsApi.findAll(),
    ])
      .then(([analyses, experiment, metrics]) => {
        setAnalyses(analyses)
        setExperiment(experiment)
        setMetrics(metrics)
        return
      })
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [experimentId])

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
