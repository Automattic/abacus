import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React, { useEffect, useState } from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import SegmentsApi from '@/api/SegmentsApi'
import ExperimentDetails from '@/components/ExperimentDetails'
import ExperimentTabs from '@/components/ExperimentTabs'
import Layout from '@/components/Layout'
import { ExperimentFull, Segment } from '@/models'

const debug = debugFactory('abacus:pages/experiments/[id].tsx')

export default function ExperimentPage() {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
  debug(`ExperimentPage#render ${experimentId}`)

  const [fetchError, setFetchError] = useState<Error | null>(null)
  const [experiment, setExperiment] = useState<ExperimentFull | null>(null)
  const [segments, setSegments] = useState<Segment[] | null>(null)

  useEffect(() => {
    if (experimentId === null) {
      setFetchError({ name: 'nullExperimentId', message: 'Experiment not found' })
      return
    }

    setFetchError(null)
    setExperiment(null)
    setSegments(null)

    Promise.all([ExperimentsApi.findById(experimentId), SegmentsApi.findAll()])
      .then(([experiment, segments]) => {
        setExperiment(experiment)
        setSegments(segments)
        return
      })
      .catch(setFetchError)
  }, [experimentId])

  return (
    <Layout title={`Experiment: ${experiment ? experiment.name : 'Not Found'}`} error={fetchError}>
      <ExperimentTabs experiment={experiment} />
      {experiment && segments && <ExperimentDetails experiment={experiment} segments={segments} />}
    </Layout>
  )
}
