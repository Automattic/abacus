import { createStyles, LinearProgress, makeStyles, Theme, Typography } from '@material-ui/core'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import React from 'react'

import { getUserCompletions } from 'src/api/AutocompleteApi'
import ExperimentsApi from 'src/api/ExperimentsApi'
import MetricsApi from 'src/api/MetricsApi'
import SegmentsApi from 'src/api/SegmentsApi'
import ExperimentForm from 'src/components/experiment-creation/ExperimentForm'
import Layout from 'src/components/Layout'
import { experimentToFormData } from 'src/lib/form-data'
import * as Normalizers from 'src/lib/normalizers'
import { ExperimentFullNew } from 'src/lib/schemas'
import { useDataLoadingError, useDataSource } from 'src/utils/data-loading'
import { or } from 'src/utils/general'

const debug = debugFactory('abacus:pages/experiments/new.tsx')

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      margin: theme.spacing(3, 0, 0, 0),
      color: theme.palette.grey.A700,
    },
    progress: {
      marginTop: theme.spacing(2),
    },
  }),
)

const ExperimentsNewPage = function (): JSX.Element {
  debug('ExperimentsNewPage#render')
  const classes = useStyles()
  const initialExperiment = experimentToFormData({})

  const { isLoading: metricsIsLoading, data: indexedMetrics, error: metricsError } = useDataSource(
    async () => Normalizers.indexMetrics(await MetricsApi.findAll()),
    [],
  )
  useDataLoadingError(metricsError, 'Metrics')

  const { isLoading: segmentsIsLoading, data: indexedSegments, error: segmentsError } = useDataSource(
    async () => Normalizers.indexSegments(await SegmentsApi.findAll()),
    [],
  )
  useDataLoadingError(segmentsError, 'Segments')

  const isLoading = or(metricsIsLoading, segmentsIsLoading)

  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const onSubmit = async (formData: unknown) => {
    try {
      const { experiment } = formData as { experiment: ExperimentFullNew }
      const receivedExperiment = await ExperimentsApi.create(experiment)
      enqueueSnackbar('Experiment Created!', { variant: 'success' })
      await router.push(
        '/experiments/[id]/code-setup?freshly_created',
        `/experiments/${receivedExperiment.experimentId}/code-setup?freshly_created`,
      )
    } catch (error) {
      enqueueSnackbar('Failed to create experiment 😨 (Form data logged to console.)', { variant: 'error' })
      console.error(error)
      console.info('Form data:', formData)
    }
  }
  const completionBag = {
    userCompletionDataSource: useDataSource(getUserCompletions, []),
  }

  return (
    <Layout headTitle='Create an Experiment'>
      <div className={classes.title}>
        <Typography variant='h2'>Create an Experiment</Typography>
      </div>
      {isLoading && <LinearProgress className={classes.progress} />}
      {!isLoading && indexedMetrics && indexedSegments && (
        <ExperimentForm {...{ indexedMetrics, indexedSegments, initialExperiment, onSubmit, completionBag }} />
      )}
    </Layout>
  )
}

export default ExperimentsNewPage
