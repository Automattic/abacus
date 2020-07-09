import { LinearProgress } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import ExperimentDetails from '@/components/ExperimentDetails'
import ExperimentTabs from '@/components/ExperimentTabs'
import Layout from '@/components/Layout'
import { ExperimentFull } from '@/models'
import { combineIsLoading, useDataSource } from '@/utils/data-loading'
import { createUnresolvingPromise } from '@/utils/general'

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

  const { isLoading: experimentIsLoading, data: experiment, error: experimentError } = useDataSource(
    () =>
      experimentId ? ExperimentsApi.findById(experimentId) : (createUnresolvingPromise() as Promise<ExperimentFull>),
    [experimentId],
  )
  const { isLoading: metricsIsLoading, data: metrics, error: metricsError } = useDataSource(
    () => MetricsApi.findAll(),
    [],
  )
  const { isLoading: segmentsIsLoading, data: segments, error: segmentsError } = useDataSource(
    () => SegmentsApi.findAll(),
    [],
  )

  const isLoading = combineIsLoading([experimentIsLoading, metricsIsLoading, segmentsIsLoading])

  const error = [experimentError, metricsError, segmentsError].filter((x) => !!x)[0]

  return (
    <Layout title={`Experiment: ${experiment?.name || ''}`} error={error}>
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
