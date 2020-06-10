import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React, { useEffect, useState } from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import ExperimentTabs from '@/components/ExperimentTabs'
import Layout from '@/components/Layout'
import { ExperimentFull } from '@/models'
import { formatIsoUtcOffset } from '@/utils/date'

const debug = debugFactory('abacus:pages/experiments/[id].tsx')

function ExperimentDetails({ experiment }: { experiment: ExperimentFull }) {
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
  const experimentId = toIntOrNull(useRouter().query.id)
  debug(`ExperimentPage#render ${experimentId}`)

  const [fetchError, setFetchError] = useState<Error | null>(null)
  const [experiment, setExperiment] = useState<ExperimentFull | null>(null)

  useEffect(() => {
    if (experimentId === null) {
      setFetchError({ name: 'nullExperimentId', message: 'Experiment not found' })
      return
    }

    setFetchError(null)
    setExperiment(null)

    ExperimentsApi.findById(experimentId).then(setExperiment).catch(setFetchError)
  }, [experimentId])

  return (
    <Layout title={`Experiment: ${experiment ? experiment.name : 'Not Found'}`} error={fetchError}>
      <ExperimentTabs experiment={experiment} />
      {experiment && <ExperimentDetails experiment={experiment} />}
    </Layout>
  )
}
