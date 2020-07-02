import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React, { useEffect, useState } from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import ExperimentDetails from '@/components/ExperimentDetails'
import ExperimentToolbar, { ExperimentToolbarMode } from '@/components/ExperimentToolbar'
import Layout from '@/components/Layout'
import { ExperimentFull, MetricBare, Segment } from '@/models'

const debug = debugFactory('abacus:pages/experiments/[id].tsx')

export default function ExperimentPage() {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
  debug(`ExperimentPage#render ${experimentId}`)

  const [mode, setMode] = useState<ExperimentToolbarMode>('view')
  const [fetchError, setFetchError] = useState<Error | null>(null)
  const [experiment, setExperiment] = useState<ExperimentFull | null>(null)
  const [metrics, setMetrics] = useState<MetricBare[] | null>(null)
  const [segments, setSegments] = useState<Segment[] | null>(null)

  /* istanbul ignore next; to be handled by an e2e test */
  function handleCancel() {
    // TODO: If form is dirty, then prompt for cancellation.
    setMode('view')
  }

  /* istanbul ignore next; to be handled by an e2e test */
  function handleConclude() {
    setMode('conclude')
    setTimeout(() => {
      window.alert('TODO: Handle conclude mode.')
    }, 1)
  }

  /* istanbul ignore next; to be handled by an e2e test */
  function handleDisable() {
    setMode('disable')
    setTimeout(() => {
      const disable = window.confirm('Are you sure you want to disable?')

      if (disable) {
        setTimeout(() => {
          window.alert('TODO: Handle disable mode.')
          setMode('view')
        }, 100)
      } else {
        setMode('view')
      }
    }, 1)
  }

  /* istanbul ignore next; to be handled by an e2e test */
  function handleEdit() {
    setMode('edit')
    setTimeout(() => {
      window.alert('TODO: Handle edit mode.')
    }, 1)
  }

  /* istanbul ignore next; to be handled by an e2e test */
  function handleSave() {
    if (mode === 'conclude') {
      window.alert('TODO: save conclusions')
    } else if (mode === 'edit') {
      window.alert('TODO: update details')
    }
    setMode('view')
  }

  useEffect(() => {
    if (experimentId === null) {
      setFetchError({ name: 'nullExperimentId', message: 'Experiment not found' })
      return
    }

    setFetchError(null)
    setExperiment(null)
    setMetrics(null)
    setSegments(null)

    Promise.all([ExperimentsApi.findById(experimentId), MetricsApi.findAll(), SegmentsApi.findAll()])
      .then(([experiment, metrics, segments]) => {
        setExperiment(experiment)
        setMetrics(metrics)
        setSegments(segments)
        return
      })
      .catch(setFetchError)
  }, [experimentId])

  return (
    <Layout title={`Experiment: ${experiment ? experiment.name : 'Not Found'}`} error={fetchError}>
      {experiment && metrics && segments && (
        <>
          <ExperimentToolbar
            experiment={experiment}
            mode={mode}
            onCancel={handleCancel}
            onConclude={handleConclude}
            onDisable={handleDisable}
            onEdit={handleEdit}
            onSave={handleSave}
            section='details'
          />
          <ExperimentDetails experiment={experiment} metrics={metrics} segments={segments} />
        </>
      )}
    </Layout>
  )
}
