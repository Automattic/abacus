import { LinearProgress } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React, { useEffect, useState } from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import ExperimentDetails from '@/components/ExperimentDetails'
import ExperimentTabs from '@/components/ExperimentTabs'
import Layout from '@/components/Layout'
import { ExperimentFull, MetricBare, Segment } from '@/models'
import { useDataLoadingError } from '@/utils/data-loading'

const debug = debugFactory('abacus:pages/experiments/[id].tsx')

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabs: {
      marginBottom: theme.spacing(2),
    },
  }),
)

export default function ExperimentPage() {
  const classes = useStyles()
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
  debug(`ExperimentPage#render ${experimentId}`)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [experiment, setExperiment] = useState<ExperimentFull | null>(null)
  const [metrics, setMetrics] = useState<MetricBare[] | null>(null)
  const [segments, setSegments] = useState<Segment[] | null>(null)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([ExperimentsApi.findById(experimentId), MetricsApi.findAll(), SegmentsApi.findAll()])
      .then(([experiment, metrics, segments]) => {
        setExperiment(experiment)
        setMetrics(metrics)
        setSegments(segments)
        return
      })
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [experimentId])

  useDataLoadingError(error)

  return (
    <Layout title={`Experiment: ${experiment?.name || ''}`}>
      {isLoading ? (
        <LinearProgress />
      ) : (
        experiment &&
        metrics &&
        segments && (
          <>
            <ExperimentTabs className={classes.tabs} experiment={experiment} tab='details' />
            <ExperimentDetails experiment={experiment} metrics={metrics} segments={segments} />
          </>
        )
      )}
    </Layout>
  )
}
