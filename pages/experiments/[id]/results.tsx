import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React, { useEffect, useState } from 'react'

import AnalysesApi from '@/api/AnalysesApi'
import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import AnalysisSummary from '@/components/AnalysisSummary'
import ExperimentTabs from '@/components/ExperimentTabs'
import Layout from '@/components/Layout'
import { Analysis, ExperimentFull, MetricBare } from '@/models'

const debug = debugFactory('abacus:pages/experiments/[id]/results.tsx')

export default function ResultsPage() {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
  debug(`ResultPage#render ${experimentId}`)

  const [fetchError, setFetchError] = useState<Error | null>(null)
  const [analyses, setAnalyses] = useState<Analysis[] | null>(null)
  const [experiment, setExperiment] = useState<ExperimentFull | null>(null)
  const [metrics, setMetrics] = useState<MetricBare[] | null>(null)

  useEffect(() => {
    if (experimentId === null) {
      setFetchError({ name: 'nullExperimentId', message: 'Experiment not found' })
      return
    }

    setFetchError(null)
    setAnalyses(null)
    setExperiment(null)
    setMetrics(null)

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
      .catch(setFetchError)
  }, [experimentId])

  return (
    <Layout title={`Experiment results: ${experiment ? experiment.name : 'Not Found'}`} error={fetchError}>
      <ExperimentTabs experiment={experiment} />
      {experiment && analyses && metrics && (
        <AnalysisSummary
          analyses={analyses}
          experiment={experiment}
          metrics={metrics}
          debugMode={router.query.debug === 'true'}
        />
      )}
    </Layout>
  )
}
