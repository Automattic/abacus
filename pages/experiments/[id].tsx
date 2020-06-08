import debugFactory from 'debug'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Container from 'semantic-ui-react/dist/commonjs/elements/Container'
import { toIntOrNull } from 'qc-to_int'

import AnalysesApi from '@/api/AnalysesApi'
import ExperimentsApi from '@/api/ExperimentsApi'
import ErrorsBox from '@/components/ErrorsBox'
import Layout from '@/components/Layout'
import { Analysis, ExperimentFull, MetricBare } from '@/models'
import { formatIsoUtcOffset } from '@/utils/date'
import AnalysisSummary from '@/components/AnalysisSummary'
import MetricsApi from '@/api/MetricsApi'

const debug = debugFactory('abacus:pages/experiments/[id].tsx')

function ExperimentDetails(props: { experiment: ExperimentFull }) {
  const { experiment } = props
  return (
    <div>
      <h2>Experiment details</h2>
      <table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{experiment.name}</td>
          </tr>
          <tr>
            <td>P2 Link</td>
            <td>
              <a href={experiment.p2Url} rel='noopener noreferrer' target='_blank'>
                P2
              </a>
            </td>
          </tr>
          <tr>
            <td>Description</td>
            <td>{experiment.description}</td>
          </tr>
          <tr>
            <td>Start</td>
            <td>{formatIsoUtcOffset(experiment.startDatetime)}</td>
          </tr>
          <tr>
            <td>End</td>
            <td>{formatIsoUtcOffset(experiment.endDatetime)}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{experiment.status}</td>
          </tr>
          <tr>
            <td>Platform</td>
            <td>{experiment.platform}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default function ExperimentPage() {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
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
    <Layout title={`Experiment: ${experiment ? experiment.name : 'Not Found'}`}>
      <Container>
        <h1>Experiment {experiment ? experiment.name : 'not found'}</h1>
        {fetchError && <ErrorsBox errors={[fetchError]} />}
        {experiment && <ExperimentDetails experiment={experiment} />}
        {experiment && analyses && metrics && (
          <AnalysisSummary
            analyses={analyses}
            experiment={experiment}
            metrics={metrics}
            debugMode={router.query.debug === 'true'}
          />
        )}
        <p>
          TODO: Fix the flash-of-error-before-data-load. That is, the `ErrorsBox` initially renders because
          `experimentId` is initially `null`.
        </p>
      </Container>
    </Layout>
  )
}
