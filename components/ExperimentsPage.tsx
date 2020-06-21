import debugFactory from 'debug'
import React, { useEffect, useState } from 'react'

import AnalysesApi from '@/api/AnalysesApi'
import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import AnalysisSummary from '@/components/AnalysisSummary'
import ExperimentDetails from '@/components/ExperimentDetails'
import ExperimentTabs from '@/components/ExperimentTabs'
import Layout from '@/components/Layout'
import { Analysis, ExperimentFull, MetricBare } from '@/models'

const debug = debugFactory('abacus:components/ExperimentPage.tsx')

function ExperimentPage({
  experimentId,
  section,
  debugMode,
}: {
  experimentId: number
  section: 'details' | 'results'
  debugMode?: boolean
}) {
  debug(`ExperimentPage#render ${experimentId}`)

  const [fetchError, setFetchError] = useState<Error | null>(null)
  const [analyses, setAnalyses] = useState<Analysis[] | null>(null)
  const [experiment, setExperiment] = useState<ExperimentFull | null>(null)
  const [metrics, setMetrics] = useState<MetricBare[] | null>(null)

  useEffect(() => {
    if (experimentId === null) {
      setFetchError({ name: 'nullExperimentId', message: 'Experiment not found' })
      return
    }

    if (section === 'details') {
      setFetchError(null)
      setExperiment(null)

      ExperimentsApi.findById(experimentId).then(setExperiment).catch(setFetchError)
    } else if (section === 'results') {
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
    }
  }, [experimentId, section])

  return (
    <Layout title={`Experiment: ${experiment ? experiment.name : 'Not Found'}`} error={fetchError}>
      <ExperimentTabs experiment={experiment} />
      {section === 'details' && experiment && <ExperimentDetails experiment={experiment} />}
      {section === 'results' && experiment && analyses && metrics && (
        <AnalysisSummary analyses={analyses} experiment={experiment} metrics={metrics} debugMode={debugMode} />
      )}
    </Layout>
  )
}

export default ExperimentPage
