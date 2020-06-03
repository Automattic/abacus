import debugFactory from 'debug'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Container from 'semantic-ui-react/dist/commonjs/elements/Container'
import { toIntOrNull } from 'qc-to_int'

import AnalysesApi from '@/api/AnalysesApi'
import ExperimentsApi from '@/api/ExperimentsApi'
import ErrorsBox from '@/components/ErrorsBox'
import Layout from '@/components/Layout'
import { Analysis, ExperimentFull } from '@/models'
import { formatIsoUtcOffset } from '@/utils/date'

const debug = debugFactory('abacus:pages/experiments/[id].tsx')

function ExperimentDetails(props: { experiment: ExperimentFull }) {
  const { experiment } = props
  return (
    <div>
      <table>
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
      </table>
    </div>
  )
}

export default function ExperimentPage() {
  const experimentId = toIntOrNull(useRouter().query.id)
  debug(`ExperimentPage#render ${experimentId}`)

  const [fetchError, setFetchError] = useState<Error | null>(null)
  const [analyses, setAnalyses] = useState<Analysis[] | null>(null)
  const [experiment, setExperiment] = useState<ExperimentFull | null>(null)

  useEffect(() => {
    if (experimentId === null) {
      setFetchError({ name: 'nullExperimentId', message: 'Experiment not found' })
      return
    }

    setFetchError(null)
    setAnalyses(null)
    setExperiment(null)

    Promise.all([AnalysesApi.findByExperimentId(experimentId), ExperimentsApi.findById(experimentId)])
      .then(([analyses, experiment]) => {
        setAnalyses(analyses)
        // TODO: See if the following hack can be removed after we figure out the data model
        // issues.
        setExperiment(experiment as ExperimentFull) // HACK: Cast to appease TypeScript.
        return
      })
      .catch(setFetchError)
  }, [experimentId])

  return (
    <Layout title='Experiment: insert_name_here'>
      <Container>
        <h1>Experiment insert_name_here</h1>
        {fetchError && <ErrorsBox errors={[fetchError]} />}
        {experiment && <ExperimentDetails experiment={experiment} />}
        {analyses && (analyses.length === 0 ? <p>No analyses yet.</p> : <pre>{JSON.stringify(analyses, null, 2)}</pre>)}
        <p>
          TODO: Fix the flash-of-error-before-data-load. That is, the `ErrorsBox` initially renders because
          `experimentId` is initially `null`.
        </p>
      </Container>
    </Layout>
  )
}
